<script setup lang="ts">
import { ref, defineAsyncComponent, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Close } from '@element-plus/icons-vue';
// import {
// 	ships,
// } from './markers';
import { defaultColor } from './components/color';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import shipIcon from '/@/assets/imgs/ship.png';
import {
	getTrajectory,
	getAllVessels,
	getAllContainerNos,
	getContainerInfo,
	getVesselInfo,
	type IContainerInfo,
	type IVesselInfo,
	type IPortStop,
} from '/@/api/materialFlow/shipTrajectory/index';

const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const iconUrl = shipIcon;

// 声明全局 Google Maps 类型
declare const google: any;

// 获取字典数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'vessels',
			fetchFn: getAllVessels,
		}, // 船名
		{
			key: 'containerNos',
			fetchFn: getAllContainerNos,
		}, // 柜号
	],
	{
		isAuto: true,
	}
);

const map = ref<any>(null);
const shipMarkers = ref<Record<string, any>>({});
const traveledPolylines = ref<Record<string, any>>({});
const remainingPolylines = ref<Record<string, any>>({});
const infoWindows = ref<Record<string, any>>({});

// 搜索类型选项
const searchTypes = [
	{ label: '柜号', value: 'cabinetNo', dictKey: 'containerNos' },
	{ label: '船名', value: 'vessel', dictKey: 'vessels' },
];

// 搜索表单数据
const searchForm = ref<any>({
	dateRangeType: 1,
	updateTimeStart: '',
	updateTimeEnd: '',
	dateRange: {},
	searchType: 'cabinetNo', // 默认选择柜号
	searchValue: '', // 输入的值
});

// 当前选中的船舶/柜号的完整信息（包含航线信息）
const selectedShipInfo = ref<any>(null);

// 当前船名信息的完整数据（用于存储containerNos和skuInfos）
const currentVesselInfoData = ref<IVesselInfo | null>(null);

// 信息弹窗相关状态
const infoWindowVisible = ref(false);
const infoWindowContent = ref('');
const infoWindowLoading = ref(false);

// 动态获取当前搜索类型对应的字典数据
const currentDictOptions = computed(() => {
	// 如果是柜号类型，使用本地数据
	// if (searchForm.value.searchType === 'cabinetNo') {
	// 	return shipDataListMarkers;
	// } else if (searchForm.value.searchType === 'vessel') {
	// 	return shipDataListMarkers2;
	// }
	if (searchForm.value.searchType === 'cabinetNo') {
		return dictMap.value.containerNos || [];
	}
	return dictMap.value.vessels || [];
});

// 搜索类型改变时清空输入值和选中信息
const handleSearchTypeChange = () => {
	searchForm.value.searchValue = '';
	selectedShipInfo.value = null;
};

// 当选择改变时，更新选中的船舶信息
// const handleSelectChange = (value: string) => {
// 	const selected = shipDataList.value.find((item) => item.value === value);
// 	selectedShipInfo.value = selected || null;
// };

// 数据加载函数（用于SelectDate组件回调）
async function getDataList() {
	// 获取轨迹之前先清空地图上已有的内容
	// if (map.value) {
	// 	clearMap();
	// }

	let postData = {
		containerNos: [],
		vessels: [],
		startTime: searchForm.value.dateRange?.updateTimeStart || '',
		endTime: searchForm.value.dateRange?.updateTimeEnd || '',
		current: 1,
		size: 10000,
	};
	if (searchForm.value.searchType === 'cabinetNo') {
		postData.containerNos = searchForm.value.searchValue || null;
	} else if (searchForm.value.searchType === 'vessel') {
		postData.vessels = searchForm.value.searchValue || null;
	}
	const res = await getTrajectory(postData);
	// shipsData.value = setShipColor(res.data || []);
	shipsData.value = res.data || [];
}
// function setShipColor(list:any[]) {
//   return list?.map((item:any,index:number) => {
//     return {
//       ...item,
//       color: colors[index % colors.length],
//     };
//   }) || [];
// }

