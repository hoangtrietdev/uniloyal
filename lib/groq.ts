import Groq from 'groq-sdk';

// Only instantiate if key is available (server-side only)
export const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

export const GROQ_MODEL = 'llama-3.3-70b-versatile';
