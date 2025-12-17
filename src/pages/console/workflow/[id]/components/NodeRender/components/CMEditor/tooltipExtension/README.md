[1 tool called]

## `CompletionContext` API 详解

### 构造函数签名

```typescript
new CompletionContext(state: EditorState, pos: number, explicit: boolean)
```

### 参数说明

| 参数       | 类型          | 说明                                                  |
| ---------- | ------------- | ----------------------------------------------------- |
| `state`    | `EditorState` | 编辑器状态                                            |
| `pos`      | `number`      | **光标位置**（文档中的绝对位置，从 0 开始）           |
| `explicit` | `boolean`     | 是否显式触发（`true` = 手动触发，`false` = 自动触发） |

### `pos` 的作用

`pos` 决定了：

1. **在哪个位置查找补全**：补全源会根据 `pos` 前后的文本来决定返回什么选项
2. **`matchBefore()` 的参照点**：所有正则匹配都以 `pos` 为终点

---

## 示例案例

假设文档内容为：`{{ DateTime.form }}`

```
位置:  0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18
字符:  {  {     D  a  t  e  T  i  m  e  .  f  o  r  m     }  }
```

### 场景 1：用户正在输入 `form`，光标在 `m` 后面

```typescript
// pos = 16（光标在 "form" 的 m 后面）
const context = new CompletionContext(state, 16, true);

// 在补全源中使用 matchBefore
context.matchBefore(/DateTime\.(\w*)/);
// 匹配结果: { from: 3, to: 16, text: "DateTime.form" }
```

### 场景 2：获取 `DateTime.` 后的方法补全

```typescript
// 用户刚输入了 "."，光标在 "." 后面
// pos = 12
const context = new CompletionContext(state, 12, true);

context.matchBefore(/DateTime\./);
// 匹配结果: { from: 3, to: 12, text: "DateTime." }
```

---

## 当前代码中的 `pos` 计算

```typescript
// 第 153-156 行
const methodPos =
  callee.name === "MemberExpression"
    ? offset + (callee.lastChild?.to ?? callee.to) // "." 后方法名结束位置
    : offset + callee.to;
```

### 图解

```
文档: {{ DateTime.format() }}
        |         |     |
     offset    callee  methodPos
        2         .lastChild.to = 17

methodPos = 2 + 15 = 17（指向 "format" 的 't' 后面）
```

### 为什么用这个位置？

因为 `datatypeCompletions` 中的正则是：

```typescript
/DateTime\.(.*)/; // 匹配 "DateTime." 后的内容
```

所以 `pos` 需要在**方法名结束处**，这样 `matchBefore` 才能正确匹配到 `DateTime.format`。

---

## 调试建议

可以加日志查看：

```typescript
function getCompletion(state, pos, filter) {
  console.log("getCompletion pos:", pos);
  console.log(
    "doc around pos:",
    state.doc.sliceString(Math.max(0, pos - 20), pos + 5)
  );

  const context = new CompletionContext(state, pos, true);
  // ...
}
```
