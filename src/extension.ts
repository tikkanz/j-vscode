import {Terminal, TextDocument, TextEditor, ExtensionContext, TextEditorEdit, commands, workspace, window } from 'vscode';

type Cmd = (textEditor: TextEditor, edit: TextEditorEdit, ...args: any[]) => void

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

    // cmds.forEach(  )
    for(const [n, f] of cmds) {  commands.registerTextEditorCommand(n, f)}

    // createTerminal();
}


export function deactivate(context: ExtensionContext) {
    if (terminal != null) {terminal.dispose()}
}

function loadScript(t: TextEditor, e: TextEditorEdit) {
    createTerminal();  terminal.sendText(`load '${t.document.fileName}'`)
}

function loadDisplayScript(t: TextEditor, e: TextEditorEdit) {
    createTerminal();  terminal.sendText(`loadd '${t.document.fileName}'`)
}

function executeSelection(t: TextEditor, e: TextEditorEdit) {
    const text = t.document.getText(t.selection)
    terminal.sendText(text, !text.endsWith('\n'))
}

function executeLine(t: TextEditor, e: TextEditorEdit) {
    createTerminal()

    const text = getExecutionText(t)
    terminal.sendText(text, !text.endsWith('\n'))
}
function executeLineAdvance(t: TextEditor, e: TextEditorEdit) {
    executeLine(t, e)
    commands.executeCommand('cursorMove', {to: "down",  by: "wrappedLine"})
}


function createTerminal() {
    if (terminal == null || terminal.exitStatus != undefined) {
        const config = workspace.getConfiguration('j');

        terminal = window.createTerminal({
            name: "Jconsole",  shellPath: config.executablePath
        });
        terminal.show();
    }
}

function isMultiline(t: string): boolean {
    const regex = /^.*\b([01234]|13|noun|adverb|conjunction|verb|monad|dyad)\s+(:\s*0|define)\b.*$/
    return regex.test(t)
}

function isMultilineEnd(t: string): boolean {
    const regex = /^\s*\)\s*$/
    return regex.test(t)
}

function getExecutionText(editor: TextEditor): string {
    let lineIndex = editor.selection.active.line
    let text = getLineText(editor, lineIndex)

    if (!isMultiline(text)) {
        return text
    }

    while (lineIndex < editor.document.lineCount) {
        let nextLine = getLineText(editor, lineIndex++)
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