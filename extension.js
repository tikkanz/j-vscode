"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
let terminal;
function activate(context) {
    const cmds = [
        ['language-j.startTerminal', startTerminal],
        ['language-j.loadScript', loadScript],
        ['language-j.loadDisplayScript', loadDisplayScript],
        ['language-j.executeSelection', executeSelection],
        ['language-j.executeLine', executeLine],
        ['language-j.executeLineAdvance', executeLineAdvance]
    ];
    for (const [n, f] of cmds) {
        vscode_1.commands.registerTextEditorCommand(n, f);
    }
}
exports.activate = activate;
function deactivate(context) {
    if (terminal != null) {
        terminal.dispose();
    }
}
exports.deactivate = deactivate;
function createTerminal() {
    const config = vscode_1.workspace.getConfiguration('j');
    return vscode_1.window.createTerminal({
        name: "Jconsole", shellPath: config.executablePath
    });
}
vscode_1.window.onDidChangeActiveTerminal(nextTerminal => {
    if (nextTerminal === undefined) {
        return;
    }
    if (nextTerminal.name == "Jconsole") {
        terminal = nextTerminal;
    }
    else {
        const jTerminals = vscode_1.window.terminals.filter(t => t.name == "Jconsole");
        terminal = jTerminals.length > 0 ? jTerminals[0] : null;
    }
});
function getTerminal() {
    if (terminal === null || terminal.exitStatus != undefined) {
        terminal = createTerminal();
    }
    terminal.show(true);
}
function startTerminal() {
    terminal = createTerminal();
    terminal.show(false);
}
function loadScript(editor, _) {
    getTerminal();
    terminal.sendText(`load '${editor.document.fileName}'`);
}
function loadDisplayScript(editor, _) {
    getTerminal();
    terminal.sendText(`loadd '${editor.document.fileName}'`);
}
function executeSelection(editor, _) {
    getTerminal();
    const text = editor.document.getText(editor.selection);
    terminal.sendText(text, !text.endsWith('\n'));
}
function executeLine(editor, _) {
    getTerminal();
    const text = getExecutionText(editor);
    console.log(text);
    terminal.sendText(text, !text.endsWith('\n'));
}
function executeLineAdvance(editor, edit) {
    executeLine(editor, edit);
    vscode_1.commands.executeCommand('cursorMove', { to: "down", by: "wrappedLine" });
}
function isMultilineStart(text) {
    const regex = /^.*\b([01234]|13|noun|adverb|conjunction|verb|monad|dyad)\s+(:\s*0|define)\b.*$/;
    return regex.test(text);
}
function isMultilineEnd(text) {
    const regex = /^\s*\)\s*$/;
    return regex.test(text);
}
function getExecutionText(editor) {
    let lineIndex = editor.selection.active.line;
    let text = getLineText(editor, lineIndex);
    if (!isMultilineStart(text)) {
        return text;
    }
    while (lineIndex < editor.document.lineCount) {
        let nextLine = getLineText(editor, ++lineIndex);
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
