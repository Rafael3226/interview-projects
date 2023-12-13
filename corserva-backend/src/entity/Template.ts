import { IContent } from "./Content";
import { IOrganization } from "./Organization";
import { IPortal } from "./Portal";

// Template interface representing the base template for portals
export interface ITemplate {
  id: string;
  name: string;
  organization: IOrganization;
  portals: IPortal[];
  content: IContent[];

  overrideContent(portalContent: IContent[]): void;
  getEffectiveContent(): IContent[];
  getSharedContent(): IContent[];
}
