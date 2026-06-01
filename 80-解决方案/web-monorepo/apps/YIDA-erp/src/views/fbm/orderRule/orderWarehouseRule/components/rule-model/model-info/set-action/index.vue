<template>
	<div class="box">
		<el-form
			:model="formData"
			ref="formRef"
			label-width="150px"
			:rules="rules"
			label-position="right"
		>
			<el-row class="title">
				<el-col :span="24">
					{{ t('设定动作') }}
				</el-col>
			</el-row>
			<el-row class="base-info" :gutter="20">
				<el-col :span="24">
					<el-form-item label="设定方式" prop="auto">
						<template #label>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							<span>{{ t('设定方式') }}</span>
						</template>
						<el-row style="width: 100%">
							<el-col :span="24">
								<el-radio-group
									v-model="formData.executionMethod"
									@change="handleExecutionMethodChange"
								>
									<el-radio :value="1" size="small">比价</el-radio>
									<el-radio :value="2" size="small">指定仓库物流</el-radio>
								</el-radio-group>
							</el-col>
						</el-row>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="base-info" :gutter="20">
				<el-col :span="16">
					<div v-if="formData.executionMethod === 1" class="comparison-mode">
						<el-row>
							<el-col :span="24">
								<el-form-item label="发货仓" prop="warehouseCodes">
									<el-row style="width: 100%">
										<el-col :span="24" class="flex">
											<el-select
												collapse-tags
												:max-collapse-tags="5"
												v-model="formData.warehouseCodes"
												clearable
												filterable
												multiple
												placeholder="发货仓"
												@change="changeWareHouseSelest"
												style="width: 100%"
											>
												<el-option
													v-for="item in warehouseOption"
													:key="item.warehouseCode"
													:label="item.warehouseName"
													:value="item.warehouseCode"
												/>
											</el-select>
										</el-col>
									</el-row>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row class="mt12" :gutter="20">
							<el-col :span="24">
								<el-form-item label="物流渠道" prop="channel">
									<el-row style="width: 100%">
										<el-col :span="24" class="flex">
											<custom-cascader
												v-model:queryForm="formData"
												:data="channelData"
												ref="customCascaderRef"
												:settings="{
													code: 'channel',
													text: '物流渠道',
													props: {
														value: 'id',
														label: 'name',
														children: 'children',
													},
													maxTagsToShow: 1,
													showSelectAll: true,
													width: '100%',
												}"
												@change="handleChannelChange"
											/>
										</el-col>
									</el-row>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
					<div v-else>
						<!-- 发货仓选择 -->
						<el-row class="base-info" :gutter="20">
							<el-col :span="24">
								<el-form-item label="发货仓">
									<template #label>
										<span
											:style="{
												color: '#f78c8c',
												marginRight: '3px',
											}"
											>*
										</span>
										<span>{{ t('发货仓') }}</span>
									</template>

									<warehouse-selector-panel
										:show-tab="false"
										v-model="formData.selectedWarehouses"
										:data="warehouseTabsData"
										:tabs="warehouseTabs"
										:default-active-tab="
											warehouseTabs.length ? warehouseTabs[0].key : null
										"
										@change="handleWarehouseChange"
										@reorder="handleWarehouseReorder"
									/>
								</el-form-item>
							</el-col>
						</el-row>
						<!-- 物流渠道选择 -->
						<el-row class="base-info mt12" :gutter="20">
							<el-col :span="24">
								<el-form-item label="物流渠道">
									<template #label>
										<span
											:style="{
												color: '#f78c8c',
												marginRight: '3px',
											}"
											>*
										</span>
										<span>{{ t('物流渠道') }}</span>
									</template>

									<channel-tree-selector
										ref="channelTreeSelectorRef"
										v-model="formData.selectedChannels"
										:data="channelTreeData"
									/>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-col>
			</el-row>
			<el-row class="base-info" :gutter="20">
				<el-col :span="16">
					<el-form-item label="库存使用方案" prop="inventoryUsageType">
						<el-select
							v-model="formData.inventoryUsageType"
							filterable
							placeholder="动作"
							style="width: 100%"
						>
							<el-option
								v-for="item in [
									{
										label: '优先使用旧箱规发货',
										value: 1,
									},
									{
										label: '优先使用新箱规发货',
										value: 2,
									},
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/> </el-select
					></el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>
