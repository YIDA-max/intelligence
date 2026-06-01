/* eslint-disable no-console */
import { selectPackage, runNpmScript } from './utils.mjs';

const extraArgs = process.argv.slice(2);

const pkg = await selectPackage('dev', '启动开发');
runNpmScript(pkg.path, 'dev', extraArgs.length > 0 ? ['--', ...extraArgs] : []);
