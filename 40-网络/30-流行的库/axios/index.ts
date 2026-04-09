// axios 是一个基于 promise 的网络请求库,非常经典,不过多介绍
import axios from "axios";

// axios.get("https://www.baidu.com").then((res) => {
//   console.log(res.data);
// });

const server = axios.create({
  baseURL: "https://www.baidu.com",
  timeout: 1000,
});

server.get("/").then((res) => {
  console.log(res.data);
});
