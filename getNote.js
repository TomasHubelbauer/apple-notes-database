import getNoteHtml from './getNoteHtml.js';

export default async function getNote(type, id) {
  const html = await getNoteHtml(type, id);
  const data = {};
  const lines = html.split('\n');

  let key = '';
  let state = 'h1';
  for (const line of lines) {
    switch (state) {
      case 'h1': {
        // Match both proper <h1> and formatting made to look like <h1>
        const match = line.match(/^<div>(<h1>(?<h1Id>.*?)<\/h1>|<b><span style="font-size: 24px">(?<htmlId>.*?)<\/span><\/b>(<br>)?)<\/div>$/);
        if (!match) {
          throw new Error(`Unexpected line: ${line}`);
        }

        if (match.groups.h1Id !== id && match.groups.htmlId !== id) {
          throw new Error(`Unexpected ID: ${match.groups.h1Id} ${match.groups.htmlId}`);
        }

        state = 'h1-br-h2';
        break;
      }
      case 'h1-br-h2': {
        if (line !== '<div><br></div>') {
          throw new Error(`Unexpected line: ${line}`);
        }

        state = 'h2';
        break;
      }
      case 'h2': {
        // Match both proper <h2> and formatting made to look like <h2>
        const match = line.match(/^<div>(<h2>(?<h2Key>.*)<\/h2>|<b><span style="font-size: 18px">(?<htmlKey>.*?)<\/span><\/b>(<br>)?)<\/div>$/);
        if (!match) {
          throw new Error(`Unexpected line: ${line}`);
        }

        key = match.groups.h2Key ?? match.groups.htmlKey;
        state = 'div';
        break;
      }
      case 'div': {
        const match = line.match(/^<div>(.*)<\/div>$/);
        if (!match) {
          throw new Error(`Unexpected line: ${line}`);
        }

        data[key] = match[1];
        state = 'div-br-h2';
        break;
      }
      case 'div-br-h2': {
        if (line === '') {
          state = 'test-exit';
          continue;
        }

        if (line !== '<div><br></div>') {
          throw new Error(`Unexpected line: ${line}`);
        }

        state = 'h2';
        break;
      }
      case 'test-exit': {
        if (line !== '') {
          throw new Error(`Unexpected line: ${line}`);
        }

        state = 'exit';
        break;
      }
      default: {
        throw new Error(`Unexpected state: ${state}`);
      }
    }
  }

  if (state !== 'exit') {
    throw new Error(`Unexpected state: ${state}`);
  }

  return data;
}

//console.log(await getNote('items', '1'));