<script setup lang="ts">
// 导入新组件
import { useMessage } from '/@/hooks/message';
import WarehouseSelectorPanel from './components/WarehouseSelectorPanel.vue';
import ChannelTreeSelector from './components/ChannelTreeSelector.vue';
import { useI18n } from 'vue-i18n';
import { getWarehouseInfoList } from '/@/api/warehouse/third-warehouse/index';
import { getWarehouseLogisticsChannelTree } from '/@/api/fbm/logisticsChannel/platformLogistics/index';
import { onMounted, watch, nextTick, computed } from 'vue';
const CustomCascader = defineAsyncComponent(
	() => import('/@/components/TreeSelectInput/custom-cascader.vue')
);

const { t } = useI18n();

// ==================== 数据定义 ====================
/**
 * 表单数据
 * executionMethod: 1-比价模式 2-指定仓库物流模式
 * 比价模式字段: warehouseCodes, channel (必填，一个仓库必须选一个渠道)
 * 指定模式字段: selectedWarehouses, selectedChannels (必填，一对一关系)
 */
const formData = ref<Record<string, any>>({
	executionMethod: 1,
	// 比价模式字段
	warehouseCodes: [], // 仓库代码数组
	channel: [], // 渠道ID数组
	// 指定模式字段
	selectedWarehouses: [], // 仓库对象数组
	selectedChannels: [], // 渠道对象数组
	// 公共字段
	inventoryUsageType: 1,
});

// 组件引用
const formRef = ref<any>(null);
const customCascaderRef = ref<any>(null); // 比价模式：级联选择器
const channelData = ref<any[]>([]); // 比价模式：渠道列表数据
const channelTreeSelectorRef = ref<any>(null); // 指定模式：树形选择器

// 数据源
const warehouseOption = ref<
	Array<{ warehouseCode: string; warehouseName: string }>
>([]); // 比价模式：仓库下拉
const warehouseTabsData = ref<Array<Record<string, any>>>([]); // 指定模式：仓库分组
const channelTreeData = ref<Array<Record<string, any>>>([]); // 指定模式：渠道树
// ==================== 【指定模式】监听渠道变化，确保一个仓库只能选一个渠道 ====================
watch(
	() => formData.value.selectedChannels,
	(newChannels) => {
		if (
			formData.value.executionMethod !== 2 ||
			!newChannels ||
			newChannels.length === 0
		)
			return;

		// 【改动】用 buildChannelInfoMap 递归查找每个渠道真正所属的顶层仓库，
		// 替换原来直接读 channel.parentId 的方式（原方式在多层树结构下会拿到中间层 id，导致分组错误）
		const channelInfoMap = buildChannelInfoMap(channelTreeData.value);

		// 按顶层仓库分组：key = 顶层仓库 code，value = 该仓库下已选渠道列表
		const channelsByWarehouse = new Map<string, any[]>();
		newChannels.forEach((channel: any) => {
			// 优先从递归映射里取顶层仓库 code，回退到 channel.parentId 兜底
			const warehouseId =
				channelInfoMap.get(channel.id)?.parentId ?? channel.parentId;

			if (warehouseId) {
				if (!channelsByWarehouse.has(warehouseId)) {
					channelsByWarehouse.set(warehouseId, []);
				}
				channelsByWarehouse.get(warehouseId)!.push(channel);
			}
		});

		// 检查是否有仓库选择了多个渠道
		const hasMultiple = Array.from(channelsByWarehouse.values()).some(
			(channels) => channels.length > 1
		);

		if (hasMultiple) {
			useMessage().warning('每个发货仓只能选择一个物流渠道');
			const adjustedChannels: any[] = [];
			const firstChannelsOfEachWarehouse: any[] = []; // 记录每个仓库的第一个渠道（不管 type）

			channelsByWarehouse.forEach((channels) => {
				const first = channels[0];
				firstChannelsOfEachWarehouse.push(first); // 保存原始第一个
				if (first.type === 1 || first.type === 2) {
					adjustedChannels.push(first);
				}
			});

			// 如果 adjustedChannels 为空，说明所有仓库的第一个渠道都是 type 3
			if (
				adjustedChannels.length === 0 &&
				firstChannelsOfEachWarehouse.length > 0
			) {
				// 兜底：保留第一个仓库的第一个渠道（type 3）
				adjustedChannels.push(firstChannelsOfEachWarehouse[0]);
			}

			formData.value.selectedChannels = adjustedChannels;

			// 同步到树形组件
			nextTick(() => {
				if (channelTreeSelectorRef.value) {
					const selectedIds = adjustedChannels.map((channel) => channel.id);
					channelTreeSelectorRef.value.setCheckedKeys(selectedIds);
				}
			});
		}
	},
	{ deep: true, immediate: false }
);

