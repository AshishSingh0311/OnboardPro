import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Dataset model
export const datasets = pgTable("datasets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  files: json("files").notNull().$type<Array<{
    originalname: string;
    filename: string;
    path: string;
    size: number;
    mimetype: string;
  }>>(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  processed: boolean("processed").default(false),
  processedAt: timestamp("processed_at"),
});

export const insertDatasetSchema = createInsertSchema(datasets).pick({
  name: true,
  description: true,
  files: true,
  processed: true,
});

export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type Dataset = typeof datasets.$inferSelect;

// Analysis Result model
export const analysisResults = pgTable("analysis_results", {
  id: serial("id").primaryKey(),
  datasetId: integer("dataset_id").notNull(),
  prediction: text("prediction").notNull(),
  confidence: json("confidence").notNull().$type<number>(),
  severity: json("severity").notNull().$type<number>(),
  modelOutput: json("model_output"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalysisResultSchema = createInsertSchema(analysisResults).pick({
  datasetId: true,
  prediction: true,
  confidence: true,
  severity: true,
  modelOutput: true,
});

export type InsertAnalysisResult = z.infer<typeof insertAnalysisResultSchema>;
export type AnalysisResult = typeof analysisResults.$inferSelect;

// Recommendations model
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  analysisId: integer("analysis_id").notNull(),
  therapyRecommendations: json("therapy_recommendations").notNull().$type<Array<{
    type: string;
    description: string;
    confidence: number;
    expectedBenefits?: string[];
  }>>(),
  specialistReferrals: json("specialist_referrals").notNull().$type<Array<{
    type: string;
    description: string;
    urgency: number;
    rationale: string;
  }>>(),
  wellnessTips: json("wellness_tips").notNull().$type<Array<{
    category: string;
    title: string;
    description: string;
    icon: string;
  }>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRecommendationsSchema = createInsertSchema(recommendations).pick({
  analysisId: true,
  therapyRecommendations: true,
  specialistReferrals: true,
  wellnessTips: true,
});

export type InsertRecommendations = z.infer<typeof insertRecommendationsSchema>;
export type Recommendations = typeof recommendations.$inferSelect;
