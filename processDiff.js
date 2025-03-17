const { execSync } = require('child_process');
const fs = require('fs');

try {
  const rawResult = execSync("git diff --unified=0 package.json").toString()
  console.log(`rawResult=${rawResult}`);
  const { DIFF, LIBS } = parseDiff(rawResult);
  console.log(`DIFF=${DIFF}`);
  console.log(`LIBS=${LIBS}`);

  // Write to GITHUB_OUTPUT
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (githubOutput) {
    fs.appendFileSync(githubOutput, `DIFF=${DIFF}\n`);
    fs.appendFileSync(githubOutput, `LIBS=${LIBS}\n`);
  }
} catch (error) {
  console.error('Error processing diff:', error);
}

const parseDiff = (diff) => {

  const diffOutput = diff
    .split('\n')
    .filter(line => line.startsWith('- ') || line.startsWith('+ '))
    .map(line => line.trim());

  let updates = [];
  let libs = [];

  for (let i = 0; i < diffOutput.length; i += 2) {
    if (diffOutput[i] && diffOutput[i + 1]) {
      const oldDep = diffOutput[i].replace('- "', '').trim();
      const newDep = diffOutput[i + 1].replace('+ "', '').trim();
      const name = oldDep.split('":')[0]; // Extract package name
      if (name) {
        updates.push(`${name}: ${oldDep.split('":')[1]} => ${newDep.split('":')[1]}`);
        libs.push(name);
      }
    }
  }


  console.log(`DIFF=${updates.join(', ')}`);
  console.log(`LIBS=${libs.join(', ')}`);

  return { DIFF: updates.join(', '), LIBS: libs.join(', ') };
}