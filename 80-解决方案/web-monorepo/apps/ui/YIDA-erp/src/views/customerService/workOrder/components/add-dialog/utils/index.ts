import { Ref } from 'vue';

export const addInit = async (
	baseInfoRef: Ref<any>,
	orderInfoRef: Ref<any>,
	descInfoRef: Ref<any>,
	fileRemarkRef: Ref<any>,
	modulesRef: Ref<any>
) => {
	// 调用子组件的 setData 初始化
	if (baseInfoRef.value) {
		const baseData = mapBaseInfo({});
		baseInfoRef.value.setData(baseData);
	}
	if (orderInfoRef.value) {
		orderInfoRef.value.setData(mapOrderInfo({}));
	}
	if (descInfoRef.value) {
		descInfoRef.value.setData(mapDescriptionInfo({}));
	}
	if (fileRemarkRef.value) {
		fileRemarkRef.value.setData(mapFileRemarkInfo({}));
	}
	if (modulesRef.value) {
		modulesRef.value.setData(mapDynamicModules({}));
	}
};

export const editInit = async (
	baseInfoRef: Ref<any>,
	orderInfoRef: Ref<any>,
	descInfoRef: Ref<any>,
	fileRemarkRef: Ref<any>,
	modulesRef: Ref<any>,
	data: any
) => {
	// 初始化数据

	// 调用子组件的 setData 初始化
	if (baseInfoRef.value) {
		const baseData = mapBaseInfo(data);
		baseInfoRef.value.setData(baseData);
	}
	if (orderInfoRef.value) {
		orderInfoRef.value.setData(mapOrderInfo(data));
	}
	if (descInfoRef.value) {
		descInfoRef.value.setData(mapDescriptionInfo(data));
	}
	if (fileRemarkRef.value) {
		fileRemarkRef.value.setData(mapFileRemarkInfo(data));
	}
	if (modulesRef.value) {
		// data contains the dynamic module data at root level
		modulesRef.value.setData(mapDynamicModules(data || {}));
	}
};

export const copyInit = async (
	baseInfoRef: Ref<any>,
	orderInfoRef: Ref<any>,
	descInfoRef: Ref<any>,
	fileRemarkRef: Ref<any>,
	modulesRef: Ref<any>,
	data: any
) => {
	// 复制逻辑通常与编辑类似，但可能会重置某些字段（如 ID、创建时间）

	if (baseInfoRef.value) {
		const baseData = mapBaseInfo(data);
		baseInfoRef.value.setData(baseData);
	}
	if (orderInfoRef.value) {
		orderInfoRef.value.setData(mapOrderInfo(data));
	}
	if (descInfoRef.value) {
		descInfoRef.value.setData(mapDescriptionInfo(data));
	}
	if (fileRemarkRef.value) {
		fileRemarkRef.value.setData(mapFileRemarkInfo(data));
	}
	if (modulesRef.value) {
		modulesRef.value.setData(mapDynamicModules(data || {}));
	}
};

/**
 * 映射基本信息
 */
export const mapBaseInfo = (data: any) => {
	return {
		orderType: data.orderType || 2,
		createTime: data.createTime || '',
		createName: data.createName || '',
	};
};

/**
 * 映射订单信息
 */
export const mapOrderInfo = (data: any) => {
	return {
		relatedOrderNo: data.relatedOrderNo || '',
		country: data.country || '',
		platformChannelCode: data.platformChannelCode || '',
		storeId: data.storeId || '',
		purchaseDate: data.purchaseDate || '',
		buyerName: data.buyerName || '',
		buyerPhone: data.buyerPhone || '',
		buyerEmail: data.buyerEmail || '',
		skuList: data.skuList ? JSON.parse(JSON.stringify(data.skuList)) : [],
	};
};

/**
 * 映射原因/描述信息
 */
export const mapDescriptionInfo = (data: any) => {
	const descList =
		data.descriptions && data.descriptions.length > 0
			? data.descriptions.map((item: any) => ({
					chineseDescription: item.chineseDescription,
					foreignDescription: item.foreignDescription,
			  }))
			: [{ chineseDescription: '', foreignDescription: '' }];

	let tagLines: any[] = [{ firstTag: '', seTag: '', thTag: '', forTag: '' }];

	const parseId = (id: string | undefined) => {
		if (!id) return '';
		const num = Number(id);
		// If it's a valid number and converting back to string matches original (no leading zeros lost), use number
		if (!isNaN(num) && String(num) === id) {
			return num;
		}
		return id;
	};

	// Prioritize tagPath as per API response
	if (data.tagPath && data.tagPath.length > 0) {
		tagLines = data.tagPath.map((tagStr: string) => {
			const parts = tagStr.split(',');
			return {
				firstTag: parseId(parts[0]),
				seTag: parseId(parts[1]),
				thTag: parseId(parts[2]),
				forTag: parseId(parts[3]),
			};
		});
	}

	return {
		descList,
		tagLines,
		files: data.files || [],
		remark: data.remark || '',
	};
};

