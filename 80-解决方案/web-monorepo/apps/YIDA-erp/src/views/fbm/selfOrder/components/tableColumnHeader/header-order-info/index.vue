<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-24 15:55:59
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-12 16:05:23
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\tableColumnHeader\header-order-info\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import commonFunction from '/@/utils/commonFunction';
import { DocumentCopy } from '@element-plus/icons-vue';
import { postUpdateOrderTag } from '/@/api/fbm/selfOrder/index';
import { getSelfOrderDetail } from '/@/api/fbm/selfOrder/index';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';
const { t } = useI18n();
import { Ref } from 'vue';
//根据订单号id获取合单列表
import { postdetailBySelfOrderNo } from '/@/api/fbm/selfOrder/index';
const { copyText } = commonFunction();
// 编辑标签组件
const EditTag = defineAsyncComponent(
	() => import('/@/components/EditTag/index.vue')
);
// 查看详情的组件
const ShowInfo = defineAsyncComponent(
	() => import('/@/views/fbm/selfOrder/components/info/index.vue')
);
const updateCurrentRow = inject<any>('updateCurrentRow');
// 查看详情的引用
const showInfoRef = ref();
const props = defineProps({
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});
const getDataList = inject('getDataList') as () => void;
// 编辑标签
const handleEditTag = async (tag: any) => {
	const res = await postUpdateOrderTag({
		id: props.currentRow.id,
		tagIds: tag?.map((item: any) => item.id),
	});
	if (res.code === 0) {
		// 更新当前行数据
		getDataList();
	}
};
// 显示查看详情
const showInfo = async () => {
	const res = await getSelfOrderDetail({ id: props.currentRow.id });
	if (res.code === 0) {
		// 更新父组件的currentRow
		updateCurrentRow(res.data);
		showInfoRef.value?.show();
	}
};

//合单弹窗引用
interface CombineOrderRef {
	handleOpen: (list: any[], index: number) => void;
}

const combineOrderRef = inject<Ref<CombineOrderRef | null>>(
	'combineOrderRef',
	ref(null)
);
//合单列表
const mergeOrderList = ref<any[]>([]);

const mergeOrder = async (selfOrderNos: any) => {
	if (!selfOrderNos) return;
	try {
		const res = await postdetailBySelfOrderNo(selfOrderNos);
		if (res.code === 0) {
			mergeOrderList.value = [props.currentRow, ...res.data];
			combineOrderRef.value?.handleOpen(mergeOrderList.value, 0);
		} else {
			useMessage().error(res.msg ?? t('操作失败'));
			return;
		}
	} catch (error: any) {
		useMessage().error(error?.msg || error?.message || t('网络错误'));
	}
};
</script>

