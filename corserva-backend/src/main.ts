import jsonData from "../sampledata/input.json";
import Content, { IContent } from "./entity/Content";
import Level, { ILevel } from "./entity/Level";
import { CONTENT_TYPE } from "./enum";
import { CONTENT_FORMAT_TYPE } from "./enum/index";
import ContentFilteringUseCase, {
  IOptions,
} from "./use-case/ContentFiltering.UseCase";

function main() {
  const { jsonLevels } = jsonData;

  const levels: ILevel[] = jsonLevels.map((l: ILevel) => {
    const content = l.contentItems.map((c: IContent) => new Content(c));
    return new Level({ type: l.type, contentItems: content });
  });

  const options: IOptions = {
    contentType: CONTENT_TYPE.DIGITAL_ASSET,
    formatType: CONTENT_FORMAT_TYPE.VIDEO,
  };

  const result = new ContentFilteringUseCase({ levels, options }).execute();

  console.table(result);
}
main();
