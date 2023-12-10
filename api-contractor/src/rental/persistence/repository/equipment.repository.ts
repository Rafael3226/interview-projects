import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Equipment, EquipmentType } from '@src/rental/core/entity/equipment.entity';
import { PersistenceValidationException } from '@src/shared/persistence/exception/persistence-validatio.exception';
import { PersistenceException } from '@src/shared/persistence/exception/persistence.exception';
import { PrismaService } from '@src/shared/persistence/prisma/prisma.service';
import { EquipmentFactory } from '../factory/equipment.factory';

@Injectable()
export class EquipmentRepository {
  private readonly model: PrismaService['equipment'];
  constructor(private readonly prismaService: PrismaService) {
    this.model = this.prismaService.equipment;
  }

  async create(equipment: Equipment): Promise<void> {
    try {
      await this.model.create({
        data: {
          ...{
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
            currentJobId: equipment.currentJobId ? equipment.currentJobId : null,
            lastLocation: equipment.lastLocation ? equipment.lastLocation : null,
          },
          ...equipment.specificDetails,
        },
      });
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  async update(equipment: Equipment): Promise<void> {
    try {
      await this.model.update({
        where: {
          id: equipment.id,
        },
        data: {
          ...{
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
            currentJobId: equipment.currentJobId ? equipment.currentJobId : null,
            lastLocation: equipment.lastLocation ? equipment.lastLocation : null,
          },
          ...equipment.specificDetails,
        },
      });
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  async findAll(
    params: { lastLocation?: string; type?: EquipmentType } = {}
  ): Promise<Equipment[]> {
    try {
      const equipment = await this.model.findMany({
        where: params,
      });
      return equipment.map((e) => {
        return EquipmentFactory.create(e);
      });
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  async findById(id: string): Promise<Equipment | undefined> {
    try {
      const equipment = await this.model.findUnique({
        where: {
          id,
        },
      });
      if (!equipment) {
        return undefined;
      }
      return EquipmentFactory.create(equipment);
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.model.deleteMany();
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  protected handleAndThrowError(error: unknown): never {
    const errorMessage = this.extractErrorMessage(error);
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new PersistenceValidationException(error.message, error);
    }

    throw new PersistenceException(errorMessage, error);
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return 'An unexpected error occurred.';
  }
}
