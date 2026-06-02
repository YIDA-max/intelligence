<template>
	<el-dialog
		:title="`发送工厂装柜邮件`"
		v-model="visible"
		:close-on-click-modal="false"
		draggable
		width="80%"
	>
		<div v-if="emailData.length > 0">
			<el-tabs v-model="activeFactoryIndex" @tab-click="handleFactoryTabClick">
				<el-tab-pane
					v-for="(factory, index) in emailData"
					:key="index"
					:label="`工厂${index + 1}`"
					:name="String(index)"
				>
					<el-form
						:ref="(el: any) => setFormRef(el, index)"
						:model="factory"
						:rules="dataRules"
						label-width="120px"
						v-loading="loading"
					>
						<!-- 基本信息 -->
						<el-row class="mb18">
							<el-col :span="8">
								<el-form-item label="工厂名称">
									<el-text>{{ factory.factoryName }}</el-text>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row class="mb18">
							<el-col :span="8">
								<el-form-item label="发送人邮箱">
									<el-text>{{ factory.email }}</el-text>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row class="mb18">
							<el-col :span="16">
								<el-form-item label="收件人邮箱" prop="factoryEmail">
									<div class="email-input-wrap">
										<el-input
											v-model="factory.factoryEmail"
											placeholder="多邮箱“;”隔开"
										/>
										<el-button @click="handleUpdateFactoryEmail(factory)"
											>更新配置邮箱</el-button
										>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row class="mb18">
							<el-col :span="8">
								<el-form-item label="抄送人邮箱" prop="ccList">
									<el-input
										v-model="factory.ccList"
										placeholder="多邮箱“;”隔开"
									/>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row class="mb18">
							<el-col :span="8">
								<el-form-item label="主题" prop="subject">
									<el-input
										v-model="factory.subject"
										placeholder="请输入主题"
									/>
								</el-form-item>
							</el-col>
						</el-row>

						<!-- 富文本编辑器 - 包含所有邮件内容 -->
						<el-form-item label="邮件正文" prop="emailContent">
							<editor
								v-model:get-html="factory.emailContent"
								placeholder="请输入邮件正文"
							/>
						</el-form-item>

						<!-- 附件 -->
						<el-form-item label="附件">
							<div class="attachment-list">
								<upload-file
									:limit="10"
									:fileSize="20"
									@change="() => {}"
									:fileType="[
										'zip',
										'pdf',
										'xlsx',
										'xls',
										'doc',
										'docx',
										'jpg',
										'png',
									]"
									v-model="factory.fileMessages"
									:isShowTip="true"
									:uploadFileUrl="'/admin/sys-file/upload'"
									type="simple"
									:data="{}"
									:dir="''"
									:autoUpload="true"
									@error="() => {}"
									@remove="() => {}"
									@preview="() => {}"
									@exceed="() => {}"
									@success="() => {}"
								/>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>
		</div>

		<div v-else class="no-data">
			<el-empty description="暂无邮件数据" />
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading"
					>确认发送</el-button
				>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="PostEmailDialog">
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import {
	getEmailDetail,
	sendMail,
	updateFactoryEmail,
} from '/@/api/materialFlow/orderContainer/index';
import { getFactoryList } from '/@/api/mcp/collectionPlan';
const emit = defineEmits(['refresh']);

const formRefs = ref<any[]>([]);
const visible = ref(false);
const loading = ref(false);
const emailData = ref<any[]>([]);
const activeFactoryIndex = ref('0');

const props = defineProps({
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});

// const UploadFile = defineAsyncComponent(() => import('./uploadFile.vue'));

// 生成表格HTML
const generateCompatibleTable = (headers: string[], rows: any[][]): string => {
	let tableHtml = '';

	// 单表自包含：使用 border 属性 + collapse，所有单元格各自带边框，避免依赖外层包裹
	tableHtml = '<table>';

	// 表头（文字居中）
	tableHtml += '<thead><tr>';
	headers.forEach((header) => {
		tableHtml += `<th align="center" bgcolor="#f5f5f5">${header}</th>`;
	});
	tableHtml += '</tr></thead>';

	// 数据（文字居中）
	tableHtml += '<tbody>';
	rows.forEach((row) => {
		tableHtml += '<tr>';
		row.forEach((cell) => {
			tableHtml += `<td align="center">${cell || ''}</td>`;
		});
		tableHtml += '</tr>';
	});
	tableHtml += '</tbody></table>';

	return tableHtml;
};

