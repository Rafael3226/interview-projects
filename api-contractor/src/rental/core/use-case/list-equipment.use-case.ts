import { Injectable } from '@nestjs/common';
import { EquipmentRepository } from '@src/rental/persistence/repository/equipment.repository';
import { EquipmentType } from '../entity/equipment.entity';

export type EquipmentSearchFilterParametersDto = {
  location?: string;
  type?: EquipmentType;
};
@Injectable()
export class ListEquipmentUseCase {
  constructor(private readonly equipmentRepository: EquipmentRepository) {}

  async execute(params?: EquipmentSearchFilterParametersDto) {
    return this.equipmentRepository.findAll({
      lastLocation: params?.location,
      type: params?.type,
    });
  }
}
