import { customAlphabet } from "nanoid";
import {
  workflowDirectoryTable,
  workflowMetaTable,
} from "../../../../schema/index.js";
import { withCommonParams } from "../../../../utils/withCommonParams.js";

// 纯数字随机 key，浏览器友好
const generateKey = customAlphabet("0123456789", 16);

export const method = "POST";

export default withCommonParams(async ({ userId, db }, c) => {
  const body = await c.req.json();
  const { title, parentKey, type, name, description, meta } = body;

  if (!title) {
    throw new Error("title is required");
  }

  const nodeType = type === "workflow" ? "workflow" : "folder";
  const newKey = generateKey();

  // 插入目录树记录
  await db.insert(workflowDirectoryTable).values({
    userId,
    title,
    key: newKey,
    parentKey: parentKey || null,
    type: nodeType,
  });

  // 如果是 workflow 类型，同时插入 meta 数据
  if (nodeType === "workflow") {
    const now = new Date();
    await db.insert(workflowMetaTable).values({
      userId,
      workflowKey: newKey,
      name: name ?? title,
      description: description ?? "",
      meta: meta ?? [],
      createdAt: now,
      updatedAt: now,
    });
  }

  return { title, key: newKey, parentKey: parentKey || null, type: nodeType };
});
