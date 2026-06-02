/**
 * 数学曲线加载器（纯 TS）：曲线数据 + 动画引擎
 * 上游参考：https://github.com/Paidax01/math-curve-loaders
 */
export type {
	CurveName,
	ICurveConfig,
	ICurveControl,
	ICurvePoint,
} from './types';
export {
	buildPath,
	CONTROL_DEFS,
	getDetailScale,
	getParticle,
	getRotation,
	normalizeProgress,
} from './helpers';
export {
	CURVE_NAMES,
	CURVES,
	getCurveByName,
	mergeCurveConfig,
} from './curves';
