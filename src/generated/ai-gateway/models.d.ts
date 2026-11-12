import "@lovable.dev/ai-gateway";

/* The MIT License

Copyright (c) OpenAI (https://openai.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
declare namespace ModelContract_2cd0b36f7d297877 {
export type paths = Record<string, never>;
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        GatewayErrorResponse: {
            error: {
                code?: string | null;
                message: string;
                metadata?: {
                    provider_name?: unknown;
                    raw?: unknown;
                };
                param?: unknown;
                type?: string;
            };
            usage?: {
                [key: string]: unknown;
            };
        };
        Output_CreateTranscriptionResponseJson: {
            languages?: components["schemas"]["Output_TranscriptionLanguage"][];
            logprobs?: {
                bytes?: number[];
                logprob?: number;
                token?: string;
            }[];
            text: string;
            usage?: components["schemas"]["Output_TranscriptTextUsageTokens"] | components["schemas"]["Output_TranscriptTextUsageDuration"];
        };
        Output_CreateTranscriptionResponseStreamEvent: components["schemas"]["Output_TranscriptTextSegmentEvent"] | components["schemas"]["Output_TranscriptTextDeltaEvent"] | components["schemas"]["Output_TranscriptTextDoneEvent"];
        Output_TranscriptionLanguage: {
            code: string;
        };
        Output_TranscriptTextDeltaEvent: {
            delta: string;
            logprobs?: {
                bytes?: number[];
                logprob?: number;
                token?: string;
            }[];
            segment_id?: string;
            
            type: "transcript.text.delta";
        };
        Output_TranscriptTextDoneEvent: {
            languages?: components["schemas"]["Output_TranscriptionLanguage"][];
            logprobs?: {
                bytes?: number[];
                logprob?: number;
                token?: string;
            }[];
            text: string;
            
            type: "transcript.text.done";
            usage?: components["schemas"]["Output_TranscriptTextUsageTokens"];
        };
        Output_TranscriptTextSegmentEvent: {
            
            end: number;
            id: string;
            speaker: string;
            
            start: number;
            text: string;
            
            type: "transcript.text.segment";
        };
        Output_TranscriptTextUsageDuration: {
            
            seconds: number;
            
            type: "duration";
        };
        Output_TranscriptTextUsageTokens: {
            input_token_details?: {
                audio_tokens?: number;
                text_tokens?: number;
            };
            input_tokens: number;
            output_tokens: number;
            total_tokens: number;
            
            type: "tokens";
        };
        TranscriptionEvent: components["schemas"]["Output_CreateTranscriptionResponseStreamEvent"] | components["schemas"]["GatewayErrorResponse"];
        
        TranscriptionInclude: "logprobs";
        TranscriptionRequest: {
            chunking_strategy?: ("auto" | components["schemas"]["VadConfig"]) | null;
            
            file: Blob;
            include?: components["schemas"]["TranscriptionInclude"][];
            keywords?: string[];
            known_speaker_names?: string[];
            known_speaker_references?: string[];
            language?: string;
            languages?: string[];
            
            model: "openai/gpt-transcribe";
            prompt?: string;
            
            response_format?: "json" | "text";
            stream?: boolean | null;
            
            temperature?: number;
            
            timestamp_granularities?: ("word" | "segment")[];
        };
        TranscriptionResponse: components["schemas"]["Output_CreateTranscriptionResponseJson"] | string;
        VadConfig: {
            
            prefix_padding_ms?: number;
            
            silence_duration_ms?: number;
            
            threshold?: number;
            
            type: "server_vad";
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;

}
declare module "@lovable.dev/ai-gateway" {
  interface GeneratedModelsBySurface {
    "chat-completions": "google/gemini-2.5-flash" | "google/gemini-2.5-flash-image" | "google/gemini-2.5-flash-lite" | "google/gemini-2.5-pro" | "google/gemini-3-flash-preview" | "google/gemini-3-pro-image" | "google/gemini-3.1-flash-image" | "google/gemini-3.1-flash-lite" | "google/gemini-3.1-pro-preview" | "google/gemini-3.5-flash" | "google/gemini-3.6-flash" | "google/gemini-3.7-flash" | "google/gemini-3.8-flash" | "openai/chat-latest" | "openai/gpt-5" | "openai/gpt-5-mini" | "openai/gpt-5-nano" | "openai/gpt-5.2" | "openai/gpt-5.4" | "openai/gpt-5.4-mini" | "openai/gpt-5.4-nano" | "openai/gpt-5.5" | "openai/gpt-5.6-luna" | "openai/gpt-5.6-sol" | "openai/gpt-5.6-terra" | "openai/gpt-6-astra";
    "responses": "openai/chat-latest" | "openai/gpt-5" | "openai/gpt-5-mini" | "openai/gpt-5-nano" | "openai/gpt-5.2" | "openai/gpt-5.4" | "openai/gpt-5.4-mini" | "openai/gpt-5.4-nano" | "openai/gpt-5.4-pro" | "openai/gpt-5.5" | "openai/gpt-5.5-pro" | "openai/gpt-5.6-luna" | "openai/gpt-5.6-sol" | "openai/gpt-5.6-terra" | "openai/gpt-6-astra";
    "messages": never;
    "interactions": never;
    "image-generation": "google/gemini-2.5-flash-image" | "google/gemini-3-pro-image" | "google/gemini-3.1-flash-image" | "google/gemini-3.1-flash-lite-image" | "openai/gpt-image-1-mini" | "openai/gpt-image-2";
    "image-edit": "openai/gpt-image-1-mini" | "openai/gpt-image-2";
    "embeddings": "google/gemini-embedding-001" | "google/gemini-embedding-2" | "openai/text-embedding-3-large" | "openai/text-embedding-3-small";
    "speech": "google/gemini-2.5-flash-lite-preview-tts" | "google/gemini-2.5-flash-tts" | "google/gemini-2.5-pro-tts" | "google/gemini-3.1-flash-tts-preview" | "openai/gpt-4o-mini-tts";
    "transcription": "google/gemini-3.5-transcribe" | "openai/gpt-4o-mini-transcribe" | "openai/gpt-4o-transcribe" | "openai/gpt-transcribe";
    "music": never;
    "videos": "google/gemini-omni-1.1-flash" | "google/veo-3.1" | "google/veo-3.1-fast" | "google/veo-3.1-lite";
    "systemone": never;
    "live": never;
  }
  interface TranscriptionFieldsByModel {
    "openai/gpt-transcribe": ModelContract_2cd0b36f7d297877.components["schemas"]["TranscriptionRequest"];
  }
  interface TranscriptionResponseByModel {
    "openai/gpt-transcribe": ModelContract_2cd0b36f7d297877.components["schemas"]["TranscriptionResponse"];
  }
  interface TranscriptionEventByModel {
    "openai/gpt-transcribe": ModelContract_2cd0b36f7d297877.components["schemas"]["TranscriptionEvent"];
  }
}
