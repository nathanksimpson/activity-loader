const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const ew3 = path.join(root, '..', '..', '..', '..', '4-Rainbow', 'Navy', 'Early Writers 3', 'early_writers_3_vocabulary_game.html');
const wn1 = path.join(root, 'activities', 'green', 'write-now-1', 'vocabulary', 'write_now_1_vocabulary_game.html');
const outDir = path.join(root, 'scripts', '_extract');
fs.mkdirSync(outDir, { recursive: true });

function extractVocab(html) {
  const marker = 'const vocabByUnit = {';
  const start = html.indexOf(marker);
  if (start < 0) throw new Error('vocabByUnit not found');
  let i = start + marker.length - 1;
  let depth = 0;
  let end = -1;
  for (; i < html.length; i++) {
    const ch = html[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end < 0) throw new Error('could not close vocabByUnit');
  const jsonish = html.slice(start + 'const vocabByUnit = '.length, end);
  return { json: JSON.parse(jsonish), end, start };
}

const ew3Html = fs.readFileSync(ew3, 'utf8');
const wn1Html = fs.readFileSync(wn1, 'utf8');
const ew3Vocab = extractVocab(ew3Html);
const wn1Vocab = extractVocab(wn1Html);

fs.writeFileSync(path.join(outDir, 'ew3-after-vocab.js'), ew3Html.slice(ew3Vocab.end));
fs.writeFileSync(path.join(outDir, 'ew3-before-vocab.html'), ew3Html.slice(0, ew3Vocab.start));
fs.mkdirSync(path.join(root, 'content', 'write-now-1'), { recursive: true });
fs.writeFileSync(path.join(root, 'content', 'write-now-1', 'vocabulary.json'), JSON.stringify({
  bookId: 'write-now-1',
  activityId: 'vocabulary',
  cefr: 'A1',
  title: 'Write Now 1 Vocabulary',
  vocabByUnit: wn1Vocab.json
}, null, 2));

console.log('EW3 after vocab bytes', ew3Html.slice(ew3Vocab.end).length);
console.log('WN1 units', Object.keys(wn1Vocab.json));
console.log('wrote content/write-now-1/vocabulary.json');
console.log('EW3 script starts with', JSON.stringify(ew3Html.slice(ew3Vocab.end, ew3Vocab.end + 250)));
