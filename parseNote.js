export default function parseNote(id, html) {
  const data = {};
  const lines = html.split('\n');

  let key = '';
  let state = 'h1';
  for (const line of lines) {
    switch (state) {
      case 'h1': {
        // Match both proper <h1> and formatting made to look like <h1>
        const regex = /^<div>(<h1>(?<h1Id>.*?)<\/h1>|<b><span style="font-size: 24px">(?<htmlId>.*?)<\/span><\/b>(<br>)?)<\/div>$/;
        const match = line.match(regex);
        if (!match) {
          throw new Error(`Unexpected line, expected ${regex}: ${line}\n${html}`);
        }

        if (match.groups.h1Id !== id && match.groups.htmlId !== id) {
          throw new Error(`Unexpected ID: ${match.groups.h1Id} ${match.groups.htmlId}`);
        }

        state = 'h1-br-h2';
        break;
      }
      case 'h1-br-h2': {
        if (line !== '<div><br></div>') {
          throw new Error(`Unexpected line, expected <div><br></div>: ${line}\n${html}`);
        }

        state = 'h2';
        break;
      }
      case 'h2': {
        // Match both proper <h2> and formatting made to look like <h2>
        const regex = /^<div>(<h2>(?<h2Key>.*)<\/h2>|<b><span style="font-size: 18px">(?<htmlKey>.*?)<\/span><\/b>(<br>)?)<\/div>$/;
        const match = line.match(regex);
        if (!match) {
          throw new Error(`Unexpected line, expected ${regex}: ${line}\n${html}`);
        }

        key = match.groups.h2Key ?? match.groups.htmlKey;
        state = 'div';
        break;
      }
      case 'div': {
        const regex = /^<div>(.*)<\/div>$/;
        const match = line.match(regex);
        if (!match) {
          throw new Error(`Unexpected line, expected ${regex}: ${line}\n${html}`);
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
          throw new Error(`Unexpected line, expected <div><br></div>: ${line}\n${html}`);
        }

        state = 'h2';
        break;
      }
      case 'test-exit': {
        if (line !== '') {
          throw new Error(`Unexpected line, expected '': ${line}\n${html}`);
        }

        state = 'exit';
        break;
      }
      default: {
        throw new Error(`Unexpected state: ${state}\n${html}`);
      }
    }
  }

  if (state !== 'exit' && state !== 'div') {
    throw new Error(`Unexpected state, expected 'exit' or 'div': ${state}\n${html}`);
  }

  return data;
}
