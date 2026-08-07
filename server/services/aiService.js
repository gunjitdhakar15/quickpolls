const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

// Initialize Gemini AI only if API key is provided
function getAIInstance() {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️ GEMINI_API_KEY is not set in environment variables. AI features will fallback to dummy analysis.');
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Summarizes the poll results and extracts sentiment using Gemini AI.
 * Falls back gracefully if API fails or is not configured.
 */
async function generatePollInsight(question, options) {
  const instance = getAIInstance();
  
  if (!instance) {
    return getFallbackInsight(question, options);
  }

  try {
    const model = instance.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const resultsString = options.map(opt => `- ${opt.text}: ${opt.votes} votes`).join('\n');
    const prompt = `You are a real-time polling data analyst. Analyze this poll:
Question: "${question}"
Results:
${resultsString}

Provide:
1. A concise, professional summary of the voting results (maximum 2 sentences).
2. The overall subject/tone sentiment (must be exactly 'positive', 'negative', or 'neutral').
3. A single expressive emoji matching the tone.

Return the result strictly as a valid JSON object with the keys "summary", "sentiment", and "emoji". Do not wrap the JSON in markdown formatting, backticks, or any conversational text.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Clean potential markdown wrap
    const cleanJSON = responseText.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleanJSON);
    
    return {
      summary: data.summary || 'Summary generated.',
      sentiment: data.sentiment || 'neutral',
      emoji: data.emoji || '📊'
    };
  } catch (error) {
    console.error('❌ Gemini AI Error:', error);
    return getFallbackInsight(question, options);
  }
}

function getFallbackInsight(question, options) {
  // Simple heuristic local fallback
  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);
  if (totalVotes === 0) {
    return {
      summary: 'No votes have been cast yet to generate analysis.',
      sentiment: 'neutral',
      emoji: '⏳'
    };
  }

  // Find winner
  const sorted = [...options].sort((a, b) => b.votes - a.votes);
  const winner = sorted[0];
  const isTie = sorted.length > 1 && sorted[0].votes === sorted[1].votes;
  
  let summary = '';
  if (isTie) {
    summary = `The poll is currently tied between multiple options, with "${winner.text}" leading. Total votes cast: ${totalVotes}.`;
  } else {
    const percentage = ((winner.votes / totalVotes) * 100).toFixed(1);
    summary = `"${winner.text}" is currently leading the poll with ${winner.votes} votes (${percentage}%). Total votes cast: ${totalVotes}.`;
  }

  return {
    summary,
    sentiment: 'neutral',
    emoji: '📊'
  };
}

module.exports = {
  generatePollInsight
};
