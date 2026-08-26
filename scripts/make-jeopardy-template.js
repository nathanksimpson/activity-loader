const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(
  root,
  '..',
  '..',
  '..',
  '..',
  '4-Rainbow',
  'Navy',
  'Write Now 3',
  'write_now_3_jeopardy.html'
);
const dest = path.join(root, 'templates', 'jeopardy.template.html');

if (!fs.existsSync(src)) {
  console.error('Source not found:', src);
  process.exit(1);
}

let html = fs.readFileSync(src, 'utf8');

html = html.replace(/<title>[^<]*<\/title>/, '<title>__TITLE__</title>');
html = html.replace(/font-family: 'Inter', sans-serif;/g, 'font-family: Inter, "Segoe UI", "Malgun Gothic", sans-serif;');
html = html.replace(
  '  <h1 id="main-board-title" class="main-title">Early Writers 3 Review</h1>',
  '  <h1 id="main-board-title" class="main-title">__TITLE__</h1>'
);
html = html.replace('based on Write Now 3 content.', "based on this book's units.");

const start = html.indexOf('// Write Now 3 Vocabulary and Grammar Extracted Content');
const end = html.indexOf('// Helper: Array Shuffle');
if (start < 0 || end < 0) {
  console.error('UNIT_DATA markers not found', start, end);
  process.exit(1);
}

const injected = `const GAME_TITLE = __TITLE_JSON__;
const GAME_LEVEL = __LEVEL_JSON__;
const GAME_BOOK = __BOOK_JSON__;
const DOWNLOAD_NAME = __DOWNLOAD_NAME_JSON__;
const STORAGE_KEY = __STORAGE_KEY_JSON__;
const UNIT_DATA = __UNIT_DATA__;

`;
html = html.slice(0, start) + injected + html.slice(end);

html = html.replace('title: "Write Now 3 Review",', 'title: GAME_TITLE,');
html = html.replace(/localStorage\.getItem\('canvasReviewDataWN3'\)/g, 'localStorage.getItem(STORAGE_KEY)');
html = html.replace(/localStorage\.setItem\('canvasReviewDataWN3',/g, 'localStorage.setItem(STORAGE_KEY,');
html = html.replace(
  'if (!gameData.title) gameData.title = "Write Now 3 Review";',
  'if (!gameData.title) gameData.title = GAME_TITLE;'
);
html = html.replace(
  "document.getElementById('edit-game-title').value = gameData.title || \"Write Now 3 Review\";",
  "document.getElementById('edit-game-title').value = gameData.title || GAME_TITLE;"
);
html = html.replace(
  '  const fileName = (gameData.title || "Review_Game").replace(/[^a-z0-9]/gi, \'_\').toLowerCase() + \'.html\';\n  a.download = fileName;',
  '  a.download = DOWNLOAD_NAME || ((gameData.title || "Review_Game").replace(/[^a-z0-9]/gi, \'_\').toLowerCase() + \'.html\');'
);

fs.writeFileSync(dest, html);
console.log('wrote', dest);
console.log('bytes', html.length);
console.log('placeholder UNIT_DATA', html.includes('const UNIT_DATA = __UNIT_DATA__;'));
console.log('placeholder STORAGE_KEY', html.includes('STORAGE_KEY'));
console.log('leftover WN3 units', html.includes('My Virtual Adventure'));
console.log('leftover WN3 title', html.includes('Write Now 3 Review'));
console.log('leftover canvasReviewDataWN3', html.includes('canvasReviewDataWN3'));
