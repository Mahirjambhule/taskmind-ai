# ✨ MindFlow AI

**MindFlow AI** is an intelligent productivity platform that transforms scattered notes into structured daily plans using next-gen LLMs.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)
![AI Powered](https://img.shields.io/badge/AI-Groq%20%2B%20HuggingFace-purple)

## 🚀 Features

* **🧠 AI Daily Planner:** Uses **Groq (Llama 3)** to instantly analyze all your tasks and generate a prioritized schedule.
* **📝 Smart Summarization:** Uses **Hugging Face** to summarize long notes into concise takeaways.
* **🔐 Secure Authentication:** Full JWT-based stateless authentication with BCrypt password hashing.
* **⚡ Real-Time Performance:** Optimized with Groq LPU inference for sub-second AI responses.
* **🎨 Modern UI:** Built with React + Tailwind CSS for a sleek, dark-mode aesthetic.

## 🛠️ Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, Axios, React Router
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **AI Models:** Llama-3-70b (via Groq), BART-Large (via Hugging Face)

## 📦 How to Run Locally

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/mindflow-ai.git](https://github.com/YOUR_USERNAME/mindflow-ai.git)
    ```
2.  **Install Backend Dependencies:**
    ```bash
    cd server
    npm install
    ```
3.  **Install Frontend Dependencies:**
    ```bash
    cd ../client
    npm install
    ```
4.  **Setup Environment Variables:**
    Create a `.env` file in the `/server` folder with:
    ```env
    MONGO_URI=your_mongodb_string
    JWT_SECRET=your_secret
    GROQ_API_KEY=your_groq_key
    HUGGINGFACE_API_KEY=your_hf_key
    ```
5.  **Run the App:**
    ```bash
    # Terminal 1 (Server)
    cd server
    npm run dev

    # Terminal 2 (Client)
    cd client
    npm run dev
    ```