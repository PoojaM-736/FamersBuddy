'use server';
/**
 * @fileOverview An AI agent that provides soil management recommendations based on qualitative observations (No-Lab Analysis).
 *
 * - recommendSoilManagement - A function that handles the qualitative soil analysis process.
 * - SoilAnalysisInput - The input type for the qualitative analysis.
 * - SoilAnalysisOutput - The return type for the analysis results.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SoilAnalysisInputSchema = z.object({
  color: z.string().describe('The color of the soil (e.g., Red, Black, Brown).'),
  texture: z.string().describe('The feel of the soil when wet (e.g., Sticky Clay, Gritty Sand, Smooth Loam).'),
  digTest: z.string().describe('How hard it is to dig a 1-foot hole (e.g., Very Hard, Loose, Normal).'),
  waterTest: z.string().describe('How water behaves on the surface (e.g., Drains instantly, Puddles for hours, Soaks in slowly).'),
  cropHistory: z.string().describe('What was grown in this soil last season.'),
  plannedCrop: z.string().describe('What the farmer intends to grow next.'),
  plantSymptoms: z.string().describe('Observed issues in current or previous plants (e.g., Yellow leaves, Stunted growth).'),
  organicMatter: z.string().describe('Presence of worms or decaying roots (e.g., None seen, Plenty of worms).'),
  region: z.string().default('Tamil Nadu').describe('The specific region for local soil context.'),
});
export type SoilAnalysisInput = z.infer<typeof SoilAnalysisInputSchema>;

const SoilAnalysisOutputSchema = z.object({
  soilHealthScore: z.number().min(0).max(100).describe('An overall percentage score of soil health.'),
  estimatedPh: z.string().describe('Estimated pH range based on observations.'),
  nutrientDeficiency: z.array(z.string()).describe('List of suspected nutrient deficiencies.'),
  npkRecommendation: z.object({
    urea: z.string().describe('Recommended Urea dose in grams per plant.'),
    dap: z.string().describe('Recommended DAP (Phosphorus) dose in grams per plant.'),
    mop: z.string().describe('Recommended MOP (Potassium) dose in grams per plant.'),
    timing: z.string().describe('When to apply these fertilizers.'),
  }),
  recommendedCrops: z.array(z.string()).describe('Crops that will thrive in these current conditions.'),
  organicAction: z.string().describe('Immediate organic fix (e.g., Panchagavya, Green Manure).'),
});
export type SoilAnalysisOutput = z.infer<typeof SoilAnalysisOutputSchema>;

export async function recommendSoilManagement(input: SoilAnalysisInput): Promise<SoilAnalysisOutput> {
  return recommendSoilManagementFlow(input);
}

const recommendSoilManagementPrompt = ai.definePrompt({
  name: 'recommendSoilManagementPrompt',
  input: {schema: SoilAnalysisInputSchema},
  output: {schema: SoilAnalysisOutputSchema},
  prompt: `You are an expert soil scientist from TNAU (Tamil Nadu Agricultural University). 
Your task is to provide a "No-Lab" scientific soil analysis based on qualitative field observations.

Context: The farmer is likely in {{region}}, specifically dealing with local soil types like Red Loam or Black Cotton soil.

Observations provided:
- Color: {{{color}}}
- Texture: {{{texture}}}
- Digging Ease: {{{digTest}}}
- Drainage: {{{waterTest}}}
- Last Crop: {{{cropHistory}}}
- Target Crop: {{{plannedCrop}}}
- Symptoms: {{{plantSymptoms}}}
- Life/Worms: {{{organicMatter}}}

Based on these specific observations:
1. Estimate the Nitrogen, Phosphorus, and Potassium needs.
2. Provide EXACT fertilizer dosages in "grams per plant" for the planned crop.
3. Suggest the 3 best crops for this specific soil state.
4. Give a practical organic remedy (like Jeevamrutham or specific oil cakes).

Format the output strictly according to the schema. Be precise with the "grams per plant" metrics.`,
});

const recommendSoilManagementFlow = ai.defineFlow(
  {
    name: 'recommendSoilManagementFlow',
    inputSchema: SoilAnalysisInputSchema,
    outputSchema: SoilAnalysisOutputSchema,
  },
  async input => {
    const {output} = await recommendSoilManagementPrompt(input);
    return output!;
  }
);
