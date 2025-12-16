const { spawn } = require('node:child_process');

const run = (command, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });

const main = async () => {
  await run('npm', ['run', 'test:coverage']);
  const env = { ...process.env, SONAR_HOST_URL: process.env.SONAR_HOST_URL || 'http://sonarqube:9000' };
  await new Promise((resolve, reject) => {
    const child = spawn(
      'docker',
      [
        'compose',
        '-p',
        'noteedit_sonar',
        '--env-file',
        '.env.sonarqube',
        '-f',
        'docker-compose.sonarqube.yml',
        '--profile',
        'scan',
        'run',
        '--rm',
        'sonar_scanner',
      ],
      { stdio: 'inherit', env },
    );

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`docker exited with code ${code}`));
    });
  });
};

main().catch((err) => {
  process.stderr.write(`${err?.message || err}\n`);
  process.exitCode = 1;
});
