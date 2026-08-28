# QuickPolls: Production-Grade Real-Time Voting Engine

We are building a secure, high-integrity, real-time polling application from scratch. The system is designed to handle high concurrency with zero race conditions, provide live updates across clients, render mobile-friendly analytics, and leverage Gemini to analyze poll questions, answer choices, voting results, and sentiment.

---

## User Review Required

> [!IMPORTANT]
> **API Keys & DB Configuration:**
> You will need to provide a MongoDB connection string (local or MongoDB Atlas) and a Gemini API key in the `.env` file once the backend structure is ready. The configured model defaults to **Gemini 1.5 Flash**.

---

## Open Questions

> [!NOTE]
> 1. **MongoDB Instance:** Do you have local MongoDB running (`mongodb://localhost:27017`) or would you prefer to use a MongoDB Atlas connection string?
> 2. **AI Provider:** Gemini is configured through the GenerateContent API and `GEMINI_API_KEY`.

---

## Proposed Changes

We will build the monorepo structure with two core subdirectories: `server` (Node/Express API) and `client` (React + Tailwind CSS + Vite).

---

### Backend System (Express + Mongoose + Socket.io + AI)

#### [NEW] [package.json](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/server/package.json)
Contains all backend dependencies including `express`, `mongoose`, `socket.io`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`, and `@google/generative-ai`.

#### [NEW] [server.js](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/server/server.js)
The entry point that bootstraps Express, establishes the Mongoose connection, wraps the server with HTTP to host Socket.io, and mounts routes and error handling.

#### [NEW] [socket.js](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/server/socket.js)
Socket.io helper to manage socket connections. Implements rooms mapped to poll IDs:
- Users join `poll:<id>` when viewing a poll.
- The server broadcasts updates only to the relevant room when a vote is cast.

#### [NEW] [User.js](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/server/models/User.js)
Mongoose Schema representing a user, containing:
- Email (unique, indexed)
- Password (hashed with bcryptjs)

#### [NEW] [Poll.js](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/server/models/Poll.js)
Mongoose Schema representing a poll, containing:
- Question
- Options: Array of `{ text, votes, _id }`
- Voters: Array of user ObjectIds (used to verify a user has already voted on this poll, indexed to support fast checks)
- CreatedBy: Link to user who created it
- AiAnalysis: Schema containing `{ summary, sentiment, emoji, lastAnalyzedVotesCount }` to cache LLM results.

#### [NEW] [auth.js](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/server/middleware/auth.js)
JWT token validation middleware to extract and verify the user ID from the Authorization header.

#### [NEW] [authController.js](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/server/controllers/authController.js)
Controller handling registration and login with bcrypt hashing and JWT token signatures.

#### [NEW] [pollController.js](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/server/controllers/pollController.js)
Handles poll operations. The voting endpoint will use an atomic query to prevent race conditions:
```javascript
const updatedPoll = await Poll.findOneAndUpdate(
  {
    _id: pollId,
    voters: { $ne: userId } // Ensure user has not voted on this poll before
  },
  {
    $inc: { "options.$[elem].votes": 1 },
    $addToSet: { voters: userId }
  },
  {
    arrayFilters: [{ "elem._id": optionId }],
    new: true
  }
);
```
If `updatedPoll` is null, it means the user already voted or the poll doesn't exist, preventing double voting and race conditions atomically. It then triggers Socket.io to broadcast the update.

#### [NEW] [aiService.js](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/server/services/aiService.js)
Service linking the Gemini API. Uses the model to analyze poll questions, answer choices, results, and provide:
- A clear summary.
- Voter sentiment.

---

### Frontend System (Vite + React + TailwindCSS + Chart.js)

#### [NEW] [package.json](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/client/package.json)
Contains client dependencies: `react`, `react-dom`, `react-router-dom`, `axios`, `socket.io-client`, `chart.js`, `react-chartjs-2`, `lucide-react` (icons), `tailwindcss`, `postcss`, `autoprefixer`.

#### [NEW] [vite.config.js](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/client/vite.config.js)
Configures the Vite build system.

#### [NEW] [tailwind.config.js](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/client/tailwind.config.js)
Sets up Tailwind config to enable custom colors, premium typography, and animation classes.

#### [NEW] [src/index.css](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/client/src/index.css)
Injects Tailwind's directives and establishes a dark, neon glassmorphism stylesheet.

#### [NEW] [src/App.jsx](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/client/src/App.jsx)
React Router configuration mapping:
- Home / Poll Directory
- Create Poll
- Login & Register Pages
- Poll Detail (Live visualization + charts + AI analysis)

#### [NEW] [src/components/PollChart.jsx](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/client/src/components/PollChart.jsx)
Uses `react-chartjs-2` to render beautiful animated bar and pie charts of real-time polling results.

#### [NEW] [src/components/PollDetail.jsx](file:///e:/Coding/%5B01%5D%20Projects/%5B01%5DResume%20projects/quickpolls/client/src/components/PollDetail.jsx)
Connects to the websocket room for the poll, registers user votes, shows the dynamic chart, and pulls AI summaries on demand.

---

## Verification Plan

### Automated Tests
- We will write an integration script in `server/scripts/testConcurrency.js` to simulate **50+ concurrent requests** hitting the vote route at the exact same time, confirming that database counts remain perfectly accurate (no lost votes, no duplicate voters).

### Manual Verification
- Launch both the backend and client servers.
- Open two different browser tabs (one in incognito, one normal) and place them side-by-side.
- Cast a vote in one tab, and verify that the other tab immediately reflects the updated counts and animation without page refresh.
- Trigger the "Generate AI Insight" button and verify that Gemini analyzes the question and answer choices.