/**
 * 映射附件/备注信息
 */
export const mapFileRemarkInfo = (data: any) => {
	let remarkList = [{ remark: '' }];
	if (data.remark) {
		remarkList = data.remark.split(';').map((r: string) => ({ remark: r }));
	}

	const fileImg: any[] = [];
	const fileVedio: any[] = [];

	if (Array.isArray(data.baseAttachments)) {
		data.baseAttachments.forEach((item: any) => {
			// const fileName = item.fileName || item.ossFileName || '';
			// const ext = fileName.split('.').pop()?.toLowerCase();
			const ext = item.fileType;
			const fileItem = {
				...item,
				name: item.fileName,
				url: item.ossFileName,
			};

			if (['jpg', 'png', 'jpeg', 'pdf'].includes(ext)) {
				fileImg.push(fileItem);
			} else if (['mp4', 'avi', 'mov'].includes(ext)) {
				fileVedio.push(fileItem);
			}
		});
	}

	return {
		fileImg,
		fileVedio,
		remarkList,
	};
};

/**
 * 映射退款信息
 */
export const mapRefundInfo = (data: any) => {
	if (!data) return {};
	return {
		type: data.refundType,
		amount: data.refundAmount,
		currency: data.currency,
		date: data.refundDate,
		refundNo: data.refundNo || '',
	};
};

/**
 * 映射退货信息
 */
export const mapReturnInfo = (data: any) => {
	if (!data) return {};
	return {
		date: data.returnDate,
		trackingNo: data.returnTrackingNo,
	};
};

/**
 * 映射补发新机信息
 */
export const mapNewMachineInfo = (data: any[]) => {
	if (Array.isArray(data) && data.length > 0) {
		return data.map((item) => ({
			date: item.reshipNewDate,
			orderNo: item.reshipNewTrackingNo,
		}));
	}
	return [{ date: '', orderNo: '' }];
};

/**
 * 映射补发配件信息
 */
export const mapAccessoryInfo = (data: any[]) => {
	if (Array.isArray(data) && data.length > 0) {
		return data.map((item) => ({
			time: item.reshipPartDate,
			orderNo: item.reshipPartNo,
			reason: item.reshipPartReason,
			detail: item.partProductName,
			number: item.partQuantity,
			file: item.partAttachments?.map((file: any) => ({
				name: file.fileName,
				url: file.ossFileName,
				...file,
			})), // TODO: Handle attachments
			trackingNo: item.partDepartTrackingNo,
			supplier: item.supplier,
			remark: item.reshipRemark,
		}));
	}
	return [
		{
			time: '',
			orderNo: '',
			reason: '',
			detail: '',
			number: '',
			file: [],
			trackingNo: '',
			supplier: '',
			remark: '',
		},
	];
};

/**
 * 映射动态模块选择状态
 */
export const mapDynamicModules = (data: any) => {
	const modulesToCheck: string[] = [];
	const newData: any = {};

	if (data.refundAction) {
		modulesToCheck.push('refundAction');
		newData.refundAction = mapRefundInfo(data.refundAction);
	}
	if (data.returnAction) {
		modulesToCheck.push('returnAction');
		newData.returnAction = mapReturnInfo(data.returnAction);
	}
	if (data.reshipNewActions && data.reshipNewActions.length > 0) {
		modulesToCheck.push('reshipNewActions');
		newData.reshipNewActions = mapNewMachineInfo(data.reshipNewActions);
	}
	if (data.reshipPartActions && data.reshipPartActions.length > 0) {
		modulesToCheck.push('reshipPartActions');
		newData.reshipPartActions = mapAccessoryInfo(data.reshipPartActions);
	}
	if (data.extendWarranty) {
		modulesToCheck.push('extendWarranty');
		newData.extendWarranty = data.extendWarranty;
	}
	if (data.giftAppMember) {
		modulesToCheck.push('giftAppMember');
		newData.giftAppMember = data.giftAppMember;
	}

	let selectedModules = modulesToCheck;
	if (data.selectedModules) {
		const merged = new Set([...data.selectedModules, ...modulesToCheck]);
		selectedModules = Array.from(merged);
	}

	return {
		selectedModules,
		modulesData: newData,
	};
};
