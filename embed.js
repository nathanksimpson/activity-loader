const fs = require('fs');
const path = require('path');
const root = __dirname;
function asModule(html) {
  return html.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}
const jox = fs.readFileSync(path.join(root, 'templates/jumpingOx.template.html'), 'utf8');
const jeo = fs.readFileSync(path.join(root, 'templates/jeopardy.template.html'), 'utf8');
const voc = fs.readFileSync(path.join(root, 'templates/vocabulary.template.html'), 'utf8');
const match = fs.readFileSync(path.join(root, 'templates/teamMatch.template.html'), 'utf8');
const char = fs.readFileSync(path.join(root, 'templates/charades.template.html'), 'utf8');
const qqt = fs.readFileSync(path.join(root, 'templates/quizQuizTrade.template.html'), 'utf8');
const fnp = fs.readFileSync(path.join(root, 'templates/fanNPick.template.html'), 'utf8');
const fsw = fs.readFileSync(path.join(root, 'templates/findSomeoneWho.template.html'), 'utf8');
const sdown = fs.readFileSync(path.join(root, 'templates/showdown.template.html'), 'utf8');
const rc = fs.readFileSync(path.join(root, 'templates/rallyCoach.template.html'), 'utf8');
const packs = {
  'early-writers-1:jumpingOx': JSON.parse(fs.readFileSync(path.join(root, 'content/early-writers-1/jumpingOx.json'), 'utf8')),
  'write-now-1:jumpingOx': JSON.parse(fs.readFileSync(path.join(root, 'content/write-now-1/jumpingOx.json'), 'utf8')),
  'write-now-1:jeopardy': JSON.parse(fs.readFileSync(path.join(root, 'content/write-now-1/jeopardy.json'), 'utf8')),
  'write-now-1:vocabulary': JSON.parse(fs.readFileSync(path.join(root, 'content/write-now-1/vocabulary.json'), 'utf8')),
  'write-now-2:jumpingOx': JSON.parse(fs.readFileSync(path.join(root, 'content/write-now-2/jumpingOx.json'), 'utf8')),
  'early-writers-2:jumpingOx': JSON.parse(fs.readFileSync(path.join(root, 'content/early-writers-2/jumpingOx.json'), 'utf8'))
};
const out = `window.ACTIVITY_EMBEDDED = {
  templates: {
    jumpingOx: \`${asModule(jox)}\`,
    jeopardy: \`${asModule(jeo)}\`,
    vocabulary: \`${asModule(voc)}\`,
    teamMatch: \`${asModule(match)}\`,
    charades: \`${asModule(char)}\`,
    quizQuizTrade: \`${asModule(qqt)}\`,
    fanNPick: \`${asModule(fnp)}\`,
    findSomeoneWho: \`${asModule(fsw)}\`,
    showdown: \`${asModule(sdown)}\`,
    rallyCoach: \`${asModule(rc)}\`
  },
  packs: ${JSON.stringify(packs)}
};
`;
fs.writeFileSync(path.join(root, 'js/embedded.js'), out);
console.log('wrote js/embedded.js', out.length);
