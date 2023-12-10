import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { EquipmentType } from '@src/rental/core/entity/equipment.entity';
import { ListEquipmentUseCase } from '@src/rental/core/use-case/list-equipment.use-case';
import { EquipmentDto } from '../dto/list-equipment.dto';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly listEquipmentUseCase: ListEquipmentUseCase) {}
  @Get()
  @ApiOkResponse({ description: 'List of equipment', type: [EquipmentDto] })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'type', required: false })
  async findAll(
    @Query('location') location?: string,
    @Query('type') type?: EquipmentType
  ): Promise<EquipmentDto[]> {
    try {
      return await this.listEquipmentUseCase.execute({
        location,
        type,
      });
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
