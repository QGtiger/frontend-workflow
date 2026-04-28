import { and, eq } from "drizzle-orm";
import { workflowDirectoryTable } from "../../../../schema/index.js";
import { withCommonParams } from "../../../../utils/withCommonParams.js";

export default withCommonParams(async ({ userId, db }, c) => {
  const body = await c.req.json();
  const { key, title, parentKey, type } = body;

  if (!key) {
    throw new Error("key is required");
  }

  const updateData: Record<string, any> = {};

  if (title !== undefined) {
    updateData.title = title;
  }
  if (parentKey !== undefined) {
    updateData.parentKey = parentKey;
  }
  if (type !== undefined) {
    if (type !== "folder" && type !== "workflow") {
      throw new Error("type must be 'folder' or 'workflow'");
    }
    updateData.type = type;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("No fields to update");
  }

  await db
    .update(workflowDirectoryTable)
    .set(updateData)
    .where(
      and(
        eq(workflowDirectoryTable.userId, userId),
        eq(workflowDirectoryTable.key, key)
      )
    );

  return { message: "ok" };
});
