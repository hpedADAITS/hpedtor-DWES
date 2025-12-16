import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

const hostUrl = process.env.SONAR_HOST_URL || 'http://localhost:9001';
const token = process.env.SONAR_TOKEN || '';

const cmd = `sonar-scanner -Dsonar.host.url=${hostUrl} -Dsonar.token=${token}`;

try {
  execSync(cmd, {
    stdio: 'inherit',
  });
} catch (err) {
  process.exit(1);
}
