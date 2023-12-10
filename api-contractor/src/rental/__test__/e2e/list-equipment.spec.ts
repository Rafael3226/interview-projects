import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  Equipment,
  EquipmentStatus,
  EquipmentType,
  NewEquipmentType,
} from '@src/rental/core/entity/equipment.entity';
import { MiscellaneusEquipment } from '@src/rental/core/value-object/miscellaneus-equipment.value-object';
import { EquipmentRepository } from '@src/rental/persistence/repository/equipment.repository';
import { ReservationRepository } from '@src/rental/persistence/repository/reservation.repository';
import { PersistenceException } from '@src/shared/persistence/exception/persistence.exception';
import { randomUUID } from 'crypto';
import request from 'supertest';

describe('EquipmentController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;
  let equipmentRepository: EquipmentRepository;
  let reservationRepository: ReservationRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    equipmentRepository = module.get<EquipmentRepository>(EquipmentRepository);
    reservationRepository = module.get<ReservationRepository>(ReservationRepository);

    await app.init();
  });

  beforeEach(async () => {
    await reservationRepository.clear();
    await equipmentRepository.clear();
  });

  afterAll(async () => {
    module.close();
  });

  describe('/equipment (GET)', () => {
    it('returns an array of equipment', async () => {
      const id = randomUUID();
      const equipmentData: NewEquipmentType = {
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
      const equipment = Equipment.create(equipmentData, id);
      await equipmentRepository.create(equipment);
      const response = await request(app.getHttpServer()).get('/equipment');
      expect(response.status).toBe(200);
      //I could've implemented a class serialization here to make this simpler
      expect(response.body).toEqual([
        {
          ...{ id },
          ...equipmentData,
          ...{
            specificDetails: {
              powerCapacityW: 1000,
            },
          },
        },
      ]);
    });

    it('allows filtering equipment by location and type', async () => {
      const id = randomUUID();
      const equipmentData: NewEquipmentType = {
        name: 'Power Gnerator One',
        serialNumber: '123456789',
        year: 2021,
        manufacturer: 'Electrify Inc',
        widthCm: 300,
        heightCm: 50,
        weightKg: 50,
        status: EquipmentStatus.AVAILABLE,
        type: EquipmentType.MISCELLANEUS,
        lastLocation: 'New York',
        specificDetails: new MiscellaneusEquipment({
          powerCapacityW: 1000,
        }),
      };
      const equipment = Equipment.create(equipmentData, id);
      await equipmentRepository.create(equipment);
      const response = await request(app.getHttpServer()).get(
        `/equipment?type=${EquipmentType.MISCELLANEUS}&location=New York`
      );
      expect(response.status).toBe(200);
      expect(response.body[0]).toBeDefined();
    });

    it('respects filters', async () => {
      const id = randomUUID();
      const equipmentData: NewEquipmentType = {
        name: 'Power Gnerator One',
        serialNumber: '123456789',
        year: 2021,
        manufacturer: 'Electrify Inc',
        widthCm: 300,
        heightCm: 50,
        weightKg: 50,
        status: EquipmentStatus.AVAILABLE,
        type: EquipmentType.MISCELLANEUS,
        lastLocation: 'New York',
        specificDetails: new MiscellaneusEquipment({
          powerCapacityW: 1000,
        }),
      };
      const equipment = Equipment.create(equipmentData, id);
      await equipmentRepository.create(equipment);
      const response = await request(app.getHttpServer()).get(
        `/equipment?type=${EquipmentType.EARTH_MOVING}&location=New York`
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('returns internal server error when any error occurs', async () => {
      jest
        .spyOn(equipmentRepository, 'findAll')
        .mockRejectedValue(new PersistenceException('General database error'));

      const response = await request(app.getHttpServer()).get('/equipment');
      expect(response.status).toBe(500);
    });
  });
});
