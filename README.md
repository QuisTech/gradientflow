# GradientFlow Architect 🚀

GradientFlow Architect is a premium, AI-powered "Mission Control" dashboard that acts as an expert Machine Learning consultant. By leveraging DigitalOcean's Gradient AI Agents, it instantly designs, optimizes, and outputs production-ready ML architectures and starter code based on your natural language descriptions.

## 🌟 Key Features

- **AI Architect Generator:** Translates plain-English problem descriptions into highly structured, actionable AI architectures (Model Choice, Training Strategy, and Code).
- **Gradient Consultant Chat (RAG-Enabled):** A persistent, multi-turn chatbot powered by DigitalOcean Agents. Attach custom PDFs to your DO Knowledge Base and chat directly with your documentation!
- **Mission Control Dashboard:** A sleek, glassmorphism UI built with React, Recharts, and TailwindCSS.
- **Secure Architecture:** An integrated Node.js Express backend securely manages DigitalOcean API keys and robustly sanitizes LLM JSON responses.

## 🛠️ Built With

- **Frontend:** React, Vite, TypeScript, TailwindCSS
- **Backend:** Node.js, Express.js
- **AI Infrastructure:** DigitalOcean AI Agents (Llama 3.1 8B Instruct), DO Knowledge Bases (RAG)
- **Deployment:** Docker, DigitalOcean App Platform

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- A [DigitalOcean Account](https://www.digitalocean.com/) with an active AI Agent Endpoint and Key.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/QuisTech/gradientflow.git
   cd gradientflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   DO_AGENT_ENDPOINT=https://your-agent-endpoint.do-ai.run
   DO_AGENT_KEY=your_secret_access_key
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The app will run concurrently (Express Backend + Vite Frontend) at `http://localhost:3000`.

## 🚢 Deployment

GradientFlow is Docker-ready and natively configured for the **DigitalOcean App Platform**:

1. Push your repository to GitHub.
2. In the DigitalOcean Console, go to **App Platform** -> **Create App**.
3. Select your repository. App Platform will automatically detect the `Dockerfile`.
4. Inject your `DO_AGENT_ENDPOINT` and `DO_AGENT_KEY` as Environment Variables.
5. Deploy!