// 导出给父组件的方法
// 获取表单数据
const getFormData = async () => {
	let warehouseChannelMatch = [];

	if (
		formData.value.executionMethod === 2 &&
		formData.value.selectedWarehouses.length > 0
	) {
		// 指定仓库物流模式：使用选中的仓库和渠道
		warehouseChannelMatch = formData.value.selectedWarehouses
			.filter((warehouse: any) => {
				// 找到对应仓库的渠道
				const channel = formData.value.selectedChannels.find((ch: any) => {
					return (
						ch.parentId === (warehouse.id || warehouse.warehouseCode) ||
						ch.warehouseCode === (warehouse.warehouseCode || warehouse.id)
					);
				});
				return !!channel; // 只保留有渠道的仓库
			})
			.map((warehouse: any) => {
				// 找到对应仓库的渠道
				const channel = formData.value.selectedChannels.find(
					(ch: any) =>
						ch.parentId === (warehouse.id || warehouse.warehouseCode) ||
						ch.warehouseCode === (warehouse.id || warehouse.warehouseCode)
				);

				return {
					warehouseCode: warehouse.id || warehouse.warehouseCode,
					channelCode: channel?.id,
				};
			});
	} else if (
		formData.value.executionMethod === 1 &&
		formData.value.warehouseCodes.length > 0
	) {
		// 比价模式：支持一个仓库多个渠道
		const channelData = (await getChannelData()) as Array<Record<string, any>>;
		const channelMap = new Map<
			string,
			{ id: string | number; warehouseCode: string }
		>();
		// 构建渠道映射
		channelData.forEach((warehouse) => {
			warehouse.children?.forEach((channel: Record<string, any>) => {
				// 第一层级循环
				channelMap.set(channel.id, {
					id: channel.id,
					warehouseCode: warehouse.warehouseCode,
				});
				// 第二层级循环
				channel?.children?.forEach((subChannel: Record<string, any>) => {
					channelMap.set(subChannel.id, {
						id: subChannel.id,
						warehouseCode: warehouse.warehouseCode,
					});
				});
			});
		});
		// 为每个选中的渠道生成记录
		const selectedChannelIds = formData.value.channel || [];

		// 为每个选中的渠道生成记录，支持一个仓库对应多个渠道
		selectedChannelIds.forEach((channelId: string) => {
			const channelInfo = channelMap.get(channelId);
			if (channelInfo) {
				warehouseChannelMatch.push({
					warehouseCode: channelInfo.warehouseCode,
					channelCode: channelId,
				});
			}
		});

		// 如果没有选择渠道，返回仓库信息 //可能要删除
		if (selectedChannelIds.length === 0) {
			formData.value.warehouseCodes.forEach((warehouseCode: string) => {
				warehouseChannelMatch.push({ warehouseCode });
			});
		}
	}
	const result = {
		executionMethod: formData.value.executionMethod,
		inventoryUsageType: formData.value.inventoryUsageType,
		warehouseChannelMatch:
			warehouseChannelMatch.length > 0 ? warehouseChannelMatch : null,
	};

	return result;
};
// 表单验证方法
const validateForm = async () => {
	try {
		// 先验证表单的基本字段（排除仓库和渠道字段）
		await formRef.value?.validate();
	} catch (error) {
		return { valid: false, message: '请填写完整信息' };
	}

	// 手动验证指定仓库物流模式的仓库和渠道选择
	if (formData.value.executionMethod === 2) {
		// 指定物流渠道模式：仓库和物流渠道都是一对一关系，且都是必填
		if (
			!formData.value.selectedWarehouses ||
			formData.value.selectedWarehouses.length === 0
		) {
			return { valid: false, message: '请至少选择一个仓库' };
		}
		if (
			!formData.value.selectedChannels ||
			formData.value.selectedChannels.length === 0
		) {
			return { valid: false, message: '请至少选择一个物流渠道' };
		}
	}
	// 获取表单数据
	const formDataResult = await getFormData();
	return { valid: true, data: formDataResult };
};

