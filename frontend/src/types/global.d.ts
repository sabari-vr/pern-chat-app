// global.d.ts is a special file. Types added here can be used globally in the project without importing them.
declare module "react-dom/client";

type ConversationType = {
  id: string;
  fullName: string;
  profilePic: string;
};

declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "react-dom/client" {
  import { Root } from "react-dom";
  export function createRoot(container: Element | DocumentFragment): Root;
  // You may need to add other exports here if you're using them
}
