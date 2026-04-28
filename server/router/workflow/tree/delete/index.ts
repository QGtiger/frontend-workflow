import { and, eq, inArray } from "drizzle-orm";
import { workflowDirectoryTable } from "../../../../schema/index.js";
import { withCommonParams } from "../../../../utils/withCommonParams.js";

/**
 * 递归获取所有子节点的 key
 */
async function getAllDescendantKeys(
  db: any,
  userId: number,
  parentKey: string
): Promise<string[]> {
  const children = await db
    .select({ key: workflowDirectoryTable.key })
    .from(workflowDirectoryTable)
    .where(
      and(
        eq(workflowDirectoryTable.userId, userId),
        eq(workflowDirectoryTable.parentKey, parentKey)
      )
    );

  const keys: string[] = [];
  for (const child of children) {
    keys.push(child.key);
    const descendantKeys = await getAllDescendantKeys(db, userId, child.key);
    keys.push(...descendantKeys);
  }
  return keys;
}

export default withCommonParams(async ({ userId, db }, c) => {
  const body = await c.req.json();
  const { key } = body;

  if (!key) {
    throw new Error("key is required");
  }

  // 获取所有子节点 key（包含自身）
  const descendantKeys = await getAllDescendantKeys(db, userId, key);
  const allKeys = [key, ...descendantKeys];

  // 批量删除
  await db
    .delete(workflowDirectoryTable)
    .where(
      and(
        eq(workflowDirectoryTable.userId, userId),
        inArray(workflowDirectoryTable.key, allKeys)
      )
    );

  return { message: "ok" };
});
