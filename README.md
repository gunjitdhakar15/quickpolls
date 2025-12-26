# QuickPolls ⚡

**A scalable voting engine engineered for secure, high-integrity data collection.**

> *Architecture: MERN Stack (MVC Pattern) | JWT Authentication | REST API Optimization*

### 🚀 Project Overview
QuickPolls is a full-stack application designed to handle voting sessions with strict data integrity. Unlike simple CRUD apps, this engine implements **atomic voting logic** to ensure one-vote-per-user and uses **stateless session management** via JWT.

The system was architected to separate concerns between the Client (React) and Server (Node/Express), ensuring scalable code maintenance.

### 🛠️ Technical Architecture
* **Backend:** Node.js & Express.js (MVC Architecture with separate Controllers/Routes).
* **Database:** MongoDB (Mongoose) with schema validation for data consistency.
* **Security:**
    * **JWT (JSON Web Tokens):** Custom middleware (`middleware/auth.js`) for protected route access.
    * **Bcrypt.js:** Cryptographic hashing for user credentials.
    * **CORS Policy:** Configured for secure client-server communication.
* **Frontend:** React.js (SPA) using `axios` services for centralized API handling.

### 📂 Key Capabilities
1.  **Secure Authentication Flow:** Complete Register/Login cycle returning Bearer tokens.
2.  **Atomic Voting Transactions:** Backend logic ensures users cannot vote multiple times on the same poll ID.
3.  **Modular Service Layer:** Frontend API calls are abstracted into `services/api.js` for cleaner components.
4.  **Responsive Dashboard:** Component-based UI (`Dashboard.js`, `PollDetail.js`) for managing polls.

### 🔧 Project Structure
This project follows a Monorepo-style structure separating the API and Client logic.

```bash
quickpolls/
├── server/                 # Backend API Layer
│   ├── controllers/        # Logic extraction (Poll/User logic)
│   ├── middleware/         # auth.js (JWT Validation)
│   ├── models/             # Mongoose Schemas (User.js, Poll.js)
│   ├── routes/             # API Endpoints declaration
│   └── server.js           # Express Entry Point
└── client/                 # React Frontend
    ├── src/
    │   ├── components/     # UI Modules (PollList, Dashboard, etc.)
    │   ├── services/       # api.js (Axios Instance)
    │   └── utils/          # auth.js (Token Decoding)