/**
 * 【比价模式】渠道校验函数
 * 确保每个仓库都至少选择了一个渠道
 */
const validateComparisonChannel = async (
	rule: any,
	value: any,
	callback: any
) => {
	// 只在比价模式下校验
	if (formData.value.executionMethod !== 1) {
		callback();
		return;
	}

	// 仓库必须选择
	if (
		!formData.value.warehouseCodes ||
		formData.value.warehouseCodes.length === 0
	) {
		callback(new Error('请至少选择一个仓库'));
		return;
	}

	// 渠道必须选择
	if (!formData.value.channel || formData.value.channel.length === 0) {
		callback(new Error('请为每个仓库至少选择一个物流渠道'));
		return;
	}

	// 检查每个仓库是否都有对应的渠道
	// 使用已加载的 channelData.value，避免重新请求接口
	if (!channelData.value || channelData.value.length === 0) {
		callback(new Error('请先选择仓库以加载渠道数据'));
		return;
	}
	// 递归构建
	const fn = (
		nodes: any[],
		warehouseCode: string,
		selectedChannelIds: Set<number | string>,
		map: Map<string, string[]>
	) => {
		// 遍历当前层级的所有节点（渠道或子渠道）
		for (const node of nodes) {
			// 如果当前节点是选中的渠道，则将其 warehouseCode 加入映射
			if (selectedChannelIds.has(node.id)) {
				// 确保目标仓库的数组已初始化
				if (!map.has(warehouseCode)) {
					map.set(warehouseCode, []);
				}
				// 推入该渠道对应的 warehouseCode（按你的业务逻辑）
				map.get(warehouseCode)!.push(node.warehouseCode);
			}

			// 如果当前节点还有子渠道（children），则递归处理
			if (node.children && Array.isArray(node.children)) {
				fn(node.children, warehouseCode, selectedChannelIds, map);
			}
		}
	};
	const warehouseChannelMap = new Map<string, string[]>();
	// 构建渠道到仓库的映射
	channelData.value.forEach((warehouse: any) => {
		warehouseChannelMap.set(warehouse.code, []);
		fn(
			warehouse.children || [],
			warehouse.code,
			new Set(formData.value.channel),
			warehouseChannelMap
		);
	});

	// 检查是否每个仓库都有至少一个渠道
	const warehousesWithoutChannel: string[] = [];
	formData.value.warehouseCodes.forEach((warehouseCode: string) => {
		const channels = warehouseChannelMap.get(warehouseCode) || [];
		if (channels.length === 0) {
			warehousesWithoutChannel.push(warehouseCode);
		}
	});
	if (warehousesWithoutChannel.length > 0) {
		callback(new Error('请为每个仓库至少选择一个物流渠道'));
	} else {
		callback();
	}
};

// 表单校验规则生成函数
const getRules = () => {
	// 基础规则：所有模式都需要
	const baseRules = {
		executionMethod: [
			{ required: true, message: '请选择设定方式', trigger: 'blur' },
		],
		inventoryUsageType: [
			{
				required: true,
				message: '请至少选择一个库存使用方案',
				trigger: 'change',
			},
		],
		// 比价模式字段：始终必填
		warehouseCodes: [
			{ required: true, message: '请至少选择一个仓库', trigger: 'change' },
		],
		channel: [
			{
				required: true,
				message: '请为每个仓库至少选择一个物流渠道',
				trigger: 'change',
				validator: validateComparisonChannel,
			},
		],
	};

	// 根据执行方式添加对应的校验规则
	if (formData.value.executionMethod === 2) {
		// 指定物流渠道模式：添加额外的校验
		return {
			...baseRules,
			selectedWarehouses: [
				{ required: true, message: '请至少选择一个仓库', trigger: 'change' },
			],
			selectedChannels: [
				{
					required: true,
					message: '请至少选择一个物流渠道',
					trigger: 'change',
				},
			],
		};
	}

	// 比价模式：返回基础规则（已包含 warehouseCodes 和 channel 的必填校验）
	return baseRules;
};

