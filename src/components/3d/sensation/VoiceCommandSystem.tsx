
import React, { useEffect, useState, useCallback } from 'react';

// Extend the Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionError) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  }

  interface SpeechRecognitionError extends Event {
    error: string;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };
}

interface VoiceCommand {
  command: string;
  action: string;
  confidence: number;
}

interface VoiceCommandSystemProps {
  onCommand: (command: VoiceCommand) => void;
  isEnabled: boolean;
}

export const VoiceCommandSystem: React.FC<VoiceCommandSystemProps> = ({
  onCommand,
  isEnabled
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [hasSupport, setHasSupport] = useState(false);

  const commandPatterns = {
    legendary: /make.*legendary|more.*legendary|legendary/i,
    fire: /fire.*effect|add.*fire|flame/i,
    sparkle: /sparkle|glitter|shine/i,
    glow: /glow|bright|illuminate/i,
    chrome: /chrome|metallic|metal/i,
    holographic: /holographic|rainbow|prismatic/i,
    rotate: /rotate|spin|turn/i,
    zoom: /zoom.*in|bigger|larger/i,
    reset: /reset|clear|remove.*effect/i,
    flip: /flip|turn.*over/i
  };

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        console.log('🎤 Voice recognition started');
      };

      recognition.onend = () => {
        setIsListening(false);
        if (isEnabled) {
          // Restart listening if still enabled
          setTimeout(() => {
            try {
              recognition.start();
            } catch (error) {
              console.warn('Failed to restart voice recognition:', error);
            }
          }, 1000);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Voice recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const transcript = lastResult[0].transcript.toLowerCase().trim();
          const confidence = lastResult[0].confidence;
          
          console.log('🎤 Voice command:', transcript, 'confidence:', confidence);
          
          // Match command patterns
          for (const [action, pattern] of Object.entries(commandPatterns)) {
            if (pattern.test(transcript)) {
              onCommand({
                command: transcript,
                action,
                confidence
              });
              break;
            }
          }
        }
      };

      setRecognition(recognition);
      setHasSupport(true);
    } else {
      console.warn('Speech recognition not supported in this browser');
      setHasSupport(false);
    }
  }, [onCommand]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.warn('Failed to start voice recognition:', error);
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [recognition, isListening]);

  useEffect(() => {
    if (isEnabled && hasSupport) {
      startListening();
    } else {
      stopListening();
    }

    return () => {
      stopListening();
    };
  }, [isEnabled, hasSupport, startListening, stopListening]);

  if (!hasSupport) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-black/80 rounded-full p-3 backdrop-blur transition-all ${
        isListening ? 'bg-red-500/20 animate-pulse' : ''
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            isListening ? 'bg-red-500' : 'bg-gray-500'
          }`} />
          <span className="text-white text-sm">
            {isListening ? 'Listening...' : 'Voice Commands'}
          </span>
        </div>
        {isEnabled && (
          <div className="text-white text-xs mt-1 opacity-75">
            Try: "Make it legendary" or "Add fire effects"
          </div>
        )}
      </div>
    </div>
  );
};
