'use server';
/**
 * @fileOverview An AI agent that provides climate-driven guidance on optimal crop choices,
 * sowing times, and irrigation schedules based on real-time climate data.
 *
 * - generateClimateGuidance - A function that handles the climate guidance process.
 * - ClimateGuidanceInput - The input type for the generateClimateGuidance function.
 * - ClimateGuidanceOutput - The return type for the generateClimateGuidance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ClimateGuidanceInputSchema = z.object({
  location: z.string().describe('The geographical location for which climate data is relevant.'),
  currentWeather: z.string().describe('A description of the current weather conditions (e.g., "sunny", "light rain").'),
  temperatureCelsius: z.number().describe('Current temperature in Celsius.'),
  humidityPercent: z.number().describe('Current humidity as a percentage.'),
  windSpeedKph: z.number().describe('Current wind speed in kilometers per hour.'),
  rainfallLast24HoursMm: z.number().describe('Rainfall in the last 24 hours in millimeters.'),
  soilType: z.string().describe('Description of the soil type (e.g., "sandy loam", "clay").'),
  historicalWeatherDataSummary: z.string().describe('A summary of historical weather patterns for the location.'),
});
export type ClimateGuidanceInput = z.infer<typeof ClimateGuidanceInputSchema>;

const ClimateGuidanceOutputSchema = z.object({
  optimalCropChoices: z.array(z.string()).describe('A list of recommended crops based on climate and soil data.'),
  sowingTimeGuidance: z.string().describe('Detailed guidance on the best sowing time considering current and forecasted climate.'),
  irrigationScheduleGuidance: z.string().describe('Recommendations for irrigation schedules, including frequency and quantity.'),
  climateInsights: z.string().describe('General insights and proactive advice based on the climate data to minimize risks and optimize yield.'),
});
export type ClimateGuidanceOutput = z.infer<typeof ClimateGuidanceOutputSchema>;

export async function generateClimateGuidance(input: ClimateGuidanceInput): Promise<ClimateGuidanceOutput> {
  return generateClimateGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'climateGuidancePrompt',
  input: { schema: ClimateGuidanceInputSchema },
  output: { schema: ClimateGuidanceOutputSchema },
  prompt: `You are an AI agricultural expert specializing in climate modeling and crop management.
Given the following real-time and historical climate data, soil information, and current weather, provide optimal guidance for farmers.
Your advice should cover optimal crop choices, best sowing times, irrigation schedules, and general climate insights to minimize climate-related crop failures and promote sustainable agricultural practices.

Here is the data:
Location: {{{location}}}
Current Weather: {{{currentWeather}}}
Temperature: {{{temperatureCelsius}}}°C
Humidity: {{{humidityPercent}}}%
Wind Speed: {{{windSpeedKph}}} km/h
Rainfall Last 24 Hours: {{{rainfallLast24HoursMm}}} mm
Soil Type: {{{soilType}}}
Historical Weather Data Summary: {{{historicalWeatherDataSummary}}}

Please provide your guidance in a structured JSON format as described in the output schema.`,
});

const generateClimateGuidanceFlow = ai.defineFlow(
  {
    name: 'generateClimateGuidanceFlow',
    inputSchema: ClimateGuidanceInputSchema,
    outputSchema: ClimateGuidanceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
