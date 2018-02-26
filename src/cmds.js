// cmds

// ---------------------------------------------------------------------
// ctrl L loads current file in terminal
function ctrlL(e) {
 load(e, false);
}

// ---------------------------------------------------------------------
function ctrlshiftL(e) {
 load(e, true);
}

// ---------------------------------------------------------------------
function load(e, show) {
 sendterm("load" + (show ? "d" : "") + " '" + e.document.fileName + "'");
}
