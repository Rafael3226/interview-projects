import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

class ReservationIdDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ type: Date })
  readonly reservationId: string;
}

export class InstantCheckoutDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  readonly equipmentId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  readonly jobId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  readonly userId: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ type: Date })
  readonly reservationEnd: Date;
}

export class ScheduledCheckoutDto extends InstantCheckoutDto {
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ type: Date })
  readonly reservationStart: Date;
}

export class ReturnEquipmentDto extends ReservationIdDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: Date })
  readonly location: string;
}

export class PerformCheckoutDto extends ReservationIdDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  readonly userId: string;
}
