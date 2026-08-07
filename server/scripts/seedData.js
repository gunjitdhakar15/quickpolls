const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Poll = require('../models/Poll');

const MONGODB_URI = process.env.DB_URI;

if (!MONGODB_URI) {
  console.error('❌ DB_URI is missing in server/.env');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas.');

    // 1. Create or find Demo Admin User
    let demoUser = await User.findOne({ email: 'alex@quickpolls.io' });
    if (!demoUser) {
      const hashedPassword = await bcrypt.hash('DemoPassword123!', 10);
      demoUser = await User.create({
        name: 'Alex Rivera',
        email: 'alex@quickpolls.io',
        password: hashedPassword
      });
      console.log('👤 Created demo user: Alex Rivera');
    }

    // 2. Clear existing polls to ensure clean, high-impact recruiter demo
    await Poll.deleteMany({});
    console.log('🧹 Cleaned previous sample polls.');

    // 3. Define 4 high-impact, professional tech polls
    const samplePolls = [
      {
        question: 'Which AI Model Architecture will dominate software engineering in 2026?',
        options: [
          { text: 'Google Gemini (1.5 Flash / 2.0 Flash)', votes: 142 },
          { text: 'Claude 3.5 Sonnet & Computer Use', votes: 118 },
          { text: 'OpenAI o3 / GPT-4o Multimodal', votes: 89 },
          { text: 'Llama 3 Open-Weights Models', votes: 54 }
        ],
        createdBy: demoUser._id,
        aiAnalysis: {
          summary: 'Community sentiment shows strong confidence in multimodal LLMs with ultra-fast inference speed and extended context windows. Google Gemini leads due to low latency API response times.',
          sentiment: 'Tech-Forward & Decisive',
          emoji: '🤖',
          lastAnalyzedVotesCount: 403
        }
      },
      {
        question: 'What is the most critical pattern for scaling high-frequency real-time voting?',
        options: [
          { text: 'Atomic Database Operators ($inc, $addToSet)', votes: 210 },
          { text: 'WebSocket Room Segregation (Socket.io)', votes: 165 },
          { text: 'Distributed Redis Lock Management', votes: 78 },
          { text: 'Edge CDN Caching & Rate Limiting', votes: 45 }
        ],
        createdBy: demoUser._id,
        aiAnalysis: {
          summary: 'Voters heavily emphasize atomic database updates to prevent race conditions during parallel vote bursts, closely followed by WebSocket channel isolation for low latency updates.',
          sentiment: 'Analytical & Performance Focused',
          emoji: '⚡',
          lastAnalyzedVotesCount: 498
        }
      },
      {
        question: 'Should TypeScript be mandatory for all production Node.js & React codebases?',
        options: [
          { text: 'Yes, mandatory for type-safety and maintenance', votes: 312 },
          { text: 'Optional, plain JS for small utility services', votes: 94 },
          { text: 'Only mandatory on Frontend UI apps', votes: 42 }
        ],
        createdBy: demoUser._id,
        aiAnalysis: {
          summary: 'Overwhelming majority agrees that static type checking is crucial for enterprise-grade Node.js and React applications to reduce runtime errors.',
          sentiment: 'Consensus Strongly Favorable',
          emoji: '🎯',
          lastAnalyzedVotesCount: 448
        }
      },
      {
        question: 'What is your primary choice for deployment and hosting modern full-stack web applications?',
        options: [
          { text: 'Vercel (Frontend) + Render / Railway (Backend)', votes: 245 },
          { text: 'AWS (ECS / Lambda / CloudFront)', votes: 180 },
          { text: 'Docker Containers on Fly.io', votes: 62 },
          { text: 'Self-hosted VPS (DigitalOcean / Hetzner)', votes: 38 }
        ],
        createdBy: demoUser._id,
        aiAnalysis: {
          summary: 'Developers favor decoupled micro-deployments: Vercel for instant static SPA delivery paired with Render/Railway for persistent Node.js servers.',
          sentiment: 'Modern Cloud Native',
          emoji: '☁️',
          lastAnalyzedVotesCount: 525
        }
      }
    ];

    await Poll.insertMany(samplePolls);
    console.log('🚀 Successfully seeded 4 high-quality recruiter demo polls into MongoDB Atlas!');

    mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
