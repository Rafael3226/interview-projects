import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { EquipmentNotAvailableException } from '@src/rental/core/exception/equipment-not-available.exception';
import { EquipmentNotFoundException } from '@src/rental/core/exception/equipment-not-found.exception';
import { ReservationNotFoundException } from '@src/rental/core/exception/reservation-not-found.exception';
import { InstantCheckoutEquipmentUseCase } from '@src/rental/core/use-case/instant-checkout-equipment.use-case';
import { ReserveEquipmentUseCase } from '@src/rental/core/use-case/reserve-equipment.use-case';
import { ReturnEquipmentUseCase } from '@src/rental/core/use-case/return-equipment.use-case';
import {
  InstantCheckoutDto,
  PerformCheckoutDto,
  ReturnEquipmentDto,
  ScheduledCheckoutDto,
} from '../dto/reservation.dto';
import { PerformCheckoutUseCase } from '@src/rental/core/use-case/perform-checkout.use-case';
import { ReservationNotPendingException } from '@src/rental/core/exception/reservation-not-pending.exception';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly instantCheckoutEquipmentUseCase: InstantCheckoutEquipmentUseCase,
    private readonly reserveEquipmentUseCase: ReserveEquipmentUseCase,
    private readonly returnEquipmentUseCase: ReturnEquipmentUseCase,
    private readonly performCheckoutUseCase: PerformCheckoutUseCase
  ) {}

  @Post('instant')
  @HttpCode(201)
  async instantCheckout(@Body() createReservationParams: InstantCheckoutDto) {
    try {
      await this.instantCheckoutEquipmentUseCase.execute({
        equipmentId: createReservationParams.equipmentId,
        userId: createReservationParams.userId,
        jobId: createReservationParams.jobId,
        reservationEnd: createReservationParams.reservationEnd,
      });
    } catch (error) {
      if (
        error instanceof EquipmentNotFoundException ||
        error instanceof EquipmentNotAvailableException
      ) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('schedule')
  @HttpCode(201)
  async scheduleCheckout(@Body() createReservationParams: ScheduledCheckoutDto) {
    try {
      await this.reserveEquipmentUseCase.execute({
        equipmentId: createReservationParams.equipmentId,
        jobId: createReservationParams.jobId,
        userId: createReservationParams.userId,
        reservationEnd: createReservationParams.reservationEnd,
        reservationStart: createReservationParams.reservationStart,
      });
    } catch (error) {
      if (
        error instanceof EquipmentNotFoundException ||
        error instanceof EquipmentNotAvailableException
      ) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('return')
  @HttpCode(200)
  async returnEquipment(@Body() createReservationParams: ReturnEquipmentDto) {
    try {
      await this.returnEquipmentUseCase.execute({
        reservationId: createReservationParams.reservationId,
        location: createReservationParams.location,
      });
    } catch (error) {
      if (error instanceof ReservationNotFoundException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('checkout')
  @HttpCode(200)
  async performCheckout(@Body() performCheckoutParams: PerformCheckoutDto) {
    try {
      await this.performCheckoutUseCase.execute({
        reservationId: performCheckoutParams.reservationId,
        userId: performCheckoutParams.userId,
      });
    } catch (error) {
      if (
        error instanceof ReservationNotFoundException ||
        error instanceof ReservationNotPendingException
      ) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
