import { CoreException } from '@src/shared/core/exception/core.exception';
import { randomUUID } from 'crypto';
import { EarthMovingEquipment } from '../value-object/earth-moving-equipment.value-object';
import { MaterialHandlingEquipment } from '../value-object/material-handling-equipment.value-object';
import { MiscellaneusEquipment } from '../value-object/miscellaneus-equipment.value-object';

/**
 * This enum ensures not only type safety but also that the value is one of the
 * expected values during runtime. This is in line with the enum on the database.
 */
export const EquipmentStatus: {
  [x: string]: 'AVAILABLE' | 'CHECKED_OUT' | 'IN_REPAIR';
} = {
  AVAILABLE: 'AVAILABLE',
  CHECKED_OUT: 'CHECKED_OUT',
  IN_REPAIR: 'IN_REPAIR',
};

export type EquipmentStatus = (typeof EquipmentStatus)[keyof typeof EquipmentStatus];

export const EquipmentType: {
  [x: string]: 'EARTH_MOVING' | 'MATERIAL_HANDLING' | 'MISCELLANEUS';
} = {
  EARTH_MOVING: 'EARTH_MOVING',
  MATERIAL_HANDLING: 'MATERIAL_HANDLING',
  MISCELLANEUS: 'MISCELLANEUS',
};

export type EquipmentType = (typeof EquipmentType)[keyof typeof EquipmentType];

type EarthMovingEquipmentProperties = {
  type: 'EARTH_MOVING';
  specificDetails: EarthMovingEquipment;
};

type MaterialHandlingEquipmentProperties = {
  type: 'MATERIAL_HANDLING';
  specificDetails: MaterialHandlingEquipment;
};

type MiscellaneusEquipmentProperties = {
  type: 'MISCELLANEUS';
  specificDetails: MiscellaneusEquipment;
};
//Ensures type safety, that the type and the specificDetails are in sync
type SpecificEquipmentProperties =
  | EarthMovingEquipmentProperties
  | MaterialHandlingEquipmentProperties
  | MiscellaneusEquipmentProperties;

export type NewEquipmentType = Omit<EquipmentProperties, 'id'> &
  (
    | EarthMovingEquipmentProperties
    | MaterialHandlingEquipmentProperties
    | MiscellaneusEquipmentProperties
  );

export type EquipmentProperties = {
  readonly id: string;
  serialNumber: string;
  name: string;
  year: number;
  manufacturer: string;
  widthCm: number;
  heightCm: number;
  weightKg: number;
  status: EquipmentStatus;
  currentJobId?: string;
  lastLocation?: string;
} & SpecificEquipmentProperties;

export class Equipment {
  readonly id: EquipmentProperties['id'];
  serialNumber: EquipmentProperties['serialNumber'];
  name: EquipmentProperties['name'];
  year: EquipmentProperties['year'];
  manufacturer: EquipmentProperties['manufacturer'];
  widthCm: EquipmentProperties['widthCm'];
  heightCm: EquipmentProperties['heightCm'];
  weightKg: EquipmentProperties['weightKg'];
  type: EquipmentProperties['type'];
  specificDetails?: EquipmentProperties['specificDetails'];
  status: EquipmentProperties['status'] = EquipmentStatus.AVAILABLE;
  currentJobId?: EquipmentProperties['currentJobId'];
  lastLocation?: EquipmentProperties['lastLocation'];

  constructor(data: EquipmentProperties) {
    Object.assign(this, data);
  }

  static create(properties: NewEquipmentType, id: string = randomUUID()): Equipment {
    return new Equipment({ ...properties, id });
  }

  isAvailable(): boolean {
    return this.status === EquipmentStatus.AVAILABLE;
  }

  assignToJob(jobId: string) {
    if (this.status !== EquipmentStatus.AVAILABLE) {
      throw new CoreException('Equipment is not available for assignment.');
    }
    this.status = EquipmentStatus.CHECKED_OUT;
    this.currentJobId = jobId;
  }

  returnFromJob(location: string) {
    if (this.status !== EquipmentStatus.CHECKED_OUT) {
      throw new CoreException('Equipment was not checked out.');
    }
    this.status = EquipmentStatus.AVAILABLE;
    this.currentJobId = undefined;
    this.lastLocation = location;
  }
}
