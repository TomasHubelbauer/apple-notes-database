import getNoteHtml from './getNoteHtml.js';
import parseNote from './parseNote.js';

export default async function getNote(type, id) {
  const html = await getNoteHtml(type, id);
  return parseNote(id, html);
}

// Test via `node getNote`
//console.log(await getNote('items', '1'));
