import { IContent } from "../entity/Content";
import { ILevel } from "../entity/Level";
import {
  BOOLEAN_AVAILABILITY,
  CONTENT_AVAILABILITY,
  CONTENT_FORMAT_TYPE,
  CONTENT_TYPE,
  LEVEL_TYPE,
} from "../enum";

export interface IOptions {
  contentType?: CONTENT_TYPE;
  formatType?: CONTENT_FORMAT_TYPE;
}
export type ContentItemsAvailability = Map<string, boolean>;

interface IContentFilteringUseCase {
  options?: IOptions;
  execute(date: Date): ContentItemsAvailability;
}

type ContentId = string;
type LevelType = string;

export default class ContentFilteringUseCase
  implements IContentFilteringUseCase
{
  options?: IOptions;
  private map: Map<ContentId, Map<LevelType, IContent>>;
  constructor({ levels, options }: { levels: ILevel[]; options?: IOptions }) {
    this.options = options;
    this.map = new Map();
    this.setMap(levels);
  }

  private setMap(levels: ILevel[]) {
    levels.forEach((level) => {
      level.contentItems.forEach((item) => {
        let levelMap = this.map.get(item.contentId);
        if (!levelMap) {
          levelMap = new Map();
          this.map.set(item.contentId, levelMap);
        }
        if (!levelMap.has(level.type)) {
          levelMap.set(level.type, item);
        }
      });
    });
  }

  execute(date: Date): ContentItemsAvailability {
    const result = new Map();
    this.map.forEach((levelMap, contentId) => {
      let isAvailable = false;
      let isLocked = false;

      for (const type in LEVEL_TYPE) {
        const content = levelMap.get(type);
        if (!content || isLocked) continue;

        isAvailable = BOOLEAN_AVAILABILITY[content.availability];

        // Check publish start and end dates
        const isFuturePublishStart =
          content.publishStartAt && content.publishStartAt > date;

        const isPastPublishEnd =
          content.publishEndAt && content.publishEndAt < date;
        if (isFuturePublishStart || isPastPublishEnd) {
          isAvailable = false;
        }

        if (
          content.locked ||
          content.availability === CONTENT_AVAILABILITY.NEVER ||
          content.availability === CONTENT_AVAILABILITY.ALWAYS
        ) {
          isLocked = true;
        }
      }
      result.set(contentId, isAvailable);
    });

    return result;
  }
}
