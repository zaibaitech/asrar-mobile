const fs = require('fs');
const text = fs.readFileSync('constants/translations.ts', 'utf8');
const textLength = text.length;
const newLineIndices = [];
for (let i = 0; i < textLength; i++) {
  if (text[i] === '\n') newLineIndices.push(i);
}
newLineIndices.push(textLength);
function lineNumberForIndex(index) {
  let low = 0;
  let high = newLineIndices.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (newLineIndices[mid] >= index) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return low + 1;
}
let balance = 0;
let str = null;
let esc = false;
let comment = null;
let rootClosedCount = 0;
for (let i = 0; i < textLength; i++) {
  const ch = text[i];
  const next = text[i + 1];
  if (comment === '//') {
    if (ch === '\n') comment = null;
  } else if (comment === '/*') {
    if (ch === '*' && next === '/') {
      comment = null;
      i++;
    }
  } else if (str) {
    if (esc) {
      esc = false;
    } else if (ch === '\\') {
      esc = true;
    } else if (ch === str) {
      str = null;
    }
  } else {
    if (ch === '/' && next === '/') {
      comment = '//';
      i++;
      continue;
    }
    if (ch === '/' && next === '*') {
      comment = '/*';
      i++;
      continue;
    }
    if (ch === '"' || ch === '\'' || ch === '`') {
      str = ch;
    } else if (ch === '{') {
      balance++;
    } else if (ch === '}') {
      balance--;
      if (balance === 0) {
        rootClosedCount += 1;
        console.log('balance returned to 0 at line', lineNumberForIndex(i));
      }
      if (balance < 0) {
        console.log('negative at index', i);
        console.log('line', lineNumberForIndex(i));
        console.log('context', text.slice(Math.max(0, i - 80), i + 40));
        process.exit(0);
      }
    }
  }
}
console.log('final balance', balance);
console.log('root closed count', rootClosedCount);