<template>
	<div class="component">
		<el-row class="row" gutter="20">
			<el-col :span="5" class="flex">
				<el-popover placement="top" width="200" trigger="hover">
					<div class="p-2">
						<div>店铺: {{ props.currentRow?.storeName || '未知状态' }}</div>
						<div>站点: {{ props.currentRow?.siteCode || '未知状态' }}</div>
					</div>
					<template #reference>
						<span class="flex w-full truncate">
							<span class="mr-1">
								<span class="font-color">平台:</span>
								{{ props.currentRow?.platformChannelText }}
							</span>
							<span>
								{{ props.currentRow?.storeName || '未知状态' }}:
								{{ props.currentRow?.siteCode || '未知状态' }}
							</span>
						</span>
					</template>
				</el-popover>
			</el-col>
			<el-col :span="5" class="flex"
				><el-row>
					<el-col :span="24" class="flex">
						<span class="mr-1 font-color"> 平台单号:</span>
						<el-popover placement="top" width="200" trigger="hover">
							<template #reference>
								<div
									v-if="auth('selfOrder-showInfo')"
									class="ml-1 mr-1 truncate max-w-48"
								>
									<el-link
										@click="
											() => {
												showInfo();
											}
										"
										:style="{ color: '#0045F0' }"
									>
										<span>{{
											props.currentRow?.platformOrderNo || '未知状态'
										}}</span>
									</el-link>
								</div>
								<div v-else class="ml-1 mr-1 truncate max-w-48">
									<span>{{
										props.currentRow?.platformOrderNo || '未知状态'
									}}</span>
								</div>
							</template>
							<div class="p-2">
								<span class="w-full">{{
									props.currentRow?.platformOrderNo || '未知状态'
								}}</span>
							</div>
						</el-popover>
						<el-link
							:icon="DocumentCopy"
							@click="copyText(props.currentRow?.platformOrderNo)"
							underline="never"
						></el-link>
						<span
							v-if="props.currentRow?.resendOrder === 1"
							class="resend-badge"
						>
							补
						</span>
					</el-col>
				</el-row></el-col
			>

			<el-col :span="5">
				<el-row>
					<el-col :span="24" class="flex">
						<span class="font-color">
							{{ props.currentRow?.selfOrderNo ? '系统订单号:' : '未知状态:' }}
						</span>
						<el-popover placement="top" width="200" trigger="hover">
							<template #reference>
								<span class="ml-1 mr-1 truncate max-w-52">{{
									props.currentRow?.selfOrderNo || '未知状态'
								}}</span>
							</template>
							<div class="p-2">
								<span class="w-full mr-1 truncate">{{
									props.currentRow?.selfOrderNo || '未知状态'
								}}</span>
							</div>
						</el-popover>

						<el-link
							:icon="DocumentCopy"
							@click="copyText(props.currentRow?.selfOrderNo)"
							underline="never"
						></el-link>
					</el-col>
				</el-row>
			</el-col>

			<el-col :span="9" class="order-tags-col">
				<div class="merged-tags-wrap">
					<div class="tag-group tag-group--platform">
						<span class="tag-group__label">平台标签</span>
						<div class="tag-group__content platform-order-tags-row">
							<el-tag
								class="platform-order-tag platform-order-tag--platform"
								v-for="item in (props.currentRow?.platformOrderTag
									? props.currentRow?.platformOrderTag.split(',')
									: []
								).slice(0, 3)"
								:key="item"
							>
								<span class="platform-order-tag__text">
									<MrTextEllipsis :text="item" :max-length="10" />
								</span>
							</el-tag>
							<span
								v-if="
									(props.currentRow?.platformOrderTag
										? props.currentRow?.platformOrderTag.split(',')
										: []
									).length === 0
								"
								class="tag-placeholder"
							>
								---
							</span>
							<el-popover
								v-if="
									(props.currentRow?.platformOrderTag
										? props.currentRow?.platformOrderTag.split(',')
										: []
									).length > 1
								"
								placement="top"
								width="200"
								trigger="hover"
							>
								<el-tag
									v-for="item in props.currentRow?.platformOrderTag
										? props.currentRow?.platformOrderTag.split(',')
										: []"
									:key="item"
									:style="{
										margin: '4px 4px 0 0',
										color: '#fff',
										backgroundColor: 'rgba(19, 156, 104,0.8)',
										border: 'none',
									}"
									:color="item.color"
									>{{ item }}</el-tag
								>
								<template #reference>
									<el-tag
										v-if="
											props.currentRow?.platformOrderTag.split(',')
												? props.currentRow?.platformOrderTag.split(',').length >
												  3
												: false
										"
										:style="{
											marginLeft: '8px',
											background: '#f0f0f0',
											color: '#000',
											cursor: 'pointer',
										}"
										>...</el-tag
									>
								</template>
							</el-popover>
						</div>
					</div>
					<el-tag
						v-if="
							props.currentRow?.mergeFlag &&
							props.currentRow?.mergeSelfOrderNos.length > 0
						"
						type="primary"
						effect="dark"
						class="merge-tag"
						@click="mergeOrder(props.currentRow?.mergeSelfOrderNos)"
						style="cursor: pointer"
						>可合单</el-tag
					>
					<div class="tag-group tag-group--order">
						<span class="tag-group__label">标签</span>
						<div class="tag-group__content">
							<el-tag
								:style="{
									color: '#fff',
								}"
								v-for="item in (props.currentRow?.orderTag
									? props.currentRow?.orderTag
									: []
								).slice(0, 1)"
								:key="item.id"
								:color="item.color"
								>{{ item.name }}
							</el-tag>
							<span
								v-if="
									(props.currentRow?.orderTag ? props.currentRow?.orderTag : [])
										.length === 0
								"
								class="tag-placeholder"
							>
								---
							</span>
							<el-popover
								v-if="
									(props.currentRow?.orderTag ? props.currentRow?.orderTag : [])
										.length > 1
								"
								placement="top"
								width="200"
								trigger="hover"
							>
								<el-tag
									v-for="item in props.currentRow?.orderTag
										? props.currentRow?.orderTag
										: []"
									:key="item.id"
									:style="{
										margin: '4px 4px 0 0',
										color: '#fff',
									}"
									:color="item.color"
									>{{ item.name }}</el-tag
								>
								<template #reference>
									<el-tag
										:style="{
											marginLeft: '8px',
											background: '#f0f0f0',
											color: '#000',
											cursor: 'pointer',
										}"
										>...</el-tag
									>
								</template>
							</el-popover>
						</div>
						<span v-if="auth('selfOrder-setTag')">
							<EditTag
								@submit="handleEditTag"
								:value="((props.currentRow?.orderTag ? props.currentRow?.orderTag : []) ).map((item :any) => item.id)"
								:style="{
									marginLeft: '8px',
								}"
							/>
						</span>
					</div>
				</div>
			</el-col>
		</el-row>
		<!-- 查看详情 -->
		<ShowInfo ref="showInfoRef" />
	</div>
</template>

<style scoped lang="scss">
.component {
	display: flex;
	gap: 8px;
	width: 100%;
	height: 100%;
	font-size: 12px;
	.row {
		width: 100%;
	}
	.font-weight {
		font-weight: 900;
	}
	.font-color {
		color: #939da8;
	}

	.resend-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 18px;
		min-width: 18px;
		color: #ff0000;
		border: 1px solid #ff0000;
		margin-left: 4px;
		padding: 0 4px;
		border-radius: 2px;
		font-size: 12px;
		line-height: 1;
	}

	.platform-order-tags-row {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		gap: 4px;
		min-width: 0;
	}

	.order-tags-col {
		overflow: hidden;
		display: flex;
		align-items: center;
	}

	.merged-tags-wrap {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		min-width: 0;
	}

	.tag-group {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}

	.tag-group--platform {
		flex: 1;
	}

	.tag-group__label {
		color: #939da8;
		flex-shrink: 0;
	}

	.tag-group__content {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		min-width: 0;
		overflow: hidden;
	}

	.tag-group--order {
		flex-shrink: 0;
	}

	.merge-tag {
		flex-shrink: 0;
	}

	.tag-placeholder {
		color: #c0c4cc;
	}

	.platform-order-tag--platform {
		color: #fff;
		background-color: rgba(19, 156, 104, 0.8);
		border: none;
	}

	.platform-order-tag__text {
		display: inline-block;
		max-width: 85px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		vertical-align: bottom;
	}
}
</style>
