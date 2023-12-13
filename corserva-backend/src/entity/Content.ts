import {
  CONTENT_AVAILABILITY,
  CONTENT_FORMAT_TYPE,
  CONTENT_TYPE,
} from "../enum";
import { IPortal } from "./Portal";

// Content interface representing either a digital asset or a question
export interface IContent {
  contentId: string;
  contentSetId: string;
  contentType: CONTENT_TYPE;
  formatType: CONTENT_FORMAT_TYPE;
  availability: CONTENT_AVAILABILITY;
  locked: boolean;
  portalId: IPortal["id"];
  publishStartAt?: Date;
  publishEndAt?: Date;
}

export default class Content implements IContent {
  contentId: IContent["contentId"];
  contentSetId: IContent["contentSetId"];
  contentType: IContent["contentType"];
  availability: IContent["availability"];
  locked: IContent["locked"];
  portalId: IContent["portalId"];
  publishStartAt?: IContent["publishStartAt"];
  publishEndAt?: IContent["publishEndAt"];
  formatType: IContent["formatType"];

  constructor(props: IContent) {
    Object.assign(this, props);
  }
}
