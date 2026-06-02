/**
 * 根据 Apifox 导出的金蝶接口文档生成 API 文件
 * 模块名称与 views/integrations/baseAssociationConfig 下的 md 文件对应
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// 模块名称映射：Apifox 模块名 -> views 文件夹名
const MODULE_NAME_MAP = {
	采购组织关系表: 'purchaseOrgRelation',
	销售组织关系: 'salesOrgRelation',
	供应商关系: 'supplierRelationTable', // API path: supplierRelation
	订单推送关系: 'orderPromotion', // API path: orderPushRelation
	产品SKU关系: 'productSkuRelation',
	币种对照关系: 'currencyCorrespondenceRelation', // API path: currencyMapRelation
	费用项目关系: 'expenseItemRelation',
	库存组织关系: 'inventoryOrgRelation',
	内部客户与组织关系: 'internalCustomerOrgRelation',
	内部供应商与组织关系: 'internalSupplierOrgRelation',
	内部结算原币规则: 'internalSettlementOriginalCurrencyRule', // API path: internalSettlementCurrencyRule
};

// API path 到模块名的映射（部分模块 path 与 folder 不同）
const API_PATH_TO_MODULE = {
	supplierRelation: 'supplierRelationTable',
	orderPushRelation: 'orderPromotion',
	currencyMapRelation: 'currencyCorrespondenceRelation',
	internalSettlementCurrencyRule: 'internalSettlementOriginalCurrencyRule',
};

// 公共接口模块（无对应 views 文件夹）
const COMMON_MODULES = ['金蝶组织关系', '金蝶币种', '金蝶客户', '金蝶仓库'];

// 将 query 参数转换为 TS 类型
function paramsToTsType(params, excludeRecords = true) {
	if (!params || !params.query) return '';
	const queryParams = params.query.filter(
		(p) => !excludeRecords || (!p.name.startsWith('records[') && !p.name.startsWith('orders['))
	);
	const lines = queryParams.map((p) => {
		const desc = p.description ? `/** ${p.description} */\n\t` : '';
		const optional = p.required ? '' : '?';
		let type = 'any';
		if (p.schema) {
			if (p.schema.type === 'integer') type = 'number';
			else if (p.schema.type === 'string') type = 'string';
			else if (p.schema.type === 'boolean') type = 'boolean';
			else if (p.schema.type === 'array') {
				const items = p.schema.items;
				if (items?.type === 'integer') type = 'number[]';
				else if (items?.type === 'string') type = 'string[]';
				else type = 'any[]';
			}
		}
		return `${desc}${p.name}${optional}: ${type};`;
	});
	return lines.join('\n\t');
}

// 从 response example 解析出 records 的字段类型
function parseRecordFieldsFromExample(exampleData) {
	try {
		const parsed = typeof exampleData === 'string' ? JSON.parse(exampleData) : exampleData;
		const data = parsed?.data;
		const records = data?.records || (Array.isArray(data) ? data : null);
		const firstRecord = records?.[0] || (data && !records ? data : null);
		if (!firstRecord || typeof firstRecord !== 'object') return null;
		const fields = [];
		for (const [key, val] of Object.entries(firstRecord)) {
			if (['records', 'total', 'size', 'current', 'orders', 'optimizeCountSql', 'searchCount', 'optimizeJoinOfCountSql', 'maxLimit', 'countId'].includes(key)) continue;
			const tsType = typeof val === 'number' ? 'number' : typeof val === 'boolean' ? 'boolean' : 'string';
			fields.push({ name: key, type: tsType });
		}
		return fields;
	} catch {
		return null;
	}
}

// 生成通用分页类型
function getCommonPageParams() {
	return `\ttotal?: number;
