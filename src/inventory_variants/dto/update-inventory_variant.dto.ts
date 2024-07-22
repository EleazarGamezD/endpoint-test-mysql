import { PartialType } from '@nestjs/mapped-types';
import {
  CreateInventoryVariantDto,
  CreateInventoryVariantTypeDto,
} from './create-inventory_variant.dto';

export class UpdateInventoryVariantDto extends PartialType(
  CreateInventoryVariantDto,
) {}
export class UpdateInventoryVariantTypeDto extends PartialType(
  CreateInventoryVariantTypeDto,
) {}
