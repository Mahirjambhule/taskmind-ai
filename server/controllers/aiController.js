const { HfInference } = require('@huggingface/inference');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');
dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const summarizeNote = async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Content required' });

  try {
    const result = await hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: content,
      parameters: { max_length: 100, min_length: 30 }
    });
    res.status(200).json({ summary: result.summary_text });
  } catch (error) {
    console.error("HF Summary Error:", error.message);
    res.status(500).json({ message: 'AI Summary Failed' });
  }
};

const generatePlan = async (req, res) => {
  const { notes } = req.body;

  if (!notes || notes.length === 0) {
    return res.status(400).json({ message: 'No notes provided!' });
  }

  const actionableNotes = notes.filter(note => note.isTask === true);

  if (actionableNotes.length === 0) {
    return res.status(200).json({ plan: "You have no tasks marked for the daily plan. Add some tasks first!" });
  }

  const tasksText = actionableNotes.map(n => `- ${n.title}: ${n.content}`).join('\n');

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert productivity planner. Create a structured daily schedule based on the user's tasks."
        },
        {
          role: "user",
          content: `Here are my tasks:\n${tasksText}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1000,
    });

    res.status(200).json({ plan: chatCompletion.choices[0]?.message?.content || "No plan generated." });

  } catch (error) {
    console.error("Groq Plan Error:", error);
    res.status(500).json({ message: 'AI Planning Service Failed' });
  }
};

module.exports = { summarizeNote, generatePlan };