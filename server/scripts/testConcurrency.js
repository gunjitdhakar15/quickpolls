const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/quickpolls';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_me';
const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const Poll = require('../models/Poll');
const User = require('../models/User');

async function runConcurrencyTest() {
  console.log('🧪 Starting Concurrency and Race Condition Test...');
  
  // 1. Connect to Database
  try {
    await mongoose.connect(DB_URI);
    console.log('✅ Connected to MongoDB database');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }

  // Create a mock user who creates the poll
  const creatorId = new mongoose.Types.ObjectId();
  
  // 2. Create a test poll directly in DB
  const testPoll = await Poll.create({
    question: `Concurrency Test Poll (${new Date().toISOString()})`,
    options: [
      { text: 'Option A (Target)', votes: 0 },
      { text: 'Option B', votes: 0 }
    ],
    createdBy: creatorId
  });

  const pollId = testPoll._id;
  const targetOptionId = testPoll.options[0]._id.toString();
  console.log(`📊 Created test poll: "${testPoll.question}"`);
  console.log(`🎯 Target Option ID: ${targetOptionId}`);

  // 3. Generate 50 mock users and sign JWT tokens manually
  const CONCURRENT_REQUESTS = 50;
  console.log(`🔑 Generating ${CONCURRENT_REQUESTS} mock JWT authorizations...`);
  const mockTokens = Array.from({ length: CONCURRENT_REQUESTS }).map((_, index) => {
    const mockUserId = new mongoose.Types.ObjectId();
    return jwt.sign({ id: mockUserId }, JWT_SECRET);
  });

  // 4. Fire 50 concurrent requests simultaneously using Promise.all
  console.log(`🔥 Launching ${CONCURRENT_REQUESTS} simultaneous votes targeting Option A...`);
  
  const voteRequests = mockTokens.map((token) => {
    return axios.post(
      `${BASE_URL}/polls/${pollId}/vote`,
      { optionId: targetOptionId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).catch(err => {
      // Return error response so Promise.all does not fail early
      return { status: err.response?.status || 500, error: err.message };
    });
  });

  const startTime = Date.now();
  const results = await Promise.all(voteRequests);
  const duration = Date.now() - startTime;

  console.log(`⏱️ All requests completed in ${duration}ms`);

  // Count success vs failure
  let successCount = 0;
  let failureCount = 0;
  results.forEach(res => {
    if (res.status === 200) successCount++;
    else failureCount++;
  });

  console.log(`🟢 Successful votes returned: ${successCount}`);
  console.log(`🔴 Failed votes returned: ${failureCount}`);

  // 5. Query the database to verify actual counts and race condition resistance
  const finalPollState = await Poll.findById(pollId);
  const targetOption = finalPollState.options.find(opt => opt._id.toString() === targetOptionId);
  const actualVotesInDB = targetOption.votes;
  const votersRegisteredCount = finalPollState.voters.length;

  console.log('\n--- VERIFICATION RESULTS ---');
  console.log(`Expected vote increment: ${CONCURRENT_REQUESTS}`);
  console.log(`Actual votes in database: ${actualVotesInDB}`);
  console.log(`Voters array size in DB: ${votersRegisteredCount}`);

  if (actualVotesInDB === CONCURRENT_REQUESTS && votersRegisteredCount === CONCURRENT_REQUESTS) {
    console.log('\n🎉 SUCCESS: High concurrency test passed! No race conditions or lost votes detected.');
    console.log('Database state matches atomic query constraints.');
  } else {
    console.error('\n❌ FAILURE: Race condition detected! Database counts are inconsistent.');
    console.error(`Lost votes: ${CONCURRENT_REQUESTS - actualVotesInDB}`);
  }

  // Cleanup test poll
  await Poll.deleteOne({ _id: pollId });
  console.log('\n🧹 Database cleaned. Test complete.');
  
  await mongoose.disconnect();
}

runConcurrencyTest();
