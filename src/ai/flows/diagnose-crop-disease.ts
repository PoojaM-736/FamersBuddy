'use server';
/**
 * @fileOverview A high-precision crop disease diagnosis AI agent.
 *
 * - diagnoseCropDisease - A function that handles the crop disease diagnosis process.
 * - DiagnoseCropDiseaseInput - The input type for the diagnoseCropDisease function.
 * - DiagnoseCropDiseaseOutput - The return type for the diagnoseCropDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseCropDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop's leaves, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z
    .string()
    .optional()
    .describe(
      'An optional description provided by the farmer about the crop or observed symptoms.'
    ),
});
export type DiagnoseCropDiseaseInput = z.infer<
  typeof DiagnoseCropDiseaseInputSchema
>;

const DiagnoseCropDiseaseOutputSchema = z.object({
  identification: z.object({
    isCrop: z.boolean().describe('Whether or not the input image contains a crop.'),
    commonName: z
      .string()
      .describe('The common name of the identified crop, if any.'),
    latinName: z
      .string()
      .describe('The Latin name of the identified crop, if any.'),
  }),
  diagnosis: z.object({
    diseaseDetected: z
      .boolean()
      .describe('Whether a disease was detected in the crop.'),
    diseaseName: z
      .string()
      .describe('The name of the detected disease, or "No disease" if none.'),
    confidence: z
      .number()
      .describe('The confidence percentage of the detection (0-100).'),
    severity: z
      .string()
      .describe('The severity level of the disease (e.g., "low", "medium", "high").'),
    treatment: z
      .string()
      .describe('Suggested treatment with specific metrics (e.g., "Copper 2g/L", "Apply Urea 10g").'),
    treatmentTamil: z
      .string()
      .describe('The treatment recommendation translated into Tamil.'),
  }),
});
export type DiagnoseCropDiseaseOutput = z.infer<
  typeof DiagnoseCropDiseaseOutputSchema
>;

export async function diagnoseCropDisease(
  input: DiagnoseCropDiseaseInput
): Promise<DiagnoseCropDiseaseOutput> {
  return diagnoseCropDiseaseFlow(input);
}

const diagnoseCropDiseasePrompt = ai.definePrompt({
  name: 'diagnoseCropDiseasePrompt',
  input: {schema: DiagnoseCropDiseaseInputSchema},
  output: {schema: DiagnoseCropDiseaseOutputSchema},
  prompt: `You are an expert plant pathologist specialized in Indian agriculture.
Your task is to analyze the provided image of a crop's leaves and an optional description to identify the crop, detect any diseases, determine their severity, and suggest appropriate treatments.

CRITICAL INSTRUCTIONS:
1. Provide a numerical confidence score (0-100) like a specialized machine learning model (e.g., 92%).
2. Treatment MUST include specific application metrics (e.g., "Spray Copper Oxychloride 2g per Liter of water").
3. Provide the treatment recommendation in both English and Tamil.

If no disease is detected:
- 'diseaseDetected' = false
- 'diseaseName' = "Healthy Crop"
- 'confidence' = [Your confidence score]
- 'treatment' = "Continue regular monitoring."
- 'treatmentTamil' = "தொடர்ந்து கண்காணிக்கவும்."

Crop Description: {{{description}}}
Crop Leaves Photo: {{media url=photoDataUri}}`,
});

const diagnoseCropDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnoseCropDiseaseFlow',
    inputSchema: DiagnoseCropDiseaseInputSchema,
    outputSchema: DiagnoseCropDiseaseOutputSchema,
  },
  async (input) => {
    const {output} = await diagnoseCropDiseasePrompt(input);
    return output!;
  }
);
