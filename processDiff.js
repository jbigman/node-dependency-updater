const { execSync } = require('child_process');

try {
  const diffOutput = execSync("git diff --unified=0 package.json")
    .toString()
    .split('\n')
    .filter(line => line.startsWith('- "') || line.startsWith('+ "')); // Fix filtering

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

  // Output for GitHub Actions
  console.log(`::set-output name=DIFF::${updates.join(', ')}`);
  console.log(`::set-output name=LIBS::${libs.join(', ')}`);
} catch (error) {
  console.error('Error processing diff:', error);
}
