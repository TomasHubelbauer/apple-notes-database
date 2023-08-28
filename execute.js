import child_process from 'child_process';

/**
 * 
 * @returns {Promise<string>}
 */
export default function execute(script) {
  return new Promise((resolve, reject) => {
    const lines = script.trim().split('\n');
    const parameters = lines.map(line => `-e '${line.trim()}'`);
    const command = `osascript ${parameters.join(' ')}`;
    child_process.exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      else if (stderr) {
        reject(stderr);
      }
      else {
        resolve(stdout);
      }
    });
  });
}
