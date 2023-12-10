import { EquipmentStatus } from '@prisma/client';
import { MiscellaneusEquipment } from '@src/rental/core/value-object/miscellaneus-equipment.value-object';
import { Equipment, EquipmentType, NewEquipmentType } from '../../equipment.entity';

describe('Equipment', () => {
  const defaultEquipment: NewEquipmentType = {
    name: 'Power Gnerator One',
    serialNumber: '123456789',
    year: 2021,
    manufacturer: 'Electrify Inc',
    widthCm: 300,
    heightCm: 50,
    weightKg: 50,
    status: EquipmentStatus.AVAILABLE,
    type: EquipmentType.MISCELLANEUS,
    specificDetails: new MiscellaneusEquipment({
      powerCapacityW: 1000,
    }),
  };
  describe('create', () => {
    it('creates a new Equipment object with the specified properties', () => {
      const equipment = Equipment.create(defaultEquipment);
      expect(equipment.serialNumber).toBe(defaultEquipment.serialNumber);
      expect(equipment.name).toBe(defaultEquipment.name);
      expect(equipment.year).toBe(defaultEquipment.year);
      expect(equipment.manufacturer).toBe(defaultEquipment.manufacturer);
      expect(equipment.widthCm).toBe(defaultEquipment.widthCm);
      expect(equipment.heightCm).toBe(defaultEquipment.heightCm);
      expect(equipment.weightKg).toBe(defaultEquipment.weightKg);
      expect(equipment.type).toBe(defaultEquipment.type);
      expect(equipment.specificDetails).toBe(defaultEquipment.specificDetails);
      expect(equipment.status).toBe(EquipmentStatus.AVAILABLE);
      expect(equipment.currentJobId).toBeUndefined();
      expect(equipment.lastLocation).toBeUndefined();
    });

    it('assigns a random UUID to the id property if not provided', () => {
      const equipment = Equipment.create(defaultEquipment);
      expect(equipment.id).toBeDefined();
    });
  });

  describe('isAvailable', () => {
    it('returns true if the equipment status is AVAILABLE', () => {
      const equipment = Equipment.create(defaultEquipment);
      expect(equipment.isAvailable()).toBe(true);
    });

    it('returns false if the equipment status is not AVAILABLE', () => {
      const equipment = Equipment.create({
        ...defaultEquipment,
        ...{ status: EquipmentStatus.CHECKED_OUT },
      });
      expect(equipment.isAvailable()).toBe(false);
    });
  });

  describe('assignToJob', () => {
    it('sets the equipment status to CHECKED_OUT and assign the current job ID', () => {
      const equipment = Equipment.create(defaultEquipment);
      equipment.assignToJob('789');
      expect(equipment.status).toBe(EquipmentStatus.CHECKED_OUT);
      expect(equipment.currentJobId).toBe('789');
    });

    it('throws an error if the equipment is not available', () => {
      const equipment = Equipment.create({
        ...defaultEquipment,
        ...{ status: EquipmentStatus.CHECKED_OUT, currentJobId: '789' },
      });
      expect(() => equipment.assignToJob('123')).toThrowError(
        'Equipment is not available for assignment.'
      );
    });
  });

  describe('returnFromJob', () => {
    it('sets the equipment status to AVAILABLE, clear the current job ID, and set the last location', () => {
      const equipment = Equipment.create({
        ...defaultEquipment,
        ...{ status: EquipmentStatus.CHECKED_OUT, currentJobId: '789' },
      });
      expect(() => equipment.assignToJob('123')).toThrowError(
        'Equipment is not available for assignment.'
      );
      equipment.returnFromJob('Site A');
      expect(equipment.status).toBe(EquipmentStatus.AVAILABLE);
      expect(equipment.currentJobId).toBeUndefined();
      expect(equipment.lastLocation).toBe('Site A');
    });

    it('throws an error if the equipment was not checked out', () => {
      const equipment = Equipment.create(defaultEquipment);
      expect(() => equipment.returnFromJob('Site A')).toThrowError(
        'Equipment was not checked out.'
      );
    });
  });
});
