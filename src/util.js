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