\tsize?: number;
\tcurrent?: number;
\torders?: OrderItem[];
\toptimizeCountSql?: boolean;
\tsearchCount?: boolean;
\toptimizeJoinOfCountSql?: boolean;
\tmaxLimit?: number;
\tcountId?: string;
\t/** 勾选的id列表  导出时使用 */
\tids?: number[];`;
}

function toPascalCase(str) {
	return str.replace(/(?:^|[-_])(\w)/g, (_, c) => c.toUpperCase());
}

function main() {
	const apifoxPath = path.join(rootDir, '金蝶.apifox.json');
	const apifox = JSON.parse(fs.readFileSync(apifoxPath, 'utf-8'));

	// 查找金蝶文件夹
	const apiCollection = apifox.apiCollection?.[0];
	const items = apiCollection?.items || [];
	const kingdeeFolder = items.find((i) => i.name === '金蝶');
	if (!kingdeeFolder?.items) {
		console.error('未找到金蝶文件夹');
		process.exit(1);
	}

	const baseApiPath = '/kingdee';
	const baseConfigDir = path.join(rootDir, 'src', 'api', 'integrations', 'baseAssociationConfig');
	const commonDir = path.join(rootDir, 'src', 'api', 'integrations', 'common');

	// 收集各模块的 API
	const baseModules = {};
	const commonApis = [];

	for (const moduleItem of kingdeeFolder.items) {
		const moduleName = moduleItem.name;
		const apiItems = moduleItem.items || [];

		if (COMMON_MODULES.includes(moduleName)) {
			// 公共接口
			for (const item of apiItems) {
				if (item.api) {
					commonApis.push({
						name: item.name,
						...item.api,
						moduleName,
					});
				}
			}
			continue;
		}

		const folderName = MODULE_NAME_MAP[moduleName];
		if (!folderName) {
			console.warn(`未找到模块 "${moduleName}" 的映射，跳过`);
			continue;
		}

		// 检查 views 下是否存在对应文件夹
		const viewsModulePath = path.join(rootDir, 'src', 'views', 'integrations', 'baseAssociationConfig', folderName);
		if (!fs.existsSync(viewsModulePath)) {
			console.warn(`views 下不存在 ${folderName}，将放入 common`);
			for (const item of apiItems) {
				if (item.api) {
					commonApis.push({ name: item.name, ...item.api, moduleName });
				}
			}
			continue;
		}

		const apis = [];
		for (const item of apiItems) {
			if (item.api) {
				apis.push({
					name: item.name,
					...item.api,
				});
			}
		}

		// 从 path 提取 apiPrefix，如 /purchaseOrgRelation/page -> purchaseOrgRelation
		const firstPath = apis[0]?.path || '';
		const apiPrefix = firstPath.split('/')[1] || folderName;

		baseModules[folderName] = {
			moduleName,
			apiPrefix,
			apis,
		};
	}

	// 生成 baseAssociationConfig/index.ts
	const baseIndexLines = [
		'/*',
		' * @Description: 金蝶基础关系配置 API - 由 scripts/generate-kingdee-api.mjs 生成',
		' */',
		"import { httpService } from '/@/utils/request';",
		'',
		'// ==================== 通用类型 ====================',
		'',
		'export interface OrderItem {',
		'\tcolumn?: string;',
		'\tasc?: boolean;',
		'}',
		'',
	];

	// 为每个模块生成类型和接口
	for (const [folderName, mod] of Object.entries(baseModules)) {
		const { apiPrefix, apis } = mod;
		const pageApi = apis.find((a) => a.name === '分页查询');
		const detailApi = apis.find((a) => a.name === '详情');
		const addApi = apis.find((a) => a.name === '新增');
		const updateApi = apis.find((a) => a.name === '编辑');
		const exportApi = apis.find((a) => a.name === '导出');

		// 从 response example 解析 VO 结构
		let recordFields = null;
		if (pageApi?.responseExamples?.[0]?.data) {
			recordFields = parseRecordFieldsFromExample(pageApi.responseExamples[0].data);
		}

		const entityName = toPascalCase(folderName);
		const voName = `${entityName}VO`;
		const pageVoName = `Page${entityName}VO`;
		const queryParamsName = `Query${entityName}PageParams`;

		// 生成 VO 类型
		baseIndexLines.push(`// ==================== ${mod.moduleName} ====================`);
		baseIndexLines.push('');
		if (recordFields && recordFields.length > 0) {
			baseIndexLines.push(`export interface ${voName} {`);
			for (const f of recordFields) {
				baseIndexLines.push(`\t/** ${f.name} */`);
				baseIndexLines.push(`\t${f.name}?: ${f.type};`);
			}
			baseIndexLines.push('}');
		} else {
			baseIndexLines.push(`export interface ${voName} {`);
			baseIndexLines.push('\t[key: string]: any;');
			baseIndexLines.push('}');
		}
		baseIndexLines.push('');

		baseIndexLines.push(`export interface ${pageVoName} {`);
		baseIndexLines.push(`\trecords?: ${voName}[];`);
		baseIndexLines.push(getCommonPageParams());
		baseIndexLines.push('}');
		baseIndexLines.push('');

		// Query 参数类型
		const queryParams = pageApi ? paramsToTsType(pageApi.parameters) : '';
		baseIndexLines.push(`export interface ${queryParamsName} {`);
		if (queryParams) baseIndexLines.push('\t' + queryParams.replace(/\n\t/g, '\n\t'));
		else baseIndexLines.push(getCommonPageParams());
		baseIndexLines.push('}');
		baseIndexLines.push('');

		// API 函数
		if (pageApi) {
			baseIndexLines.push(`/** 分页查询${mod.moduleName} */`);
			baseIndexLines.push(`export function get${entityName}Page(params: ${queryParamsName}) {`);
			baseIndexLines.push(`\treturn httpService.get<{ code: number; data: ${pageVoName}; msg: string }>('${baseApiPath}${pageApi.path}', { params });`);
			baseIndexLines.push('}');
			baseIndexLines.push('');
		}
		if (addApi) {
			baseIndexLines.push(`/** 新增${mod.moduleName} */`);
			baseIndexLines.push(`export function add${entityName}(data: any) {`);
			baseIndexLines.push(`\treturn httpService.post<{ code: number; data: number; msg: string }>('${baseApiPath}${addApi.path}', data);`);
			baseIndexLines.push('}');
			baseIndexLines.push('');
		}
		if (updateApi) {
			baseIndexLines.push(`/** 编辑${mod.moduleName} */`);
			baseIndexLines.push(`export function update${entityName}(data: any) {`);
			baseIndexLines.push(`\treturn httpService.post<{ code: number; data: boolean; msg: string }>('${baseApiPath}${updateApi.path}', data);`);
			baseIndexLines.push('}');
			baseIndexLines.push('');
		}
		if (detailApi) {
			baseIndexLines.push(`/** 获取${mod.moduleName}详情 */`);
			baseIndexLines.push(`export function get${entityName}Detail(params: { id: number }) {`);
			baseIndexLines.push(`\treturn httpService.get<{ code: number; data: any; msg: string }>('${baseApiPath}${detailApi.path}', { params });`);
			baseIndexLines.push('}');
			baseIndexLines.push('');
		}
		if (exportApi) {
			baseIndexLines.push(`/** 导出${mod.moduleName} */`);
			baseIndexLines.push(`export function getExport${entityName}(params?: any) {`);
			baseIndexLines.push(`\treturn httpService.post('${baseApiPath}${exportApi.path}', params ?? {}, {`);
			baseIndexLines.push(`\t\tresponseType: 'blob',`);
			baseIndexLines.push(`\t});`);
			baseIndexLines.push('}');
			baseIndexLines.push('');
		}
	}

	fs.writeFileSync(path.join(baseConfigDir, 'index.ts'), baseIndexLines.join('\n'), 'utf-8');
	console.log('已生成 baseAssociationConfig/index.ts');

	// 生成 common/index.ts
	const commonLines = [
		'/*',
		' * @Description: 金蝶公共接口 API - 由 scripts/generate-kingdee-api.mjs 生成',
		' */',
		"import { httpService } from '/@/utils/request';",
		'',
		'// ==================== 类型定义 ====================',
		'',
		'export interface KingdeeOrgVO {',
		'\t/** ID */',
		'\tid?: number;',
		'\t/** 金蝶采购组织编码 */',
		'\tkingdeeOrgCode?: string;',
		'\t/** 金蝶采购组织名称 */',
		'\tkingdeeOrgName?: string;',
		'}',
		'',
		'export interface KingdeeCurrencyVO {',
		'\t/** ID */',
		'\tid?: number;',
		'\t/** 币种编码 */',
		'\tcurrencyCode?: string;',
		'\t/** 币种名称 */',
		'\tcurrencyName?: string;',
		'}',
		'',
		'export interface KingdeeCustomerVO {',
		'\t/** ID */',
		'\tid?: number;',
		'\t/** 金蝶客户编码 */',
		'\tkingdeeCustomerCode?: string;',
		'\t/** 金蝶客户名称 */',
		'\tkingdeeCustomerName?: string;',
		'}',
		'',
		'export interface KingdeeWarehouseVO {',
		'\t/** ID */',
		'\tid?: number;',
		'\t/** 金蝶仓库编码 */',
		'\tkingdeeWareCode?: string;',
		'\t/** 金蝶仓库名称 */',
		'\tkingdeeWareName?: string;',
		'}',
		'',
		'// ==================== 接口定义 ====================',
		'',
		'/** 查询所有 - 金蝶组织关系列表 */',
		'export function getKingdeeOrgList() {',
		"\treturn httpService.get<{ code: number; msg: string; data: KingdeeOrgVO[] }>('/kingdee/kingdeeOrg/list');",
		'}',
		'',
		'/** 查询所有 - 金蝶币种列表 */',
		'export function getKingdeeCurrencyList() {',
		"\treturn httpService.get<{ code: number; msg: string; data: KingdeeCurrencyVO[] }>('/kingdee/kingdeeCurrency/list');",
		'}',
		'',
		'/** 查询所有 - 金蝶客户列表 */',
		'export function getKingdeeCustomerList() {',
		"\treturn httpService.get<{ code: number; msg: string; data: KingdeeCustomerVO[] }>('/kingdee/kingdeeCustomer/list');",
		'}',
		'',
		'/** 查询所有 - 金蝶仓库列表 */',
		'export function getKingdeeWarehouseList() {',
		"\treturn httpService.get<{ code: number; msg: string; data: KingdeeWarehouseVO[] }>('/kingdee/kingdeeWarehouse/list');",
		'}',
		'',
	];

	fs.writeFileSync(path.join(commonDir, 'index.ts'), commonLines.join('\n'), 'utf-8');
	console.log('已生成 common/index.ts');
}

main();
