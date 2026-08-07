# QuickPolls Walkthrough: Built From Scratch ⚡

We have successfully rebuilt the **QuickPolls** monorepo from scratch to perfectly support the advanced engineering claims on your resume. 

Here is a summary of what has been built and how to run it.

---

## 🛠️ Changes Made

### 1. Backend Core (`server/`)
* **Atomic Concurrency Voting:** Created [pollController.js](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/server/controllers/pollController.js) using MongoDB's atomic operators (`$inc` and `$addToSet` in a single query transaction) to avoid race conditions.
* **WebSocket Isolation:** Wrote [socket.js](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/server/socket.js) to group socket clients into specific rooms based on their viewed `pollId` and emit update events.
* **AI Summary Engine:** Implemented [aiService.js](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/server/services/aiService.js) using the official `@google/generative-ai` package to fetch, analyze, and cache sentiment and summaries asynchronously in MongoDB.
* **Secure JWT Auth:** Implemented custom middleware [auth.js](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/server/middleware/auth.js) and controllers to hash credentials and authenticate users.

### 2. Frontend Core (`client/`)
* **Vite & React Scaffolding:** Initialized a modern client built using Vite.
* **TailwindCSS Dark Theme:** Configured [tailwind.config.js](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/client/tailwind.config.js) and [src/index.css](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/client/src/index.css) to support a dark-mode glassmorphic interface with custom indigo-emerald neon themes.
* **Dynamic Charting:** Created [PollChart.jsx](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/client/src/components/PollChart.jsx) using Chart.js to render animated vote counts.
* **WebSocket Integration:** Integrated [PollDetail.jsx](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/client/src/components/PollDetail.jsx) with `socket.io-client` to join/leave rooms and sync state instantly without page reloads.

### 3. Automated Validation Script
* **Concurrency stress testing:** Wrote [testConcurrency.js](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/server/scripts/testConcurrency.js) which manually signs 50 distinct JWT tokens and sends **50 concurrent HTTP requests simultaneously** to verify database vote counts remain consistent.

---

## 🧪 Verification Plan

### Automated Test Execution
To run the automated concurrency test:
1. Copy `server/.env.example` to `server/.env` and paste your MongoDB Atlas string (`DB_URI`).
2. Run the server using `npm run dev` in the `server` directory.
3. In a separate console, run:
   ```bash
   node server/scripts/testConcurrency.js
   ```
4. Verify the console prints a success report confirming that all 50 votes were correctly and atomically registered.

### Manual Verification
1. Ensure both the `server` and `client` are running (`npm run dev`).
2. Register an account, create a poll, and open that poll in two side-by-side tabs.
3. Place a vote in Tab A, and watch Tab B's charts and percentages update automatically via websockets!
4. Click **Generate AI Insights** to call the Gemini API and fetch the sentiment summary.
