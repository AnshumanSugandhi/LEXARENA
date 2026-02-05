export type Message = {
  role: "user" | "assistant";
  content: string;
  sections?: {
    section: string;
    title: string;
    preview: string;
  }[];
};
