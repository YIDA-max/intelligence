# Excel 文件对比工具

## 📋 功能说明

对比两个 Excel 文件（a.xlsx 和 b.xlsx）的内容，找出差异并以对象数组的方式输出结果。

## 🚀 使用方法

### 1. 安装依赖

```bash
npm install xlsx
```

或者如果项目根目录已有 node_modules，可以直接使用。

### 2. 准备文件

将需要对比的两个 Excel 文件放在此目录下，重命名为：

- `a.xlsx` - 第一个文件
- `b.xlsx` - 第二个文件

### 3. 运行脚本

```bash
node code.js
```

### 4. 查看结果

结果会保存到 `result.json` 文件中，包含：

```json
{
  "summary": {
    "totalA": 10,        // 文件 A 总行数
    "totalB": 12,        // 文件 B 总行数
    "onlyInA": 2,        // 只在 A 中存在的行数
    "onlyInB": 4,        // 只在 B 中存在的行数
    "bothExist": 8,      // 两边都存在且相同的行数
    "different": 0       // 两边都存在但不同的行数
  },
  "onlyInA": [           // 只在 A 中存在的行（对象数组）
    {
      "key": "唯一标识",
      "rowIndex": 1,
      "data": { ... }
    }
  ],
  "onlyInB": [           // 只在 B 中存在的行（对象数组）
    ...
  ],
  "bothExist": [         // 两边都存在且相同的行（对象数组）
    {
      "key": "唯一标识",
      "rowIndexA": 1,
      "rowIndexB": 2,
      "data": { ... }
    }
  ],
  "different": [         // 两边都存在但不同的行（对象数组）
    {
      "key": "唯一标识",
      "rowIndexA": 1,
      "rowIndexB": 2,
      "dataA": { ... },
      "dataB": { ... },
      "diffFields": [     // 不同的字段
        {
          "field": "字段名",
          "valueA": "A 文件的值",
          "valueB": "B 文件的值"
        }
      ]
    }
  ]
}
```

## 📝 注意事项

1. 脚本会自动识别 Excel 文件中的唯一标识字段（如：订单号、orderNo、订单编号、id 等）
2. 如果没有唯一标识字段，会使用整行数据作为标识
3. 对比时会忽略字段名的大小写和前后空格
4. 结果以对象数组的形式输出，方便后续处理

## 🔍 输出说明

- **summary**: 汇总信息
- **onlyInA**: 只在文件 A 中存在的行（对象数组）
- **onlyInB**: 只在文件 B 中存在的行（对象数组）
- **bothExist**: 两边都存在且内容相同的行（对象数组）
- **different**: 两边都存在但内容不同的行（对象数组，包含差异字段详情）
