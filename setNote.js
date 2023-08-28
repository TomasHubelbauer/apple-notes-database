import setNoteHtml from './setNoteHtml.js';

export default async function setNote(type, id, data) {
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

// const data = await (await import('./getNote.js')).default('items', '1');
// console.log(data);
// console.log(await setNote('items', '3', data));
