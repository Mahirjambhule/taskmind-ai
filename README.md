# 🖊️ TaskMind AI

> **From Chaos to Clarity.** > An intelligent productivity platform that transforms scattered notes into structured daily plans using next-gen Generative AI.

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![AI](https://img.shields.io/badge/AI-Groq%20LPU%20%2B%20HuggingFace-purple)
![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-forestgreen)
![Deployment](https://img.shields.io/badge/Deployed-Vercel%20%26%20Render-black)

---

## 🌐 Live Demo
👉 **[Launch TaskMind AI](https://taskmind-ai-app.vercel.app)** *(Note: The backend is hosted on Render's Free Tier. If you are the first person visiting in a while, please allow 30-50 seconds for the server to wake up!)*

---

## 🚀 Key Features

### 🧠 1. AI Daily Planner (Powered by Groq)
* Uses the **Llama-3-70b** model via **Groq's LPU (Language Processing Unit)** engine.
* Analyzes all your tasks, understands context/urgency, and generates a structured **Morning / Afternoon / Evening** schedule instantly (<1s latency).
* **Circuit Breaker Logic:** If the primary AI fails, a fallback algorithm ensures the app never crashes.

### 📝 2. Intelligent Note Taking
* **Smart Separation:** Distinct tabs for **Actionable Tasks** and **Reference Notes**.
* **Auto-Summarization:** Uses **Hugging Face (BART-Large)** to detect long notes (>150 chars) and offers a one-click summary.
* **Rich UI:** "Read More" expansion, optional descriptions, and clean card-based layout.

### 🔐 3. Enterprise-Grade Security
* **Stateless Auth:** Secure access using **JWT (JSON Web Tokens)**.
* **Data Privacy:** Passwords are hashed using **BCrypt** before storage.
* **Production Security:** Strict **CORS** whitelisting preventing unauthorized API access.

---

## 🛠️ Tech Stack

| Component | Technology | Use Case |
| :--- | :--- | :--- |
| **Frontend** | React.js, Tailwind CSS | Responsive UI, State Management, Tabs System |
| **Backend** | Node.js, Express.js | REST API, Business Logic, AI Orchestration |
| **Database** | MongoDB Atlas | Cloud storage for Users and Notes |
| **AI Engine 1** | **Groq SDK (Llama-3)** | High-speed reasoning for Daily Planning |
| **AI Engine 2** | **Hugging Face (BART)** | Text summarization for long content |
| **DevOps** | Vercel & Render | CI/CD Deployment pipeline |

---

## 📦 Local Installation Guide

If you want to run this project locally on your machine, follow these steps:

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/taskmind-ai.git](https://github.com/YOUR_USERNAME/taskmind-ai.git)
cd taskmind-ai

### 2. Install Dependencies
# Install Server Dependencies
cd server
npm install
# Install Client Dependencies
cd ../client
npm install

### 3. Setup Environment Variables
Create a file named .env inside the /server folder and add the following keys:
# Server Configuration
PORT=5000

# Database Connection (MongoDB Atlas or Local)
MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/taskmind-db

# Security Secrets
JWT_SECRET=put_any_long_random_string_here

# AI Service Keys (Free Tiers)
# Get key from: [https://console.groq.com/keys](https://console.groq.com/keys)
GROQ_API_KEY=gsk_...
# Get key from: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
HUGGINGFACE_API_KEY=hf_...

### 4. Run the App
cd server
npm run dev
cd client
npm run dev