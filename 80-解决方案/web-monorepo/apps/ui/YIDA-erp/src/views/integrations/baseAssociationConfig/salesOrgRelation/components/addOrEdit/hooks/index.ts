import { ref, nextTick } from 'vue';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import type { FormInstance, FormRules } from 'element-plus';

/**
 * 表单管理 Hook 配置接口
 */
export interface UseFormDialogOptions {
	/** 初始表单数据 */
	initialFormData?: () => any;
	/** 表单验证规则 */
	formRules?: FormRules;
	/** 添加接口 */
	addApi?: (data: any) => Promise<any>;
	/** 编辑接口 */
	updateApi?: (data: any) => Promise<any>;
	/** 获取详情接口 */
	getDetailApi?: (params: any) => Promise<any>;
	/** 提交成功后的回调 */
	onSuccess?: () => void;
	/** 提交失败后的回调 */
	onError?: (error: any) => void;
	/** 提交前的数据处理 */
	beforeSubmit?: (data: any) => any;
	/** 编辑模式数据回填时的数据处理 */
	transformDetailData?: (data: any) => any;
}

/**
 * 表单管理 Hook
 * @param options 配置选项
 * @returns 表单管理相关的状态和方法
 */
export function useFormDialog(options: UseFormDialogOptions = {}) {
	const { t } = useI18n();
	const { success } = useMessage();

	// 弹窗显示状态
	const visible = ref(false);
	// 加载状态
	const loading = ref(false);
	// 表单引用
	const formRef = ref<FormInstance>();

	// 初始化表单数据
	const initFormData = (): any => {
		if (options.initialFormData) {
			return options.initialFormData();
		}
		return {};
	};

	// 表单数据
	const formData = ref<any>(initFormData());

	// 表单验证规则
	const rules = ref<FormRules>(options.formRules || {});

	/**
	 * 重置表单
	 */
	const resetForm = () => {
		nextTick(() => {
			formRef.value?.resetFields();
			formData.value = initFormData();
		});
	};

	/**
	 * 打开弹窗
	 * @param type 类型：'add' | 'edit'
	 * @param row 编辑模式下的行数据
	 */
	const handleOpen = async (type: 'add' | 'edit', row?: any) => {
		visible.value = true;

		if (type === 'edit' && row && options.getDetailApi) {
			// 编辑模式，获取详情数据
			try {
				loading.value = true;
				const res = await options.getDetailApi({ id: row.id });
				if (res.code === 0) {
					// 如果有数据转换函数，使用转换函数处理数据
					if (options.transformDetailData) {
						formData.value = options.transformDetailData(res.data);
					} else {
						formData.value = res.data || {};
					}
				}
			} catch (err: any) {
				//
			} finally {
				loading.value = false;
			}
		} else {
			// 添加模式，重置表单
			resetForm();
		}
	};

	/**
	 * 关闭弹窗
	 */
	const handleClose = () => {
		visible.value = false;
		resetForm();
	};

	/**
	 * 提交表单
	 * @param type 类型：'add' | 'edit'
	 * @param row 编辑模式下的行数据
	 */
	const onSubmit = async (type: 'add' | 'edit', row?: any) => {
		if (!formRef.value) return;

		try {
			// 表单验证
			const valid = await formRef.value.validate().catch(() => false);
			if (!valid) return;

			loading.value = true;

			// 准备提交数据
			let submitData = {
				...formData.value,
				id: type === 'add' ? '' : row?.id || '',
			};

			// 提交前的数据处理
			if (options.beforeSubmit) {
				submitData = options.beforeSubmit(submitData);
			}

			// 调用对应的 API
			const api = type === 'add' ? options.addApi : options.updateApi;
			if (!api) {
				throw new Error('API 接口未配置');
			}

			const res = await api(submitData);

			if (res.code === 0) {
				success(
					t(type === 'add' ? 'common.addSuccessText' : 'common.editSuccessText')
				);
				handleClose();
				// 执行成功回调
				if (options.onSuccess) {
					options.onSuccess();
				}
			} else {
				throw new Error(res.msg || '操作失败');
			}
		} catch (err: any) {
			// 执行失败回调
			if (options.onError) {
				options.onError(err);
			}
		} finally {
			loading.value = false;
		}
	};

	/**
	 * 获取弹窗标题
	 * @param type 类型：'add' | 'edit'
	 */
	const getTitle = (type: 'add' | 'edit') => {
		return t(type === 'add' ? 'common.addBtn' : 'common.editBtn');
	};

	return {
		// 状态
		visible,
		loading,
		formRef,
		formData,
		rules,

		// 方法
		handleOpen,
		handleClose,
		resetForm,
		onSubmit,
		getTitle,
	};
}
