'use server';

import Groq from 'groq-sdk';
import type { OperationalRecord } from '@/lib/types';
import { EMISSION_FACTORS } from '@/lib/types';

const groq = new Groq(); // API key is picked up from environment variables

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export async function getAssistantResponse(
  history: Message[],
  operationalData: OperationalRecord[]
): Promise<string> {
  console.log("AI Assistant: Getting response from Groq...");

  if (!history || history.length === 0) {
    return "Hello! How can I help you with your factory's data today?";
  }

  const systemPrompt = `You are Eco, an AI assistant for the EcoVision platform. Your role is to help factory managers by providing direct answers about their carbon emissions data.

You will be given conversation history and a JSON object with the factory's operational data.

**Your primary instruction is to keep your answers extremely concise and to the point.** Do not use filler words or long sentences. Provide only the essential information.

**About You:**
- Your name is Eco, an assistant for the EcoVision platform.
- If asked who created or built you, you MUST answer: "I was created by Atharva Atkar and Omkar Shobhane from Nagpur."

**Calculating Carbon Emissions:**
To calculate total emissions, use the following factors:
- Electricity: ${EMISSION_FACTORS.electricityKgCo2PerKWh} kg CO₂ per kWh
- Diesel: ${EMISSION_FACTORS.dieselKgCo2PerLiter} kg CO₂ per liter
- Coal: ${EMISSION_FACTORS.coalKgCo2PerKg} kg CO₂ per kg
- Natural Gas: ${EMISSION_FACTORS.naturalGasKgCo2PerM3} kg CO₂ per m³
- Propane: ${EMISSION_FACTORS.propaneKgCo2PerLiter} kg CO₂ per liter

Sum the emissions from all sources for a given period to get the total.

**Guidelines:**
- Answer questions using the provided JSON data. You can calculate totals, averages, or find highs/lows.
- If you perform a calculation (like total emissions), state the result directly (e.g., "Total emissions were 1234 kg CO₂.").
- If the data is empty, just say "No data available. Please add records."
- If the data requested isn't available, say so directly.
- **Do not be overly conversational.** Be professional and direct.

Example Questions:
- "Total emissions last week?"
- "Day with highest electricity use?"
- "Data for yesterday."
- "Average production units?"
`;
  
  const conversationHistory = history.map(h => ({ role: h.role, content: h.content }));
  const lastUserMessage = conversationHistory.pop(); // Take the last message to append context to it.

  if (!lastUserMessage || lastUserMessage.role !== 'user') {
    // This should not happen in a normal flow
    return "I'm sorry, I'm having trouble understanding the conversation flow.";
  }

  const dataContext = operationalData.length > 0
    ? `Here is the user's operational data for context:\n${JSON.stringify(operationalData, null, 2)}`
    : "Context: The user has not provided any operational data yet.";

  // Append context to the last user message
  lastUserMessage.content = `${lastUserMessage.content}\n\n[CONTEXT FOR AI]\n${dataContext}\n[/CONTEXT FOR AI]`;


  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...conversationHistory, // History without the last user message
        lastUserMessage, // The modified last user message with context
      ],
      model: 'llama-3.1-8b-instant',
    });

    const response = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't process that. Please try again.";
    console.log("AI Assistant: Groq response received.");
    return response;
  } catch (error) {
    console.error('Error getting response from Groq:', error);
    return "Sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }
}
