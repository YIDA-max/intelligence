# 航行轨迹数据处理优化方案

## 📋 问题分析

### 原始数据特点

1. **靠港数据重复**：`navi_status = 1` 时，船舶在港口停留期间会定时上传位置，产生大量相似坐标
2. **航行数据冗余**：`navi_status = 0` 时，航行过程中定时上传产生密集轨迹点
3. **精度不匹配**：港口数据库的坐标精度与实际轨迹点精度不一致

### 业务需求

- 重点关注：**港口数据** + **当前位置**
- 次要关注：**航行轨迹**（用于地图绘制，需要流畅但不需要过于密集）

## 🎯 优化方案

### 1. 靠港数据过滤（navi_status = 1）

**策略**：基于距离和时间的去重

- 距离阈值：0.5 公里（可调）
- 时间阈值：10 分钟（可调）
- 逻辑：相邻靠港点如果距离很近且时间间隔短，则视为重复数据

**效果**：大幅减少港口停留期间的冗余数据点

### 2. 航行数据优化（navi_status = 0）

提供两种算法：

#### 方案 A：Douglas-Peucker 轨迹简化算法（推荐）

- **原理**：保留轨迹的关键转折点，去除直线段上的冗余点
- **优点**：
  - 保持航线形状和流畅度
  - 压缩率高
  - 适合地图可视化
- **参数**：容差值（tolerance），默认 0.3 公里

#### 方案 B：基于规则的智能过滤

- **考虑因素**：
  - 速度变化（sog）：速度突变点保留
  - 航向变化（cog）：航向转折点保留
  - 时间间隔：超过阈值保留
  - 距离间隔：超过阈值保留
- **优点**：
  - 保留关键航行事件
  - 可精确控制过滤条件
  - 适合数据分析

### 3. 港口匹配

**策略**：基于 Haversine 公式计算实际地理距离

- 只对 `navi_status = 1` 的点进行匹配
- 在指定半径内（默认 5 公里）查找最近的港口
- 返回港口详细信息（代码、名称、中文名等）

## 🚀 使用方法

### 快速开始

```typescript
import { portMapByLocation } from './portMap';
import { portData } from './pino';
import { processTrajectoryData } from './commonKiro';

// 一键处理（推荐）
const result = processTrajectoryData(portMapByLocation, portData);

// 结果包含：
// - 过滤后的轨迹点
// - 匹配的港口信息
// - 标记的港口/航行状态
```

### 自定义配置

```typescript
const result = processTrajectoryData(portMapByLocation, portData, {
	// 港口匹配
	maxMatchDistance: 5, // 港口匹配半径（公里）

	// 靠港点过滤
	portFilterDistance: 0.5, // 距离阈值（公里）
	portFilterTime: 10, // 时间阈值（分钟）

	// 航行点过滤
	filterNavigation: true, // 是否过滤航行点
	useSimplification: true, // 使用轨迹简化算法
	simplificationTolerance: 0.3, // 简化容差（公里）

	// 或使用规则过滤
	// useSimplification: false,
	// minTimeInterval: 15,        // 最小时间间隔（分钟）
	// minDistance: 1,             // 最小距离（公里）
	// speedChangeThreshold: 2,    // 速度变化阈值（节）
	// courseChangeThreshold: 30,  // 航向变化阈值（度）
	// keepKeyPoints: true,        // 保留关键点
});
```

### 分步处理

```typescript
import {
	filterDuplicatePortPoints,
	filterNavigationPoints,
	matchPortsToTrajectory,
} from './commonKiro';

// 步骤 1: 过滤靠港点
let data = filterDuplicatePortPoints(portData, 0.5, 10);

// 步骤 2: 过滤航行点
data = filterNavigationPoints(data, {
	useSimplification: true,
	simplificationTolerance: 0.3,
});

// 步骤 3: 匹配港口
const result = matchPortsToTrajectory(portMapByLocation, data, 5);
```

## 📊 预设配置

### 地图展示配置（推荐）

```typescript
import { defaultConfig } from './example';

const result = processTrajectoryData(
	portMapByLocation,
	portData,
	defaultConfig.mapDisplay
);
```

- 平衡压缩率和流畅度
- 适合 Web 地图可视化
- 预期压缩率：60-80%

### 数据分析配置

