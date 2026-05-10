import type { ConfigControlSection, InspectorTab } from "./InspectorTabs.types";

export const inspectorTabs: InspectorTab[] = [
  {
    icon: "sliders-horizontal",
    id: "config",
    label: "Config"
  },
  {
    icon: "highlighter",
    id: "annotation",
    label: "Annotation"
  },
  {
    icon: "message-square",
    id: "comment",
    label: "Comment"
  }
];

export const configControlSections: ConfigControlSection[] = [
  {
    id: "material",
    title: "Material",
    description: "Surface values that shape the coat material.",
    controls: [
      {
        type: "color",
        label: "Coat color",
        description: "Apply a tint over the current material."
      },
      {
        type: "pending",
        label: "Roughness",
        description: "Control how matte or glossy the leather appears."
      },
      {
        type: "pending",
        label: "Metalness",
        description: "Tune reflective highlights for hardware or trims."
      },
      {
        type: "pending",
        label: "Opacity",
        description: "Adjust material transparency for inspection modes."
      },
      {
        type: "pending",
        label: "Material preset",
        description: "Switch between leather, suede, cotton, or nylon looks."
      }
    ]
  },
  {
    id: "texture",
    title: "Texture",
    description: "Texture maps and pattern layers for later editing.",
    controls: [
      {
        type: "pending",
        label: "Normal intensity",
        description: "Adjust surface grain and seam depth."
      },
      {
        type: "pending",
        label: "Texture repeat",
        description: "Scale texture tiling across the garment."
      },
      {
        type: "pending",
        label: "Logo / decal",
        description: "Place a graphic layer on selected coat parts."
      },
      {
        type: "pending",
        label: "Pattern overlay",
        description: "Preview pattern layers over the base material."
      }
    ]
  },
  {
    id: "lighting",
    title: "Lighting",
    description: "Scene lighting controls for material review.",
    controls: [
      {
        type: "boolean",
        key: "showEnvironment",
        label: "Environment",
        description: "Use the studio environment light."
      },
      {
        type: "pending",
        label: "Environment intensity",
        description: "Increase or reduce reflection strength."
      },
      {
        type: "pending",
        label: "Directional light",
        description: "Control the key light strength."
      },
      {
        type: "pending",
        label: "Exposure",
        description: "Tune the final tone mapping exposure."
      }
    ]
  },
  {
    id: "display",
    title: "Display",
    description: "Helpers and visibility controls for inspecting the model.",
    controls: [
      {
        type: "boolean",
        key: "showGrid",
        label: "Grid",
        description: "Show the ground reference grid."
      },
      {
        type: "pending",
        label: "Bounding box",
        description: "Show the model bounds for scale review."
      },
      {
        type: "pending",
        label: "Part visibility",
        description: "Hide or isolate coat parts when meshes are mapped."
      },
      {
        type: "pending",
        label: "Camera preset",
        description: "Jump to front, side, back, or detail views."
      }
    ]
  },
  {
    id: "interaction",
    title: "Interaction",
    description: "Viewer controls that affect navigation behavior.",
    controls: [
      {
        type: "boolean",
        key: "autoRotate",
        label: "Auto rotate",
        description: "Rotate the model automatically."
      },
      {
        type: "boolean",
        key: "canZoom",
        label: "Zoom",
        description: "Allow wheel and pinch zoom."
      },
      {
        type: "boolean",
        key: "useDamping",
        label: "Damping",
        description: "Smooth orbit movement."
      },
      {
        type: "pending",
        label: "Screenshot",
        description: "Export the current viewer frame."
      }
    ]
  }
];
