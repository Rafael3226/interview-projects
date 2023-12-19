import {
  BOOLEAN_AVAILABILITY,
  CONTENT_AVAILABILITY,
  CONTENT_FORMAT_TYPE,
  CONTENT_TYPE,
} from "../enum";

// Content interface representing either a digital asset or a question
export interface IContentProperties {
  contentId: string;
  availability: CONTENT_AVAILABILITY;
  formatType: CONTENT_FORMAT_TYPE;
  contentType: CONTENT_TYPE;
  isLocked: boolean;
  portalId?: string;
  templateId?: string;
  contentSetId?: string;
  publishStartAt?: Date;
  publishEndAt?: Date;
}

export interface IContentMethods {
  isAvailable(date?: Date): boolean;
  shouldLock(): boolean;
}

export interface IContent extends IContentProperties, IContentMethods {}

export default class Content implements IContent {
  contentId: string;
  availability: CONTENT_AVAILABILITY;
  formatType: CONTENT_FORMAT_TYPE;
  contentType: CONTENT_TYPE;
  isLocked: boolean;
  portalId?: string;
  templateId?: string;
  contentSetId?: string;
  publishStartAt?: Date;
  publishEndAt?: Date;

  constructor(props: IContentProperties) {
    this.contentId = props.contentId;
    this.availability = props.availability;
    this.formatType = props.formatType;
    this.contentType = props.contentType;
    this.isLocked = props.isLocked;
    this.portalId = props.portalId;
    this.templateId = props.templateId;
    this.contentSetId = props.contentSetId;
    this.publishStartAt = props.publishStartAt;
    this.publishEndAt = props.publishEndAt;
  }

  isAvailable(date?: Date): boolean {
    const availability = BOOLEAN_AVAILABILITY[this.availability];
    return date
      ? this.getAvailabilityByDate(date) && availability
      : availability;
  }

  shouldLock(): boolean {
    const availabilityLockCases = [
      CONTENT_AVAILABILITY.NEVER,
      CONTENT_AVAILABILITY.ALWAYS,
    ];
    return this.isLocked || availabilityLockCases.includes(this.availability);
  }

  private getAvailabilityByDate(date: Date): boolean {
    const isDateAfterPublishStart =
      this.publishStartAt === undefined ? true : this.publishStartAt > date;

    const isDateBeforePublishEnd =
      this.publishEndAt === undefined ? true : this.publishEndAt < date;

    return isDateAfterPublishStart && isDateBeforePublishEnd;
  }
}
