import execute from './execute.js';
import appName from './appName.js';

/**
 * 
 * @param {string} type 
 * @param {string[] | undefined} ids 
 */
export default async function getNotesHtmls(type, ids) {
  const htmls = await execute(`
tell application "Notes"
  set htmls to {}
  set ids to ${JSON.stringify(ids ?? [])}
  repeat with aNote in notes of folder "${type}" of folder "${appName}"
    if ids is {} or name of aNote is in ids then
      set noteId to name of aNote
      set html to body of aNote
      set end of htmls to {id:noteId, html:html}
    end if
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
      if (ids && !ids.includes(id)) {
        throw new Error(`Unexpected id, expected same order as ids: ${id}`);
      }

      const html = line.slice(line.indexOf(', html:') + ', html:'.length);
      note = { id, html };
      notes.push(note);
      continue;
    }

    if (!note) {
      throw new Error(`Unexpected line: ${line}\n${JSON.stringify({ line, lines }, null, 2)}`);
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
//console.log(await getNotesHtmls('items'));
