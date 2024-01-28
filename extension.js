"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
function activate(context) {
    const cmds = [
        ['language-j.startTerminal', startTerminal],
        ['language-j.loadScript', loadScript],
        ['language-j.loadDisplayScript', loadDisplayScript],
        ['language-j.execute', execute],
        ['language-j.executeAdvance', executeAdvance],
        ['language-j.openNuVoc', openNuVoc]
    ];
    for (const [n, f] of cmds) {
        vscode_1.commands.registerTextEditorCommand(n, f);
    }
}
exports.activate = activate;
let terminal = null;
let isWinExe;
function deactivate(context) {
    if (terminal != null) {
        terminal.dispose();
    }
}
exports.deactivate = deactivate;
function createTerminal() {
    const config = vscode_1.workspace.getConfiguration('j');
    isWinExe = config.executablePath.endsWith('.exe');
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
function loadScript(editor) {
    editor.document.save();
    sendTerminalText(`load '${editor.document.fileName}'`);
}
function loadDisplayScript(editor) {
    editor.document.save();
    sendTerminalText(`loadd '${editor.document.fileName}'`);
}
function execute(editor) {
    _execute(editor);
}
function executeAdvance(editor) {
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
function _execute(editor) {
    let [text, endPosition] = getExecutionText(editor);
    sendTerminalText(text);
    return endPosition;
}
function getExecutionText(editor) {
    if (!editor.selection.isEmpty) {
        const text = editor.document.getText(editor.selection);
        return [text, editor.selection.end];
    }
    else {
        let lineIndex = editor.selection.active.line;
        let text = getLineText(editor, lineIndex);
        if (!isMultilineStart(text)) {
            return [text, editor.selection.active];
        }
        text = "";
        while (lineIndex < editor.document.lineCount) {
            let nextLine = getLineText(editor, lineIndex);
            text += `\n${nextLine}`;
            if (isMultilineEnd(nextLine)) {
                return [text, new vscode_1.Position(lineIndex, nextLine.length)];
            }
            lineIndex++;
        }
        throw new Error("Incomplete multiline definition!");
    }
}
function isMultilineStart(text) {
    const regex = /(?<!NB\..*)\w*(([0-4]|13|noun|verb|conjunction|monad|adverb|dyad) +(: *0|define))|(\{\{)/;
    return regex.test(text);
}
function isMultilineEnd(text) {
    const regex = /(^\s*\)\s*$)|(\}\})/;
    return regex.test(text);
}
function getNextNonBlankLineOffset(editor, endPosition) {
    let lineIdx = 1 + endPosition.line;
    while (lineIdx < editor.document.lineCount && getLineText(editor, lineIdx).trim().length === 0) {
        lineIdx++;
    }
    return lineIdx - editor.selection.end.line;
}
function getLineText(editor, index) {
    return editor.document.lineAt(index).text;
}
function sendTerminalText(txt) {
    let clearline = '\u0015';
    if (isWinExe) {
        clearline = '';
    }
    getTerminal();
    terminal.sendText(clearline + txt, !txt.endsWith('\n'));
}
function openNuVoc() {
    const NuVocURL = 'https://code.jsoftware.com/wiki/NuVoc';
    vscode_1.env.openExternal(vscode_1.Uri.parse(NuVocURL));
}
