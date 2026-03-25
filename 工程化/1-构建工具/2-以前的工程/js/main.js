// main.js
// 典型“以前的工程”写法：jQuery 负责 DOM，axios 负责请求，自己封装一点点逻辑

(function ($, axios, MockApi, logger) {
	// DOM 引用
	var $tableBody = $('#tableBody');
	var $emptyState = $('#emptyState');
	var $refreshBtn = $('#refreshBtn');
	var $searchBtn = $('#searchBtn');
	var $keywordInput = $('#keywordInput');

	// 渲染订单行
	function renderRows(list) {
		if (!list || list.length === 0) {
			$tableBody.empty();
			$emptyState.show();
			return;
		}

		$emptyState.hide();
		var html = '';
		$.each(list, function (_, item) {
			html +=
				'<tr>' +
				'<td>' +
				item.id +
				'</td>' +
				'<td>' +
				escapeHtml(item.customer) +
				'</td>' +
				'<td>¥ ' +
				item.amount.toLocaleString() +
				'</td>' +
				'<td>' +
				renderStatus(item.status) +
				'</td>' +
				'<td>' +
				item.createdAt +
				'</td>' +
				'</tr>';
		});
		$tableBody.html(html);
	}

	// 状态渲染
	function renderStatus(status) {
		var text = '';
		var cls = '';
		if (status === 'pending') {
			text = '待处理';
			cls = 'pending';
		} else if (status === 'success') {
			text = '已完成';
			cls = 'success';
		} else if (status === 'canceled') {
			text = '已取消';
			cls = 'canceled';
		} else {
			text = status;
		}
		return '<span class="status ' + cls + '">' + text + '</span>';
	}

	// HTML 转义，避免 XSS
	function escapeHtml(str) {
		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	// 加载列表
	function loadOrders(options) {
		var keyword = (options && options.keyword) || '';
		logger.log('开始加载订单列表, keyword=' + keyword);

		// “以前的工程”里，经常直接把模拟接口当真接口来调
		MockApi.getOrders({ keyword: keyword }).then(function (res) {
			logger.log('接口返回 /api/orders', res.data);
			if (res.data && res.data.code === 0) {
				renderRows(res.data.data || []);
			} else {
				renderRows([]);
			}
		});
	}

	// 事件绑定
	function bindEvents() {
		$refreshBtn.on('click', function () {
			$keywordInput.val('');
			loadOrders();
		});

		$searchBtn.on('click', function () {
			var keyword = $keywordInput.val();
			loadOrders({ keyword: keyword });
		});

		$keywordInput.on('keypress', function (e) {
			if (e.which === 13) {
				var keyword = $keywordInput.val();
				loadOrders({ keyword: keyword });
			}
		});
	}

	// 初始化
	$(function () {
		bindEvents();
		loadOrders();
	});
})(jQuery, axios, window.MockApi, window.mockLogger);
