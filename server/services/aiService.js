/**
 * Analyzes the poll question, answer choices, and voting results with Gemini.
 * Falls back gracefully if API fails or is not configured.
 */
async function generatePollInsight(question, options) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️ GEMINI_API_KEY is not set. AI features will use the local fallback.');
    return getFallbackInsight(question, options);
  }

  try {
    const answers = options.map((opt, index) => `${index + 1}. "${opt.text}" - ${opt.votes} votes`).join('\n');
    const prompt = `You are an expert poll analyst. Analyze the meaning and intent of the poll question, what each answer option represents, and how the voting results relate to the question. Do not only report the vote distribution.

Poll question: "${question}"
Answer options and results:
${answers}

Provide:
1. A concise, insightful analysis of the question and answer choices, followed by what the results suggest (maximum 3 sentences).
2. The overall subject/tone sentiment (must be exactly 'positive', 'negative', or 'neutral').
3. A single expressive emoji matching the tone.

Return the result strictly as a valid JSON object with the keys "summary", "sentiment", and "emoji". Do not wrap the JSON in markdown formatting, backticks, or any conversational text.`;

    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 250,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned ${response.status}`);
    }

    const result = await response.json();
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!responseText) {
      throw new Error('Gemini API returned an empty response');
    }

    const data = JSON.parse(responseText.replace(/^```json\s*|\s*```$/g, ''));
    const sentiment = ['positive', 'negative', 'neutral'].includes(data.sentiment)
      ? data.sentiment
      : 'neutral';

    return {
      summary: data.summary || 'Analysis generated.',
      sentiment,
      emoji: data.emoji || '📊'
    };
  } catch (error) {
    console.error('❌ Gemini AI Error:', error.message);
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