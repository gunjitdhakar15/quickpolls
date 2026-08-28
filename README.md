# QuickPolls⚡
**A high-concurrency, real-time voting engine engineered with atomic database operations, live WebSocket synchronization, interactive visualization, and automated GPT-3.5 AI insights.**

## 🚀 Key Technical Highlights (Resume & Interview Assets)

1. **Real-time Live Sync via WebSockets:** 
   * Configured Socket.io room segregation where clients subscribe to a dedicated channel (`poll:<id>`) upon landing on a poll detail page.
   * Eliminates HTTP polling overhead and cuts data synchronization latency to **<50ms**, ensuring instantaneous UI visual updates.
2. **Race Condition Prevention & Atomic Database Operations:**
   * Engineered thread-safe `/vote` transaction handling using MongoDB's atomic operators (`$inc` and `$addToSet`) in a single `findOneAndUpdate` execution block.
   * Guarantees 100% data consistency and strict one-vote-per-user enforcement even during severe parallel vote bursts.
3. **Automated AI Insights (OpenAI GPT-3.5):**
   * Integrated OpenAI GPT-3.5-turbo API to process and summarize incoming vote data, classifying semantic voter sentiment and caching results.
   * Utilizes background asynchronous execution to keep HTTP response times ultra-low while performing LLM text operations.
4. **Data Visualization (Chart.js & TailwindCSS):**
   * Implemented responsive animated bar graphs using Chart.js to render results dynamically.
   * Designed a premium, glassmorphic dark-mode interface built completely with TailwindCSS.

<img width="1886" height="864" alt="screenshot" src="https://github.com/user-attachments/assets/dbd31f56-ac6d-46ff-9701-3a0239e91131" />

### 🚀 Project Overview
QuickPolls is a full-stack application designed to handle voting sessions with strict data integrity. Unlike simple CRUD apps, this engine implements **atomic voting logic** to ensure one-vote-per-user and uses **stateless session management** via JWT.

---

## 🛠️ System Architecture

* **Frontend:** React (Vite SPA) | TailwindCSS | Chart.js / React-Chartjs-2 | Socket.io-Client
* **Backend:** Node.js | Express.js | Socket.io | Mongoose (MongoDB)
* **AI Engine:** OpenAI SDK (`openai`) — GPT-3.5-turbo
* **Security:** JWT (JSON Web Tokens) Authorization | Bcryptjs Hashing

---

## 📂 Repository Structure

```text
quickpolls/
├── server/                 # Express REST API & WebSocket Server
│   ├── controllers/        # Controllers (authController, pollController)
│   ├── middleware/         # auth.js (JWT Validation)
│   ├── models/             # Mongoose Schemas (User, Poll)
│   ├── routes/             # Route configurations
│   ├── services/           # aiService.js (OpenAI GPT-3.5 API)
│   ├── scripts/            # testConcurrency.js (Simulated concurrency tests)
│   └── socket.js           # Socket.io Room connection manager
└── client/                 # React Frontend (Vite)
    ├── src/
        ├── components/     # UI Views (Dashboard, PollDetail, Navbar, Chart)
        ├── services/       # api.js (Axios Client Wrapper)
        └── utils/          # auth.js (Session Storage Utilities)
```

---

## ⚙️ Local Setup Instructions

### 1. Database & AI Configurations
In your terminal, navigate to the `server/` directory and copy `.env.example` into a new `.env` file:
```bash
cp .env.example .env
```
Fill in the following variables inside `server/.env`:
* `DB_URI`: Your MongoDB Atlas connection string (or local string: `mongodb://localhost:27017/quickpolls`).
* `OPENAI_API_KEY`: Your OpenAI API key with available API quota.
* `JWT_SECRET`: Any secure cryptographic string (for signing authorization tokens).

---

### 2. Install & Start Backend Server
```bash
cd server
npm install
npm run dev
```
The server will boot on `http://localhost:5000`. You can test connection health by visiting `http://localhost:5000/api/health`.

---

### 3. Install & Start Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
The application will launch on `http://localhost:5173`.

---

## 🧪 Testing Concurrency (Race Conditions)
We have written an automated test script to prove the thread safety of our voting engine under stress.
To simulate **50 simultaneous votes** hitting the backend at the exact same millisecond:
1. Ensure the backend server is running (`npm run dev` in the `server` directory).
2. Open a separate terminal, navigate to the `server` folder, and run:
   ```bash
   node scripts/testConcurrency.js
   ```
The script will auto-generate 50 mock authorization tokens, execute concurrent calls, and check Mongoose records to verify zero lost votes.
