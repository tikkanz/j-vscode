import {
    Terminal,
    TextEditor,
    ExtensionContext,
    TextEditorEdit,
    commands,
    workspace,
    window,
    Position,
} from 'vscode';

type Cmd = (editor: TextEditor, edit: TextEditorEdit, ...args: any[]) => void

let terminal: Terminal;

export function activate(context: ExtensionContext) {
    const cmds: [string, Cmd][] = [
        ['language-j.startTerminal', startTerminal],
        ['language-j.loadScript', loadScript],
        ['language-j.loadDisplayScript', loadDisplayScript],
        ['language-j.execute', execute],
        ['language-j.executeAdvance', executeAdvance]
    ];

    for (const [n, f] of cmds) { commands.registerTextEditorCommand(n, f) }

}


export function deactivate(context: ExtensionContext) {
    if (terminal != null) { terminal.dispose() }
}

function createTerminal(): Terminal {
    const config = workspace.getConfiguration('j')

    return window.createTerminal({
        name: "Jconsole", shellPath: config.executablePath
    });
}

window.onDidChangeActiveTerminal(nextTerminal => {
    if (nextTerminal === undefined) { return }
    if (nextTerminal.name == "Jconsole") {
        terminal = nextTerminal
    } else {
        const jTerminals = window.terminals.filter(t => t.name == "Jconsole")
        terminal = jTerminals.length > 0 ? jTerminals[0] : null
    }
})

function getTerminal() {
    if (terminal === null || terminal.exitStatus != undefined) {
        terminal = createTerminal()
    }
    terminal.show(true)
}

function startTerminal() {
    terminal = createTerminal();
    terminal.show(false)
}

function loadScript(editor: TextEditor, _: TextEditorEdit) {
    getTerminal()
    terminal.sendText(`load '${editor.document.fileName}'`)
}

function loadDisplayScript(editor: TextEditor, _: TextEditorEdit) {
    getTerminal()
    terminal.sendText(`loadd '${editor.document.fileName}'`)
}

function _execute(editor: TextEditor): Position {
    let text = editor.document.getText(editor.selection)
    let endPosition: Position
    if (text.length === 0) {
        endPosition = executeLine(editor)
    } else {
        endPosition = executeSelection(editor)
    }
    return endPosition
}

function execute(editor: TextEditor, _: TextEditorEdit) {
    _execute(editor)
}

function executeAdvance(editor: TextEditor, _: TextEditorEdit) {
    let endPosition = _execute(editor)
    let offset = getNextNonBlankLineOffset(editor, endPosition)
    commands.executeCommand('cursorMove', {
        to: "down",
        by: "wrappedLine",
        value: offset
    })
    commands.executeCommand("cursorMove", {
        to: "wrappedLineEnd"
    })
}

function executeSelection(editor: TextEditor): Position {
    getTerminal()
    const text = editor.document.getText(editor.selection)
    terminal.sendText(text, !text.endsWith('\n'))
    return editor.selection.end
}

function executeLine(editor: TextEditor): Position {
    getTerminal()
    const [text, endPosition] = getExecutionText(editor)
    terminal.sendText(text, !text.endsWith('\n'))
    return endPosition
}

function isMultilineStart(text: string): boolean {
    const regex = /^.*\b([01234]|13|noun|adverb|conjunction|verb|monad|dyad)\s+(:\s*0|define)\b.*$/
    return regex.test(text)
}

function isMultilineEnd(text: string): boolean {
    const regex = /^\s*\)\s*$/
    return regex.test(text)
}

function getExecutionText(editor: TextEditor): [string, Position] {
    let lineIndex = editor.selection.active.line
    let text = getLineText(editor, lineIndex)

    if (!isMultilineStart(text)) {
        return [text, editor.selection.active]
    }

    while (lineIndex < editor.document.lineCount) {
        let nextLine = getLineText(editor, ++lineIndex)
        text += `\n${nextLine}`
        if (isMultilineEnd(nextLine)) {
            return [text, new Position(lineIndex, nextLine.length)]
        }
    }

    throw new Error("Incomplete multiline definition!");
}

function getLineText(editor: TextEditor, index: number): string {
    return editor.document.lineAt(index).text
}


function getNextNonBlankLineOffset(editor: TextEditor, endPosition: Position): number {
    let lineIdx = 1 + endPosition.line;
    while (lineIdx < editor.document.lineCount && getLineText(editor, lineIdx).trim().length === 0) {
        lineIdx++;
    }
    return lineIdx - editor.selection.end.line
}
