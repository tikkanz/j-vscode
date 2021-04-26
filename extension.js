// language-j

const vscode = require('vscode');

let terminal;

// ---------------------------------------------------------------------
function activate(context) {
  const config = vscode.workspace.getConfiguration('j');
  const terminalName = 'Jconsole';
  const terminalCmd = config.executablePath;
  isWinExe = terminalCmd.endsWith('.exe');

  const createTerminal = () => {
    terminal = vscode.window.createTerminal(terminalName, terminalCmd);
    terminal.show();
  };

  createTerminal();

  let cmd;
  cmd = vscode.commands.registerTextEditorCommand('language-j.executeSelection', executeSelection);
  context.subscriptions.push(cmd);
  cmd = vscode.commands.registerTextEditorCommand('language-j.loadScript', loadScript);
  context.subscriptions.push(cmd);
  cmd = vscode.commands.registerTextEditorCommand('language-j.loadDisplayScript', loadDisplayScript);
  context.subscriptions.push(cmd);
  cmd = vscode.commands.registerTextEditorCommand('language-j.executeLine', executeLine);
  context.subscriptions.push(cmd);
  cmd = vscode.commands.registerTextEditorCommand('language-j.executeLineAdvance', executeLineAdvance);
  context.subscriptions.push(cmd);
  cmd = vscode.commands.registerTextEditorCommand('language-j.createTerminal', createTerminal);
  context.subscriptions.push(cmd);

}

function deactivate() {
  if (terminal) {
    terminal.dispose();
  }
}

// ---------------------------------------------------------------------
exports.activate = activate;
exports.deactivate = deactivate;

// util

// ----------------------------------------------------------------------
function has(array, element) {
  return -1 < array.indexOf(element);
}

// ----------------------------------------------------------------------
// return if line is start of multiline definition
// checks only most common cases using standard library
function ismultiline(t) {
  let s = t.trim();
  if (s.length === 0) return false;
  if ("Note'" === s.substring(0, 5)) return true;
  s = splitblankJ(s);
  if ("Note" === s[0]) return true;
  let len = s.length;
  let num = ["0", "1", "2", "3", "4"];
  let def = ["noun", "adverb", "conjunction", "verb", "monad", "dyad"];
  for (let i = 1; i < len; i++) {
    if (s[i] !== "define" &&
      (s[i] !== ":" || i === len - 1 || s[i + 1] !== "0")) continue;
    if (has(def, s[i - 1]) || has(num, s[i - 1])) return true;
  }
  return false;
}

// ---------------------------------------------------------------------
// split on blanks, ignoring J strings 'abc def'
function splitblankJ(s) {
  return s.match(/(?:[^\s']+|'[^']*')+/g);
}

// cmds

// ---------------------------------------------------------------------
// ctrl L loads current file in terminal
function loadScript(e) {
  load(e, false);
}

// ---------------------------------------------------------------------
function loadDisplayScript(e) {
  load(e, true);
}

// ---------------------------------------------------------------------
function load(e, show) {
  sendterm("load" + (show ? "d" : "") + " '" + e.document.fileName + "'");
}

// entry

let csel, lsel;

// ---------------------------------------------------------------------
// ctrl E runs selection on one line
function executeSelection(e) {
  if (!e.selection) return;
  getselections(e);
  let txt;
  if ((lsel[0] !== lsel[1]) || (csel[0] !== csel[1]))
    sendterm(e.document.getText(e.selection));
}

// ---------------------------------------------------------------------
function executeLine(e) {
  runline(e, false);
}

// ---------------------------------------------------------------------
function executeLineAdvance(e) {
  runline(e, true);
}

// ---------------------------------------------------------------------
function getline(e, p) {
  return e.document.lineAt(p).text;
}

// ---------------------------------------------------------------------
function getselections(e) {
  csel = [e.selection.start.character, e.selection.end.character];
  lsel = [e.selection.start.line, e.selection.end.line];
}

// ---------------------------------------------------------------------
function movecursor(n) {
  vscode.commands.executeCommand("cursorMove", {
    to: "down",
    by: "wrappedLine",
    value: n
  });
  vscode.commands.executeCommand("cursorMove", {
    to: "wrappedLineEnd"
  });
}

// ---------------------------------------------------------------------
// returns next non-empty line, entry from given position
function readentry(e) {
  let res = readentry1(e);
  let p = res[0];
  while (p < e.document.lineCount) {
    let s = getline(e, p);
    if (s.trim().length) break;
    p++;
  }
  return [p, res[1]];
}

// ---------------------------------------------------------------------
function readentry1(e) {
  let p = lsel[0];
  let r = getline(e, p++);
  if (r.trim().length === 0 || !ismultiline(r)) return [p, r];
  while (p < e.document.lineCount) {
    let s = getline(e, p++);
    r += "\n" + s;
    if (s === ")") break;
  }
  return [p, r];
};

// ---------------------------------------------------------------------
function runline(e, advance) {
  if (!e.selection) return;
  getselections(e);
  let res = readentry(e);
  let pos = res[0];
  let txt = res[1];
  sendterm(txt);
  if (advance)
    movecursor(pos - lsel[0]);
}

// ---------------------------------------------------------------------
function sendterm(txt) {
  let clearline = '\u0015';
  if (isWinExe) clearline = '';
  terminal.sendText(clearline + txt, !txt.endsWith('\n'));
}
