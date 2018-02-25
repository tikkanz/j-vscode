// cmds

// ---------------------------------------------------------------------
// ctrl L runs selection on one line
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
