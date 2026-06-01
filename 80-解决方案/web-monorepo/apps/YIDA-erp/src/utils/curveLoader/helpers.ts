/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-05-06 16:48:35
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-06 16:52:56
 * @FilePath: \qianyi-ui\src\utils\curveLoader\helpers.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
/**
 * 数学曲线加载动画：纯函数引擎（与上游 main.js 行为对齐）
 */
import type { ICurveConfig, ICurveControl } from './types';

/** 全局可调参数（与上游 CONTROL_DEFS 一致） */
export const CONTROL_DEFS: ICurveControl[] = [
	{
		key: 'particleCount',
		labelEn: 'Particles',
		labelZh: '粒子数',
		min: 24,
		max: 140,
		step: 1,
	},
	{
		key: 'trailSpan',
		labelEn: 'Trail',
		labelZh: '尾迹长度',
		min: 0.12,
		max: 0.68,
		step: 0.01,
	},
	{
		key: 'durationMs',
		labelEn: 'Loop',
		labelZh: '循环时长',
		min: 2400,
		max: 12000,
		step: 100,
	},
	{
		key: 'pulseDurationMs',
		labelEn: 'Pulse',
		labelZh: '呼吸时长',
		min: 1800,
		max: 10000,
		step: 100,
	},
	{
		key: 'rotationDurationMs',
		labelEn: 'Rotate',
		labelZh: '旋转时长',
		min: 6000,
		max: 60000,
		step: 500,
	},
	{
		key: 'strokeWidth',
		labelEn: 'Stroke',
		labelZh: '轨迹粗细',
		min: 2.5,
		max: 7.5,
		step: 0.1,
	},
];

export function normalizeProgress(progress: number): number {
	return ((progress % 1) + 1) % 1;
}

export function getDetailScale(
	time: number,
	config: ICurveConfig,
	phaseOffset = 0
): number {
	const pulseProgress =
		((time + phaseOffset * config.pulseDurationMs) % config.pulseDurationMs) /
		config.pulseDurationMs;
	const pulseAngle = pulseProgress * Math.PI * 2;
	return 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48;
}

export function getRotation(
	time: number,
	config: ICurveConfig,
	phaseOffset = 0
): number {
	if (!config.rotate) {
		return 0;
	}
	return (
		-(
			((time + phaseOffset * config.rotationDurationMs) %
				config.rotationDurationMs) /
			config.rotationDurationMs
		) * 360
	);
}

export function buildPath(
	config: ICurveConfig,
	detailScale: number,
	steps = 480
): string {
	return Array.from({ length: steps + 1 }, (_, index) => {
		const point = config.point(index / steps, detailScale, config);
		return `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(
			2
		)}`;
	}).join(' ');
}

export function getParticle(
	config: ICurveConfig,
	index: number,
	progress: number,
	detailScale: number
): { x: number; y: number; radius: number; opacity: number } {
	const tailOffset = index / (config.particleCount - 1);
	const point = config.point(
		normalizeProgress(progress - tailOffset * config.trailSpan),
		detailScale,
		config
	);
	const fade = Math.pow(1 - tailOffset, 0.56);
	return {
		x: point.x,
		y: point.y,
		radius: 0.9 + fade * 2.7,
		opacity: 0.04 + fade * 0.96,
	};
}
