import {
    Terminal,
    TextEditor,
    ExtensionContext,
    TextEditorEdit,
    commands,
    workspace,
    window,
    Position,
} from 'vscode'

type Cmd = (editor: TextEditor) => void

export function activate(context: ExtensionContext) {
    const cmds: [string, Cmd][] = [
        ['language-j.startTerminal', startTerminal],
        ['language-j.loadScript', loadScript],
        ['language-j.loadDisplayScript', loadDisplayScript],
        ['language-j.execute', execute],
        ['language-j.executeAdvance', executeAdvance]
    ]

    for (const [n, f] of cmds) { commands.registerTextEditorCommand(n, f) }

}

let terminal: Terminal = null

export function deactivate(context: ExtensionContext) {
    if (terminal != null) { terminal.dispose() }
}

function createTerminal(): Terminal {
    const config = workspace.getConfiguration('j')

    return window.createTerminal({
        name: "Jconsole", shellPath: config.executablePath
    })
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
    terminal = createTerminal()
    terminal.show(false)
}

function loadScript(editor: TextEditor) {
    getTerminal()
    terminal.sendText(`load '${editor.document.fileName}'`)
}

function loadDisplayScript(editor: TextEditor) {
    getTerminal()
    terminal.sendText(`loadd '${editor.document.fileName}'`)
}

function execute(editor: TextEditor) {
    _execute(editor)
}

function executeAdvance(editor: TextEditor) {
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

function _execute(editor: TextEditor): Position {
    let [text, endPosition] = getExecutionText(editor)

    getTerminal()
    terminal.sendText(text, !text.endsWith('\n'))

    return endPosition
}

function getExecutionText(editor: TextEditor): [string, Position] {
    if (!editor.selection.isEmpty) {
        const text = editor.document.getText(editor.selection)
        return [text, editor.selection.end]
    } else {
        let lineIndex = editor.selection.active.line
        let text = getLineText(editor, lineIndex)

        if (!isMultilineStart(text)) {
            return [text, editor.selection.active]
        }

        text = ""
        while (lineIndex < editor.document.lineCount) {
            let nextLine = getLineText(editor, lineIndex)
            text += `\n${nextLine}`
            if (isMultilineEnd(nextLine)) {
                return [text, new Position(lineIndex, nextLine.length)]
            }
            lineIndex++
        }

        throw new Error("Incomplete multiline definition!")
    }
}

function isMultilineStart(text: string): boolean {
    const regex = /^.*\b([01234]|13|noun|adverb|conjunction|verb|monad|dyad\s+:\s*0|define)\b.*$|(\{\{)/
    return regex.test(text)
}

function isMultilineEnd(text: string): boolean {
    const regex = /(^\s*\)\s*$)|(\}\})/
    return regex.test(text)
}

function getNextNonBlankLineOffset(editor: TextEditor, endPosition: Position): number {
    let lineIdx = 1 + endPosition.line
    while (lineIdx < editor.document.lineCount && getLineText(editor, lineIdx).trim().length === 0) {
        lineIdx++
    }
    return lineIdx - editor.selection.end.line
}

function getLineText(editor: TextEditor, index: number): string {
    return editor.document.lineAt(index).text
}
