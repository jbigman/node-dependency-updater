const { execSync } = require('child_process');

try {
  const diffOutput = execSync("git diff --unified=0 package.json")
    .toString()
    .split('\n')
    .filter(line => line.startsWith('- "') || line.startsWith('+ "'));

  let updates = [];
  let libs = [];

  for (let i = 0; i < diffOutput.length; i += 2) {
    if (diffOutput[i] && diffOutput[i + 1]) {
      const oldDep = diffOutput[i].replace('-\t', '').trim();
      const newDep = diffOutput[i + 1].replace('+\t', '').trim();
      const name = oldDep.split(':')[0].replace(/"/g, '');
      updates.push(`${name}: ${oldDep.split(':')[1]} => ${newDep.split(':')[1]}`);
      libs.push(name);
    }
  }

  console.log(`DIFF=${updates.join(', ')}`);
  console.log(`LIBS=${libs.join(', ')}`);

  process.env.GITHUB_OUTPUT = `DIFF=${updates.join(', ')}\nLIBS=${libs.join(', ')}`;
} catch (error) {
  console.error('Error processing diff:', error);
}
