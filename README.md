# QuickPolls

A full‑stack polling app where users can register, create polls with multiple options, vote once per poll, and see results in a modern UI.

## Features

- 🔐 **Auth**: Email/password register & login with JWT‑protected poll actions  
- 📊 **Polls**: Create polls with 2+ options, one vote per user, delete your own polls  
- 📈 **Results**: View total votes and per‑option percentages on the poll detail page  
- 🎨 **UI**: React SPA with React Router, Axios, and a dark, modern dashboard‑style layout  

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs  
- **Frontend**: React, React Router, Axios, custom CSS (dark / glassmorphism style)  

## Project Structure

```text
quickpolls/
├── server/
│   ├── models/        # User, Poll
│   ├── routes/        # /api/auth, /api/polls
│   ├── middleware/    # auth.js (JWT)
│   └── server.js      # Express + Mongo connection
└── client/
    ├── src/
    │   ├── components/  # Login, Register, PollList, CreatePoll, PollDetail
    │   ├── services/    # api.js (Axios instance + APIs)
    │   ├── utils/       # auth.js (JWT decode helpers)
    │   └── App.js       # Routes and layout
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)  
- MongoDB (local or Atlas)  
- npm or yarn  

### Backend Setup

```bash
cd server
npm install

# server/.env
PORT=5000
DB_URI=mongodb://localhost:27017/quickpolls
JWT_SECRET=your_super_secret_jwt_key

npm run dev   # or: npm start
```

The API will be available at `http://localhost:5000/api`.

### Frontend Setup

```bash
cd client
npm install

# optional: client/.env
REACT_APP_API_URL=http://localhost:5000/api

npm start
```

The React app will run at `http://localhost:3000`.

## Core API Endpoints

### Authentication

- `POST /api/auth/register` – register, body: `{ email, password }`  
- `POST /api/auth/login` – login, body: `{ email, password }`, returns `{ token }`  

### Polls (JWT in `Authorization: Bearer <token>`)

- `GET /api/polls` – list polls  
- `GET /api/polls/:id` – get a single poll  
- `POST /api/polls` – create poll, body: `{ question, options: string[] }`  
- `POST /api/polls/:id/vote` – vote, body: `{ optionIndex: number }`  
- `DELETE /api/polls/:id` – delete poll (creator only)  

## Usage Flow

1. Register and log in to get a JWT stored in `localStorage`.  
2. From the home page, click **Create New Poll** and submit a question + options.  
3. Open a poll detail page to vote once per poll as an authenticated user.  
4. See live results with counts and percentages; delete the poll if you are the creator.  