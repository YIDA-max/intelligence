#!/usr/bin/env sh

# 规范化目录名，避免特殊字符导致路径问题
sanitize_path_segment() {
	printf '%s' "${1-}" | sed 's#[\\/:*?"<>|]#_#g; s#^ *##; s# *$##; s#[[:space:]]\+#_#g'
}

# JSON 字符串转义
json_escape() {
	printf '%s' "${1-}" | sed ':a;N;$!ba;s/\\/\\\\/g;s/"/\\"/g;s/\r/\\r/g;s/\n/\\n/g;s/\t/\\t/g'
}

# 规范化分支名：移除 refs 前缀与已知 remote 前缀
normalize_branch_name() {
	local branch="$1"
	local remote

	branch="${branch#refs/heads/}"
	branch="${branch#refs/remotes/}"
	branch="${branch#remotes/}"

	for remote in $(git remote 2>/dev/null); do
		case "$branch" in
			"$remote"/*)
				branch="${branch#"$remote"/}"
				break
				;;
		esac
	done

	printf '%s' "$branch"
}

# 获取当前操作人（优先 git user.name）
get_operator_name() {
	local git_name
	git_name="$(git config --get user.name 2>/dev/null || printf '')"
	if [ -n "$git_name" ]; then
		printf '%s' "$git_name"
		return 0
	fi

	if [ -n "${GIT_AUTHOR_NAME-}" ]; then
		printf '%s' "$GIT_AUTHOR_NAME"
		return 0
	fi

	if [ -n "${USERNAME-}" ]; then
		printf '%s' "$USERNAME"
		return 0
	fi

	printf 'unknown'
}

get_log_base_dir() {
	local event="$1"
	local operator raw_operator date_str base_dir event_dir
	raw_operator="$(get_operator_name)"
	operator="$(sanitize_path_segment "$raw_operator")"
	date_str="$(date '+%Y-%m-%d')"
	base_dir=".husky/logs/$operator/$date_str"
	event_dir='operation'
	case "$event" in
		COMMIT) event_dir='commit' ;;
		MERGE) event_dir='merge' ;;
	esac
	mkdir -p "$base_dir/$event_dir"
	printf '%s/%s' "$base_dir" "$event_dir"
}

append_operation_log() {
	local event="$1"
	shift
	local detail="$*"
	local now log_file json_file operator escaped_detail escaped_operator json_object compact_json base_dir
	now="$(date '+%Y-%m-%d %H:%M:%S')"
	base_dir="$(get_log_base_dir "$event")"
	case "$event" in
		COMMIT)
			log_file="$base_dir/commit.log"
			json_file="$base_dir/commit.json"
			;;
		MERGE)
			log_file="$base_dir/merge.log"
			json_file="$base_dir/merge.json"
			;;
		*)
			log_file="$base_dir/operation.log"
			json_file="$base_dir/operation.json"
			;;
	esac
	operator="$(get_operator_name)"
	escaped_detail="$(json_escape "$detail")"
	escaped_operator="$(json_escape "$operator")"
	json_object="{\"timestamp\":\"$now\",\"event\":\"$event\",\"operator\":\"$escaped_operator\",\"detail\":\"$escaped_detail\"}"

	{
		printf '[%s] [%s]\n' "$now" "$event"
		printf '%s\n\n' "$detail"
	} >> "$log_file"

	# 同步写入结构化日志（标准 JSON 数组）
	if [ ! -s "$json_file" ]; then
		printf '[%s]\n' "$json_object" > "$json_file"
		return 0
	fi

	compact_json="$(tr -d ' \t\r\n' < "$json_file")"
	case "$compact_json" in
		'[]')
			printf '[%s]\n' "$json_object" > "$json_file"
			;;
		\[*\])
			printf '%s,%s]\n' "${compact_json%]}" "$json_object" > "$json_file"
			;;
		*)
			# 兜底：历史文件格式异常时重建为合法 JSON 数组，避免写入失败
			printf '[%s]\n' "$json_object" > "$json_file"
			;;
	esac
}

# 从提交消息中提取 merge 关键信息，并写入临时上下文文件
write_merge_meta_from_commit_msg() {
	local commit_msg_file="$1"
	local target_branch merge_title from_branch has_conflict conflict_files meta_file git_dir

	target_branch="$(git symbolic-ref --short -q HEAD 2>/dev/null || printf 'DETACHED')"
	target_branch="$(normalize_branch_name "$target_branch")"
	merge_title="$(sed -n '1p' "$commit_msg_file" 2>/dev/null || printf '')"
	from_branch=''

	# 兼容常见的 merge 提交标题
	if printf '%s' "$merge_title" | grep -q "^Merge branch '"; then
		from_branch="$(printf '%s' "$merge_title" | sed -n "s/^Merge branch '\([^']\+\)'.*$/\1/p")"
	elif printf '%s' "$merge_title" | grep -q '^Merge pull request '; then
		from_branch="$(printf '%s' "$merge_title" | sed -n 's/^Merge pull request #[0-9]\+ from \([^[:space:]]\+\).*$/\1/p')"
	elif printf '%s' "$merge_title" | grep -q "^Merge remote-tracking branch '"; then
		from_branch="$(printf '%s' "$merge_title" | sed -n "s/^Merge remote-tracking branch '\([^']\+\)'.*$/\1/p")"
	elif printf '%s' "$merge_title" | grep -q "^Merge .* into "; then
		# 兜底：提取 "Merge xxx into yyy" 中的 xxx
		from_branch="$(printf '%s' "$merge_title" | sed -n 's/^Merge \(.*\) into .*/\1/p')"
	fi
	from_branch="$(normalize_branch_name "$from_branch")"

	has_conflict='no'
	if grep -q '^Conflicts:$' "$commit_msg_file"; then
		has_conflict='yes'
	fi

	conflict_files="$(awk '
		/^Conflicts:$/ { in_conflicts=1; next }
		in_conflicts && /^[[:space:]]+\S/ { sub(/^[[:space:]]+/, "", $0); print; next }
		in_conflicts && !/^[[:space:]]+/ { in_conflicts=0 }
	' "$commit_msg_file" 2>/dev/null)"

	git_dir="$(git rev-parse --git-dir 2>/dev/null || printf '.git')"
	meta_file="$git_dir/husky-merge-meta"
	{
		printf 'merge_title=%s\n' "$merge_title"
		printf 'from_branch=%s\n' "$from_branch"
		printf 'to_branch=%s\n' "$target_branch"
		printf 'has_conflict=%s\n' "$has_conflict"
		printf 'conflict_files<<EOF\n%s\nEOF\n' "$conflict_files"
	} > "$meta_file"
}

read_merge_meta_value() {
	local key="$1"
	local git_dir meta_file
	git_dir="$(git rev-parse --git-dir 2>/dev/null || printf '.git')"
	meta_file="$git_dir/husky-merge-meta"
	[ -f "$meta_file" ] || return 1
	sed -n "s/^$key=//p" "$meta_file" | sed -n '1p'
}

read_merge_meta_conflict_files() {
	local git_dir meta_file
	git_dir="$(git rev-parse --git-dir 2>/dev/null || printf '.git')"
	meta_file="$git_dir/husky-merge-meta"
	[ -f "$meta_file" ] || return 1
	awk '
		/^conflict_files<<EOF$/ { in_block=1; next }
		in_block && /^EOF$/ { in_block=0; exit }
		in_block { print }
	' "$meta_file"
}

cleanup_merge_meta() {
	local git_dir meta_file
	git_dir="$(git rev-parse --git-dir 2>/dev/null || printf '.git')"
	meta_file="$git_dir/husky-merge-meta"
	[ -f "$meta_file" ] && rm -f "$meta_file"
}
