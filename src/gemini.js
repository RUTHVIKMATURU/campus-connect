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

export async function askGemini(prompt) {
  const key = getNextApiKey();

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();

  if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  } else {
    return 'Sorry, I couldn’t understand that.';
  }
}
