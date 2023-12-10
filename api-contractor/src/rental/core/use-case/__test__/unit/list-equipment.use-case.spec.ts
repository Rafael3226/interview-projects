import { Test } from '@nestjs/testing';
import {
  Equipment,
  EquipmentStatus,
  EquipmentType,
  NewEquipmentType,
} from '@src/rental/core/entity/equipment.entity';
import { MiscellaneusEquipment } from '@src/rental/core/value-object/miscellaneus-equipment.value-object';
import { EquipmentRepository } from '@src/rental/persistence/repository/equipment.repository';
import { ListEquipmentUseCase } from '../../list-equipment.use-case';

describe('ListEquipmentUseCase', () => {
  let useCase: ListEquipmentUseCase;
  let equipmentRepository: EquipmentRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListEquipmentUseCase,
        {
          provide: EquipmentRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();
    useCase = moduleRef.get<ListEquipmentUseCase>(ListEquipmentUseCase);
    equipmentRepository = moduleRef.get<EquipmentRepository>(EquipmentRepository);
  });

  describe('execute', () => {
    it('return an array of equipment objects', async () => {
      const equipmenData: NewEquipmentType = {
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
      const equipment = Equipment.create(equipmenData);
      jest.spyOn(equipmentRepository, 'findAll').mockResolvedValue([equipment]);
      const result = await useCase.execute();
      expect(result).toEqual([equipment]);
    });
  });
});
