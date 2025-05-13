import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Check file types
    const validTypes = [
      // EEG files
      ".edf", ".csv",
      // Audio files
      ".wav", ".mp3",
      // Text files
      ".txt", ".json",
      // Image files
      ".jpg", ".jpeg", ".png",
    ];
    
    const ext = path.extname(file.originalname).toLowerCase();
    if (validTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Supported types: ${validTypes.join(", ")}`));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // API routes
  // Get datasets
  app.get("/api/datasets", async (req, res) => {
    try {
      const datasets = await storage.getAllDatasets();
      res.json(datasets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch datasets" });
    }
  });

  // Get dataset by ID
  app.get("/api/datasets/:id", async (req, res) => {
    try {
      const dataset = await storage.getDataset(parseInt(req.params.id));
      if (!dataset) {
        return res.status(404).json({ error: "Dataset not found" });
      }
      res.json(dataset);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dataset" });
    }
  });

  // Upload files
  app.post("/api/upload", upload.array("files", 10), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      // Group files by type
      const filesByType = {
        eeg: [] as Express.Multer.File[],
        audio: [] as Express.Multer.File[],
        text: [] as Express.Multer.File[],
        visual: [] as Express.Multer.File[],
      };

      req.files.forEach((file) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if ([".edf", ".csv"].includes(ext)) {
          filesByType.eeg.push(file);
        } else if ([".wav", ".mp3"].includes(ext)) {
          filesByType.audio.push(file);
        } else if ([".txt", ".json"].includes(ext)) {
          filesByType.text.push(file);
        } else if ([".jpg", ".jpeg", ".png"].includes(ext)) {
          filesByType.visual.push(file);
        }
      });

      // Create dataset record
      const dataset = await storage.createDataset({
        name: req.body.name || `Dataset ${new Date().toISOString()}`,
        description: req.body.description || "Uploaded dataset",
        files: req.files.map((file) => ({
          originalname: file.originalname,
          filename: file.filename,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
        })),
        uploadedAt: new Date(),
        processed: false,
      });

      res.status(201).json({
        message: "Files uploaded successfully",
        dataset,
        fileCount: req.files.length,
        filesByType: {
          eeg: filesByType.eeg.length,
          audio: filesByType.audio.length,
          text: filesByType.text.length,
          visual: filesByType.visual.length,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload files" });
    }
  });

  // Process dataset
  app.post("/api/datasets/:id/process", async (req, res) => {
    try {
      const datasetId = parseInt(req.params.id);
      const dataset = await storage.getDataset(datasetId);
      
      if (!dataset) {
        return res.status(404).json({ error: "Dataset not found" });
      }

      // Simulate processing
      setTimeout(async () => {
        try {
          // Update dataset as processed
          const updatedDataset = await storage.updateDataset(datasetId, {
            ...dataset,
            processed: true,
            processedAt: new Date(),
          });
          
          // Create an analysis result
          const analysisResult = await storage.createAnalysisResult({
            datasetId,
            prediction: "Generalized Anxiety Disorder",
            confidence: 0.875,
            severity: 6.2,
            createdAt: new Date(),
          });
          
          console.log(`Dataset ${datasetId} processed successfully`);
        } catch (error) {
          console.error(`Error processing dataset ${datasetId}:`, error);
        }
      }, 5000);

      res.json({
        message: "Processing started",
        datasetId,
      });
    } catch (error) {
      console.error("Processing error:", error);
      res.status(500).json({ error: "Failed to process dataset" });
    }
  });

  // Get analysis results
  app.get("/api/analysis", async (req, res) => {
    try {
      const results = await storage.getAllAnalysisResults();
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analysis results" });
    }
  });

  // Get analysis result by ID
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const result = await storage.getAnalysisResult(parseInt(req.params.id));
      if (!result) {
        return res.status(404).json({ error: "Analysis result not found" });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analysis result" });
    }
  });

  // Get recommendations
  app.get("/api/recommendations/:analysisId", async (req, res) => {
    try {
      const analysisId = parseInt(req.params.analysisId);
      const recommendations = await storage.getRecommendations(analysisId);
      
      if (!recommendations) {
        // Generate mock recommendations if none exist
        const mockRecommendations = {
          therapyRecommendations: [
            {
              type: "Cognitive Behavioral Therapy (CBT)",
              description: "A structured, present-oriented psychotherapy directed toward solving current problems and modifying dysfunctional thinking and behavior.",
              confidence: 0.92,
            },
            {
              type: "Mindfulness-Based Stress Reduction",
              description: "A program that uses mindfulness meditation to help patients become more aware of their reactions to stressors and develop healthier coping strategies.",
              confidence: 0.85,
            }
          ],
          specialistReferrals: [
            {
              type: "Psychiatrist",
              description: "For medication evaluation and management",
              urgency: 7,
              rationale: "Symptom severity suggests potential benefit from pharmacological intervention alongside psychotherapy."
            },
            {
              type: "Clinical Psychologist",
              description: "For specialized cognitive-behavioral therapy",
              urgency: 5,
              rationale: "The pattern of cognitive distortions would benefit from structured cognitive-behavioral approach."
            }
          ],
          wellnessTips: [
            {
              category: "Meditation",
              title: "Meditation Practice",
              description: "Daily 10-minute guided meditation focused on anxiety reduction and present-moment awareness.",
              icon: "self_improvement"
            },
            {
              category: "Exercise",
              title: "Physical Exercise",
              description: "Moderate aerobic exercise 3-4 times weekly for 30 minutes has been shown to reduce anxiety symptoms.",
              icon: "directions_run"
            }
          ],
          createdAt: new Date(),
          analysisId
        };
        
        res.json(mockRecommendations);
      } else {
        res.json(recommendations);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  return httpServer;
}
