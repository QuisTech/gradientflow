## Inspiration

Building reliable Machine Learning pipelines for edge devices (like autonomous drones) and enterprise environments is incredibly complex. Developers and data scientists spend weeks architecting systems, selecting models, and configuring deployment constraints. We wanted to build a "Mission Control" that acts as a real-time, expert AI consultant to instantaneously design, optimize, and output production-ready ML architectures.

## What it does

**GradientFlow Architect** is an interactive web-based command center powered by DigitalOcean AI.

1. **AI Architect Generator:** Users describe their problem (e.g., "I need a real-time object detection model for a drone"), and the DO Agent instantly generates a formalized JSON schema containing the Optimal Model Choice, Training Strategy, and starter code, which is beautifully unpacked and natively rendered by the React Dashboard.
2. **Gradient Consultant Chat:** A persistent, multi-turn RAG (Retrieval-Augmented Generation) chatbot hooked directly to DigitalOcean Agents. Users can upload custom PDFs (like PyTorch documentation) directly to their DO Knowledge Base, and the Chatbot fluidly answers highly technical implementation questions using context from those specific research documents.

## How we built it

- **Frontend:** Built with **React** and **Vite**, written in **TypeScript**. We styled the dashboard with **TailwindCSS** and `lucide-react` to deliver a premium, glassmorphism, dark-mode "Mission Control" aesthetic.
- **Backend:** A securely proxied **Node.js/Express** layer (`server.ts`) handles API traffic to prevent client-side credential leaking and implements robust text-sanitization to catch LLM hallucination edges.
- **AI Infrastructure:** Fully powered by **DigitalOcean Gradient AI**. We utilized the **Llama 3.1 8B Instruct** model deployed as a DO Agent, leveraging DO Knowledge Bases for native RAG.
- **Deployment:** Containerized using a multi-stage **Docker** build and seamlessly deployed to the **DigitalOcean App Platform** using GitHub CI/CD integration and OS-level environment variable injections.

## Challenges we ran into

Getting an LLM to consistently return valid, parseable JSON code blocks for the React frontend was challenging. Sometimes the Agent would return unescaped newline characters in the middle of Python code strings, crashing the JavaScript `JSON.parse` logic. We overcame this by building a dual-layer sanitization pipeline in our Express backend that strict-prompts the DO Agent natively, strips markdown wrappers using Regex, safely catches anomalies, and provides a graceful UI fallback.

## Accomplishments that we're proud of

We are incredibly proud of building a 100% DigitalOcean-native stack. Instead of relying on messy third-party wrappers like LangChain, we pushed user messages and conversation history directly to the DO Agent `/chat/completions` REST API. Seeing the DigitalOcean App Platform auto-detect our Dockerfile, securely encrypt our API endpoint keys, and effortlessly serve both our Vite frontend and Node backend on a single `.app` domain was a massive victory.

## What we learned

The native integration of DigitalOcean Knowledge Bases (RAG) directly into DO Agents is profoundly powerful. It entirely eliminates the manual burden of chunking text, managing a separate standalone vector database, or writing complex cosine-similarity retrieval algorithms.

## What's next for GradientFlow Architect

Our next step is integrating the DigitalOcean Droplet API directly into the interface! Once the AI Architect designs a model deployment strategy, we want to add a "Provision DO Droplet" button that uses the API to automatically spin up a GPU Droplet instantly pre-configured with the AI Agent's recommended Docker environment.

---

**Built with:**
React, Vite, Node.js, Express.js, TypeScript, TailwindCSS, Docker, DigitalOcean AI Agents, DigitalOcean App Platform, Llama 3 8B
