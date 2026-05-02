export type SplitterOrientation = "horizontal" | "vertical";

export type SplitterProps = {
  lazy?: boolean;
  orientation?: SplitterOrientation;
  vertical?: boolean;
};

export type SplitterPanelProps = {
  defaultSize?: number | string;
  max?: number | string;
  min?: number | string;
  resizable?: boolean;
  size?: number | string;
};

export type SplitterResizeDetail = {
  sizes: string[];
};

export type SplitterResizeStartDetail = SplitterResizeDetail;
export type SplitterResizeEndDetail = SplitterResizeDetail;

export type SplitterDraggerDoubleClickDetail = {
  index: number;
  sizes: string[];
};
