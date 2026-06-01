<template>
	<div v-if="isShowBreadcrumb" class="layout-navbars-breadcrumb">
		<SvgIcon
			class="layout-navbars-breadcrumb-icon"
			:name="themeConfig.isCollapse ? 'ele-Expand' : 'ele-Fold'"
			:size="16"
			@click="onThemeConfigChange"
		/>
		<el-breadcrumb class="layout-navbars-breadcrumb-hide">
			<transition-group name="breadcrumb">
				<el-breadcrumb-item
					v-for="(v, k) in state.breadcrumbList"
					:key="!v.meta.tagsViewName ? v.name : v.meta.tagsViewName"
				>
					<span
						v-if="k === state.breadcrumbList.length - 1"
						class="layout-navbars-breadcrumb-span"
					>
						<SvgIcon
							:name="v.meta.icon"
							class="layout-navbars-breadcrumb-iconfont"
							v-if="themeConfig.isBreadcrumbIcon"
						/>
						<div v-if="!v.meta.tagsViewName">{{ $t(v.name) }}</div>
						<div v-else>{{ v.meta.tagsViewName }}</div>
					</span>
					<a v-else @click.prevent="onBreadcrumbClick(v)">
						<SvgIcon
							:name="v.meta.icon"
							class="layout-navbars-breadcrumb-iconfont"
							v-if="themeConfig.isBreadcrumbIcon"
						/>{{ $t(v.name) }}
					</a>
				</el-breadcrumb-item>
			</transition-group>
		</el-breadcrumb>
	</div>
</template>

<script setup lang="ts" name="layoutBreadcrumb">
import { reactive, computed, onMounted, watch } from 'vue';
import {
	onBeforeRouteUpdate,
	RouteLocation,
	useRoute,
	useRouter,
} from 'vue-router';
import { Local } from '/@/utils/storage';
import other from '/@/utils/other';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useRoutesList } from '/@/stores/routesList';

// 定义变量内容
const stores = useRoutesList();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { routesList } = storeToRefs(stores);
const route = useRoute();
const router = useRouter();
const state = reactive<BreadcrumbState>({
	breadcrumbList: [],
	routeSplit: [],
	routeSplitFirst: '',
	routeSplitIndex: 1,
});

// 动态设置经典、横向布局不显示
const isShowBreadcrumb = computed(() => {
	const { layout, isBreadcrumb } = themeConfig.value;
	if (layout === 'classic' || layout === 'transverse') return false;
	else return isBreadcrumb ? true : false;
});
// 面包屑点击时
const onBreadcrumbClick = (v: RouteItem) => {
	const { redirect, path } = v;
	if (redirect) router.push(redirect);
	else router.push(path);
};
// 展开/收起左侧菜单点击
const onThemeConfigChange = () => {
	themeConfig.value.isCollapse = !themeConfig.value.isCollapse;
	setLocalThemeConfig();
};
// 存储布局配置
const setLocalThemeConfig = () => {
	Local.remove('themeConfig');
	Local.set('themeConfig', themeConfig.value);
};
/**
 * 辅助函数：递归检查子菜单树中是否包含目标路径
 * @param children 子菜单数组
 * @param targetPath 目标路径
 * @returns 如果找到目标路径返回 true，否则返回 false
 *
 * 作用：用于判断某个父级菜单的子菜单树中是否包含当前访问的页面
 * 例如：当访问 /materialFlow/providerCode/index 时，
 *      检查"物流追踪"菜单的子菜单中是否包含这个路径
 */
const hasPathInChildren = (
	children: RouteItems,
	targetPath: string
): boolean => {
	for (const child of children) {
		// 如果子菜单的路径与目标路径完全匹配，返回 true
		if (child.path === targetPath) {
			return true;
		}
		// 如果子菜单还有子菜单，继续递归查找
		if (child.children && child.children.length > 0) {
			if (hasPathInChildren(child.children, targetPath)) {
				return true;
			}
		}
	}
	return false;
};

/**
 * 处理面包屑数据 - 递归查找完整路径链
 * @param arr 菜单列表数组
 * @param currentPath 当前访问的路径
 * @param breadcrumbs 已收集的面包屑数组（用于递归传递）
 * @returns 返回完整的面包屑路径链，如果没找到返回 null
 *
 * 核心逻辑：
 * 1. 遍历菜单列表，对每个菜单项进行两种匹配检查：
 *    - 直接匹配：当前路径是否等于或以该菜单项路径开头
 *    - 子菜单匹配：该菜单项的子菜单树中是否包含当前路径
 * 2. 如果匹配成功，将该菜单项加入面包屑链
 * 3. 如果完全匹配，返回面包屑链
 * 4. 如果有子菜单，继续递归查找
 *
 * 例如：访问 /materialFlow/providerCode/index
 * - 第一层：匹配到"物流"(/materialFlow)，加入面包屑
 * - 第二层：匹配到"物流追踪"（子菜单中包含目标路径），加入面包屑
 * - 第三层：完全匹配到"物流商代码配置表"，返回完整面包屑链
 */
