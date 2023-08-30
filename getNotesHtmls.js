import execute from './execute.js';
import appName from './appName.js';

/**
 * 
 * @param {string} type 
 * @param {string[]} ids 
 */
export default async function getNotesHtmls(type, ids) {
  const htmls = await execute(`
tell application "Notes"
  set htmls to {}
  set noteIds to ${JSON.stringify(ids)}
  repeat with noteId in noteIds
    set html to body of note noteId of folder "${type}" of folder "${appName}"
    set end of htmls to {id:noteId as text, html:html}
  end repeat
  return htmls
end tell
`);

  const notes = [];
  let note;
  const lines = (', ' + htmls).trim().split('\n');
  for (const line of lines) {
    if (line.startsWith(', id:')) {
      const id = line.slice(', id:'.length, line.indexOf(', html:'));
      if (id !== ids.shift()) {
        throw new Error(`Unexpected id, expected same order as ids: ${id}`);
      }

      const html = line.slice(line.indexOf(', html:') + ', html:'.length);
      note = { id, html };
      notes.push(note);
      continue;
    }

    if (!note) {
      throw new Error(`Unexpected line: ${line}`);
    }

    note.html += '\n' + line;
  }

  for (const note of notes) {
    note.html += '\n\n';
  }

  return notes;
}

// Test via `node getNotesHtmls`
//console.log(await getNotesHtmls('items', ['1', '2']));
