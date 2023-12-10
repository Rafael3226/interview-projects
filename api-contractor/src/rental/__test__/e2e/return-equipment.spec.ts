import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  Equipment,
  EquipmentStatus,
  EquipmentType,
  NewEquipmentType,
} from '@src/rental/core/entity/equipment.entity';
import { Reservation } from '@src/rental/core/entity/reservation.entity';
import { MiscellaneusEquipment } from '@src/rental/core/value-object/miscellaneus-equipment.value-object';
import { ReturnEquipmentDto } from '@src/rental/http/rest/dto/reservation.dto';
import { EquipmentRepository } from '@src/rental/persistence/repository/equipment.repository';
import { ReservationRepository } from '@src/rental/persistence/repository/reservation.repository';
import { randomUUID } from 'crypto';
import request from 'supertest';

describe('ReservationController - return equipment (e2e)', () => {
  let app: INestApplication;
  let equipmentRepository: EquipmentRepository;
  let reservationRepository: ReservationRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    equipmentRepository = moduleFixture.get<EquipmentRepository>(EquipmentRepository);
    reservationRepository =
      moduleFixture.get<ReservationRepository>(ReservationRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await reservationRepository.clear();
    await equipmentRepository.clear();
  });

  describe('/reservation/return (POST)', () => {
    it('return 400 if the reservation is not found', async () => {
      const returnEquipmentParams: ReturnEquipmentDto = {
        reservationId: '123',
        location: 'New York',
      };
      await request(app.getHttpServer())
        .post('/reservation/return')
        .send(returnEquipmentParams)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toEqual('Reservation with id 123 not found');
        });
    });

    it('returns 200 if the reservation is found and the equipment is returned', async () => {
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
      const equipment = Equipment.create(defaultEquipment);
      await equipmentRepository.create(equipment);

      const reservationId = randomUUID();

      const reservation = Reservation.create(
        {
          equipment,
          jobId: '789',
          userId: randomUUID(),
          reservationStart: new Date(),
          reservationEnd: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        reservationId
      );
      reservation.start();

      await reservationRepository.create(reservation);
      await equipmentRepository.update(equipment);

      const returnEquipmentParams: ReturnEquipmentDto = {
        reservationId: reservationId,
        location: 'New York',
      };
      await request(app.getHttpServer())
        .post('/reservation/return')
        .send(returnEquipmentParams)
        .expect(HttpStatus.OK);
    });
  });
});
