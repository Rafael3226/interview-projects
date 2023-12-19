export enum CONTENT_TYPE {
  DIGITAL_ASSET = "digitalasset",
  QUESTION = "question",
}

export enum CONTENT_AVAILABILITY {
  NEVER = "never",
  HIDE = "hide",
  SHOW = "show",
  ALWAYS = "always",
}

export const BOOLEAN_AVAILABILITY = {
  [CONTENT_AVAILABILITY.NEVER]: false,
  [CONTENT_AVAILABILITY.HIDE]: false,
  [CONTENT_AVAILABILITY.SHOW]: true,
  [CONTENT_AVAILABILITY.ALWAYS]: true,
};

export enum CONTENT_FORMAT_TYPE {
  VIDEO = "video",
  DOCUMENT = "document",
}

export enum LEVEL_TYPE {
  CONTENT_SET = "contentset",
  TEMPLATE = "template",
  PORTAL = "portal",
  MEMBER = "member", // Added for future enhancement
}
