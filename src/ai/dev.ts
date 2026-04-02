import { config } from 'dotenv';
config();

import '@/ai/flows/recommend-soil-management.ts';
import '@/ai/flows/generate-climate-guidance.ts';
import '@/ai/flows/diagnose-crop-disease.ts';
import '@/ai/flows/predict-market-prices.ts';
import '@/ai/flows/provide-voice-guidance.ts';