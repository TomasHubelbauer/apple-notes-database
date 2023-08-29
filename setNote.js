import setNoteHtml from './setNoteHtml.js';
import idRegex from './idRegex.js';

/**
 * Stores a note containing the provided data under the given ID in Apple Notes.
 * 
 * @param {string} type The name of the type folder.
 * @param {string} id The name/title of the note.
 * @param {Record<string, string>} data The data to store in the note.
 */
export default async function setNote(type, id, data) {
  if (!idRegex.exec(id)) {
    throw new Error(`Malformaed ID, expected ${idRegex}: "${id}"`);
  }

  let html = [];
  html.push(`<div><h1>${id}</h1></div>`);
  html.push(`<div><br></div>`);
  for (const key in data) {
    html.push(`<div><h2>${key}</h2></div>`);
    html.push(`<div>${data[key]}</div>`);
    html.push(`<div><br></div>`);
  }

  html.pop();
  await setNoteHtml(type, id, html.join('\n'));
}

// Test via `node setNote`
// const data = await (await import('./getNote.js')).default('items', '1');
// console.log(data);
// console.log(await setNote('items', '3', data));
