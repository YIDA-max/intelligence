/**
 * 数学曲线加载器类型（源自 Paidax01/math-curve-loaders，纯 TS 层）
 */

/** 曲线上的点（SVG viewBox 0–100 坐标系） */
export interface ICurvePoint {
	x: number;
	y: number;
}

/** 滑杆元信息（与上游 CONTROL_DEFS / 各曲线 controls 一致） */
export interface ICurveControl {
	key: string;
	labelEn: string;
	labelZh: string;
	min: number;
	max: number;
	step: number;
}

/** 内置 21 条曲线名称（与上游 curves[].name 一致） */
export type CurveName =
	| 'Original Thinking'
	| 'Thinking Five'
	| 'Thinking Nine'
	| 'Rose Orbit'
	| 'Rose Curve'
	| 'Rose Two'
	| 'Rose Three'
	| 'Rose Four'
	| 'Lissajous Drift'
	| 'Lemniscate Bloom'
	| 'Hypotrochoid Loop'
	| 'Three-Petal Spiral'
	| 'Four-Petal Spiral'
	| 'Five-Petal Spiral'
	| 'Six-Petal Spiral'
	| 'Butterfly Phase'
	| 'Cardioid Glow'
	| 'Cardioid Heart'
	| 'Heart Wave'
	| 'Spiral Search'
	| 'Fourier Flow';

/**
 * 单条曲线完整运行时配置（含数学参数与 point/formula）
 * 各曲线专有标量字段通过对象字面量附加，由 curves 模块保证完整。
 */
export interface ICurveConfig {
	name: CurveName;
	tag: string;
	descriptionEn: string;
	descriptionZh: string;
	rotate: boolean;
	particleCount: number;
	trailSpan: number;
	durationMs: number;
	rotationDurationMs: number;
	pulseDurationMs: number;
	strokeWidth: number;
	controls?: ICurveControl[];
	formula: (config: ICurveConfig) => string;
	point: (
		progress: number,
		detailScale: number,
		config: ICurveConfig
	) => ICurvePoint;
	/** 各曲线专属数值/整型参数 */
	[key: string]:
		| string
		| number
		| boolean
		| ICurveControl[]
		| undefined
		| ((config: ICurveConfig) => string)
		| ((
				progress: number,
				detailScale: number,
				config: ICurveConfig
		  ) => ICurvePoint);
}
