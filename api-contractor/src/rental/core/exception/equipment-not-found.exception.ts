import { CoreException } from '@src/shared/core/exception/core.exception';

export class EquipmentNotFoundException extends CoreException {
  constructor(id: string) {
    super(`Equipment with id ${id} not found`);
  }
}
