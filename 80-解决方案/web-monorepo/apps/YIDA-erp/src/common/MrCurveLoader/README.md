# MrCurveLoader

基于 [Paidax01/math-curve-loaders](https://github.com/Paidax01/math-curve-loaders) 的数学曲线粒子加载动画，拆分为：

- **`/@/utils/curveLoader`**：21 条曲线定义 + `buildPath` / `getParticle` 等纯函数引擎
- **本组件**：SVG 渲染 + `requestAnimationFrame` 驱动

## 安装引用

```ts
import MrCurveLoader from '/@/common/MrCurveLoader';
// 或
import { MrCurveLoader } from '/@/common/MrCurveLoader';
```

## Props

| 属性          | 类型                    | 默认值                | 说明                                             |
| ------------- | ----------------------- | --------------------- | ------------------------------------------------ |
| `name`        | `CurveName`             | `'Original Thinking'` | 内置曲线名称                                     |
| `config`      | `Partial<ICurveConfig>` | —                     | 覆盖默认参数（如 `particleCount`、`durationMs`） |
| `size`        | `number \| string`      | `120`                 | 宽高（数字视为 px）                              |
| `color`       | `string`                | `'currentColor'`      | 轨迹与粒子颜色                                   |
| `running`     | `boolean`               | `true`                | 是否播放                                         |
| `steps`       | `number`                | `480`                 | 背景 path 采样步数                               |
| `showPath`    | `boolean`               | `true`                | 是否绘制底层轨迹                                 |
| `pathOpacity` | `number`                | `0.1`                 | 底层 path 透明度                                 |

## 方法（`ref` 调用）

| 方法        | 说明             |
| ----------- | ---------------- |
| `start()`   | 开始动画         |
| `stop()`    | 停止动画         |
| `restart()` | 重置时间轴并播放 |

```vue
<script setup lang="ts">
import { ref } from 'vue';
import MrCurveLoader from '/@/common/MrCurveLoader';

const loaderRef = ref<InstanceType<typeof MrCurveLoader> | null>(null);

const pause = () => loaderRef.value?.stop();
const resume = () => loaderRef.value?.start();
</script>

<template>
	<MrCurveLoader ref="loaderRef" name="Fourier Flow" />
</template>
```

## 二次封装示例

```vue
<!-- MyPageLoader.vue -->
<script setup lang="ts">
import MrCurveLoader from '/@/common/MrCurveLoader';
</script>

<template>
	<div class="page-loader">
		<MrCurveLoader name="Rose Orbit" :size="200" color="#67c23a" />
		<span>加载中…</span>
	</div>
</template>

<style scoped>
.page-loader {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
}
</style>
```

## 曲线列表与工具函数

```ts
import { CURVE_NAMES, getCurveByName, buildPath } from '/@/utils/curveLoader';
```

完整预览见同目录 `example.vue`。
