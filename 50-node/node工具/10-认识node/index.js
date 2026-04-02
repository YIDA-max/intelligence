const os = require("os");

console.log(os.platform(), "操作系统平台");
console.log(os.arch(), "操作系统架构");
console.log(os.freemem(), "空闲内存");
console.log(os.totalmem(), "总内存");
console.log(os.homedir(), "用户主目录");
console.log(os.tmpdir(), "临时文件目录");
console.log(os.hostname(), "主机名");
console.log(os.networkInterfaces(), "网络接口");
console.log(os.type(), "操作系统类型");
console.log(os.version(), "操作系统版本");
console.log(os.uptime(), "系统运行时间");
