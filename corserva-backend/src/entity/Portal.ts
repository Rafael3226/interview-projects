import { IContentItem } from "./ContentItem";
import { IContent[] } from "../delete/ContentSet";
import { ITemplate } from "./Template";

export interface IPortal {
  id: string;
  name: string;
  template: ITemplate;
  contentItems: IContent[];
  sharedContentItems: IContent[];
  hiddenContentItems: IContent[];
  adHocContentItems: IContent[];

  configureContentVisibility(contentIds: string[], hidden: boolean): void;
  addAdHocContent(content: IContentItem): void;
  getEffectiveContent(): IContent[];

  getSharedContent(): IContent[];
}

// export default class Portal implements IPortal {}
