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
  let clearline = '\u0015'
  if (isWinExe)
    clearline = '';
  terminal.sendText(clearline + txt, !txt.endsWith('\n'));
}
