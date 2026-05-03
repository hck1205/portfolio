export type TransferDirection = "left" | "right";
export type TransferStatus = "error" | "warning";

export type TransferItem = {
  disabled?: boolean;
  description?: string;
  key: string;
  title: string;
};

export type TransferChangeDetail = {
  direction: TransferDirection;
  moveKeys: string[];
  targetKeys: string[];
};

export type TransferSelectChangeDetail = {
  sourceSelectedKeys: string[];
  targetSelectedKeys: string[];
};

export type TransferSearchDetail = {
  direction: TransferDirection;
  value: string;
};
