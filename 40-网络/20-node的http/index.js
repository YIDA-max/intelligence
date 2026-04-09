// http是nodejs的http模块,用于创建http服务器
// 同时也可以发请求
const http = require("http");
const https = require("https"); // 请求百度需要 https

const server = http.createServer((req, res) => {
  res.end("初始化成功");
});

// 监听端口
// server.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });

// 发请求
// 2. 发送请求 (修正 body 获取方式)
https
  .get("https://www.baidu.com", (res) => {
    console.log("状态码:", res.statusCode);

    let rawData = ""; // 用于拼接数据碎片

    // 当接收到一小块数据时触发
    res.on("data", (chunk) => {
      rawData += chunk;
    });

    // 当数据全部接收完毕时触发
    res.on("end", () => {
      console.log("完整响应内容:", rawData);
    });
  })
  .on("error", (e) => {
    console.error(`请求出错: ${e.message}`);
  });
// node 的全局对象是 global
// 浏览器的全局对象是 window

console.log(global);