const getBreadcrumbList = (
	arr: RouteItems,
	currentPath: string,
	breadcrumbs: RouteItem[] = []
): RouteItem[] | null => {
	for (const item of arr) {
		// 方式1: 直接路径匹配
		// 检查当前路径是否等于菜单项路径，或者以菜单项路径开头（说明是子路径）
		const directMatch =
			currentPath === item.path || currentPath.startsWith(item.path + '/');

		// 方式2: 子菜单匹配
		// 检查该菜单项的子菜单树中是否包含目标路径
		// 这样可以处理父级菜单路径不在当前路径中的情况
		const childrenMatch =
			item.children &&
			item.children.length > 0 &&
			hasPathInChildren(item.children, currentPath);

		// 如果直接匹配或子菜单匹配成功，说明这个菜单项应该在面包屑中
		if (directMatch || childrenMatch) {
			// 将当前菜单项加入面包屑链
			const newBreadcrumbs = [...breadcrumbs, item];

			// 如果完全匹配当前路径，说明找到了目标页面，返回完整的面包屑链
			if (currentPath === item.path) {
				return newBreadcrumbs;
			}

			// 如果有子菜单，继续在子菜单中递归查找
			if (item.children && item.children.length > 0) {
				const result = getBreadcrumbList(
					item.children,
					currentPath,
					newBreadcrumbs
				);
				// 如果在子菜单中找到了结果，返回
				if (result) {
					return result;
				}
			}
		}
	}
	// 遍历完所有菜单项都没找到，返回 null
	return null;
};

/**
 * 初始化面包屑导航
 * @param toRoute 目标路由对象
 *
 * 主要流程：
 * 1. 获取当前路由路径
 * 2. 使用递归方法查找完整的面包屑路径链
 * 3. 在面包屑前面加上"首页"
 * 4. 处理特殊情况（首页、异常页）
 * 5. 设置最后一个面包屑项的显示名称
 */
const initRouteSplit = (toRoute: RouteLocation) => {
	let path = toRoute.path;
	// 如果配置中关闭了面包屑显示，直接返回
	if (!themeConfig.value.isBreadcrumb) return false;

	// 使用递归方法查找完整的面包屑路径
	// 例如：/materialFlow/providerCode/index 会返回 [物流, 物流追踪, 物流商代码配置表]
	const breadcrumbs = getBreadcrumbList(routesList.value, path);

	if (breadcrumbs && breadcrumbs.length > 0) {
		// 在面包屑前面加上"首页"，形成完整的面包屑链
		// 最终结果：[首页, 物流, 物流追踪, 物流商代码配置表]
		state.breadcrumbList = [routesList.value[0], ...breadcrumbs];
	} else {
		// 如果没有找到匹配的路径，只显示首页
		state.breadcrumbList = [routesList.value[0]];
	}

	// 特殊处理：首页或异常页（404）只显示自己，不显示其他层级
	if (
		toRoute.name === 'router.home' ||
		(toRoute.name === 'staticRoutes.notFound' &&
			state.breadcrumbList.length > 1)
	) {
		// 删除除最后一项外的所有面包屑
		state.breadcrumbList.splice(0, state.breadcrumbList.length - 1);
	} else if (state.breadcrumbList.length > 0) {
		// 设置最后一个面包屑项的显示名称（支持国际化）
		state.breadcrumbList[state.breadcrumbList.length - 1].meta.tagsViewName =
			other.setTagsViewNameI18n(<RouteToFrom>route);
	}
};

// 页面加载时，初始化面包屑
onMounted(() => {
	initRouteSplit(route);
});

/**
 * 监听路由变化，实时更新面包屑
 * 当用户点击不同的菜单项时，route.path 会发生变化
 * 这个 watch 会自动触发，重新计算并更新面包屑显示
 */
watch(
	() => route.path,
	() => {
		initRouteSplit(route);
	}
);

/**
 * 路由更新钩子（备用方案）
 * 在某些情况下，watch 可能不会触发，这个钩子作为备用
 * 确保路由更新时面包屑一定会更新
 */
onBeforeRouteUpdate((to) => {
	initRouteSplit(to);
});
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb {
	flex: 1;
	height: inherit;
	display: flex;
	align-items: center;

	.layout-navbars-breadcrumb-icon {
		cursor: pointer;
		font-size: 18px;
		color: var(--next-bg-topBarColor);
		height: 100%;
		width: 40px;
		opacity: 0.8;

		&:hover {
			opacity: 1;
		}
	}

	.layout-navbars-breadcrumb-span {
		display: flex;
		opacity: 0.7;
		color: var(--next-bg-topBarColor);
	}

	.layout-navbars-breadcrumb-iconfont {
		font-size: 14px;
		margin-right: 5px;
	}

	:deep(.el-breadcrumb__separator) {
		opacity: 0.7;
		color: var(--next-bg-topBarColor);
	}

	:deep(.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link) {
		font-weight: unset !important;
		color: var(--next-bg-topBarColor);

		&:hover {
			color: var(--el-color-primary) !important;
		}
	}
}
</style>
