import { LEVEL_TYPE } from "../enum";
import { IContent } from "./Content";

// Level interface representing the upstream and downstream hierarchies
export interface ILevel {
  type: LEVEL_TYPE;
  contentItems: IContent[];
}

export default class Level implements ILevel {
  type: ILevel["type"];
  contentItems: ILevel["contentItems"];

  constructor({ type, contentItems }: ILevel) {
    this.type = type;
    this.contentItems = contentItems;
  }
}
