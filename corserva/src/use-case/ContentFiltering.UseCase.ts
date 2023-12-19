import Content, { IContent } from "../entity/Content";
import { ILevel } from "../entity/Level";
import { CONTENT_FORMAT_TYPE, CONTENT_TYPE, LEVEL_TYPE } from "../enum";

export interface IOptions {
  contentType?: CONTENT_TYPE;
  formatType?: CONTENT_FORMAT_TYPE;
}

export interface IContentFilteringUseCaseParameters {
  levels: ILevel[];
  options?: IOptions;
}

export type ContentAvailabilityMap = Map<IContent["contentId"], boolean>;
export type LevelsMap = Map<ILevel["type"], IContent>;
export type ContentLevelsMap = Map<IContent["contentId"], LevelsMap>;

export default class ContentFilteringUseCase {
  private static options?: IOptions = undefined;
  private static contentAvailabilityMap: ContentAvailabilityMap = new Map();
  private static map: ContentLevelsMap = new Map();

  public static execute(params: IContentFilteringUseCaseParameters) {
    ContentFilteringUseCase.options = params.options;
    ContentFilteringUseCase.setMap(params.levels);
    ContentFilteringUseCase.checkMap();
    const result = ContentFilteringUseCase.getContentAvailabilityMap();
    ContentFilteringUseCase.cleanUp();
    return result;
  }

  private static setMap(levels: ILevel[]) {
    const { map } = ContentFilteringUseCase;
    levels.forEach((level) => {
      level.contentItems.forEach((item) => {
        let levelsMap = map.get(item.contentId);
        if (!levelsMap) {
          levelsMap = new Map();
          map.set(item.contentId, levelsMap);
        }
        if (!levelsMap.has(level.type)) {
          levelsMap.set(level.type, item);
        }
      });
    });
  }

  private static checkMap() {
    const { map, contentAvailabilityMap } = ContentFilteringUseCase;
    map.forEach((levelMap, contentId) => {
      let isAvailable = false;

      for (const type of Object.values(LEVEL_TYPE)) {
        const contentObj = levelMap.get(type);
        if (!contentObj) continue;
        const content = new Content(contentObj);
        if (!ContentFilteringUseCase.getAvailabilityByOptions(content)) {
          break;
        }
        isAvailable = content.isAvailable(new Date());
        if (content.shouldLock()) {
          break;
        }
      }
      contentAvailabilityMap.set(contentId, isAvailable);
    });
  }

  private static getContentAvailabilityMap(): ContentAvailabilityMap {
    return ContentFilteringUseCase.contentAvailabilityMap;
  }

  private static getAvailabilityByOptions(content: IContent) {
    const { options } = ContentFilteringUseCase;

    if (!options) return true;

    const isContentTypeOk =
      options.contentType === undefined
        ? true
        : options.contentType === content.contentType;

    const isFormatType =
      options.formatType === undefined
        ? true
        : options.formatType === content.formatType;

    return isContentTypeOk && isFormatType;
  }

  private static cleanUp() {
    ContentFilteringUseCase.options = undefined;
    ContentFilteringUseCase.contentAvailabilityMap = new Map();
    ContentFilteringUseCase.map = new Map();
  }
}
