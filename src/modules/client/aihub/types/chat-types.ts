export type ResponseMode = "ask" | "actions" | "analytics";

export type VoiceMode = "off" | "speech-to-text" | "voice-to-voice";

export interface ChatInputProps {
  onSubmit?: (message: { text: string; files: any[] }) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
}
