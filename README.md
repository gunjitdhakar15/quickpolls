# QuickPolls

A full-stack polling application built with React and Node.js/Express. Users can create polls, vote on them, and view real-time results.

## Features

- 🔐 User authentication (Register/Login)
- 📊 Create polls with multiple options
- ✅ Vote on polls (one vote per user)
- 📈 View poll results with visual progress bars
- 🗑️ Delete your own polls
- 📱 Responsive design

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 19
- React Router for navigation
- Axios for API calls
- Modern CSS styling

## Project Structure

```
quickpolls/
├── server/
│   ├── models/
│   │   ├── User.js          # User model
│   │   └── Poll.js           # Poll model
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   └── polls.js          # Poll routes
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   └── server.js             # Express server setup
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── PollList.js
│   │   │   ├── CreatePoll.js
│   │   │   └── PollDetail.js
│   │   ├── services/
│   │   │   └── api.js        # API service
│   │   ├── utils/
│   │   │   └── auth.js       # Auth utilities
│   │   └── App.js            # Main app component
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quickpolls
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

4. Start MongoDB (if running locally):
```bash
# On Windows
mongod

# On Mac/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

5. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The client will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  - Body: `{ email, password }`
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ token }`

### Polls
- `GET /api/polls` - Get all polls
- `GET /api/polls/:id` - Get a single poll
- `POST /api/polls` - Create a poll (requires auth)
  - Body: `{ question, options: [string, string, ...] }`
- `POST /api/polls/:id/vote` - Vote on a poll (requires auth)
  - Body: `{ optionIndex: number }`
- `DELETE /api/polls/:id` - Delete a poll (requires auth, creator only)

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **View Polls**: Browse all available polls on the home page
3. **Create Poll**: Click "Create New Poll" to create your own poll
4. **Vote**: Click on a poll to view details and vote (one vote per user)
5. **View Results**: See real-time vote counts and percentages
6. **Delete**: Poll creators can delete their own polls

## Environment Variables

### Server (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

### Client (.env)
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Notes

- Users must be authenticated to create polls and vote
- Each user can only vote once per poll
- Poll creators can delete their own polls
- JWT tokens expire after 1 day

## Future Enhancements

- Real-time updates using WebSockets
- Poll categories/tags
- Search functionality
- User profiles
- Poll expiration dates
- Share polls via link
- Poll analytics

