const fs = require('fs');
const path = require('path');

const root = __dirname;
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function write(rel, text) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text);
}

const joxTpl = read('templates/jumpingOx.template.html');
const jeoTpl = read('templates/jeopardy.template.html');
const vocTpl = read('templates/vocabulary.template.html');
const charTpl = read('templates/charades.template.html');
const matchTpl = read('templates/teamMatch.template.html');

function unitDataFromPack(pack) {
  if (pack && pack.units && typeof pack.units === 'object' && !Array.isArray(pack.units)) {
    const keys = Object.keys(pack.units);
    if (keys.length && pack.units[keys[0]] && Array.isArray(pack.units[keys[0]].questions)) {
      return pack.units;
    }
  }
  const groups = {};
  const order = [];
  (pack.sentences || []).forEach((s) => {
    const name = s.unit || 'Unit';
    if (!groups[name]) {
      order.push(name);
      groups[name] = [];
    }
    groups[name].push({
      text: s.original,
      correct: !!s.is_correct,
      explanation: s.is_correct
        ? ('Good! "' + s.original + '" is correct.')
        : ('Incorrect. Say: "' + (s.corrected || s.original) + '".')
    });
  });
  const units = {};
  order.forEach((name, i) => {
    units[String(i + 1)] = {
      title: name,
      description: groups[name].length + ' questions',
      questions: groups[name]
    };
  });
  return units;
}

const curricula = JSON.parse(read('data/curricula.json'));
function bookInfo(bookId) {
  return (curricula.books || []).find((b) => b.id === bookId) || null;
}
function activityLabel(activityId) {
  return { jumpingOx: 'Jumping OX', jeopardy: 'Jeopardy', vocabulary: 'Vocabulary', charades: 'Charades', teamMatch: 'Team Match' }[activityId] || activityId;
}
function outputFileName(bookId, activityId) {
  const book = bookInfo(bookId);
  const level = (book && book.levelIds && book.levelIds[0]) || 'Green';
  const title = (book && book.title) || bookId;
  return level + ' - ' + title + ' - ' + activityLabel(activityId) + '.html';
}
function outPath(bookId, activityId) {
  const book = bookInfo(bookId);
  const levelFolder = String((book && book.levelIds && book.levelIds[0]) || 'green').toLowerCase();
  const folder = { jumpingOx: 'jumping-ox', jeopardy: 'jeopardy', vocabulary: 'vocabulary', charades: 'charades', teamMatch: 'team-match' }[activityId] || activityId;
  return 'activities/' + levelFolder + '/' + bookId + '/' + folder + '/' + outputFileName(bookId, activityId);
}

function bakeJox(packRel, bookId) {
  const pack = JSON.parse(read(packRel));
  const book = bookInfo(bookId);
  const level = (book && book.levelIds && book.levelIds[0]) || 'Green';
  const bookTitle = (book && book.title) || pack.title;
  const html = joxTpl
    .replace('__TITLE_JSON__', JSON.stringify(pack.title))
    .replace(/__TITLE__/g, pack.title)
    .replace('__LEVEL_JSON__', JSON.stringify(level))
    .replace('__BOOK_JSON__', JSON.stringify(bookTitle))
    .replace('__DOWNLOAD_NAME_JSON__', JSON.stringify(outputFileName(bookId, 'jumpingOx')))
    .replace('__UNIT_DATA__', JSON.stringify(unitDataFromPack(pack)).replace(/</g, '\\u003c'));
  const dest = outPath(bookId, 'jumpingOx');
  write(dest, html);
  return dest;
}

function bakeMeta(html, pack, bookId, activityId) {
  const book = bookInfo(bookId);
  const level = (book && book.levelIds && book.levelIds[0]) || 'Green';
  const bookTitle = (book && book.title) || pack.title;
  return html
    .replace('__TITLE_JSON__', JSON.stringify(pack.title))
    .replace(/__TITLE__/g, pack.title)
    .replace('__LEVEL_JSON__', JSON.stringify(level))
    .replace('__BOOK_JSON__', JSON.stringify(bookTitle))
    .replace('__DOWNLOAD_NAME_JSON__', JSON.stringify(outputFileName(bookId, activityId)));
}

function bakeJeo(packRel, bookId) {
  const pack = JSON.parse(read(packRel));
  const html = bakeMeta(jeoTpl, pack, bookId, 'jeopardy')
    .replace('__STORAGE_KEY_JSON__', JSON.stringify('canvasReviewData_' + bookId))
    .replace('__UNIT_DATA__', JSON.stringify(pack.units || {}).replace(/</g, '\\u003c'));
  const dest = outPath(bookId, 'jeopardy');
  write(dest, html);
  return dest;
}

function bakeVocabType(packRel, bookId, activityId, template) {
  const pack = JSON.parse(read(packRel));
  pack.title = (bookInfo(bookId) && bookInfo(bookId).title ? bookInfo(bookId).title : pack.title) +
    (activityId === 'charades' ? ' Charades' : activityId === 'teamMatch' ? ' Team Match' : ' Vocabulary');
  const html = bakeMeta(template, pack, bookId, activityId)
    .replace('__STORAGE_KEY_JSON__', JSON.stringify('vocab_image_' + bookId + '_'))
    .replace('__VOCAB_BY_UNIT__', JSON.stringify(pack.vocabByUnit || {}).replace(/</g, '\\u003c'));
  const dest = outPath(bookId, activityId);
  write(dest, html);
  return dest;
}

function bakeVoc(packRel, bookId) {
  return bakeVocabType(packRel, bookId, 'vocabulary', vocTpl);
}

const baked = [
  bakeJox('content/early-writers-1/jumpingOx.json', 'early-writers-1'),
  bakeJox('content/write-now-1/jumpingOx.json', 'write-now-1'),
  bakeJox('content/write-now-2/jumpingOx.json', 'write-now-2'),
  bakeJox('content/early-writers-2/jumpingOx.json', 'early-writers-2'),
  bakeJeo('content/write-now-1/jeopardy.json', 'write-now-1'),
  bakeVoc('content/write-now-1/vocabulary.json', 'write-now-1'),
  bakeVocabType('content/write-now-1/vocabulary.json', 'write-now-1', 'charades', charTpl),
  bakeVocabType('content/write-now-1/vocabulary.json', 'write-now-1', 'teamMatch', matchTpl)
];
console.log('baked:\n' + baked.join('\n'));
