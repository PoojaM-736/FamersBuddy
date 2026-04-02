'use server';
/**
 * @fileOverview A Genkit flow for predicting future crop price trends and suggesting optimal selling times.
 *
 * - predictMarketPrices - A function that handles the market price prediction process.
 * - PredictMarketPricesInput - The input type for the predictMarketPrices function.
 * - PredictMarketPricesOutput - The return type for the predictMarketPrices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const PredictMarketPricesInputSchema = z.object({
  cropName: z.string().describe('The name of the crop for which to predict market prices.'),
  region: z.string().describe('The geographical region where the crop is grown and sold.'),
  currentInventory: z.number().int().min(0).describe('The current inventory of the crop in units (e.g., kg, bushels).'),
  harvestDate: z.string().describe('The expected harvest date of the crop (e.g., "YYYY-MM-DD").'),
  historicalPriceSummary: z.string().optional().describe('An optional summary of historical price data for the crop in the region, if available.'),
});
export type PredictMarketPricesInput = z.infer<typeof PredictMarketPricesInputSchema>;

// Output Schema
const PredictMarketPricesOutputSchema = z.object({
  predictedPriceTrends: z.string().describe('A detailed description of the predicted future price trends for the crop.'),
  optimalSellTime: z.string().describe('The recommended best time to sell the crop to maximize profit.'),
  reasoning: z.string().describe('The reasoning behind the optimal sell time recommendation, considering market dynamics, seasonality, and other factors.'),
});
export type PredictMarketPricesOutput = z.infer<typeof PredictMarketPricesOutputSchema>;

// Wrapper function to be called from the frontend
export async function predictMarketPrices(input: PredictMarketPricesInput): Promise<PredictMarketPricesOutput> {
  return predictMarketPricesFlow(input);
}

// Genkit Prompt Definition
const prompt = ai.definePrompt({
  name: 'predictMarketPricesPrompt',
  input: {schema: PredictMarketPricesInputSchema},
  output: {schema: PredictMarketPricesOutputSchema},
  prompt: `You are an expert agricultural market analyst. Your task is to predict future crop price trends and recommend the optimal selling time for a farmer's produce to maximize profit.\n\nConsider the following information:\nCrop Name: {{{cropName}}}\nRegion: {{{region}}}\nCurrent Inventory: {{{currentInventory}}} units\nExpected Harvest Date: {{{harvestDate}}}\n{{#if historicalPriceSummary}}Historical Price Summary: {{{historicalPriceSummary}}}{{/if}}\n\nBased on this data, provide:\n1. Predicted price trends for the next few months, including any expected peaks or drops.\n2. The optimal time frame to sell the crop.\n3. A clear reasoning for your recommendation, referencing market dynamics, seasonality, regional factors, and potential supply/demand shifts.\n\nYour response MUST be a JSON object conforming to the PredictMarketPricesOutputSchema.`,
});

// Genkit Flow Definition
const predictMarketPricesFlow = ai.defineFlow(
  {
    name: 'predictMarketPricesFlow',
    inputSchema: PredictMarketPricesInputSchema,
    outputSchema: PredictMarketPricesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get market price prediction from prompt.');
    }
    return output;
  }
);
