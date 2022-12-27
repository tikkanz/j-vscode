import { Terminal, TextEditor, ExtensionContext, TextEditorEdit, commands, workspace, window } from 'vscode';

type Cmd = (editor: TextEditor, edit: TextEditorEdit, ...args: any[]) => void

let terminal: Terminal;

export function activate(context: ExtensionContext) {
    const cmds: [string, Cmd][] = [
        ['language-j.createTerminal', createTerminal],
        ['language-j.loadScript', loadScript],
        ['language-j.loadDisplayScript', loadDisplayScript],
        ['language-j.executeSelection', executeSelection],
        ['language-j.executeLine', executeLine],
        ['language-j.executeLineAdvance', executeLineAdvance]
    ];

    for (const [n, f] of cmds) { commands.registerTextEditorCommand(n, f) }

}


export function deactivate(context: ExtensionContext) {
    if (terminal != null) { terminal.dispose() }
}

function loadScript(editor: TextEditor, _: TextEditorEdit) {
    createTerminal(); terminal.sendText(`load '${editor.document.fileName}'`)
}

function loadDisplayScript(editor: TextEditor, _: TextEditorEdit) {
    createTerminal(); terminal.sendText(`loadd '${editor.document.fileName}'`)
}

function executeSelection(editor: TextEditor, _: TextEditorEdit) {
    const text = editor.document.getText(editor.selection)
    terminal.sendText(text, !text.endsWith('\n'))
}

function executeLine(editor: TextEditor, _: TextEditorEdit) {
    createTerminal()

    const text = getExecutionText(editor)
    console.log(text)
    terminal.sendText(text, !text.endsWith('\n'))
}
function executeLineAdvance(editor: TextEditor, edit: TextEditorEdit) {
    executeLine(editor, edit)
    commands.executeCommand('cursorMove', { to: "down", by: "wrappedLine" })
}


function createTerminal() {
    if (terminal == null || terminal.exitStatus != undefined) {
        const config = workspace.getConfiguration('j');

        terminal = window.createTerminal({
            name: "Jconsole", shellPath: config.executablePath
        });
        terminal.show();
    }
}

function isMultilineStart(text: string): boolean {
    const regex = /^.*\b([01234]|13|noun|adverb|conjunction|verb|monad|dyad)\s+(:\s*0|define)\b.*$/
    return regex.test(text)
}

function isMultilineEnd(text: string): boolean {
    const regex = /^\s*\)\s*$/
    return regex.test(text)
}

function getExecutionText(editor: TextEditor): string {
    let lineIndex = editor.selection.active.line
    let text = getLineText(editor, lineIndex)

    if (!isMultilineStart(text)) {
        return text
    }

    while (lineIndex < editor.document.lineCount) {
        let nextLine = getLineText(editor, ++lineIndex)
        text += `\n${nextLine}`
        if (isMultilineEnd(nextLine)) {
            return text
        }
    }

    throw new Error("Incomplete multiline definition!");
}

function getLineText(editor: TextEditor, index: number): string {
    return editor.document.lineAt(index).text
}