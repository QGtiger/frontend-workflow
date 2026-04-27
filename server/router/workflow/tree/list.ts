import { asc, eq } from "drizzle-orm";
import { workflowDirectoryTable } from "../../../schema/index.js";
import { withCommonParams } from "../../../utils/withCommonParams.js";

/**
 * 构建树形结构
 */
function buildTree(
  items: Array<{
    title: string;
    key: string;
    parentKey: string | null;
    type: string;
  }>,
  parentKey: string | null = null
): Array<{
  title: string;
  key: string;
  type: string;
  children?: any[];
}> {
  return items
    .filter((item) => item.parentKey === parentKey)
    .map((item) => {
      const children = buildTree(items, item.key);
      if (children.length > 0) {
        return { title: item.title, key: item.key, type: item.type, children };
      }
      return { title: item.title, key: item.key, type: item.type };
    });
}

export default withCommonParams(async ({ userId, db }) => {
  const allNodes = await db
    .select({
      title: workflowDirectoryTable.title,
      key: workflowDirectoryTable.key,
      parentKey: workflowDirectoryTable.parentKey,
      type: workflowDirectoryTable.type,
    })
    .from(workflowDirectoryTable)
    .where(eq(workflowDirectoryTable.userId, userId))
    .orderBy(asc(workflowDirectoryTable.createdAt));

  return buildTree(allNodes);
});
