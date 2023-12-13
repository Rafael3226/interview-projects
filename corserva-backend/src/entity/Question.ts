import { IContent } from "./Content";

// Question interface extending Content
export interface IQuestion extends IContent {
  question: string;
  answer: string;
}

export default class Question implements IQuestion {
  question: IQuestion["question"];
  answer: IQuestion["answer"];
  contentId: IQuestion["contentId"];
  contentSetId: IQuestion["contentSetId"];
  contentType: IQuestion["contentType"];
  availability: IQuestion["availability"];
  locked: IQuestion["locked"];
  portalId: IQuestion["portalId"];
  publishStartAt?: Date | undefined;
  publishEndAt?: Date | undefined;
}
