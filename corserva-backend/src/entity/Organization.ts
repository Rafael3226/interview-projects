import { IContent } from "./Content";
import { ITemplate } from "./Template";

export interface IOrganization {
  id: string;
  name: string;
  templates: ITemplate[];
  sharedContent: IContent[];
}
