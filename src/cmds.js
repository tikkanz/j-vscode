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
