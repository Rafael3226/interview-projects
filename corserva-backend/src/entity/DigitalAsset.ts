import { CONTENT_FORMAT_TYPE } from "../enum";
import { IContent } from "./Content";

// DigitalAsset interface extending Content
export interface IDigitalAsset extends IContent {
  format: CONTENT_FORMAT_TYPE;
}

export default class DigitalAsset implements IDigitalAsset {
  formatType: IDigitalAsset["formatType"];
  format: IDigitalAsset["format"];
  contentId: IDigitalAsset["contentId"];
  contentSetId: IDigitalAsset["contentSetId"];
  contentType: IDigitalAsset["contentType"];
  availability: IDigitalAsset["availability"];
  locked: IDigitalAsset["locked"];
  portalId: IDigitalAsset["portalId"];
  publishStartAt?: IDigitalAsset["publishStartAt"];
  publishEndAt?: IDigitalAsset["publishEndAt"];
}