// 表单校验
const rules = ref(getRules());

// 仓库tab数据，直接用接口返回的类型和名称
const warehouseTabs = computed(() =>
	warehouseTabsData.value.map((group) => ({
		key: group.id, // 仓库类型编号，如 1, 2, 3
		label: group.name, // 仓库类型名称，如 '平台仓'
	}))
);

onMounted(() => {
	getWareHouseListOption();
});

// ==================== 初始化和数据加载 ====================
// 获取仓库数据并分组
const getWareHouseListOption = async () => {
	const res = await getWarehouseInfoList({
		status: 1, // 只获取启用的仓库
	});
	warehouseOption.value = res?.data;
	warehouseTabsData.value = [
		{
			id: 'third-party',
			name: '三方仓',
			type: 'third-party',
			children: res?.data.map((item: any) => ({
				id: item.warehouseCode,
				name: `${item.spName} - ${item.warehouseName}`,
				type: 'third-party',
			})),
		},
	];
};

/**
 * 设定方式切换事件处理
 * 清空所有数据，重置为初始状态
 * 注意：如果有选中的仓库，需要清空层级选择器的渠道列表数据
 */
const handleExecutionMethodChange = () => {
	// 先清空级联选择器的数据（避免使用旧的仓库代码请求接口）
	if (customCascaderRef.value) {
		customCascaderRef.value.clearData();
	}

	// 清空比价模式数据
	formData.value.warehouseCodes = [];
	formData.value.channel = [];

	// 清空指定模式数据
	formData.value.selectedWarehouses = [];
	formData.value.selectedChannels = [];
	channelTreeData.value = [];

	// 重置公共字段
	formData.value.inventoryUsageType = 1;

	// 更新校验规则
	rules.value = getRules();

	// 清除校验状态
	nextTick(() => {
		formRef.value?.clearValidate();
	});
};

// ==================== 【比价模式】相关功能 ====================
/**
 * 【比价模式】加载渠道数据
 * 根据选中的仓库代码获取渠道数据，并更新 channelData
 */
const loadChannelData = async () => {
	// 如果没有选中仓库，清空渠道数据
	if (
		!formData.value.warehouseCodes ||
		formData.value.warehouseCodes.length === 0
	) {
		channelData.value = [];
		return;
	}

	// 根据选中的仓库代码获取渠道数据
	const data = (await getChannelData()) as Array<Record<string, any>>;
	channelData.value = data;
};

/**
 * 【比价模式】根据仓库代码获取渠道数据
 * @returns 渠道树数据
 */
const getChannelData = async (): Promise<Array<Record<string, any>>> => {
	const codes = formData.value.warehouseCodes;
	if (!codes || !Array.isArray(codes) || codes.length === 0) {
		return [];
	}
	const res = await getWarehouseLogisticsChannelTree({
		warehouseCodes: codes,
		status: 1,
	});
	if (res.code !== 0) {
		return [];
	}
	const setData = (res.data || []) as unknown as Array<Record<string, any>>;
	return setData;
};

/**
 * 【比价模式】渠道选择变化处理
 * 当渠道选择变化时，触发表单校验
 */
const handleChannelChange = () => {
	nextTick(() => {
		formRef.value?.validateField(['channel']);
	});
};

/**
 * 【比价模式】仓库选择变化处理
 * 当仓库变化时：
 * 1. 保存当前已选中的渠道
 * 2. 清空级联选择器数据
 * 3. 如果没有选中仓库，清空渠道
 * 4. 如果有选中仓库，重新加载渠道数据
 * 5. 过滤渠道，只保留属于当前仓库的渠道
 * 6. 触发渠道校验
 */
