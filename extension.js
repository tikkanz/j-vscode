"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
let terminal;
function activate(context) {
    const cmds = [
        ['language-j.createTerminal', createTerminal],
        ['language-j.loadScript', loadScript],
        ['language-j.loadDisplayScript', loadDisplayScript],
        ['language-j.executeSelection', executeSelection],
        ['language-j.executeLine', executeLine],
        ['language-j.executeLineAdvance', executeLineAdvance]
    ];
    // cmds.forEach(  )
    for (const [n, f] of cmds) {
        vscode_1.commands.registerTextEditorCommand(n, f);
    }
    // createTerminal();
}
exports.activate = activate;
function deactivate(context) {
    if (terminal != null) {
        terminal.dispose();
    }
}
exports.deactivate = deactivate;
function loadScript(t, e) {
    createTerminal();
    terminal.sendText(`load '${t.document.fileName}'`);
}
function loadDisplayScript(t, e) {
    createTerminal();
    terminal.sendText(`loadd '${t.document.fileName}'`);
}
function executeSelection(t, e) {
    const text = t.document.getText(t.selection);
    terminal.sendText(text, !text.endsWith('\n'));
}
function executeLine(t, e) {
    createTerminal();
    const text = getExecutionText(t);
    terminal.sendText(text, !text.endsWith('\n'));
}
function executeLineAdvance(t, e) {
    executeLine(t, e);
    vscode_1.commands.executeCommand('cursorMove', { to: "down", by: "wrappedLine" });
}
function createTerminal() {
    if (terminal == null || terminal.exitStatus != undefined) {
        const config = vscode_1.workspace.getConfiguration('j');
        terminal = vscode_1.window.createTerminal({
            name: "Jconsole", shellPath: config.executablePath
        });
        terminal.show();
    }
}
function isMultiline(t) {
    const regex = /^.*\b([01234]|13|noun|adverb|conjunction|verb|monad|dyad)\s+(:\s*0|define)\b.*$/;
    return regex.test(t);
}
function isMultilineEnd(t) {
    const regex = /^\s*\)\s*$/;
    return regex.test(t);
}
function getExecutionText(editor) {
    let lineIndex = editor.selection.active.line;
    let text = getLineText(editor, lineIndex);
    if (!isMultiline(text)) {
        return text;
    }
    while (lineIndex < editor.document.lineCount) {
        let nextLine = getLineText(editor, lineIndex++);
        text += `\n${nextLine}`;
        if (isMultilineEnd(nextLine)) {
            return text;
        }
    }
    throw new Error("Incomplete multiline definition!");
}
function getLineText(editor, index) {
    return editor.document.lineAt(index).text;
}
