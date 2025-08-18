const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getAIResponse(prompt, maxTokens = 200) {
  const resp = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.7,
  });

  return resp.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not generate a response.';
}

module.exports = { getAIResponse };
