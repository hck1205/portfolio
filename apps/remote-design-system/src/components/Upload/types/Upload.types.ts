export type UploadListType = "text" | "picture" | "picture-card" | "picture-circle";

export type UploadFileItem = {
  lastModified: number;
  name: string;
  size: number;
  status: "done";
  type: string;
  uid: string;
};

export type UploadChangeDetail = {
  fileList: UploadFileItem[];
};

export type UploadRemoveDetail = {
  file: UploadFileItem;
  fileList: UploadFileItem[];
};
