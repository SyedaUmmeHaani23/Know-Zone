import { 
  users, colleges, forumPosts, questions, questionAnswers, 
  opportunities, lostFound, busRoutes, chatMessages, notifications,
  type User, type InsertUser, type College, type InsertCollege,
  type ForumPost, type InsertForumPost, type Question, type InsertQuestion,
  type QuestionAnswer, type InsertQuestionAnswer, type Opportunity, type InsertOpportunity,
  type LostFound, type InsertLostFound, type BusRoute, type InsertBusRoute,
  type ChatMessage, type InsertChatMessage, type Notification, type InsertNotification
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getUsersByCollege(collegeId: string): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;

  // Colleges
  getCollege(id: string): Promise<College | undefined>;
  getAllColleges(): Promise<College[]>;
  createCollege(college: InsertCollege): Promise<College>;
  updateCollege(id: string, updates: Partial<College>): Promise<College | undefined>;

  // Forum Posts
  getForumPost(id: number): Promise<ForumPost | undefined>;
  getForumPostsByForum(forumName: string): Promise<ForumPost[]>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  updateForumPost(id: number, updates: Partial<ForumPost>): Promise<ForumPost | undefined>;
  deleteForumPost(id: number): Promise<boolean>;

  // Questions
  getQuestion(id: number): Promise<Question | undefined>;
  getQuestionsByTarget(targetRole: string): Promise<Question[]>;
  getQuestionsByUser(userUid: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: number, updates: Partial<Question>): Promise<Question | undefined>;

  // Question Answers
  getAnswersByQuestion(questionId: number): Promise<QuestionAnswer[]>;
  createQuestionAnswer(answer: InsertQuestionAnswer): Promise<QuestionAnswer>;
  updateQuestionAnswer(id: number, updates: Partial<QuestionAnswer>): Promise<QuestionAnswer | undefined>;

  // Opportunities
  getOpportunity(id: number): Promise<Opportunity | undefined>;
  getAllOpportunities(): Promise<Opportunity[]>;
  getOpportunitiesByType(type: string): Promise<Opportunity[]>;
  createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity>;
  updateOpportunity(id: number, updates: Partial<Opportunity>): Promise<Opportunity | undefined>;

  // Lost & Found
  getLostFoundItem(id: number): Promise<LostFound | undefined>;
  getAllLostFoundItems(): Promise<LostFound[]>;
  getLostFoundByType(type: string): Promise<LostFound[]>;
  createLostFoundItem(item: InsertLostFound): Promise<LostFound>;
  updateLostFoundItem(id: number, updates: Partial<LostFound>): Promise<LostFound | undefined>;

  // Bus Routes
  getBusRoute(id: string): Promise<BusRoute | undefined>;
  getAllBusRoutes(): Promise<BusRoute[]>;
  createBusRoute(route: InsertBusRoute): Promise<BusRoute>;
  updateBusRoute(id: string, updates: Partial<BusRoute>): Promise<BusRoute | undefined>;

  // Chat Messages
  getChatMessagesByUser(userId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Notifications
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private colleges: Map<string, College> = new Map();
  private forumPosts: Map<number, ForumPost> = new Map();
  private questions: Map<number, Question> = new Map();
  private questionAnswers: Map<number, QuestionAnswer> = new Map();
  private opportunities: Map<number, Opportunity> = new Map();
  private lostFound: Map<number, LostFound> = new Map();
  private busRoutes: Map<string, BusRoute> = new Map();
  private chatMessages: Map<number, ChatMessage> = new Map();
  private notifications: Map<number, Notification> = new Map();
  
  private currentUserId = 1;
  private currentForumPostId = 1;
  private currentQuestionId = 1;
  private currentQuestionAnswerId = 1;
  private currentOpportunityId = 1;
  private currentLostFoundId = 1;
  private currentChatMessageId = 1;
  private currentNotificationId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Sample colleges
    const sampleColleges: College[] = [
      {
        id: "vit-vellore",
        name: "VIT University",
        city: "Vellore",
        type: "Private",
        forums: ["VIT Forum", "South Zone Tech Forum", "All India Forum"],
        activeUsers: [],
        createdAt: new Date(),
      },
      {
        id: "iit-bangalore",
        name: "Indian Institute of Technology",
        city: "Bangalore",
        type: "Government",
        forums: ["IIT Forum", "South Zone Tech Forum", "All India Forum"],
        activeUsers: [],
        createdAt: new Date(),
      },
      {
        id: "vtu-bangalore",
        name: "Visvesvaraya Technological University",
        city: "Bangalore",
        type: "VTU",
        forums: ["VTU Forum", "South Zone Tech Forum", "All India Forum"],
        activeUsers: [],
        createdAt: new Date(),
      },
    ];

    sampleColleges.forEach(college => {
      this.colleges.set(college.id, college);
    });

    // Sample bus routes
    const sampleBusRoutes: BusRoute[] = [
      {
        id: "BUS01",
        route: "Electronic City - VIT Campus",
        driverName: "Ravi Kumar",
        driverContact: "+91 9876543210",
        gpsLiveLink: "https://maps.google.com/live-tracking-link-1",
        timings: { start: "7:30 AM", end: "5:30 PM" },
        studentIds: [],
        facultyIds: [],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "BUS02", 
        route: "Whitefield - VIT Campus",
        driverName: "Suresh Reddy",
        driverContact: "+91 9876543211",
        gpsLiveLink: "https://maps.google.com/live-tracking-link-2",
        timings: { start: "7:45 AM", end: "5:45 PM" },
        studentIds: [],
        facultyIds: [],
        isActive: true,
        createdAt: new Date(),
      },
    ];

    sampleBusRoutes.forEach(route => {
      this.busRoutes.set(route.id, route);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.firebaseUid === firebaseUid);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      status: insertUser.status || null,
      usn: insertUser.usn || null,
      batch: insertUser.batch || null,
      year: insertUser.year || null,
      linkedinUrl: insertUser.linkedinUrl || null,
      busId: insertUser.busId || null,
      employeeId: insertUser.employeeId || null,
      profileImage: insertUser.profileImage || null,
      designation: insertUser.designation || null,
      subjects: insertUser.subjects || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUsersByCollege(collegeId: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.collegeId === collegeId);
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  // College methods
  async getCollege(id: string): Promise<College | undefined> {
    return this.colleges.get(id);
  }

  async getAllColleges(): Promise<College[]> {
    return Array.from(this.colleges.values());
  }

  async createCollege(insertCollege: InsertCollege): Promise<College> {
    const college: College = {
      ...insertCollege,
      activeUsers: insertCollege.activeUsers || null,
      createdAt: new Date(),
    };
    this.colleges.set(college.id, college);
    return college;
  }

  async updateCollege(id: string, updates: Partial<College>): Promise<College | undefined> {
    const college = this.colleges.get(id);
    if (!college) return undefined;

    const updatedCollege = { ...college, ...updates };
    this.colleges.set(id, updatedCollege);
    return updatedCollege;
  }

  // Forum Post methods
  async getForumPost(id: number): Promise<ForumPost | undefined> {
    return this.forumPosts.get(id);
  }

  async getForumPostsByForum(forumName: string): Promise<ForumPost[]> {
    return Array.from(this.forumPosts.values()).filter(post => post.forumName === forumName);
  }

  async createForumPost(insertPost: InsertForumPost): Promise<ForumPost> {
    const id = this.currentForumPostId++;
    const post: ForumPost = {
      ...insertPost,
      id,
      tags: insertPost.tags || null,
      likes: null,
      replies: null,
      isAnonymous: insertPost.isAnonymous || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.forumPosts.set(id, post);
    return post;
  }

  async updateForumPost(id: number, updates: Partial<ForumPost>): Promise<ForumPost | undefined> {
    const post = this.forumPosts.get(id);
    if (!post) return undefined;

    const updatedPost = { ...post, ...updates, updatedAt: new Date() };
    this.forumPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteForumPost(id: number): Promise<boolean> {
    return this.forumPosts.delete(id);
  }

  // Question methods
  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getQuestionsByTarget(targetRole: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(q => q.targetRole === targetRole || q.targetRole === 'any');
  }

  async getQuestionsByUser(userUid: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(q => q.askerUid === userUid);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.currentQuestionId++;
    const question: Question = {
      ...insertQuestion,
      id,
      tags: insertQuestion.tags || null,
      isAnonymous: insertQuestion.isAnonymous || null,
      isAnswered: null,
      upvotes: null,
      createdAt: new Date(),
    };
    this.questions.set(id, question);
    return question;
  }

  async updateQuestion(id: number, updates: Partial<Question>): Promise<Question | undefined> {
    const question = this.questions.get(id);
    if (!question) return undefined;

    const updatedQuestion = { ...question, ...updates };
    this.questions.set(id, updatedQuestion);
    return updatedQuestion;
  }

  // Question Answer methods
  async getAnswersByQuestion(questionId: number): Promise<QuestionAnswer[]> {
    return Array.from(this.questionAnswers.values()).filter(a => a.questionId === questionId);
  }

  async createQuestionAnswer(insertAnswer: InsertQuestionAnswer): Promise<QuestionAnswer> {
    const id = this.currentQuestionAnswerId++;
    const answer: QuestionAnswer = {
      ...insertAnswer,
      id,
      upvotes: 0,
      isVerified: false,
      createdAt: new Date(),
    };
    this.questionAnswers.set(id, answer);
    return answer;
  }

  async updateQuestionAnswer(id: number, updates: Partial<QuestionAnswer>): Promise<QuestionAnswer | undefined> {
    const answer = this.questionAnswers.get(id);
    if (!answer) return undefined;

    const updatedAnswer = { ...answer, ...updates };
    this.questionAnswers.set(id, updatedAnswer);
    return updatedAnswer;
  }

  // Opportunity methods
  async getOpportunity(id: number): Promise<Opportunity | undefined> {
    return this.opportunities.get(id);
  }

  async getAllOpportunities(): Promise<Opportunity[]> {
    return Array.from(this.opportunities.values()).filter(opp => opp.isActive);
  }

  async getOpportunitiesByType(type: string): Promise<Opportunity[]> {
    return Array.from(this.opportunities.values()).filter(opp => opp.type === type && opp.isActive);
  }

  async createOpportunity(insertOpportunity: InsertOpportunity): Promise<Opportunity> {
    const id = this.currentOpportunityId++;
    const opportunity: Opportunity = {
      ...insertOpportunity,
      id,
      tags: insertOpportunity.tags || null,
      company: insertOpportunity.company || null,
      location: insertOpportunity.location || null,
      deadline: insertOpportunity.deadline || null,
      requirements: insertOpportunity.requirements || null,
      postedBy: insertOpportunity.postedBy || null,
      isActive: null,
      createdAt: new Date(),
    };
    this.opportunities.set(id, opportunity);
    return opportunity;
  }

  async updateOpportunity(id: number, updates: Partial<Opportunity>): Promise<Opportunity | undefined> {
    const opportunity = this.opportunities.get(id);
    if (!opportunity) return undefined;

    const updatedOpportunity = { ...opportunity, ...updates };
    this.opportunities.set(id, updatedOpportunity);
    return updatedOpportunity;
  }

  // Lost & Found methods
  async getLostFoundItem(id: number): Promise<LostFound | undefined> {
    return this.lostFound.get(id);
  }

  async getAllLostFoundItems(): Promise<LostFound[]> {
    return Array.from(this.lostFound.values()).filter(item => !item.isResolved);
  }

  async getLostFoundByType(type: string): Promise<LostFound[]> {
    return Array.from(this.lostFound.values()).filter(item => item.type === type && !item.isResolved);
  }

  async createLostFoundItem(insertItem: InsertLostFound): Promise<LostFound> {
    const id = this.currentLostFoundId++;
    const item: LostFound = {
      ...insertItem,
      id,
      location: insertItem.location || null,
      images: insertItem.images || null,
      isResolved: null,
      createdAt: new Date(),
    };
    this.lostFound.set(id, item);
    return item;
  }

  async updateLostFoundItem(id: number, updates: Partial<LostFound>): Promise<LostFound | undefined> {
    const item = this.lostFound.get(id);
    if (!item) return undefined;

    const updatedItem = { ...item, ...updates };
    this.lostFound.set(id, updatedItem);
    return updatedItem;
  }

  // Bus Route methods
  async getBusRoute(id: string): Promise<BusRoute | undefined> {
    return this.busRoutes.get(id);
  }

  async getAllBusRoutes(): Promise<BusRoute[]> {
    return Array.from(this.busRoutes.values()).filter(route => route.isActive);
  }

  async createBusRoute(insertRoute: InsertBusRoute): Promise<BusRoute> {
    const route: BusRoute = {
      ...insertRoute,
      driverContact: insertRoute.driverContact || null,
      gpsLiveLink: insertRoute.gpsLiveLink || null,
      studentIds: insertRoute.studentIds || null,
      facultyIds: insertRoute.facultyIds || null,
      timings: insertRoute.timings || {},
      isActive: null,
      createdAt: new Date(),
    };
    this.busRoutes.set(route.id, route);
    return route;
  }

  async updateBusRoute(id: string, updates: Partial<BusRoute>): Promise<BusRoute | undefined> {
    const route = this.busRoutes.get(id);
    if (!route) return undefined;

    const updatedRoute = { ...route, ...updates };
    this.busRoutes.set(id, updatedRoute);
    return updatedRoute;
  }

  // Chat Message methods
  async getChatMessagesByUser(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(msg => msg.userId === userId);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const message: ChatMessage = {
      ...insertMessage,
      id,
      context: insertMessage.context || null,
      isHelpful: insertMessage.isHelpful || null,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  // Notification methods
  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(notif => notif.userId === userId);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.currentNotificationId++;
    const notification: Notification = {
      ...insertNotification,
      id,
      data: insertNotification.data || {},
      isRead: null,
      createdAt: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;

    notification.isRead = true;
    this.notifications.set(id, notification);
    return true;
  }
}

export const storage = new MemStorage();
