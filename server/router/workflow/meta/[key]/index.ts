import { and, eq } from "drizzle-orm";
import type { ContextWithDb } from "@lightfish/server";
import {
  workflowMetaTable,
  workflowDirectoryTable,
} from "../../../../schema/index.js";
import { withCommonParams } from "../../../../utils/withCommonParams.js";

export const method = ["GET", "PUT"];

const handler = withCommonParams(async ({ userId, db }, c) => {
  const { key } = c.get("params");

  if (!key) {
    throw new Error("key is required");
  }

  if (c.req.method === "PUT") {
    return await handleUpdate(userId, db, key, c);
  }

  return await handleGet(userId, db, key);
});

async function handleGet(userId: number, db: any, key: string) {
  const result = await db
    .select({
      workflowKey: workflowMetaTable.workflowKey,
      name: workflowMetaTable.name,
      description: workflowMetaTable.description,
      meta: workflowMetaTable.meta,
    })
    .from(workflowMetaTable)
    .where(
      and(
        eq(workflowMetaTable.userId, userId),
        eq(workflowMetaTable.workflowKey, key),
      ),
    )
    .limit(1);

  if (result.length === 0) {
    return { workflowKey: key, name: "", description: "", meta: [] };
  }

  return result[0];
}

async function handleUpdate(
  userId: number,
  db: any,
  key: string,
  c: ContextWithDb,
) {
  const body = await c.req.json();
  const { name, description, meta } = body;

  // 使用 upsert 逻辑：存在则更新，不存在则插入
  const now = new Date();

  await db
    .insert(workflowMetaTable)
    .values({
      userId,
      workflowKey: key,
      name: name ?? "",
      description: description ?? "",
      meta: meta ?? [],
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: workflowMetaTable.workflowKey,
      set: {
        name: name ?? "",
        description: description ?? "",
        meta: meta ?? [],
        updatedAt: now,
      },
    });

  // 如果传了 name，同步更新 workflow_directory 的 title
  if (name !== undefined) {
    await db
      .update(workflowDirectoryTable)
      .set({ title: name, updatedAt: now })
      .where(
        and(
          eq(workflowDirectoryTable.userId, userId),
          eq(workflowDirectoryTable.key, key),
        ),
      );
  }

  return { message: "ok" };
}

export default handler;
