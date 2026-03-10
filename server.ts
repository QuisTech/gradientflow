import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // DO API for ML Architecture Agent
  app.post("/api/architect", async (req, res) => {
    try {
      const problem = req.body.problem;
      const endpoint = process.env.DO_AGENT_ENDPOINT;
      const key = process.env.DO_AGENT_KEY;
      
      const doReq = await fetch(`${endpoint}/api/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "ml-architect",
          messages: [{ role: "user", content: `Please generate a system architecture for this problem: ${problem}. VERY IMPORTANT: Respond strictly with valid JSON. Any code snippets in the suggestedCode field MUST have their newlines (\\n) and quotes properly escaped.` }],
          response_format: { type: "json_object" }
        })
      });

      if (!doReq.ok) {
        throw new Error(await doReq.text());
      }

      const data = await doReq.json();
      let content = data.choices[0].message.content;
      content = content.trim().replace(/^```json\s*/, "").replace(/\s*```$/, "");
      
      try {
        res.json(JSON.parse(content));
      } catch(e) {
        console.error("Agent returned unparsable JSON: ", content);
        res.json({ 
          architectureName: "Raw Output Recovered",
          modelChoice: "DO Agent Config",
          trainingStrategy: "See generated code below for instructions",
          deploymentConfig: "",
          suggestedCode: content
        });
      }
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Chat interface endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const messages = req.body.messages;
      const endpoint = process.env.DO_AGENT_ENDPOINT;
      const key = process.env.DO_AGENT_KEY;
      
      const doReq = await fetch(`${endpoint}/api/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "ml-architect",
          messages: messages
        })
      });

      if (!doReq.ok) {
        throw new Error(await doReq.text());
      }

      const data = await doReq.json();
      res.json(data);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Mock API for ML Jobs
  app.get("/api/jobs", (req, res) => {
    res.json([
      { id: "job-101", name: "ResNet-50 Training", status: "running", progress: 65, accuracy: 0.89 },
      { id: "job-102", name: "NLP Transformer Fine-tune", status: "completed", progress: 100, accuracy: 0.94 },
      { id: "job-103", name: "Object Detection v8", status: "queued", progress: 0, accuracy: 0 },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GradientFlow Server running on http://localhost:${PORT}`);
  });
}

startServer();
