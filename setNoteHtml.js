import execute from './execute.js';
import appName from './appName.js';

/**
 * 
 * @param {string} type 
 * @param {string} id 
 * @param {string} html 
 */
export default async function setNoteHtml(type, id, html) {
  html = html.replaceAll('\n', '').replaceAll('"', '\\"');
  return await execute(`
tell application "Notes"
  try
    set body of note "${id}" of folder "${type}" of folder "${appName}" to "${html}"
  on error
    make new note with properties {body:"${html}"} at folder "${type}" of folder "${appName}"
  end try
end tell
`);
}

// const html = await (await import('./getNoteHtml.js')).default('items', '1');
// console.log(html);
// console.log(await setNoteHtml('items', '1', html));
