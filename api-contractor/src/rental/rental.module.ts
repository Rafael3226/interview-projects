import { Module } from '@nestjs/common';
import { PrismaService } from '@src/shared/persistence/prisma/prisma.service';
import { InstantCheckoutEquipmentUseCase } from './core/use-case/instant-checkout-equipment.use-case';
import { ListEquipmentUseCase } from './core/use-case/list-equipment.use-case';
import { ReserveEquipmentUseCase } from './core/use-case/reserve-equipment.use-case';
import { ReturnEquipmentUseCase } from './core/use-case/return-equipment.use-case';
import { EquipmentController } from './http/rest/controller/equipment.controller';
import { ReservationController } from './http/rest/controller/reservation.controller';
import { EquipmentRepository } from './persistence/repository/equipment.repository';
import { ReservationRepository } from './persistence/repository/reservation.repository';
import { PerformCheckoutUseCase } from './core/use-case/perform-checkout.use-case';

@Module({
  controllers: [EquipmentController, ReservationController],
  providers: [
    InstantCheckoutEquipmentUseCase,
    ReserveEquipmentUseCase,
    ReturnEquipmentUseCase,
    PerformCheckoutUseCase,
    ListEquipmentUseCase,
    ReservationRepository,
    EquipmentRepository,
    PrismaService,
  ],
})
export class RentalModule {}
