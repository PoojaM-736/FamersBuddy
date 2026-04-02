'use server';
/**
 * @fileOverview Provides a voice assistant flow for farmers to receive guidance on crop management, alerts, and instructions.
 *
 * - provideVoiceGuidance - A function that handles the voice assistant interaction.
 * - ProvideVoiceGuidanceInput - The input type for the provideVoiceGuidance function.
 * - ProvideVoiceGuidanceOutput - The return type for the provideVoiceGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';

const ProvideVoiceGuidanceInputSchema = z.string().describe('The farmer\'s query in their local language.');
export type ProvideVoiceGuidanceInput = z.infer<typeof ProvideVoiceGuidanceInputSchema>;

const ProvideVoiceGuidanceOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio response as a data URI (audio/wav).'),
});
export type ProvideVoiceGuidanceOutput = z.infer<typeof ProvideVoiceGuidanceOutputSchema>;

// Helper function to convert PCM audio to WAV format.
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const voiceAssistantPrompt = ai.definePrompt({
  name: 'voiceAssistantPrompt',
  input: {
    schema: z.object({ query: ProvideVoiceGuidanceInputSchema }),
  },
  output: {
    schema: z.string().describe('A textual response to the farmer\'s query.'),
  },
  prompt: `You are an AI-powered agricultural assistant named FarmersBuddy. 
Your goal is to provide helpful, clear, and concise guidance to Indian farmers.

CRITICAL LANGUAGE INSTRUCTION:
1. Detect the language of the user's query.
2. You MUST respond in the EXACT same language as the user.
   - If they speak Tamil, respond in Tamil.
   - If they speak Hindi, respond in Hindi.
   - If they speak Punjabi, respond in Punjabi.
   - If they speak Marathi, respond in Marathi.
3. Use a friendly, conversational tone, like a knowledgeable local farm expert.

The farmer's query is: {{{query}}}

Keep the response under 100 words so it is easy to listen to.`,
});

const provideVoiceGuidanceFlow = ai.defineFlow(
  {
    name: 'provideVoiceGuidanceFlow',
    inputSchema: ProvideVoiceGuidanceInputSchema,
    outputSchema: ProvideVoiceGuidanceOutputSchema,
  },
  async (query) => {
    // 1. Get textual response from the prompt
    const { output: textResponse } = await voiceAssistantPrompt({ query });

    if (!textResponse) {
      throw new Error('Failed to get a textual response from the voice assistant prompt.');
    }

    // 2. Convert text response to audio using TTS model
    // Note: Gemini TTS is generally multilingual and can handle the output text correctly
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // Algenib is a neutral voice good for instructions
          },
        },
      },
      prompt: textResponse,
    });

    if (!media) {
      throw new Error('No audio media returned from TTS model.');
    }

    // Extract raw audio buffer (PCM)
    const audioData = media.url.substring(media.url.indexOf(',') + 1);
    const audioBuffer = Buffer.from(audioData, 'base64');

    // Convert PCM to WAV and get base64 string
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);

export async function provideVoiceGuidance(input: ProvideVoiceGuidanceInput): Promise<ProvideVoiceGuidanceOutput> {
  return provideVoiceGuidanceFlow(input);
}
