export type MessageType = "error" | "info" | "loading" | "success" | "warning";

export type MessageCloseDetail = {
  type: MessageType;
};

export type MessageShowOptions = {
  closable?: boolean;
  content: string;
  duration?: number;
  type?: MessageType;
};
