import { EquipmentStatus, EquipmentType, Prisma } from '@prisma/client';
import { Equipment } from '@src/rental/core/entity/equipment.entity';
import { EarthMovingEquipment } from '@src/rental/core/value-object/earth-moving-equipment.value-object';
import { MaterialHandlingEquipment } from '@src/rental/core/value-object/material-handling-equipment.value-object';
import { MiscellaneusEquipment } from '@src/rental/core/value-object/miscellaneus-equipment.value-object';
import { EquipmentFactory } from '../../equipment.factory';

describe('EquipmentFactory', () => {
  describe('create', () => {
    it('creates an equipment object with earth-moving specific details', () => {
      const equipmentData = {
        id: '123',
        serialNumber: '456',
        name: 'Excavator',
        year: 2021,
        manufacturer: 'Caterpillar',
        widthCm: 300,
        heightCm: 400,
        weightKg: 5000,
        type: EquipmentType.EARTH_MOVING,
        bucketCapacityKg: 10000,
        status: EquipmentStatus.AVAILABLE,
      };
      const equipment = EquipmentFactory.create(
        equipmentData as Prisma.$EquipmentPayload['scalars']
      );
      expect(equipment).toBeInstanceOf(Equipment);
      expect(equipment.type).toEqual(EquipmentType.EARTH_MOVING);
      expect(equipment.specificDetails).toBeInstanceOf(EarthMovingEquipment);
    });

    it('creates an equipment object with material-handling specific details', () => {
      const equipmentData = {
        id: '456',
        serialNumber: '789',
        name: 'Forklift',
        year: 2022,
        manufacturer: 'Toyota',
        widthCm: 200,
        heightCm: 300,
        weightKg: 2000,
        type: EquipmentType.MATERIAL_HANDLING,
        liftingCapacityKg: 5000,
        reachMt: 5,
        status: EquipmentStatus.CHECKED_OUT,
        currentJobId: '123',
      };
      const equipment = EquipmentFactory.create(
        equipmentData as Prisma.$EquipmentPayload['scalars']
      );
      expect(equipment).toBeInstanceOf(Equipment);
      expect(equipment.type).toEqual(EquipmentType.MATERIAL_HANDLING);
      expect(equipment.specificDetails).toBeInstanceOf(MaterialHandlingEquipment);
    });

    it('creates an equipment object with miscellaneus specific details', () => {
      const equipmentData = {
        id: '789',
        serialNumber: '012',
        name: 'Generator',
        year: 2023,
        manufacturer: 'Honda',
        widthCm: 100,
        heightCm: 200,
        weightKg: 1000,
        type: EquipmentType.MISCELLANEUS,
        powerCapacityW: 5000,
        status: EquipmentStatus.IN_REPAIR,
      };
      const equipment = EquipmentFactory.create(
        equipmentData as Prisma.$EquipmentPayload['scalars']
      );
      expect(equipment).toBeInstanceOf(Equipment);
      expect(equipment.type).toEqual(EquipmentType.MISCELLANEUS);
      expect(equipment.specificDetails).toBeInstanceOf(MiscellaneusEquipment);
    });

    it('throws an error for an unknown equipment type', () => {
      const equipmentData = {
        id: 'abc',
        serialNumber: 'def',
        name: 'Unknown',
        year: 2024,
        manufacturer: 'Unknown',
        widthCm: 50,
        heightCm: 100,
        weightKg: 500,
        type: 'unknown',
        status: EquipmentStatus.AVAILABLE,
      };
      expect(() =>
        EquipmentFactory.create(equipmentData as Prisma.$EquipmentPayload['scalars'])
      ).toThrow('Equipment type not found');
    });
  });
});
