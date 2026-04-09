// fetch 是新出的自带的网络请求原生功能
fetch("https://www.baidu.com")
  .then((res) => {
    // 1. 先把响应流转换成文本格式
    return res.text();
  })
  .then((data) => {
    // 2. 这里才是真正的网页 HTML 内容！
    console.log(data);
  });
