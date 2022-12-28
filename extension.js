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
        ['language-j.execute', execute],
        ['language-j.executeAdvance', executeAdvance]
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
function _execute(editor) {
    let text = editor.document.getText(editor.selection);
    let endPosition;
    if (text.length === 0) {
        endPosition = executeLine(editor);
    }
    else {
        endPosition = executeSelection(editor);
    }
    return endPosition;
}
function execute(editor, _) {
    _execute(editor);
}
function executeAdvance(editor, _) {
    let endPosition = _execute(editor);
    let offset = getNextNonBlankLineOffset(editor, endPosition);
    vscode_1.commands.executeCommand('cursorMove', {
        to: "down",
        by: "wrappedLine",
        value: offset
    });
    vscode_1.commands.executeCommand("cursorMove", {
        to: "wrappedLineEnd"
    });
}
function executeSelection(editor) {
    getTerminal();
    const text = editor.document.getText(editor.selection);
    terminal.sendText(text, !text.endsWith('\n'));
    return editor.selection.end;
}
function executeLine(editor) {
    getTerminal();
    const [text, endPosition] = getExecutionText(editor);
    terminal.sendText(text, !text.endsWith('\n'));
    return endPosition;
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
        return [text, editor.selection.active];
    }
    while (lineIndex < editor.document.lineCount) {
        let nextLine = getLineText(editor, ++lineIndex);
        text += `\n${nextLine}`;
        if (isMultilineEnd(nextLine)) {
            return [text, new vscode_1.Position(lineIndex, nextLine.length)];
        }
    }
    throw new Error("Incomplete multiline definition!");
}
function getLineText(editor, index) {
    return editor.document.lineAt(index).text;
}
function getNextNonBlankLineOffset(editor, endPosition) {
    let lineIdx = 1 + endPosition.line;
    while (lineIdx < editor.document.lineCount && getLineText(editor, lineIdx).trim().length === 0) {
        lineIdx++;
    }
    return lineIdx - editor.selection.end.line;
}
