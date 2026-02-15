'use server';

import type { AnalyzeEmissionPatternsOutput, GenerateReductionRecommendationsOutput } from '@/ai/types';
import type { OperationalRecord } from '@/lib/types';
import Groq from 'groq-sdk';

// The Groq SDK automatically picks up the API key from the GROQ_API_KEY environment variable.
// We have this set in the .env file.
const groq = new Groq();

export async function runAnalysisAction(data: OperationalRecord[]): Promise<AnalyzeEmissionPatternsOutput> {
  console.log("Running REAL analysis action with Groq...");
  if (!data || data.length === 0) {
    throw new Error('No operational data provided for analysis.');
  }

  const systemPrompt = `You are an expert carbon emission analyst for small industrial factories. Your task is to analyze the provided daily operational data and identify key patterns and inefficiencies. Your analysis should also incorporate findings from advanced diagnostics like thermal imaging and acoustic analysis if they are provided with the data.
  
  Based on the data, you must generate a JSON object with the following structure. Each value must be a string containing a concise paragraph.
  
  {
    "overallEmissionSummary": "string",
    "peakUsageInsights": "string",
    "idleTimeInsights": "string",
    "inefficiencyInsights": "string",
    "abnormalEnergySpikes": "string",
    "potentialSavingsOverview": "string"
  }
  
  Analyze the data considering relationships between electricity/fuel consumption and production units/hours. Your analysis should be insightful and tailored to the provided data. Respond ONLY with the valid JSON object.`;

  try {
    const dataForPrompt = data.map(d => {
        let entry = `Date: ${d.date}, Electricity: ${d.electricity_kwh} kWh, Production: ${d.production_units} units, Hours: ${d.production_hours}h`;
        if (d.fuel_type && d.fuel_type !== 'none' && d.fuel_amount > 0) {
          let unit = '';
          switch (d.fuel_type) {
            case 'diesel': unit = 'L'; break;
            case 'coal': unit = 'kg'; break;
            case 'natural_gas': unit = 'm³'; break;
            case 'propane': unit = 'L'; break;
          }
          entry += `, Fuel: ${d.fuel_amount} ${unit} (${d.fuel_type})`;
        }
        if (d.thermal_image_description) {
            entry += `, Thermal Anomaly: "${d.thermal_image_description}"`;
        }
        if (d.acoustic_analysis_summary) {
            entry += `, Acoustic Anomaly: "${d.acoustic_analysis_summary}"`;
        }
        return entry;
    }).join('\n');

    const userContent = `Here is the operational data for the last ${data.length} days:\n${dataForPrompt}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userContent,
        },
      ],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Groq returned an empty response.');
    }

    const result = JSON.parse(responseContent) as AnalyzeEmissionPatternsOutput;
    console.log("Groq analysis successful.");
    return result;

  } catch (error) {
    console.error('Error during Groq analysis action:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during analysis.';
    throw new Error(`Analysis Failed: ${errorMessage}`);
  }
}

export async function getRecommendationsAction(
  analysis: AnalyzeEmissionPatternsOutput,
  operationalData: OperationalRecord[] // Keep this in the signature for potential future use
): Promise<GenerateReductionRecommendationsOutput> {
  console.log("Running REAL recommendations action with Groq...");
  if (!analysis) {
    throw new Error('Analysis results are required to generate recommendations.');
  }

  const systemPrompt = `You are a sustainability consultant for small industrial factories. Based on the provided emission analysis, generate a list of smart, actionable recommendations to reduce the factory's carbon footprint. The analysis may contain insights from thermal and acoustic diagnostics, so your recommendations should reflect those where applicable.
  
  You must generate a JSON object with a single key "recommendations", which is an array of strings. Each string in the array should be a complete recommendation in a single, insightful paragraph.
  
  Example format:
  {
    "recommendations": [
      "Based on the thermal imaging data showing an overheating motor, prioritize its maintenance to prevent failure and reduce wasted energy, which could lower related emissions by up to 15%.",
      "The detected high-frequency whine in the acoustic analysis suggests bearing wear in Machine B. Proactive replacement can prevent a costly breakdown and improve operational efficiency.",
      "Install automatic shutdown timers on equipment to cut energy waste during idle periods like pre-production hours or breaks, potentially saving up to 3% of daily energy consumption."
    ]
  }

  Generate 3-4 distinct and practical recommendations based on the analysis. Respond ONLY with the valid JSON object.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Here is the analysis of the factory's emissions: ${JSON.stringify(analysis, null, 2)}`,
        },
      ],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Groq returned an empty response for recommendations.');
    }

    const result = JSON.parse(responseContent) as GenerateReductionRecommendationsOutput;
    console.log("Groq recommendations successful.");

    // Validate that the result has the correct shape
    if (!result.recommendations || !Array.isArray(result.recommendations)) {
        throw new Error("AI did not return recommendations in the expected format.");
    }

    return result;

  } catch (error) {
    console.error('Error during Groq recommendations action:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during recommendation generation.';
    throw new Error(`Failed to Get Recommendations: ${errorMessage}`);
  }
}