const changeWareHouseSelest = async () => {
	// 保存当前已选中的渠道
	const currentChannels = [...(formData.value.channel || [])];

	// 清空级联选择器数据
	if (customCascaderRef.value) {
		customCascaderRef.value.clearData();
	}

	// 如果没有选中仓库，清空渠道
	if (
		!formData.value.warehouseCodes ||
		formData.value.warehouseCodes.length === 0
	) {
		formData.value.channel = [];
		nextTick(() => {
			formRef.value?.validateField(['channel']);
		});
		return;
	}

	// 有选中仓库：重新加载渠道数据
	await loadChannelData();

	// 过滤渠道：只保留属于当前选中仓库的渠道
	const validChannelIds = new Set<string>();
	channelData.value.forEach((warehouse: any) => {
		warehouse.children?.forEach((channel: any) => {
			// 第一层级循环
			validChannelIds.add(channel.id);
			channel?.children?.forEach((subChannel: any) => {
				// 第二层级循环
				validChannelIds.add(subChannel.id);
			});
		});
	});

	// 过滤出仍然有效的渠道（保留之前选中的渠道）
	formData.value.channel = currentChannels.filter((channelId: string) =>
		validChannelIds.has(channelId)
	);

	// 触发渠道字段的校验
	nextTick(() => {
		formRef.value?.validateField(['channel']);
	});
};

// ==================== 【指定模式】相关功能 ====================
/**
 * 【指定模式】构建渠道信息映射（递归处理多层嵌套）
 */
const buildChannelInfoMap = (channelData: Array<Record<string, any>>) => {
	const map = new Map<string, { name: string; parentId: string }>();

	// 递归处理渠道节点
	const processChannelNodes = (
		nodes: Array<Record<string, any>>,
		warehouseCode: string
	) => {
		nodes.forEach((node: any) => {
			// 如果节点有 id，将其添加到映射中
			if (node.id) {
				map.set(node.id, {
					name: node.name,
					parentId: warehouseCode,
				});
			}

			// 如果节点有子节点，递归处理
			if (
				node.children &&
				Array.isArray(node.children) &&
				node.children.length > 0
			) {
				processChannelNodes(node.children, warehouseCode);
			}
		});
	};

	// 遍历每个仓库
	channelData.forEach((warehouse: any) => {
		const warehouseCode = warehouse.warehouseCode || warehouse.id;

		// 如果仓库有子节点，递归处理
		if (warehouse.children && Array.isArray(warehouse.children)) {
			processChannelNodes(warehouse.children, warehouseCode);
		}
	});

	return map;
};

/**
 * 【指定模式】仓库选择变化处理
 * 当仓库变化时：
 * 1. 重新获取渠道数据
 * 2. 过滤已选渠道，只保留仍然有效的
 * 3. 按仓库顺序排序渠道
 */
const handleWarehouseChange = async (
	selectedWarehouses: Array<Record<string, any>>
) => {
	if (formData.value.executionMethod !== 2) {
		channelTreeData.value = [];
		formData.value.selectedChannels = [];
		return;
	}
	if (channelTreeSelectorRef.value) {
		await channelTreeSelectorRef.value.loadData();
	}

	const warehouseCodes = (selectedWarehouses || [])
		.map((warehouse) => warehouse.id || warehouse.warehouseCode)
		.filter((code: string) => !!code);

	if (warehouseCodes.length === 0) {
		channelTreeData.value = [];
		formData.value.selectedChannels = [];
		return;
	}

	const channelData = await getChannelDataByWarehouseCodes(warehouseCodes);
	channelTreeData.value = channelData;

	// 构建最新的渠道名称与父仓库映射，保留仍合法的选中项
	const channelInfoMap = buildChannelInfoMap(channelData);

	const currentSelected = formData.value.selectedChannels || [];
	const filteredSelected = currentSelected
		.filter((channel: any) => channelInfoMap.has(channel.id))
		.map((channel: any) => {
			const info = channelInfoMap.get(channel.id)!;
			return {
				id: channel.id,
				name: info.name || channel.name,
				parentId: info.parentId,
			};
		})
		// 确保渠道顺序与仓库顺序一致
		.sort((a: any, b: any) => {
			const aIndex = warehouseCodes.indexOf(a.parentId);
			const bIndex = warehouseCodes.indexOf(b.parentId);
			return aIndex - bIndex;
		});

	formData.value.selectedChannels = filteredSelected;

	await nextTick();
};

