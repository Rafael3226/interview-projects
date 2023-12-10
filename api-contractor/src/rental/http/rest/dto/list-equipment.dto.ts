import { ApiProperty } from '@nestjs/swagger';

class SpecificEquipmentDetailsDto {
  @ApiProperty({ type: Number, required: false })
  readonly bucketCapacityKg?: number;
  @ApiProperty({ type: Number, required: false })
  readonly powerCapacityW?: number;
  @ApiProperty({ type: Number, required: false })
  readonly liftingCapacityKg?: number;
  @ApiProperty({ type: Number, required: false })
  readonly reachMt?: number;
}

export class EquipmentDto {
  @ApiProperty({ type: String })
  readonly id: string;
  @ApiProperty({ type: String })
  readonly serialNumber: string;
  @ApiProperty({ type: String })
  readonly name: string;
  @ApiProperty({ type: Number })
  readonly year: number;
  @ApiProperty({ type: String })
  readonly manufacturer: string;
  @ApiProperty({ type: Number })
  readonly widthCm: number;
  @ApiProperty({ type: Number })
  readonly heightCm: number;
  @ApiProperty({ type: Number })
  readonly weightKg: number;
  @ApiProperty({ type: Number })
  readonly type: string;
  @ApiProperty({ type: Number })
  readonly status: string;

  @ApiProperty({
    type: SpecificEquipmentDetailsDto,
    description:
      'Specific details of the equipment, it varies based on the equipment type',
    required: false,
  })
  readonly specificDetails?: SpecificEquipmentDetailsDto;
}
