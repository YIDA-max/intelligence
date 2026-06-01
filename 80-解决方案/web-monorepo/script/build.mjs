/* eslint-disable no-console */
import { selectPackage, runNpmScript } from './utils.mjs';

const extraArgs = process.argv.slice(2);

const pkg = await selectPackage('build', '构建');
runNpmScript(pkg.path, 'build', extraArgs.length > 0 ? ['--', ...extraArgs] : []);
