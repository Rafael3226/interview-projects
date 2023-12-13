import { IContent } from "./Content";

// ContentSet interface representing a collection of content items
export interface IContentSet {
  id: string;
  contents: Map<string, IContent>;
}

export default class ContentSet implements IContentSet {
  id: IContentSet["id"];
  contents: IContentSet["contents"];

  constructor({ id, items }: { id: string; items: IContent[] }) {
    this.id = id;
    this.contents = new Map();
    items.forEach((i) => {
      this.contents.set(i.contentId, i);
    });
  }

  add(content: IContent) {
    this.contents.set(content.contentId, content);
  }

  get(id: string): IContent | undefined {
    return this.contents.get(id);
  }

  has(id: string): boolean {
    return this.contents.has(id);
  }
}
