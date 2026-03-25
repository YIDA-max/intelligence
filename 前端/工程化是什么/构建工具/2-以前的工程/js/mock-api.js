// mock-api.js
// 使用 axios 拦截器 + setTimeout 模拟网络请求与延迟

(function () {
	// 一些模拟数据
	var mockOrders = [
		{
			id: 'SO20260001',
			customer: '北京千易科技有限公司',
			amount: 12800,
			status: 'pending',
			createdAt: '2026-03-01 10:20:33',
		},
		{
			id: 'SO20260002',
			customer: '上海星云电子',
			amount: 5600,
			status: 'success',
			createdAt: '2026-03-02 14:11:09',
		},
		{
			id: 'SO20260003',
			customer: '深圳速联供应链',
			amount: 23200,
			status: 'canceled',
			createdAt: '2026-03-03 09:45:18',
		},
		{
			id: 'SO20260004',
			customer: '广州远航物流',
			amount: 9800,
			status: 'pending',
			createdAt: '2026-03-05 16:02:01',
		},
	];

	// 简单的日志函数，方便 main.js 里复用
	function appendLog(message, data) {
		var $log = $('#logOutput');
		if ($log.length === 0) return;
		var time = new Date().toLocaleTimeString();
		var line = '[' + time + '] ' + message;
		if (data) {
			line += ' ' + JSON.stringify(data);
		}
		$log.append(line + '\n');
		$log.scrollTop($log[0].scrollHeight);
	}

	// 把日志函数挂到全局，方便 main.js 调用
	window.mockLogger = {
		log: appendLog,
	};

	// axios 请求拦截：在这里可以统一设置 headers、token 等
	axios.interceptors.request.use(function (config) {
		appendLog('请求发出: ' + config.method + ' ' + config.url);
		return config;
	});

	// axios 响应拦截：在这里模拟后端接口
	axios.interceptors.response.use(
		function (response) {
			// 真实项目里这里是处理服务端返回
			return response;
		},
		function (error) {
			appendLog(
				'请求出错: ' + (error && error.message ? error.message : '未知错误')
			);
			return Promise.reject(error);
		}
	);

	// 暴露一个“伪接口”函数：axios.get('/api/orders', { params }) 形式
	window.MockApi = {
		getOrders: function (params) {
			// params: { keyword?: string }
			var keyword = (params && params.keyword) || '';
			var filtered = mockOrders.filter(function (item) {
				if (!keyword) return true;
				return item.customer.indexOf(keyword) !== -1;
			});

			// 用 Promise + setTimeout 模拟网络延迟
			return new Promise(function (resolve) {
				var delay = 800 + Math.random() * 700; // 800~1500ms
				setTimeout(function () {
					var data = {
						code: 0,
						message: 'ok',
						data: filtered,
					};
					resolve({ data: data });
				}, delay);
			});
		},
	};
})();
