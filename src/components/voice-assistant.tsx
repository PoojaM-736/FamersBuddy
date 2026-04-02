"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Volume2, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { provideVoiceGuidance } from "@/ai/flows/provide-voice-guidance";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/components/language-provider";
import { Language } from "@/lib/translations";

// Mapping app language to Web Speech API language codes
const SPEECH_LANG_MAP: Record<Language, string> = {
  en: 'en-US',
  ta: 'ta-IN',
  hi: 'hi-IN',
  pa: 'pa-IN',
  mr: 'mr-IN',
};

export function VoiceAssistant() {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Speech Recognition on the client side
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      
      // Update recognition language whenever the app language changes
      recognitionInstance.lang = SPEECH_LANG_MAP[language] || 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          toast({
            variant: "destructive",
            title: "Speech Error",
            description: "Could not recognize speech. Please check your microphone permissions.",
          });
        }
      };

      setRecognition(recognitionInstance);
    }
  }, [toast, language]);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Your browser does not support speech recognition.",
      });
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      setTranscript("");
      setIsListening(true);
      try {
        recognition.start();
      } catch (e) {
        console.error("Failed to start recognition", e);
        setIsListening(false);
      }
    }
  };

  const handleProcessVoice = async (query: string) => {
    if (!query || isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await provideVoiceGuidance(query);
      if (audioRef.current) {
        audioRef.current.src = result.audioDataUri;
        audioRef.current.play().catch(e => {
          console.error("Audio playback blocked", e);
          toast({
            title: "Audio Playback",
            description: "Please click the play icon to hear Buddy's response.",
          });
        });
      }
    } catch (error) {
      console.error("Voice guidance failed", error);
      toast({
        variant: "destructive",
        title: "Buddy Error",
        description: "I couldn't process your request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically process when speech recognition ends naturally if there is a transcript
  useEffect(() => {
    if (!isListening && transcript && !isLoading) {
      handleProcessVoice(transcript);
    }
  }, [isListening]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="shadow-2xl border-primary/20 bg-background/95 backdrop-blur">
        <CardContent className="p-4 flex flex-col items-center gap-2">
          <audio ref={audioRef} hidden />
          
          <div className="flex items-center gap-3">
            {isListening ? (
              <div className="flex gap-1">
                <span className="w-1 h-4 bg-primary animate-bounce delay-75" />
                <span className="w-1 h-6 bg-primary animate-bounce delay-100" />
                <span className="w-1 h-4 bg-primary animate-bounce delay-150" />
              </div>
            ) : null}
            
            <Button
              size="icon"
              variant={isListening ? "destructive" : "default"}
              className="rounded-full w-12 h-12 shadow-lg"
              onClick={toggleListening}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : isListening ? (
                <Square className="fill-current" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>
            
            <div className="hidden sm:block text-sm font-medium">
              {isLoading ? t('loading') : isListening ? "Listening..." : t('askBuddy')}
            </div>
          </div>
          
          {transcript && (
            <div className="mt-2 text-xs text-muted-foreground max-w-[200px] truncate italic">
              "{transcript}"
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
