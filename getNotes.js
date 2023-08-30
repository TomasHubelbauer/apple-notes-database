import getNotesHtmls from './getNotesHtmls.js';
import parseNote from './parseNote.js';

export default async function getNotes(type, ids) {
  const data = await getNotesHtmls(type, ids);
  for (const item of data) {
    item.data = parseNote(item.id, item.html);
    delete item.html;
  }

  return data;
}

// Test via `node getNotes`
//console.log(await getNotes('items', ['1', '2']));
