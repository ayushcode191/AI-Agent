# 🤖 MultiTool AI Assistant

A full-stack AI Agent built using **Google Gemini API** and **Node.js**, designed to handle multiple tools like calculations, prime checks, and crypto price queries — all in one place.

---

## ✨ Features

- ➕ Add two numbers  
- 🔍 Check if a number is prime  
- 💰 Get real-time crypto prices (via CoinGecko API)  
- 💬 Smart AI Q&A powered by Gemini  
- ⌨️ Typing animation for AI responses  
- 📄 Markdown-formatted answers (bold, lists, etc.)

---

## ⚙️ How to Run Locally

### 🔧 Prerequisites

- [Node.js](https://nodejs.org/)
- Internet connection
- Google Gemini API key

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/multitool-ai-assistant.git
cd multitool-ai-assistant
```

---

### 2️⃣ Setup Backend

```bash
cd Backend
npm install
```

Then create a `.env` file inside the `Backend` folder:

```ini
GOOGLE_API_KEY=your_gemini_api_key_here
```

---

### 3️⃣ Start the Backend Server

```bash
node server.js
```

Server will run at: [http://localhost:3001](http://localhost:3001)

---

### 4️⃣ Open the Frontend

Open `Frontend/index.html` directly in your browser, or use the **Live Server** extension in VS Code.

---

## 🧪 Example Prompts

- `What is 17 + 23?`
- `Is 29 a prime number?`
- `Get price of Bitcoin`
- `What is Linked List?`
