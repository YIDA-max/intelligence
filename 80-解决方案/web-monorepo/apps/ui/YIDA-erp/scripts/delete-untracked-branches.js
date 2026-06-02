/* eslint-disable no-console */
// delete-untracked-branches.js
const { execSync } = require('child_process');
const readline = require('readline');

/**
 * 安全删除本地分支（支持特殊字符）
 */
function deleteBranchRef(branchName) {
	try {
		// 使用引号包裹分支名，防止空格、中文、括号等导致解析错误
		execSync(`git branch -D "${branchName}"`, { stdio: 'pipe' });
		console.log(`🗑️  已删除分支: ${branchName}`);
		return true;
	} catch (e) {
		// 捕获具体错误信息（例如：branch not found, 或被 checkout 等）
		const errorMsg = e.message.trim().split('\n').pop() || e.message;
		console.error(`❌ 删除失败: ${branchName} — ${errorMsg}`);
		return false;
	}
}

function run() {
	const remoteName = process.argv[2] || 'origin';
	const mainBranches = ['main', 'master'];

	try {
		console.log(`🔍 获取远程 \`${remoteName}\` 的分支列表...`);
		const remoteBranchesOutput = execSync(
			`git ls-remote --heads ${remoteName}`,
			{ encoding: 'utf8' }
		);
		const remoteBranches = new Set();
		remoteBranchesOutput.split('\n').forEach((line) => {
			if (line.trim()) {
				const match = line.match(/refs\/heads\/(.+)/);
				if (match) {
					remoteBranches.add(match[1]);
				}
			}
		});

		console.log(`✅ 远程 \`${remoteName}\` 共有 ${remoteBranches.size} 个分支`);

		const localBranchesOutput = execSync(
			'git for-each-ref --format="%(refname:strip=2)" refs/heads',
			{ encoding: 'utf8' }
		);
		const currentBranch = execSync('git branch --show-current', {
			encoding: 'utf8',
		}).trim();

		const branchesToDelete = [];
		localBranchesOutput.split('\n').forEach((branch) => {
			const name = branch.trim();
			if (!name) return;
			if (name === currentBranch) {
				console.log(`ℹ️  跳过当前分支: ${name}`);
				return;
			}
			if (name.includes('(HEAD detached') || name.startsWith('(')) {
				console.log(`⚠️  跳过非法引用: ${name}`);
				return;
			}
			if (!remoteBranches.has(name)) {
				branchesToDelete.push(name);
			}
		});

		if (branchesToDelete.length === 0) {
			console.log('✅ 没有找到可删除的分支。');
			return;
		}

		// 确定主干分支（main 或 master）
		let targetMainBranch = null;
		for (const mb of mainBranches) {
			try {
				execSync(`git show-ref --verify --quiet refs/heads/${mb}`);
				targetMainBranch = mb;
				break;
			} catch (e) {
				// ignore
			}
		}

		// 检查未合并的分支
		const unmergedBranches = new Set();
		if (targetMainBranch) {
			console.log(`\n🔍 检查是否已合并到 \`${targetMainBranch}\`...`);
			branchesToDelete.forEach((branch) => {
				try {
					execSync(
						`git merge-base --is-ancestor "${branch}" "${targetMainBranch}"`,
						{ stdio: 'pipe' }
					);
				} catch (e) {
					unmergedBranches.add(branch);
				}
			});
		}

		console.log(
			`\n🗑️  以下 ${branchesToDelete.length} 个本地分支在远程 \`${remoteName}\` 中不存在：`
		);
		branchesToDelete.forEach((b) => {
			const marker = unmergedBranches.has(b) ? '❗' : '  ';
			console.log(`${marker} ${b}`);
		});

		if (unmergedBranches.size > 0) {
			console.log(
				`\n❗ 警告：${unmergedBranches.size} 个分支尚未合并到 \`${
					targetMainBranch || '主干'
				}\`，删除将永久丢失代码！`
			);
		}

		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		rl.question(`\n❓ 确认删除以上分支？(y/N): `, (answer) => {
			rl.close();
			if (answer.toLowerCase() === 'y') {
				console.log('\n⏳ 正在删除...');
				let successCount = 0;
				branchesToDelete.forEach((branch) => {
					if (deleteBranchRef(branch)) {
						successCount++;
					}
				});
				console.log(
					`\n✅ 成功清理 ${successCount}/${branchesToDelete.length} 个分支！`
				);
			} else {
				console.log('\n❌ 操作已取消。');
			}
		});
	} catch (err) {
		console.error('💥 脚本执行出错:', err.message);
		process.exit(1);
	}
}

run();
