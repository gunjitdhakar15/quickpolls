# QuickPolls - Project Overview & Understanding Guide

## What is QuickPolls?

QuickPolls is a web application that allows users to create and participate in polls. Think of it like a simple version of Strawpoll or Doodle polls.

## Architecture Overview

### Backend (Server)
The backend is built with **Express.js** and uses **MongoDB** for data storage.

#### Key Components:

1. **server.js** - Main entry point
   - Sets up Express server
   - Connects to MongoDB
   - Mounts routes (`/api/auth` and `/api/polls`)
   - Handles CORS and JSON parsing

2. **Models** (Database Schemas):
   - **User.js**: Stores user email and hashed password
   - **Poll.js**: Stores poll question, options, votes, creator, and voters

3. **Routes**:
   - **auth.js**: Handles user registration and login
     - `/register`: Creates new user account
     - `/login`: Authenticates user and returns JWT token
   - **polls.js**: Handles poll operations
     - `GET /`: Get all polls
     - `GET /:id`: Get single poll
     - `POST /`: Create new poll (protected)
     - `POST /:id/vote`: Vote on poll (protected)
     - `DELETE /:id`: Delete poll (protected, creator only)

4. **Middleware**:
   - **auth.js**: Verifies JWT tokens and attaches user to request

### Frontend (Client)
The frontend is built with **React** and uses **React Router** for navigation.

#### Key Components:

1. **App.js** - Main component
   - Sets up routing
   - Manages authentication state
   - Provides navigation bar

2. **Components**:
   - **Login.js**: User login form
   - **Register.js**: User registration form
   - **PollList.js**: Displays all polls in a grid
   - **CreatePoll.js**: Form to create new polls
   - **PollDetail.js**: Shows poll details, voting interface, and results

3. **Services**:
   - **api.js**: Axios instance configured with base URL and token injection
   - Provides functions for all API calls

4. **Utils**:
   - **auth.js**: Helper functions to decode JWT and get user ID

## How Authentication Works

1. **Registration**:
   - User provides email and password
   - Password is hashed using bcryptjs
   - User is saved to database

2. **Login**:
   - User provides email and password
   - Password is compared with stored hash
   - If valid, JWT token is generated and returned
   - Token is stored in browser's localStorage

3. **Protected Routes**:
   - Frontend sends token in `Authorization: Bearer <token>` header
   - Backend middleware verifies token
   - If valid, user info is attached to request

## How Polls Work

1. **Creating a Poll**:
   - User must be authenticated
   - User provides question and at least 2 options
   - Poll is saved with creator ID

2. **Voting**:
   - User must be authenticated
   - User can only vote once per poll
   - Vote increments the option's vote count
   - User ID is added to voters array

3. **Viewing Results**:
   - Anyone can view polls (no auth required)
   - Results show vote counts and percentages
   - Visual progress bars show distribution

## Data Flow Example: Creating and Voting on a Poll

1. **User logs in**:
   ```
   Frontend → POST /api/auth/login → Backend verifies → Returns JWT token
   Frontend stores token in localStorage
   ```

2. **User creates poll**:
   ```
   Frontend → POST /api/polls (with token) → Backend verifies token → 
   Creates poll in DB → Returns poll data → Frontend shows success
   ```

3. **User votes**:
   ```
   Frontend → POST /api/polls/:id/vote (with token) → Backend verifies token →
   Checks if user already voted → Updates poll → Returns updated poll →
   Frontend updates UI with new results
   ```

## Key Technologies Explained

### JWT (JSON Web Tokens)
- Stateless authentication
- Token contains user ID
- Signed with secret key
- Expires after 1 day

### bcryptjs
- Password hashing library
- One-way encryption (can't decrypt)
- Uses salt rounds (10) for security

### Mongoose
- MongoDB object modeling
- Provides schemas and validation
- Handles database operations

### React Router
- Client-side routing
- No page refreshes
- URL-based navigation

### Axios
- HTTP client library
- Interceptors add auth token automatically
- Handles errors and responses

## Security Features

1. **Password Hashing**: Passwords are never stored in plain text
2. **JWT Tokens**: Secure, stateless authentication
3. **Protected Routes**: Only authenticated users can create/vote
4. **Vote Limiting**: One vote per user per poll
5. **Creator Verification**: Only poll creators can delete their polls

## File Structure Explained

```
server/
├── server.js          # Express app setup
├── models/            # Database schemas
├── routes/            # API endpoints
├── middleware/        # Request handlers (auth)
└── package.json       # Dependencies

client/
├── src/
│   ├── App.js         # Main React component
│   ├── components/    # UI components
│   ├── services/      # API calls
│   └── utils/         # Helper functions
└── package.json       # Dependencies
```

## Common Patterns Used

1. **RESTful API**: Standard HTTP methods (GET, POST, DELETE)
2. **Component-Based**: React components for UI
3. **State Management**: React hooks (useState, useEffect)
4. **Error Handling**: Try-catch blocks and error messages
5. **Loading States**: Loading indicators during API calls

## Next Steps to Understand

1. **Start the servers** and test the application
2. **Read the code** in each file to see how it works
3. **Use browser DevTools** to see network requests
4. **Check MongoDB** to see how data is stored
5. **Modify code** to see how changes affect behavior

## Troubleshooting

- **MongoDB connection error**: Make sure MongoDB is running
- **CORS errors**: Check that server CORS is enabled
- **Auth errors**: Verify JWT_SECRET matches
- **Token expired**: User needs to login again

