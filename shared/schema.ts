import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with role-based fields
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull(), // "student", "alumni", "faculty"
  collegeId: text("college_id").notNull(),
  department: text("department").notNull(),
  branch: text("branch").notNull(),
  
  // Student/Alumni specific fields
  usn: text("usn"),
  batch: text("batch"),
  year: text("year"),
  status: text("status"), // "current", "alumni"
  
  // Faculty specific fields
  employeeId: text("employee_id"),
  designation: text("designation"),
  experience: integer("experience"),
  subjects: text("subjects").array(),
  
  // Common optional fields
  linkedinUrl: text("linkedin_url"),
  profileImage: text("profile_image"),
  busId: text("bus_id"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Colleges table
export const colleges = pgTable("colleges", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  type: text("type").notNull(), // "VTU", "Autonomous", "Government", "Private"
  forums: text("forums").array().notNull(),
  activeUsers: text("active_users").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Forum posts table
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  forumName: text("forum_name").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  tags: text("tags").array(),
  likes: integer("likes").default(0),
  replies: integer("replies").default(0),
  isAnonymous: boolean("is_anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Questions for MentorConnect
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  askerUid: text("asker_uid").notNull(),
  targetRole: text("target_role").notNull(), // "senior", "faculty", "any"
  isAnonymous: boolean("is_anonymous").default(false),
  isAnswered: boolean("is_answered").default(false),
  tags: text("tags").array(),
  upvotes: integer("upvotes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Question answers
export const questionAnswers = pgTable("question_answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => questions.id).notNull(),
  answererUid: text("answerer_uid").notNull(),
  answer: text("answer").notNull(),
  upvotes: integer("upvotes").default(0),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Opportunities table
export const opportunities = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "internship", "hackathon", "event", "job"
  company: text("company"),
  location: text("location"),
  deadline: timestamp("deadline"),
  requirements: text("requirements").array(),
  tags: text("tags").array(),
  postedBy: integer("posted_by").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Lost and Found items
export const lostFound = pgTable("lost_found", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "lost", "found"
  category: text("category").notNull(),
  location: text("location"),
  contactInfo: text("contact_info").notNull(),
  images: text("images").array(),
  postedBy: integer("posted_by").references(() => users.id).notNull(),
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bus routes for tracking
export const busRoutes = pgTable("bus_routes", {
  id: text("id").primaryKey(),
  route: text("route").notNull(),
  driverName: text("driver_name").notNull(),
  driverContact: text("driver_contact"),
  gpsLiveLink: text("gps_live_link"),
  timings: jsonb("timings"),
  studentIds: text("student_ids").array(),
  facultyIds: text("faculty_ids").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Chat messages for Gemini AI
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  userMessage: text("user_message").notNull(),
  aiResponse: text("ai_response").notNull(),
  context: text("context"), // Additional context for the conversation
  isHelpful: boolean("is_helpful"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: text("type").notNull(), // "opportunity", "forum", "mentor", "system"
  data: jsonb("data"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCollegeSchema = createInsertSchema(colleges).omit({
  createdAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  likes: true,
  replies: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  isAnswered: true,
  upvotes: true,
  createdAt: true,
});

export const insertQuestionAnswerSchema = createInsertSchema(questionAnswers).omit({
  id: true,
  upvotes: true,
  isVerified: true,
  createdAt: true,
});

export const insertOpportunitySchema = createInsertSchema(opportunities).omit({
  id: true,
  isActive: true,
  createdAt: true,
});

export const insertLostFoundSchema = createInsertSchema(lostFound).omit({
  id: true,
  isResolved: true,
  createdAt: true,
});

export const insertBusRouteSchema = createInsertSchema(busRoutes).omit({
  isActive: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type College = typeof colleges.$inferSelect;
export type InsertCollege = z.infer<typeof insertCollegeSchema>;

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type QuestionAnswer = typeof questionAnswers.$inferSelect;
export type InsertQuestionAnswer = z.infer<typeof insertQuestionAnswerSchema>;

export type Opportunity = typeof opportunities.$inferSelect;
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;

export type LostFound = typeof lostFound.$inferSelect;
export type InsertLostFound = z.infer<typeof insertLostFoundSchema>;

export type BusRoute = typeof busRoutes.$inferSelect;
export type InsertBusRoute = z.infer<typeof insertBusRouteSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
