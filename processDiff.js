const { execSync } = require('child_process');
const fs = require('fs');

try {
  const diffOutput = execSync("git diff --unified=0 package.json")
    .toString()
    .split('\n')
    .filter(line => line.startsWith('- "') || line.startsWith('+ "')); // Adjusted filtering

  let updates = [];
  let libs = [];

  for (let i = 0; i < diffOutput.length; i += 2) {
    if (diffOutput[i] && diffOutput[i + 1]) {
      const oldDep = diffOutput[i].replace('- "', '').trim();
      const newDep = diffOutput[i + 1].replace('+ "', '').trim();
      const name = oldDep.split('":')[0]; // Extract package name
      updates.push(`${name}: ${oldDep.split('":')[1]} => ${newDep.split('":')[1]}`);
      libs.push(name);
    }
  }

  console.log(`DIFF=${updates.join(', ')}`);
  console.log(`LIBS=${libs.join(', ')}`);

  // Write to GITHUB_OUTPUT
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (githubOutput) {
    fs.appendFileSync(githubOutput, `DIFF=${updates.join(', ')}\n`);
    fs.appendFileSync(githubOutput, `LIBS=${libs.join(', ')}\n`);
  }
} catch (error) {
  console.error('Error processing diff:', error);
}
