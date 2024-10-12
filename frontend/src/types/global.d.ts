// global.d.ts is a special file. Types added here can be used globally in the project without importing them.

type ConversationType = {
  id: string;
  fullName: string;
  profilePic: string;
};

interface ImportMetaEnv {
  VITE_API_URL: string; // Example of adding a specific variable
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.mp3" {
  const src: string;
  export default src;
}
