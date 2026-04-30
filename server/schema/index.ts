import {
  pgSchema,
  integer,
  varchar,
  timestamp,
  text,
  jsonb,
} from "drizzle-orm/pg-core";

// 使用应用名称作为schema前缀
const appSchema = pgSchema("frontend-workflow");

/**
 * Workflow 目录树表
 * 用于存储 workflow 的目录结构，支持多级嵌套
 * type: 'folder' - 文件夹，'workflow' - 工作流文件（可通过 key 路由跳转）
 */
export const workflowDirectoryTable = appSchema.table("workflow_directory", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull(), // 用户ID，用于隔离不同用户的目录
  title: varchar({ length: 255 }).notNull(),
  key: varchar({ length: 255 }).notNull().unique(),
  parentKey: varchar({ length: 255 }), // 父节点 key，null 表示根节点
  type: varchar({ length: 20 }).notNull().default("folder"), // 'folder' | 'workflow'
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

/**
 * Workflow Meta 数据表
 * 用于存储 workflow 的节点编排数据（meta JSON）
 * 一个 workflow 对应一条记录，通过 workflowKey 关联 workflow_directory
 */
export const workflowMetaTable = appSchema.table("workflow_meta", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull(),
  workflowKey: varchar({ length: 255 }).notNull().unique(), // 关联 workflow_directory.key
  name: varchar({ length: 255 }).notNull().default(""),
  description: text().notNull().default(""),
  meta: jsonb().notNull().default([]), // 节点编排数据 JSON 数组
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});
