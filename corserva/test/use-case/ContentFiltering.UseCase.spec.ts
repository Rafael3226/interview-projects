import Content, { IContent } from "../../src/entity/Content";
import Level, { ILevel } from "../../src/entity/Level";
import {
  CONTENT_AVAILABILITY,
  CONTENT_FORMAT_TYPE,
  CONTENT_TYPE,
  LEVEL_TYPE,
} from "../../src/enum";
import ContentFilteringUseCase from "../../src/use-case/ContentFiltering.UseCase";

describe("Content Filtering Use Case", () => {
  const contentObject = {
    contentId: "pnRMgdJKJ0BAD4E",
    contentSetId: "WHEKxCFDUQ",
    contentType: CONTENT_TYPE.DIGITAL_ASSET,
    formatType: CONTENT_FORMAT_TYPE.VIDEO,
    availability: CONTENT_AVAILABILITY.SHOW,
    isLocked: false,
  };

  describe("Execute", () => {
    it("Should return a empty map if no levels provided", () => {
      const map = ContentFilteringUseCase.execute({ levels: [] });
      expect(map.size).toBe(0);
    });

    it("Should return a map with contentId and evaluated visibility", () => {
      // Prepare
      const content: IContent = new Content(contentObject);
      const type = LEVEL_TYPE.CONTENT_SET;
      const level = new Level({ type, contentItems: [content] });

      // Execute
      const map = ContentFilteringUseCase.execute({ levels: [level] });

      // Assert
      expect(map.size).toBe(1);
      expect(map.has(content.contentId)).toBe(true);
      expect(map.get(content.contentId)).toBe(true);
    });

    it("Should overwrite contentset with template", () => {
      // Prepare

      const content1 = { ...contentObject };
      const ContentSetContent: IContent = new Content(content1);
      const contentSetLevel: ILevel = new Level({
        type: LEVEL_TYPE.CONTENT_SET,
        contentItems: [ContentSetContent],
      });

      const content2 = {
        ...contentObject,
        availability: CONTENT_AVAILABILITY.HIDE,
      };
      const templateContent: IContent = new Content(content2);
      const templateLevel: ILevel = new Level({
        type: LEVEL_TYPE.TEMPLATE,
        contentItems: [templateContent],
      });

      // Execute
      const map = ContentFilteringUseCase.execute({
        levels: [contentSetLevel, templateLevel],
      });

      // Assert
      expect(map.size).toBe(1);
      expect(map.has(contentObject.contentId)).toBe(true);
      expect(map.get(contentObject.contentId)).toBe(false);
    });

    it("Should NOT overwrite while locked", () => {
      // Prepare

      const content1 = { ...contentObject, isLocked: true };
      const ContentSetContent: IContent = new Content(content1);
      const contentSetLevel: ILevel = new Level({
        type: LEVEL_TYPE.CONTENT_SET,
        contentItems: [ContentSetContent],
      });

      const content2 = {
        ...contentObject,
        availability: CONTENT_AVAILABILITY.HIDE,
      };
      const templateContent: IContent = new Content(content2);
      const templateLevel: ILevel = new Level({
        type: LEVEL_TYPE.TEMPLATE,
        contentItems: [templateContent],
      });

      // Execute
      const map = ContentFilteringUseCase.execute({
        levels: [contentSetLevel, templateLevel],
      });

      // Assert
      expect(map.size).toBe(1);
      expect(map.has(contentObject.contentId)).toBe(true);
      expect(map.get(contentObject.contentId)).toBe(true);
    });

    it("Should lock when AVAILABILITY ALWAYS, RETURN TRUE", () => {
      // Prepare

      const content1 = {
        ...contentObject,
        availability: CONTENT_AVAILABILITY.ALWAYS,
      };
      const ContentSetContent: IContent = new Content(content1);
      const contentSetLevel: ILevel = new Level({
        type: LEVEL_TYPE.CONTENT_SET,
        contentItems: [ContentSetContent],
      });

      const content2 = {
        ...contentObject,
        availability: CONTENT_AVAILABILITY.HIDE,
      };
      const templateContent: IContent = new Content(content2);
      const templateLevel: ILevel = new Level({
        type: LEVEL_TYPE.TEMPLATE,
        contentItems: [templateContent],
      });

      // Execute
      const map = ContentFilteringUseCase.execute({
        levels: [contentSetLevel, templateLevel],
      });

      // Assert
      expect(map.size).toBe(1);
      expect(map.has(contentObject.contentId)).toBe(true);
      expect(map.get(contentObject.contentId)).toBe(true);
    });

    it("Should lock when AVAILABILITY NEVER, RETURN FALSE", () => {
      // Prepare

      const content1 = {
        ...contentObject,
        availability: CONTENT_AVAILABILITY.NEVER,
      };
      const ContentSetContent: IContent = new Content(content1);
      const contentSetLevel: ILevel = new Level({
        type: LEVEL_TYPE.CONTENT_SET,
        contentItems: [ContentSetContent],
      });

      const content2 = {
        ...contentObject,
        availability: CONTENT_AVAILABILITY.SHOW,
      };
      const templateContent: IContent = new Content(content2);
      const templateLevel: ILevel = new Level({
        type: LEVEL_TYPE.TEMPLATE,
        contentItems: [templateContent],
      });

      // Execute
      const map = ContentFilteringUseCase.execute({
        levels: [contentSetLevel, templateLevel],
      });

      // Assert
      expect(map.size).toBe(1);
      expect(map.has(contentObject.contentId)).toBe(true);
      expect(map.get(contentObject.contentId)).toBe(false);
    });
  });
});