// 将历史港口信息转换为航线停靠点格式
const convertHistoryPortToPortStops = (
	historyPort: IContainerInfo['historyPort'] | IVesselInfo['historyPort']
): IPortStop[] => {
	if (!historyPort || !Array.isArray(historyPort)) {
		return [];
	}
	return historyPort.map((port) => ({
		portNameEn: port.portNameEn || '',
		countryNameEn: port.countryEn || '',
		portNameZh: port.portNameCn || '',
		countryNameZh: port.countryCn || '',
		departureTime: port.atd || '',
		arrivalTime: port.ata || '',
	}));
};
const handleSearchValueChange = async (value: any) => {
	if (!value) {
		initMap();
		selectedShipInfo.value = null;
		closeInfoWindow();

		setTimeout(async () => {
			await getDataList();
			drawAllShips();
		}, 100);
	}
};
// 搜索处理函数
const handleSearch = async () => {
	// 验证输入
	// const searchTypeLabel = searchTypes.find(
	// 	(item) => item.value === searchForm.value.searchType
	// )?.label;
	// if (!searchForm.value.searchValue) {
	// 	ElMessage.warning(`请输入${searchTypeLabel}`);
	// 	return;
	// }
	initMap();
	closeInfoWindow();

	setTimeout(async () => {
		try {
			selectedShipInfo.value = null;

			// 获取轨迹数据
			await getDataList();
			// 数据获取成功后，绘制路线和标记
			drawAllShips();

			// 根据搜索类型获取对应的港口信息
			const params = {
				startTime: searchForm.value.dateRange?.updateTimeStart || undefined,
				endTime: searchForm.value.dateRange?.updateTimeEnd || undefined,
			};

			if (
				searchForm.value.searchType === 'cabinetNo' &&
				searchForm.value.searchValue
			) {
				// 获取箱号信息
				const containerRes = await getContainerInfo({
					containerNo: searchForm.value.searchValue,
					...params,
				});

				if (containerRes.data) {
					const containerData = containerRes.data;
					// 更新选中的船舶信息，包含航线信息
					selectedShipInfo.value = {
						routeInfo: {
							vessel: containerData.vessel || '',
							actualDepartureTime: containerData.actualDepartureTime || '',
							portStops: convertHistoryPortToPortStops(
								containerData.historyPort
							),
						},
					};
				}
			} else if (
				searchForm.value.searchType === 'vessel' &&
				searchForm.value.searchValue
			) {
				// 获取船名信息
				const vesselRes = await getVesselInfo({
					vessel: searchForm.value.searchValue,
					...params,
				});

				if (vesselRes.data) {
					const vesselData = vesselRes.data;
					// 保存船名信息数据，供 toggleContainer 使用
					currentVesselInfoData.value = vesselData;
					// 更新选中的船舶信息，包含航线信息
					selectedShipInfo.value = {
						routeInfo: {
							vessel: vesselData.vessel || '',
							actualDepartureTime: vesselData.actualDepartureTime || '',
							portStops: convertHistoryPortToPortStops(vesselData.historyPort),
						},
					};
				}
			}
		} catch (error) {
			ElMessage.error('获取港口信息失败，请稍后重试');
		}
	}, 100);
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// This example creates a 2-pixel-wide red polyline showing the path of
// the first trans-Pacific flight between Oakland, CA, and Brisbane,
// Australia which was made by Charles Kingsford Smith.

let shipsData = ref<any[]>([]);
const loading = ref(false);

function initMap() {
	//增加loding效果
	loading.value = true;
	// 使用北京的经纬度作为默认中心点
	const center = {
		lat: 39.9042,
		lng: 116.4074,
	};
	map.value = new google.maps.Map(document.getElementById('map'), {
		zoom: 3, // 初始缩放级别（0-20，数值越大越近）
		minZoom: 2, // 最小缩放级别（限制地图可以缩小到多远）
		maxZoom: 18, // 最大缩放级别（限制地图可以放大到多近）
		center: center,
		mapTypeId: 'terrain',
		// 地图类型控件设置（右上角的地图类型选择器）
		mapTypeControl: true, // 启用地图类型控件
		mapTypeControlOptions: {
			position: google.maps.ControlPosition.LEFT_BOTTOM, // 设置位置为左下角
			mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain'], // 可选的地图类型
		},
		// 比例尺控件设置（显示距离/图例）
		scaleControl: true, // 启用比例尺控件
		scaleControlOptions: {
			position: google.maps.ControlPosition.LEFT_BOTTOM, // 比例尺位置（左下角）
		},
		// 全屏控件设置
		fullscreenControl: true, // 启用全屏控件
		fullscreenControlOptions: {
			position: google.maps.ControlPosition.RIGHT_BOTTOM, // 全屏按钮位置（右下角）
		},
		// styles: [
		//   {
		//     featureType: 'water',
		//     elementType: 'geometry',
		//     stylers: [{ color: '#1a2a6c' }],
		//   },
		//   {
		//     featureType: 'landscape',
		//     elementType: 'geometry',
		//     stylers: [{ color: '#2c3e50' }],
		//   },
		// ],
	});

	// initMap 只负责初始化地图，不绘制内容
	// 绘制内容将在数据获取后统一处理
	loading.value = false;
}

function drawShipRoute(ship: any) {
	// 绘制已航行路线
	if (ship?.trajectory?.length) {
		// 将坐标转换为 Google Maps 格式 {lat, lng}
		const trajectory = ship.trajectory.map((point: any) => {
			// if(!point?.latitude || !point?.longitude) {
			//   console.log('point is null-ship-trajectory',ship.vessel,point);
			// }
			const lat = point.latitude || 0;
			const lng = point.longitude || 0;
			return { lat, lng };
		});

		// 创建箭头符号，箭头方向自动跟随路径方向
		// 使用 repeat 属性让箭头沿着路径重复显示
		// 使用 FORWARD_CLOSED_ARROW 使箭头指向路径前进方向
		const arrowSymbol = {
			path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
			scale: 2,
			strokeColor: defaultColor,
			strokeWeight: 1,
			fillColor: defaultColor,
			fillOpacity: 1,
			// rotation 不设置或设为 0，箭头会自动跟随路径方向
		};

		const arrowIcons = [
			{
				icon: arrowSymbol,
				offset: '50%', // 从路径中点开始显示
				repeat: '50px', // 每隔 50px 重复一次箭头，确保箭头始终在路径上
			},
		];

		const traveledPolyline = new google.maps.Polyline({
			path: trajectory,
			geodesic: true,
			// strokeColor: ship?.color || '#4285F4',
			strokeColor: defaultColor,
			strokeOpacity: 1,
			strokeWeight: 1,
			icons: arrowIcons.length > 0 ? arrowIcons : undefined,
		});

		traveledPolyline.setMap(map.value);
		traveledPolylines.value[ship.vessel] = traveledPolyline;
	}
	// 绘制未航行路线
	//TODO 根据历史轨迹和当前位置绘制未航行路线
	//结束的经纬度从接口中获取,开始位置如果trajectory为空则取startLatitude和startLongitude
	//起止点都是未航行路线
	const lastPointTrajectory = ship.trajectory?.[ship.trajectory?.length - 1];
	const lastPoint = {
		lat: lastPointTrajectory?.latitude || ship?.startLatitude || 0,
		lng: lastPointTrajectory?.longitude || ship?.startLongitude || 0,
	};
	const endPoint = {
		lat: ship?.endLatitude || 0,
		lng: ship?.endLongitude || 0,
	};
	const remainingPath = [lastPoint, endPoint];
	const startPoint = {
		lat: ship.trajectory?.[0]?.latitude || ship?.startLatitude || 0,
		lng: ship.trajectory?.[0]?.longitude || ship?.startLongitude || 0,
	};

	drawPointCircle(startPoint);
	drawPointCircle(endPoint);

	//判断必须有startLatitude和startLongitude和endLatitude和endLongitude
	if (!lastPoint.lat || !lastPoint.lng || !endPoint.lat || !endPoint.lng) {
		return;
	}

	// 未航行路线使用虚线样式和箭头
	const lineSymbol = {
		path: 'M 0,-1 0,1',
		strokeOpacity: 1,
		scale: 2,
	};

	// 创建未航行路线的箭头符号
	const remainingArrowSymbol = {
		path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
		scale: 2,
		strokeColor: defaultColor,
		strokeWeight: 1,
		fillColor: defaultColor,
		fillOpacity: 0.3, // 与未航行路线的透明度保持一致
	};

	const remainingPolyline = new google.maps.Polyline({
		path: remainingPath,
		geodesic: true,
		// strokeColor: ship?.color || '#4285F4',
		strokeColor: defaultColor,
		strokeOpacity: 0.3,
		strokeWeight: 2,
		icons: [
			{
				icon: lineSymbol,
				offset: '0',
				repeat: '15px',
			},
			{
				icon: remainingArrowSymbol,
				offset: '50%', // 从路径中点开始显示
				repeat: '50px', // 每隔 50px 重复一次箭头
			},
		],
	});

	remainingPolyline.setMap(map.value);
	remainingPolylines.value[ship.vessel] = remainingPolyline;
}
// 绘制起止点圆点
function drawPointCircle(point: { lat: number; lng: number }) {
	if (!map.value) {
		return;
	}
	if ((point.lat === 0 && point.lng === 0) || !point.lat || !point.lng) {
		return;
	}
	const circleIcon = {
		path: google.maps.SymbolPath.CIRCLE,
		scale: 4, // 圆点大小
		fillColor: defaultColor,
		fillOpacity: 0.3,
		strokeColor: defaultColor,
		strokeWeight: 3,
		strokeOpacity: 1,
	};
	new google.maps.Marker({
		position: {
			lat: point.lat || 0,
			lng: point.lng || 0,
		},
		map: map.value,
		icon: circleIcon,
		// title: point.title || '',
		optimized: false, // 禁用优化以确保显示
	});
}

function createShipMarker(ship: any) {
	// 检查地图是否已初始化
	if (!map.value) {
		return;
	}

	const lastPoint = ship.trajectory?.[ship.trajectory?.length - 1] || {
		latitude: ship.startLatitude || 0,
		longitude: ship.startLongitude || 0,
	};
	// 确保坐标格式符合 Google Maps API 要求 {lat, lng}
	const currentPosition = {
		lat: lastPoint.latitude || 0,
		lng: lastPoint.longitude || 0,
	};

	// 验证坐标有效性（排除无效坐标 0,0）
	if (!currentPosition.lat || !currentPosition.lng) {
		return;
	}
	// 创建船舶标记
	const marker = new google.maps.Marker({
		position: currentPosition,
		map: map.value,
		title: ship.vessel,
		icon: {
			url: iconUrl,
			scaledSize: new google.maps.Size(30, 30),
			anchor: new google.maps.Point(15, 30), // 图标底部中心点对准位置
		},
	});

	shipMarkers.value[ship.vessel] = marker;

	// 创建信息窗口（内容将在点击时动态加载）
	const infoWindow = new google.maps.InfoWindow({
		content: '<div style="padding: 20px; text-align: center;">加载中...</div>',
	});

	infoWindows.value[ship.vessel] = infoWindow;

	// 根据接口数据生成信息窗口 HTML 的函数
	const generateInfoWindowHtml = (
		data: IContainerInfo | IVesselInfo,
		isContainerInfo: boolean
	) => {
		// 构建顶部信息
		const shipName = data.vessel || ship.name || '';
		const startPortName = isContainerInfo
			? (data as IContainerInfo).originPortCn ||
			  (data as IContainerInfo).originPort ||
			  ''
			: (data as IVesselInfo).originPortCn ||
			  (data as IVesselInfo).originPort ||
			  '';
		const endPortName = isContainerInfo
			? (data as IContainerInfo).destPortCn ||
			  (data as IContainerInfo).destPort ||
			  ''
			: (data as IVesselInfo).destPortCn ||
			  (data as IVesselInfo).destPort ||
			  '';
		const actualDepartureTime = data.actualDepartureTime || '';
		const estimatedArrivalTime = data.estimatedArrivalTime || '';

		// 判断航行状态（根据是否有预计到达时间或历史港口信息）
		const naviStatus = estimatedArrivalTime ? 1 : 0;

		const topHtml = `
      <div class="ship-name">${shipName}</div>
      
      <div class="progress-container">
        <div class="progress-header">
          <div class="progress-header-line bold">
            <div class="port-label">${startPortName}</div>
            <div class="port-label">${endPortName}</div>
          </div>
          <div class="progress-header-line progress-header-line-content">
            <div class="port-circle "><div class="port-circle-inner"></div></div>
            <div class="progress-line">
              <div class="progress-line-bar">
                <span class="status-badge">${
									naviStatus == 1 ? '航行中' : '靠泊中'
								}</span>
              </div>
            </div>
            <div class="port-circle "><div class="port-circle-inner"></div></div>
          </div>
          <div class="progress-header-line">
            <div class="port-label">${actualDepartureTime}</div>
            <div class="port-label">${estimatedArrivalTime}</div>
          </div>
        </div>
      </div>
`;

		if (isContainerInfo) {
			// 箱号信息：显示该箱号下的 SKU 列表
			const containerData = data as IContainerInfo;
			// 接口返回的是 skuInfos 数组，直接显示 SKU 列表
			const skuListHtml = containerData.skuInfos
				? containerData.skuInfos
						.map((sku) => {
							return `
                  <div class="sku-row container-item sku-row-p">
                    <div class="sku-label">${sku.skuCode || ''}</div>
                    <div class="sku-quantity">${sku.quantity || 0}</div>
                  </div>
                `;
						})
						.join('')
				: '<div class="sku-row container-item"><div class="sku-label">暂无数据</div></div>';

			return `
    <div class="ship-info-window">
      ${topHtml}
      <div class="containers-section">
        <div class="containers-header ">
          <div class="sku-label">SKU</div>
          <div class="sku-quantity">实际发货数量</div>
        </div>
        <div class="table-container">
          ${skuListHtml}
        </div>
      </div>
    </div>
  `;
		} else {
			// 船名信息：显示该船名下的所有柜号列表
			const vesselData = data as IVesselInfo;
			// 接口返回的是 containerNos 数组（对象数组，包含 containerNo 和 skuInfos），显示柜号列表
			// 确保 containerNos 是数组类型
			const containerNos = vesselData?.containerNos || [];

			const containerListHtml =
				containerNos.length > 0
					? containerNos
							.map((containerInfo) => {
								const containerNo = containerInfo?.containerNo || '';
								return `
                  <div class="container-item" data-container-id="${containerNo}">
                    <div class="container-header" onclick="toggleContainer('${containerNo}')">
                      <div class="expand-icon">+</div>
                      <div class="container-number">${containerNo}</div>
                    </div>
                    <div class="container-details" id="details-${containerNo}">
                      <div class="details-header">
                        <div class="sku-label">SKU</div>
                        <div class="sku-quantity">实际发货数量</div>
                      </div>
                      <div class="sku-list-container" id="sku-list-${containerNo}">
                        <div style="padding: 12px; text-align: center; color: #999;">点击展开查看SKU列表</div>
                      </div>
                    </div>
                  </div>
                `;
							})
							.join('')
					: '<div class="sku-row container-item"><div class="sku-label">暂无数据</div></div>';

			return `
    <div class="ship-info-window">
      ${topHtml}
      <div class="containers-section">
        <div class="containers-header ">
          <div class="sku-label">柜号</div>
          <div class="sku-quantity"></div>
        </div>
        <div class="table-container">
          ${containerListHtml}
        </div>
      </div>
    </div>
  `;
		}
	};

	// 点击标记打开信息窗口
	marker.addListener('click', async () => {
		// 关闭所有其他信息窗口
		Object.values(infoWindows.value).forEach((window: any) => window.close());

		// 显示弹窗并设置加载状态
		infoWindowVisible.value = true;
		infoWindowLoading.value = true;
		infoWindowContent.value =
			'<div style="padding: 20px; text-align: center;">加载中...</div>';

		try {
			// 根据筛选条件决定调用哪个接口
			const params = {
				startTime: searchForm.value.updateTimeStart || undefined,
				endTime: searchForm.value.updateTimeEnd || undefined,
			};

			let data: IContainerInfo | IVesselInfo;
			let isContainerInfo = false;

			if (!searchForm.value.searchValue) {
				// 输入框为空，使用船名调用船名信息接口
				const vesselRes = await getVesselInfo({
					vessel: ship.vessel || ship.name || '',
					...params,
				});
				if (vesselRes.data) {
					data = vesselRes.data;
					isContainerInfo = false;
					// 保存船名信息数据，供 toggleContainer 使用
					currentVesselInfoData.value = vesselRes.data;
				} else {
					throw new Error('获取船名信息失败');
				}
			} else {
				// 输入框有值，根据 searchType 调用对应接口
				if (searchForm.value.searchType === 'cabinetNo') {
					// 获取箱号信息
					const containerRes = await getContainerInfo({
						containerNo: searchForm.value.searchValue,
						...params,
					});
					if (containerRes.data) {
						data = containerRes.data;
						isContainerInfo = true;
					} else {
						throw new Error('获取箱号信息失败');
					}
				} else if (searchForm.value.searchType === 'vessel') {
					// 获取船名信息
					const vesselRes = await getVesselInfo({
						vessel: searchForm.value.searchValue,
						...params,
					});
					if (vesselRes.data) {
						data = vesselRes.data;
						isContainerInfo = false;
						// 保存船名信息数据，供 toggleContainer 使用
						currentVesselInfoData.value = vesselRes.data;
					} else {
						throw new Error('获取船名信息失败');
					}
				} else {
					throw new Error('未知的搜索类型');
				}
			}

			// 生成信息窗口 HTML
			const html = generateInfoWindowHtml(data, isContainerInfo);
			infoWindowContent.value = html;
			infoWindowLoading.value = false;
		} catch (error: any) {
			ElMessage.error('获取信息窗口数据失败');
			infoWindowContent.value = `<div style="padding: 20px; text-align: center; color: red;">加载失败：${
				error.message || '未知错误'
			}</div>`;
			infoWindowLoading.value = false;
		}

		// 高亮对应的船舶列表项
		document.querySelectorAll('.ship-item').forEach((item) => {
			item.classList.remove('active');
			const shipItem = item as HTMLElement;
			if (
				shipItem.dataset.shipId &&
				parseInt(shipItem.dataset.shipId) === ship.id
			) {
				item.classList.add('active');
			}
		});
	});
}

function toggleContainer(containerId: string) {
	const detailsEl = document.getElementById(`details-${containerId}`);
	// 从全局 event 对象获取点击事件的目标元素
	const clickEvent = (window as any).event as MouseEvent;
	const iconEl = (clickEvent?.target as HTMLElement)
		?.closest('.container-header')
		?.querySelector('.expand-icon') as HTMLElement;
	const skuListContainer = document.getElementById(`sku-list-${containerId}`);

	if (!detailsEl || !iconEl) {
		return;
	}

	if (detailsEl.classList.contains('expanded')) {
		// 收起
		detailsEl.classList.remove('expanded');
		iconEl.textContent = '+';
	} else {
		// 展开
		detailsEl.classList.add('expanded');
		iconEl.textContent = '-';

		// 检查是否已加载SKU数据
		const hasLoaded = skuListContainer?.getAttribute('data-loaded') === 'true';

		if (!hasLoaded && skuListContainer) {
			// 从已保存的船名信息数据中获取SKU信息
			if (
				currentVesselInfoData.value &&
				currentVesselInfoData.value.containerNos
			) {
				// 查找对应的柜号信息
				const containerInfo = currentVesselInfoData.value.containerNos.find(
					(item) => item.containerNo === containerId
				);

				if (containerInfo && containerInfo.skuInfos) {
					const skuList = containerInfo.skuInfos;

					if (skuList.length > 0) {
						const skuHtml = skuList
							.map((sku) => {
								const safeSkuCode = (sku.skuCode || '')
									.replace(/&/g, '&amp;')
									.replace(/</g, '&lt;')
									.replace(/>/g, '&gt;')
									.replace(/"/g, '&quot;')
									.replace(/'/g, '&#039;');
								return `
                  <div class="sku-row ">
                    <div class="sku-label">${safeSkuCode}</div>
                    <div class="sku-quantity">${sku.quantity || 0}</div>
                  </div>
                `;
							})
							.join('');

						skuListContainer.innerHTML = skuHtml;
					} else {
						skuListContainer.innerHTML =
							'<div style="padding: 12px; text-align: center; color: #999;">暂无SKU数据</div>';
					}

					// 标记为已加载
					skuListContainer.setAttribute('data-loaded', 'true');
				} else {
					skuListContainer.innerHTML =
						'<div style="padding: 12px; text-align: center; color: #999;">暂无SKU数据</div>';
					skuListContainer.setAttribute('data-loaded', 'true');
				}
			} else {
				skuListContainer.innerHTML =
					'<div style="padding: 12px; text-align: center; color: #999;">暂无数据</div>';
				skuListContainer.setAttribute('data-loaded', 'true');
			}
		}
	}
}

// 将 toggleContainer 暴露到全局，供 HTML 字符串中的 onclick 调用
(window as any).toggleContainer = toggleContainer;

// 关闭信息弹窗
const closeInfoWindow = () => {
	infoWindowVisible.value = false;
	infoWindowContent.value = '';
	infoWindowLoading.value = false;
};

// 绘制所有船舶的路线和标记
function drawAllShips() {
	if (!map.value || !shipsData.value || shipsData.value.length === 0) {
		return;
	}
	// 绘制所有船舶的路线和标记
	shipsData.value.forEach((ship) => {
		drawShipRoute(ship);
		createShipMarker(ship);
	});

	// 绘制完成后，将地图中心点设置到第一条线路的位置
	if (shipsData.value?.[0]?.trajectory?.length > 0) {
		const firstShip = shipsData.value[0];
		const trajectory = firstShip.trajectory[firstShip.trajectory.length - 1];
		if (trajectory?.latitude && trajectory?.longitude) {
			const center = {
				lat: trajectory.latitude,
				lng: trajectory.longitude,
			};
			map.value.setCenter(center);
		}
	}
}

onMounted(async () => {
	// 页面刷新时关闭信息弹窗
	closeInfoWindow();

	// 等待 Google Maps API 加载完成后初始化地图
	const checkGoogleMaps = () => {
		if (typeof google !== 'undefined' && google.maps) {
			initMap();
			// 地图初始化完成后，请求数据
			getDataList()
				.then(() => {
					// 数据获取成功后，绘制路线和标记
					drawAllShips();
				})
				.catch(() => {
					// 数据获取失败时不做处理
				});
		} else {
			// 如果 API 还未加载，1000ms 后重试
			setTimeout(checkGoogleMaps, 1000);
		}
	};

	// 开始检查 Google Maps API 是否加载完成
	checkGoogleMaps();
});
</script>

<template>
	<div class="map-container">
		<!-- 左上角搜索表单 -->
		<div class="search-panel">
			<div class="search-row">
				<div class="search-input-group">
					<SelectDate
						v-model:queryForm="searchForm.dateRange"
						:settings="{
							selectStyle: {
								width: '100px',
							},
							dateStyle: {
								width: '150px',
							},
						}"
						:searchTypes="[
							{
								label: '开船时间',
								value: 'updateTime',
								isAddHMS: true,
								dateStart: 'updateTimeStart',
								dateEnd: 'updateTimeEnd',
							},
						]"
					/>
				</div>
			</div>
			<div class="search-panel-content">
				<div class="search-row">
					<div class="search-input-group">
						<el-select
							v-model="searchForm.searchType"
							placeholder="请选择"
							@change="handleSearchTypeChange"
						>
							<el-option
								v-for="item in searchTypes"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
						<el-select
							v-model="searchForm.searchValue"
							collapse-tags
							clearable
							filterable
							multiple
							:max-collapse-tags="1"
							style="width: 300px"
							placeholder="请输入"
							@change="handleSearchValueChange"
						>
							<el-option
								v-for="item in currentDictOptions"
								:key="
									searchForm.searchType === 'cabinetNo'
										? item.containerNo
										: item.vessel
								"
								:label="
									searchForm.searchType === 'cabinetNo'
										? item.label
										: item.vessel
								"
								:value="
									searchForm.searchType === 'cabinetNo'
										? item.containerNo
										: item.vessel
								"
							>
								<div class="flex justify-between">
									<span>{{
										searchForm.searchType === 'cabinetNo'
											? item.containerNo
											: item.vessel
									}}</span>
									<span class="text-gray-500 text-sm ml-2"
										>开船时间：{{ item.actualDepartureTime }}</span
									>
								</div>
							</el-option>
						</el-select>
					</div>
					<el-button type="primary" @click="handleSearch">搜索</el-button>
				</div>

				<!-- 航线信息展示区域 - 使用 Vue 模板语法 -->
				<div
					v-if="selectedShipInfo && selectedShipInfo.routeInfo"
					class="route-info-panel"
				>
					<!-- 航线时间轴 -->
					<div class="ship-route-timeline">
						<!-- 头部信息 -->
						<div class="route-header">
							<div class="route-ship-name">
								{{ selectedShipInfo.routeInfo.vessel }}
							</div>
							<div class="route-departure-time">
								实际开船时间:
								{{ selectedShipInfo.routeInfo.actualDepartureTime }}
							</div>
						</div>

						<!-- 港口停靠点列表 -->
						<div class="route-stops-container">
							<div
								v-for="(stop, index) in selectedShipInfo.routeInfo.portStops"
								:key="index"
								class="route-stop-item"
							>
								<!-- 左侧图标 -->
								<div class="route-stop-icon">
									<div class="route-stop-circle"></div>
									<div
										v-if="
											index < (selectedShipInfo.routeInfo.portStops.length)as any - 1
										"
										class="route-stop-line"
									></div>
								</div>

								<!-- 右侧内容 -->
								<div class="route-stop-content">
									<div class="route-stop-port">
										{{ stop.portNameEn }}, {{ stop.countryNameEn }} ({{
											stop.portNameZh
										}}, {{ stop.countryNameZh }})
									</div>
									<div class="route-stop-times">
										<div class="route-time">
											离港时间: {{ stop.departureTime }}
										</div>
										<div class="route-time">
											到港时间: {{ stop.arrivalTime }}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="map-wrapper" id="map" v-loading="loading"></div>

		<!-- 固定定位的信息弹窗 -->
		<div v-if="infoWindowVisible" class="info-window-panel">
			<div class="info-window-header">
				<span class="info-window-title">船舶信息</span>
				<el-icon class="info-window-close" @click="closeInfoWindow">
					<Close />
				</el-icon>
			</div>
			<div class="info-window-body" v-loading="infoWindowLoading">
				<div v-html="infoWindowContent"></div>
			</div>
		</div>
	</div>
</template>

<style>
@import './index.scss';
</style>
