import { CoreException } from '@src/shared/core/exception/core.exception';

export class EquipmentNotAvailableException extends CoreException {
  constructor(id: string) {
    super(`Equipment with id ${id} it not available`);
  }
}