```typescript
const result = processTrajectoryData(
	portMapByLocation,
	portData,
	defaultConfig.dataAnalysis
);
```

- 保留更多细节
- 适合航行数据分析
- 预期压缩率：40-60%

### 移动端配置

```typescript
const result = processTrajectoryData(
	portMapByLocation,
	portData,
	defaultConfig.mobileDisplay
);
```

- 最大化压缩
- 减少数据传输和渲染负担
- 预期压缩率：80-90%

## 📈 数据统计

```typescript
import { getTrajectoryStats } from './commonKiro';

const stats = getTrajectoryStats(processedData);
console.log(stats);
// {
//   total: 150,              // 总点数
//   portPoints: 20,          // 靠港点数
//   navigationPoints: 130,   // 航行点数
//   totalDistance: 1234.56,  // 总距离（公里）
//   averageSpeed: 12.5,      // 平均速度（节）
//   duration: 48.5,          // 总时长（小时）
// }
```

## 🎨 地图绘制建议

### 获取关键数据

```typescript
const processedData = processTrajectoryData(portMapByLocation, portData);

// 港口点（用于标记）
const ports = processedData.filter((p) => p.isPort && p.portInfo);

// 当前位置（用于实时显示）
const currentPosition = processedData[processedData.length - 1];

// 航行轨迹（用于绘制路线）
const navigationPath = processedData.filter((p) => !p.isPort);
```

### 绘制方案

1. **港口标记**：使用特殊图标标注港口位置，显示港口名称
2. **航行路线**：使用平滑曲线连接轨迹点
3. **当前位置**：使用动态图标标注船舶当前位置
4. **方向指示**：根据 `hdg` 或 `cog` 显示船舶朝向

## 🔧 算法对比

| 特性       | Douglas-Peucker | 规则过滤   |
| ---------- | --------------- | ---------- |
| 压缩率     | ⭐⭐⭐⭐⭐      | ⭐⭐⭐⭐   |
| 流畅度     | ⭐⭐⭐⭐⭐      | ⭐⭐⭐     |
| 保留关键点 | ⭐⭐⭐⭐        | ⭐⭐⭐⭐⭐ |
| 性能       | ⭐⭐⭐⭐        | ⭐⭐⭐⭐⭐ |
| 适用场景   | 地图可视化      | 数据分析   |

## 💡 最佳实践

1. **地图展示**：使用 Douglas-Peucker 算法，容差 0.3-0.5 公里
2. **数据分析**：使用规则过滤，保留关键航行事件
3. **移动端**：增大容差到 1 公里，减少数据量
4. **实时更新**：只处理新增数据，避免重复处理
5. **缓存结果**：处理后的数据可以缓存，避免重复计算

## 📝 数据结构

### 输入：TrajectoryPoint

```typescript
{
	id: number;
	vessel: string;
	navi_status: number; // 0=航行, 1=靠港
	latitude: number;
	longitude: number;
	hdg: string; // 航向
	cog: string; // 对地航向
	sog: string; // 对地航速
	utc: string; // 时间
}
```

### 输出：MatchedTrajectoryPoint

```typescript
{
  ...TrajectoryPoint,
  lat: number,          // Google Maps 格式
  lng: number,          // Google Maps 格式
  isPort: boolean,      // 是否为港口
  portInfo?: {          // 匹配的港口信息（如果有）
    code: string,
    name: string,
    chinese_name: string,
    country_code: string,
    latitude: number,
    longitude: number,
    // ...
  }
}
```

## 🐛 常见问题

**Q: 为什么有些港口没有匹配到？**
A: 可能是距离超过了 `maxMatchDistance`，尝试增大这个值。

**Q: 航线看起来不够流畅？**
A: 减小 `simplificationTolerance` 或使用规则过滤并减小阈值。

**Q: 数据量还是太大？**
A: 增大 `simplificationTolerance` 或使用移动端配置。

**Q: 如何保留所有关键转折点？**
A: 使用规则过滤，设置 `keepKeyPoints: true` 并调整速度/航向阈值。

## 📚 参考资料

- [Douglas-Peucker 算法](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm)
- [Haversine 公式](https://en.wikipedia.org/wiki/Haversine_formula)
- [AIS 数据格式](https://en.wikipedia.org/wiki/Automatic_identification_system)
