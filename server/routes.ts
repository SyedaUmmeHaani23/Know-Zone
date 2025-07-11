import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getAIResponse, getOpportunityRecommendations, generateSmartNotification } from "./services/gemini";
import { verifyIdToken } from "./services/firebase";
import { 
  insertUserSchema, insertCollegeSchema, insertForumPostSchema, 
  insertQuestionSchema, insertQuestionAnswerSchema, insertOpportunitySchema,
  insertLostFoundSchema, insertBusRouteSchema, insertChatMessageSchema,
  insertNotificationSchema,
  type User
} from "@shared/schema";
import { z } from "zod";

// Middleware to verify Firebase token
async function authenticateUser(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const idToken = authHeader.split(' ')[1];
  try {
    const decodedToken = await verifyIdToken(idToken);
    const user = await storage.getUserByFirebaseUid(decodedToken.uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByFirebaseUid(userData.firebaseUid);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({ error: 'Invalid user data' });
    }
  });

  app.get("/api/auth/me", authenticateUser, async (req: any, res: any) => {
    res.json(req.user);
  });

  // College routes
  app.get("/api/colleges", async (req, res) => {
    try {
      const colleges = await storage.getAllColleges();
      res.json(colleges);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch colleges' });
    }
  });

  app.post("/api/colleges", authenticateUser, async (req: any, res: any) => {
    try {
      const collegeData = insertCollegeSchema.parse(req.body);
      const college = await storage.createCollege(collegeData);
      res.json(college);
    } catch (error) {
      res.status(400).json({ error: 'Invalid college data' });
    }
  });

  // Chat routes
  app.post("/api/chat", authenticateUser, async (req: any, res: any) => {
    try {
      const { message, context } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const aiResponse = await getAIResponse(message, context);
      
      // Save chat message
      const chatMessage = await storage.createChatMessage({
        userId: req.user.id,
        userMessage: message,
        aiResponse,
        context,
      });

      res.json({ response: aiResponse, messageId: chatMessage.id });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to get AI response' });
    }
  });

  app.get("/api/chat/history", authenticateUser, async (req: any, res: any) => {
    try {
      const messages = await storage.getChatMessagesByUser(req.user.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat history' });
    }
  });

  // Forum routes
  app.get("/api/forums/:forumName/posts", async (req, res) => {
    try {
      const { forumName } = req.params;
      const posts = await storage.getForumPostsByForum(decodeURIComponent(forumName));
      
      // Get author information for each post
      const postsWithAuthors = await Promise.all(
        posts.map(async (post) => {
          const author = await storage.getUser(post.authorId);
          return {
            ...post,
            author: author ? {
              id: author.id,
              name: author.name,
              role: author.role,
              department: author.department,
              profileImage: author.profileImage,
            } : null,
          };
        })
      );

      res.json(postsWithAuthors);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch forum posts' });
    }
  });

  app.post("/api/forums/posts", authenticateUser, async (req, res) => {
    try {
      const postData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost({
        ...postData,
        authorId: req.user.id,
      });
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: 'Invalid post data' });
    }
  });

  app.put("/api/forums/posts/:id/like", authenticateUser, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getForumPost(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const updatedPost = await storage.updateForumPost(postId, {
        likes: (post.likes || 0) + 1,
      });
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: 'Failed to like post' });
    }
  });

  // Question routes
  app.get("/api/questions", async (req, res) => {
    try {
      const { targetRole } = req.query;
      let questions;
      
      if (targetRole) {
        questions = await storage.getQuestionsByTarget(targetRole as string);
      } else {
        questions = await storage.getQuestionsByTarget('any');
      }

      // Get asker information for non-anonymous questions
      const questionsWithDetails = await Promise.all(
        questions.map(async (question) => {
          let asker = null;
          if (!question.isAnonymous) {
            const user = await storage.getUserByFirebaseUid(question.askerUid);
            if (user) {
              asker = {
                name: user.name,
                role: user.role,
                department: user.department,
                profileImage: user.profileImage,
              };
            }
          }

          const answers = await storage.getAnswersByQuestion(question.id);
          return { ...question, asker, answerCount: answers.length };
        })
      );

      res.json(questionsWithDetails);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  });

  app.post("/api/questions", authenticateUser, async (req, res) => {
    try {
      const questionData = insertQuestionSchema.parse(req.body);
      const question = await storage.createQuestion({
        ...questionData,
        askerUid: req.user.firebaseUid,
      });
      res.json(question);
    } catch (error) {
      res.status(400).json({ error: 'Invalid question data' });
    }
  });

  app.get("/api/questions/:id/answers", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const answers = await storage.getAnswersByQuestion(questionId);
      
      // Get answerer information
      const answersWithDetails = await Promise.all(
        answers.map(async (answer) => {
          const user = await storage.getUserByFirebaseUid(answer.answererUid);
          return {
            ...answer,
            answerer: user ? {
              name: user.name,
              role: user.role,
              department: user.department,
              profileImage: user.profileImage,
            } : null,
          };
        })
      );

      res.json(answersWithDetails);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch answers' });
    }
  });

  app.post("/api/questions/:id/answers", authenticateUser, async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const answerData = insertQuestionAnswerSchema.parse(req.body);
      
      const answer = await storage.createQuestionAnswer({
        ...answerData,
        questionId,
        answererUid: req.user.firebaseUid,
      });

      // Mark question as answered
      await storage.updateQuestion(questionId, { isAnswered: true });

      res.json(answer);
    } catch (error) {
      res.status(400).json({ error: 'Invalid answer data' });
    }
  });

  // Opportunity routes
  app.get("/api/opportunities", async (req, res) => {
    try {
      const { type } = req.query;
      let opportunities;
      
      if (type) {
        opportunities = await storage.getOpportunitiesByType(type as string);
      } else {
        opportunities = await storage.getAllOpportunities();
      }

      res.json(opportunities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch opportunities' });
    }
  });

  app.get("/api/opportunities/recommendations", authenticateUser, async (req, res) => {
    try {
      const opportunities = await storage.getAllOpportunities();
      const recommendations = await getOpportunityRecommendations(req.user, opportunities);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  });

  app.post("/api/opportunities", authenticateUser, async (req, res) => {
    try {
      const opportunityData = insertOpportunitySchema.parse(req.body);
      const opportunity = await storage.createOpportunity({
        ...opportunityData,
        postedBy: req.user.id,
      });
      res.json(opportunity);
    } catch (error) {
      res.status(400).json({ error: 'Invalid opportunity data' });
    }
  });

  // Lost & Found routes
  app.get("/api/lost-found", async (req, res) => {
    try {
      const { type } = req.query;
      let items;
      
      if (type) {
        items = await storage.getLostFoundByType(type as string);
      } else {
        items = await storage.getAllLostFoundItems();
      }

      // Get poster information
      const itemsWithPosters = await Promise.all(
        items.map(async (item) => {
          const poster = await storage.getUser(item.postedBy);
          return {
            ...item,
            poster: poster ? {
              name: poster.name,
              role: poster.role,
              profileImage: poster.profileImage,
            } : null,
          };
        })
      );

      res.json(itemsWithPosters);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch lost & found items' });
    }
  });

  app.post("/api/lost-found", authenticateUser, async (req, res) => {
    try {
      const itemData = insertLostFoundSchema.parse(req.body);
      const item = await storage.createLostFoundItem({
        ...itemData,
        postedBy: req.user.id,
      });
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: 'Invalid lost & found data' });
    }
  });

  // Bus route routes
  app.get("/api/bus-routes", async (req, res) => {
    try {
      const routes = await storage.getAllBusRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch bus routes' });
    }
  });

  app.get("/api/bus-routes/my-bus", authenticateUser, async (req, res) => {
    try {
      if (!req.user.busId) {
        return res.json(null);
      }

      const busRoute = await storage.getBusRoute(req.user.busId);
      if (!busRoute) {
        return res.status(404).json({ error: 'Bus route not found' });
      }

      // Get co-passengers
      const allPassengerIds = [...(busRoute.studentIds || []), ...(busRoute.facultyIds || [])];
      const coPassengers = await Promise.all(
        allPassengerIds
          .filter(uid => uid !== req.user.firebaseUid)
          .map(async (uid) => {
            const user = await storage.getUserByFirebaseUid(uid);
            return user ? {
              name: user.name,
              role: user.role,
              department: user.department,
              profileImage: user.profileImage,
            } : null;
          })
      );

      res.json({
        ...busRoute,
        coPassengers: coPassengers.filter(Boolean),
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch your bus route' });
    }
  });

  // User routes
  app.get("/api/users/linkedin", async (req, res) => {
    try {
      const users = await storage.getUsersByRole('student');
      const linkedinUsers = users
        .filter(user => user.linkedinUrl)
        .map(user => ({
          id: user.id,
          name: user.name,
          role: user.role,
          department: user.department,
          branch: user.branch,
          year: user.year,
          linkedinUrl: user.linkedinUrl,
          profileImage: user.profileImage,
          collegeId: user.collegeId,
        }));
      
      res.json(linkedinUsers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch LinkedIn users' });
    }
  });

  // Notification routes
  app.get("/api/notifications", authenticateUser, async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByUser(req.user.id);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  app.put("/api/notifications/:id/read", authenticateUser, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const success = await storage.markNotificationAsRead(notificationId);
      if (!success) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