// 根据仓库代码获取渠道数据的辅助方法
const getChannelDataByWarehouseCodes = async (
	warehouseCodes: string[]
): Promise<Array<Record<string, any>>> => {
	let channelData: Array<Record<string, any>> = [];
	const res = await getWarehouseLogisticsChannelTree({
		warehouseCodes,
		status: 1,
	});

	if (res.code === 0) {
		channelData = (res.data || []) as unknown as Array<Record<string, any>>;
	}

	return channelData;
};

/**
 * 【指定模式】仓库排序变化处理
 * 当仓库顺序变化时，同步调整渠道顺序
 */
const handleWarehouseReorder = async (
	reorderedWarehouses: Array<Record<string, any>>
) => {
	// 更新仓库顺序
	formData.value.selectedWarehouses = reorderedWarehouses;

	// 重新排列物流渠道，使其与仓库顺序保持一致
	if (
		reorderedWarehouses.length > 0 &&
		formData.value.selectedChannels.length > 0
	) {
		const warehouseCodes = reorderedWarehouses.map(
			(warehouse) => warehouse.id || warehouse.warehouseCode
		);

		try {
			// 如果没有渠道树数据，先获取一次
			if (channelTreeData.value.length === 0) {
				const channelData = await getChannelDataByWarehouseCodes(
					warehouseCodes
				);
				channelTreeData.value = channelData;
			}

			// 构建渠道信息映射，用于获取渠道名称等信息
			const channelInfoMap = buildChannelInfoMap(channelTreeData.value);

			// 获取当前选中的渠道
			const currentSelectedChannels = formData.value.selectedChannels || [];

			// 按照新的仓库顺序重新排列渠道
			const reorderedChannels = reorderedWarehouses
				.map((warehouse) => {
					// 查找当前仓库对应的渠道
					const warehouseCode = warehouse.id || warehouse.warehouseCode;
					const existingChannel = currentSelectedChannels.find(
						(channel: any) =>
							channel.parentId === warehouseCode ||
							channel.warehouseCode === warehouseCode
					);

					if (existingChannel) {
						const info = channelInfoMap.get(existingChannel.id);
						return {
							id: existingChannel.id,
							name: info?.name || existingChannel.name,
							parentId: warehouseCode,
						};
					}

					return null;
				})
				.filter(Boolean);

			// 更新渠道顺序，与仓库顺序一致
			formData.value.selectedChannels = reorderedChannels;

			// 等待DOM更新后，同步树形组件的选择状态
			await nextTick();
			if (channelTreeSelectorRef.value) {
				const selectedIds = reorderedChannels
					.filter(
						(channel): channel is NonNullable<typeof channel> =>
							channel !== null
					)
					.map((channel) => channel.id);
				channelTreeSelectorRef.value.setCheckedKeys(selectedIds);
			}
		} catch (error) {
			useMessage().error('重新排列物流渠道失败');
		}
	}
};

/**
 * 【指定模式】同步渠道选择（用于数据回显）
 */
const syncChannelSelection = async ({
	warehouseMatch,
}: {
	warehouseMatch: Array<Record<string, any>>;
}) => {
	const selectedWarehouses = formData.value.selectedWarehouses || [];
	const warehouseCodes = selectedWarehouses
		.map((warehouse: any) => warehouse.id || warehouse.warehouseCode)
		.filter((code: string) => !!code);

	if (warehouseCodes.length === 0) {
		channelTreeData.value = [];
		formData.value.selectedChannels = [];
		return;
	}

	try {
		const channelData = await getChannelDataByWarehouseCodes(warehouseCodes);
		channelTreeData.value = channelData;
		const channelInfoMap = buildChannelInfoMap(channelData);
		const selectedChannels = warehouseMatch
			.filter(
				(item: any) =>
					warehouseCodes.includes(item.warehouseCode) && item.channelCode
			)
			.map((item: any) => {
				const info = channelInfoMap.get(item.channelCode);
				return {
					id: item.channelCode,
					name: info?.name || item.channelCode,
					parentId: info?.parentId || item.warehouseCode,
				};
			})
			// 确保渠道顺序与仓库顺序一致
			.sort((a: any, b: any) => {
				const aIndex = warehouseCodes.indexOf(a.parentId);
				const bIndex = warehouseCodes.indexOf(b.parentId);
				return aIndex - bIndex;
			});

		formData.value.selectedChannels = selectedChannels;
		await nextTick();
	} catch (error) {
		channelTreeData.value = [];
		formData.value.selectedChannels = [];
	}
};

