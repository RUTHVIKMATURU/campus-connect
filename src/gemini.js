import { websiteKnowledge } from './data/websiteKnowledge';

const keys = import.meta.env.VITE_GEMINI_API_KEY.split(',');

let currentKeyIndex = 0;

const getNextApiKey = () => {
  if (!keys || keys.length === 0) {
    throw new Error('No API keys provided.');
  }
  const key = keys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % keys.length;
  return key;
};

/**
 * Sends a prompt to the Gemini API with website knowledge context
 * @param {string} prompt - The user's question or message
 * @returns {Promise<string>} - The AI's response
 */
export async function askGemini(prompt) {
  const key = getNextApiKey();

  // Create a system prompt with website knowledge
  const systemPrompt = `
You are Arya, the helpful assistant for the Campus Connect platform.
You have the following knowledge about the Campus Connect website:

${websiteKnowledge}

Please use this information to provide helpful, accurate responses about the Campus Connect platform.
Be friendly, concise, and informative. If you don't know something specific about the platform that isn't
covered in the knowledge base, you can provide general guidance but make it clear that the user might
want to check the specific details on the website or contact support.

IMPORTANT FORMATTING INSTRUCTIONS:
1. Format your responses using Markdown syntax for better readability
2. Use headings (## or ###) for section titles
3. Use bullet points or numbered lists when appropriate
4. Use **bold** or *italic* for emphasis
5. Use \`code\` formatting for technical terms or UI elements
6. Organize longer responses with clear sections
7. Keep paragraphs short and focused

Now, please respond to the user's question or message:
`;

  // Combine system prompt with user prompt
  const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}\n\nArya:`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  const data = await response.json();

  if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  } else {
    console.error('Error from Gemini API:', data);
    return 'Sorry, I couldn\'t understand that. Please try asking in a different way.';
  }
}
