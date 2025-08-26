/// <reference types="vite/client" />

declare global {
  interface Window {
    TikTok?: {
      reloadEmbeds: () => void;
    };
  }
}

export {};