// ==================== 表单初始化和数据回显 ====================
/**
 * 初始化表单
 */
const init = () => {
	formData.value = {
		executionMethod: 1,
		selectedWarehouses: [], // 重置发货仓选中的仓库列表
		selectedChannels: [], // 重置物流渠道选中的渠道列表
		warehouseCodes: [],
		channel: [],
		inventoryUsageType: 1,
	};
	// 初始化时清除校验状态
	nextTick(() => {
		formRef.value?.clearValidate();
	});
};

/**
 * 设置表单数据（用于编辑回显）
 */
const setFormData = async (data: Record<string, any>) => {
	let warehouseChannelMatch = [];
	try {
		warehouseChannelMatch = JSON.parse(data.warehouseChannelMatch || '[]');
	} catch (error) {
		warehouseChannelMatch = [];
	}

	// 获取仓库和渠道的实际名称
	const warehouseCodes = warehouseChannelMatch?.map(
		(item: any) => item.warehouseCode
	);
	const channelCodes = warehouseChannelMatch?.map(
		(item: any) => item.channelCode
	);

	// 获取仓库名称映射
	const warehouseMap = new Map();
	try {
		const warehouseRes = await getWarehouseInfoList({ status: '1' });
		warehouseRes?.data?.forEach((warehouse: any) => {
			warehouseMap.set(warehouse.warehouseCode, warehouse.warehouseName);
		});
	} catch (error: any) {
		useMessage().error(error);
	}

	// 根据执行方式设置不同的数据结构
	if (data.executionMethod === 1) {
		// 比价模式：设置仓库代码和渠道数据
		const uniqueWarehouseCodes = [...new Set(warehouseCodes || [])];

		// 获取所有渠道代码（包括重复的，因为一个仓库可能对应多个渠道）
		const allChannelCodes = channelCodes || [];

		formData.value = {
			executionMethod: data.executionMethod,
			warehouseCodes: uniqueWarehouseCodes,
			channel: allChannelCodes, // 设置渠道ID数组用于custom-cascader
			selectedWarehouses: [],
			selectedChannels: [],
			inventoryUsageType: data.inventoryUsageType || 2,
		};
		// 触发仓库和渠道选择框的回显
		await nextTick();
		changeWareHouseSelest();
	} else {
		// 指定仓库物流模式：设置仓库对象和渠道数据
		const selectedWarehouses = warehouseChannelMatch.map((item: any) => ({
			id: item.warehouseCode,
			name: warehouseMap.get(item.warehouseCode) || item.warehouseCode,
			type: 'third-party',
		}));

		// 重新排列仓库顺序，使其与warehouseChannelMatch中的顺序一致
		const reorderedWarehouses = warehouseChannelMatch.map((item: any) => ({
			id: item.warehouseCode,
			name: warehouseMap.get(item.warehouseCode) || item.warehouseCode,
			type: 'third-party',
		}));

		formData.value = {
			executionMethod: data.executionMethod,
			selectedWarehouses: reorderedWarehouses,
			selectedChannels: [],
			warehouseCodes: warehouseCodes,
			channel: channelCodes,
			inventoryUsageType: data.inventoryUsageType || 2,
		};
		if (selectedWarehouses.length > 0) {
			await syncChannelSelection({ warehouseMatch: warehouseChannelMatch });
		}
	}

	// 更新校验规则
	rules.value = getRules();

	nextTick(() => {
		formRef.value?.clearValidate();
	});
};

defineExpose({
	validateForm,
	init,
	setFormData,
});
</script>

<style scoped lang="scss">
.box {
	border-radius: 5px;
	min-height: 100%;

	.title {
		font-size: 16px;
		font-weight: 500;
	}

	.comparison-mode {
		// 比价模式的样式，确保内容紧凑显示
		min-height: auto;
	}

	// 确保库存使用方案和发货确认部分紧跟在前面的内容下方
	.base-info {
		margin-top: 12px;

		&:first-of-type {
			margin-top: 0;
		}
	}
}
.span-tip {
	margin-left: 10px;
	color: #999;
	font-size: 12px;
}
</style>
