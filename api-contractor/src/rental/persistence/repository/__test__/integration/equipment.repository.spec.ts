import { Test, TestingModule } from '@nestjs/testing';
import {
  Equipment,
  EquipmentStatus,
  EquipmentType,
  NewEquipmentType,
} from '@src/rental/core/entity/equipment.entity';
import { MiscellaneusEquipment } from '@src/rental/core/value-object/miscellaneus-equipment.value-object';
import { PersistenceValidationException } from '@src/shared/persistence/exception/persistence-validatio.exception';
import { PrismaService } from '@src/shared/persistence/prisma/prisma.service';
import { EquipmentRepository } from '../../equipment.repository';

describe('EquipmentRepository', () => {
  let prismaService: PrismaService;
  let equipmentRepository: EquipmentRepository;

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

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, EquipmentRepository],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    equipmentRepository = module.get<EquipmentRepository>(EquipmentRepository);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  beforeEach(async () => {
    await prismaService.reservation.deleteMany();
    await prismaService.equipment.deleteMany();
  });

  describe('create', () => {
    it('creates a new equipment in the database', async () => {
      const equipment = Equipment.create(defaultEquipment);
      await equipmentRepository.create(equipment);
      const createdEquipment = await prismaService.equipment.findUnique({
        where: { id: equipment.id },
      });
      expect(createdEquipment).toMatchObject({
        id: equipment.id,
        serialNumber: equipment.serialNumber,
        name: equipment.name,
        year: equipment.year,
        manufacturer: equipment.manufacturer,
        widthCm: equipment.widthCm,
        heightCm: equipment.heightCm,
        weightKg: equipment.weightKg,
        type: equipment.type,
        status: equipment.status,
      });
    });
    it('throws a PersistenceValidationException if the equipment data is invalid', async () => {
      const equipment = Equipment.create({
        ...defaultEquipment,
        ...{ widthCm: 'string' as any }, //forces a type error
      });
      await expect(equipmentRepository.create(equipment)).rejects.toThrow(
        PersistenceValidationException
      );
    });
  });

  describe('findAll', () => {
    it('returns an array of equipment objects from the database', async () => {
      const equipment = Equipment.create(defaultEquipment);
      await equipmentRepository.create(equipment);
      const result = await equipmentRepository.findAll();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Equipment);
      expect(result[0].id).toEqual(equipment.id);
      expect(result[0].serialNumber).toEqual(equipment.serialNumber);
      expect(result[0].name).toEqual(equipment.name);
      expect(result[0].year).toEqual(equipment.year);
      expect(result[0].manufacturer).toEqual(equipment.manufacturer);
      expect(result[0].widthCm).toEqual(equipment.widthCm);
      expect(result[0].heightCm).toEqual(equipment.heightCm);
      expect(result[0].weightKg).toEqual(equipment.weightKg);
      expect(result[0].type).toEqual(equipment.type);
      expect(result[0].status).toEqual(equipment.status);
      expect(result[0].currentJobId).toEqual(equipment.currentJobId);
      expect(result[0].lastLocation).toEqual(equipment.lastLocation);
      expect(result[0].specificDetails).toEqual(equipment.specificDetails);
    });
  });
});