// 多邮箱解析与校验
const emailRegex = /^[\w.!#$%&'*+/=?^_`{|}~-]+@[\w-]+(\.[\w-]+)+$/i;

const parseEmails = (str: string): string[] => {
	if (!str) return [];
	return str
		.split(/[;；]/)
		.map((s) => s.trim())
		.filter((s) => s.length > 0);
};
const validateMultiEmail = (_: any, value: string, callback: any) => {
	const list = parseEmails(value);
	if (list.length === 0) return callback(new Error('邮箱不能为空'));
	const invalid = list.find((e) => !emailRegex.test(e));
	if (invalid) return callback(new Error(`邮箱格式不正确: ${invalid}`));
	callback();
};
const optionalMultiEmail = (_: any, value: string, callback: any) => {
	if (!value) return callback();
	const list = parseEmails(value);
	const invalid = list.find((e) => !emailRegex.test(e));
	if (invalid) return callback(new Error(`邮箱格式不正确: ${invalid}`));
	callback();
};

const dataRules = ref({
	factoryEmail: [{ validator: validateMultiEmail, trigger: 'blur' }],
	ccList: [{ validator: optionalMultiEmail, trigger: 'blur' }],
	subject: [{ required: true, message: '主题不能为空', trigger: 'blur' }],
	emailContent: [
		{ required: true, message: '邮件正文不能为空', trigger: 'blur' },
	],
});

// 设置表单引用
const setFormRef = (el: any, index: number) => {
	if (el) {
		formRefs.value[index] = el;
	}
};

// 生成富文本邮件内容
const generateEmailContent = (factory: any, shippingMethod: string) => {
	let content = '';

	// 订柜号 + 预计装柜时间（合并为一行）
	content += `<p><strong>订柜号：</strong>${
		factory.orderContainerNo || ''
	}&nbsp;&nbsp;&nbsp;&nbsp;<strong>预计装柜时间：</strong>${
		factory.estimatedLoadingTime || ''
	}</p>`;

	// 发货方式标题
	content += `<p><strong>发货方式：</strong>`;
	switch (shippingMethod) {
		case 'cropshippingOne':
			content += '一件代发(一箱一个)</p>';
			break;
		case 'cropshippingMany':
			content += '一件代发(一箱多个)</p>';
			break;
		case 'platformOne':
			content += '入平台仓(一箱一个)</p>';
			break;
		case 'platformMany':
			content += '入平台仓(一箱多个)</p>';
			break;
		default:
			content += '</p>';
	}

	// 发货清单表格 - 使用智能适配的表格结构
	const tableData = getTableData(factory, shippingMethod);
	if (tableData.length > 0) {
		// 根据发货方式生成表头和数据
		let headers: string[] = [];
		let rows: any[][] = [];

		switch (shippingMethod) {
			case 'cropshippingOne':
				headers = ['国家', '目的仓', '发货单号', 'SKU', 'PCS', '箱数'];
				rows = tableData.map((item: any) => [
					item.country || '',
					item.destinationWarehouse || '',
					item.deliveryOrderNo || '',
					item.skuName || '',
					item.pcs || '',
					item.carton || '',
				]);
				break;
			case 'cropshippingMany':
				headers = [
					'目的国',
					'目的仓',
					'发货单号',
					'SKU',
					'PCS',
					'箱数',
					'物流分货标',
				];
				rows = tableData.map((item: any) => [
					item.country || '',
					item.destinationWarehouse || '',
					item.deliveryOrderNo || '',
					item.skuName || '',
					item.pcs || '',
					item.carton || '',
					item.logisticShippingFlag || '',
				]);
				break;
			case 'platformOne':
				headers = [
					'国家',
					'目的仓',
					'发货单号',
					'SKU',
					'ShipmentID',
					'FNSKU/EAN/GTIN',
					'PCS',
					'箱数',
				];
				rows = tableData.map((item: any) => [
					item.country || '',
					item.destinationWarehouse || '',
					item.deliveryOrderNo || '',
					item.skuName || '',
					item.shipmentId || '',
					item.barcodeInfo || '',
					item.pcs || '',
					item.carton || '',
				]);
				break;
			case 'platformMany':
				headers = [
					'国家',
					'目的仓',
					'发货单号',
					'SKU',
					'ShipmentID',
					'FNSKU/EAN/GTIN',
					'PCS',
					'箱数',
					'物流分货标',
				];
				rows = tableData.map((item: any) => [
					item.country || '',
					item.destinationWarehouse || '',
					item.deliveryOrderNo || '',
					item.skuName || '',
					item.shipmentId || '',
					item.barcodeInfo || '',
					item.pcs || '',
					item.carton || '',
					item.logisticShippingFlag || '',
				]);
				break;
		}

		// 生成兼容的表格HTML
		content += generateCompatibleTable(headers, rows);
	}

	// 提示文字
	const promptText = getPromptText(factory, shippingMethod);
	if (promptText) {
		content += `<p style="background-color: #f5f7fa; padding: 12px; border-radius: 4px; color: #606266;">${promptText}</p>`;
	}

	return content;
};

// 获取表格正文数据
const getTableData = (factory: any, shippingMethod: string) => {
	switch (shippingMethod) {
		case 'cropshippingOne':
			return factory.cropshippingOneCartons || [];
		case 'cropshippingMany':
			return factory.cropshippingManyCartons || [];
		case 'platformOne':
			return factory.enterPlatformWarehouseOneCartons || [];
		case 'platformMany':
			return factory.enterPlatformWarehouseManyCartons || [];
		default:
			return [];
	}
};

// 获取提示文字
const getPromptText = (factory: any, shippingMethod: string) => {
	switch (shippingMethod) {
		case 'cropshippingOne':
			return factory.promptOneCarton || '';
		case 'cropshippingMany':
			return factory.promptManyCarton || '';
		case 'platformOne':
			return factory.promptPlatformOneCarton || '';
		case 'platformMany':
			return factory.promptPlatformManyCarton || '';
		default:
			return '';
	}
};

// 每种发货方式
const buildSection = (factory: any, shippingMethod: string) => {
	const dataList = getTableData(factory, shippingMethod);
	if (!Array.isArray(dataList) || dataList.length === 0) return '';
	return generateEmailContent(factory, shippingMethod);
};

// 所有发货方式(拼接好)
const generateEmailContentAll = (factory: any) => {
	let html = '';
	// 订柜号 + 预计装柜时间行
	html += `<p><strong>订柜号：</strong>${
		factory.orderContainerNo || ''
	}&nbsp;&nbsp;&nbsp;&nbsp;<strong>预计装柜时间：</strong>${
		factory.estimatedLoadingTime || ''
	}</p>`;

	// 依次拼接四类（若有数据才拼），为每个表格分配唯一索引
	const methods = [
		'cropshippingOne',
		'cropshippingMany',
		'platformOne',
		'platformMany',
	];

	methods.forEach((m) => {
		const section = buildSection(factory, m);
		if (section) {
			// 子段落内部会再生成一行"发货方式：xxx"和表格/提示
			// 为避免头部重复，这里去掉第一行订柜号：我们在 buildSection 前先暂时清掉那一行
			const trimmed = section.replace(/^<p><strong>订柜号[\s\S]*?<\/p>/, '');
			html += trimmed;
		}
	});
	return html;
};

const openDialog = async (orderContainerNo?: string) => {
	visible.value = true;
	loading.value = true;
	emailData.value = [];

	try {
		if (orderContainerNo) {
			const res = await getEmailDetail({ orderContainerNo });
			if (res.code === 0) {
				emailData.value =
					res.data.map((item: any) => {
						return {
							...item,
							fileMessages: item.fileMessages.map((val: any) => {
								// 回显展示原文件名，塞入name
								return {
									...val,
									fileUrl: val.fileName,
									name: val.original ? val.original : val.fileName,
									code: val.original ? val.original : val.fileName,
								};
							}),
						};
					}) || [];
				if (emailData.value.length > 0) {
					// 为每个工厂初始化数据
					emailData.value.forEach((factory) => {
						// 生成初始邮件内容
						if (factory) {
							factory.emailContent = generateEmailContentAll(factory);
						}
					});

					activeFactoryIndex.value = '0';
				}
				const factoryIds = emailData.value.map((factory) => factory.factoryId);
				// 为每一个工厂设置默认收件人邮箱（如果为空）
				const getFactoryListRes = await getFactoryList({ factoryIds });
				if (getFactoryListRes.code === 0) {
					// 获取工厂列表
					const factoryList = getFactoryListRes.data || [];
					// 设置默认收件人邮箱
					emailData.value.forEach((factory) => {
						if (
							factory.factoryEmail == null ||
							factory.factoryEmail.trim() === ''
						) {
							// 查找匹配的工厂
							const matchedFactory = factoryList.find(
								(f: any) => f.id === factory.factoryId
							);
							// 设置默认邮箱
							if (matchedFactory && matchedFactory.email) {
								factory.factoryEmail = matchedFactory.email;
							}
						}
					});
				}
			}
		}
	} catch (error: any) {
		useMessage().error(error.msg || '获取邮件数据失败');
	} finally {
		loading.value = false;
	}
};

const handleUpdateFactoryEmail = (factory: any) => {
	if (!factory.factoryEmail) {
		useMessage().warning('请输入邮箱地址');
		return;
	}
	const invalidEmail = parseEmails(factory.factoryEmail).find(
		(e) => !emailRegex.test(e)
	);
	if (invalidEmail) {
		useMessage().error(`邮箱格式不正确: ${invalidEmail}`);
		return;
	}
	ElMessageBox.confirm(
		`确认将工厂 "${factory.factoryName}" 的收件人邮箱更新为：${factory.factoryEmail} ？`,
		'更新配置邮箱',
		{
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		}
	)
		.then(async () => {
			const res = await updateFactoryEmail([
				{
					id: factory.factoryId,
					email: factory.factoryEmail,
				},
			]);
			if (res.code === 0) {
				useMessage().success('邮箱配置更新成功');
			}
		})
		.catch(() => {});
};
const handleFactoryTabClick = (tab: any) => {
	// tab.name 就是当前选中的工厂索引
	activeFactoryIndex.value = tab.name;
};

const onSubmit = async () => {
	// 验证所有表单
	const validationPromises = formRefs.value.map((formRef) => {
		if (formRef) {
			return formRef.validate().catch(() => false);
		}
		return Promise.resolve(true);
	});

	const validationResults = await Promise.all(validationPromises);
	const allValid = validationResults.every((result) => result === true);

	if (!allValid) {
		useMessage().error('请检查表单填写是否完整');
		return false;
	}

	try {
		loading.value = true;
		const emailList = emailData.value.map((factory) => {
			const html = factory.emailContent;
			// 1. 修改 table，确保边框合并
			let modifiedHtml = html.replace(
				/<table(\s+[^>]*)?>/gi,
				'<table$1 style="border-collapse: collapse; border: 1px solid black;" border="1" cellspacing="0" cellpadding="0">'
			);
			// 2. 修改 td/th，确保每个单元格都有边框
			modifiedHtml = modifiedHtml.replace(
				/<(td|th)(\s+[^>]*)?>/gi,
				'<$1$2 style="border: 1px solid black;text-align: center">'
			);
			factory.emailContent = modifiedHtml;
			if (factory.fileMessages) {
				factory.fileMessages = factory.fileMessages.map((file: any) => {
					if (typeof file === 'string') {
						// 如果fileMessages是字符串数组，直接转换为对象
						return file;
					} else {
						// 如果fileMessages已经是对象数组，也只需要fileUrl或fileName
						return file.fileUrl || file.fileName;
					}
				});
			}
			return {
				mailAddress: parseEmails(factory.factoryEmail),
				title: factory.subject,
				ccList: parseEmails(factory.ccList),
				html: factory.emailContent,
				attachmentList: factory.fileMessages,
				bizCode: 'WSRSA',
				mailTypeEnum: 'mixed',
				provider: 'fei_shu',
			};
		});
		const params = {
			id: props.currentRow.id,
			factoryMessageList: emailList,
		};
		const res = await sendMail(params);
		if (res.code === 0) {
			useMessage().success(res.msg || '发送成功');
		}
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg || '邮件发送失败');
	} finally {
		loading.value = false;
	}
};

defineExpose({
	openDialog,
});
</script>

<style lang="scss" scoped>
.email-input-wrap {
	display: flex;
	gap: 8px;
	align-items: center;
}

.attachment-list {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
}

.attachment-link {
	margin-right: 12px;
}

.no-data {
	padding: 40px 0;
}
</style>
