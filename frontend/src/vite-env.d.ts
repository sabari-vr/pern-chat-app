// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_API_URL: string; // Add your specific environment variables here
  VITE_ANOTHER_VAR: string; // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
