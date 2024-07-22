import { Module } from '@nestjs/common';
import { InventoryVariantsService } from './inventory_variants.service';
import { InventoryVariantsController } from './inventory_variants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './entitites/variant.entity';
import { VariantsContent } from './entitites/variants-content.entity';
import {
  VariantRepository,
  VariantsTypeRepository,
} from 'src/repositories/variants-repository';

@Module({
  controllers: [InventoryVariantsController],
  providers: [
    InventoryVariantsService,
    VariantRepository,
    VariantsTypeRepository,
  ],
  imports: [TypeOrmModule.forFeature([Variant, VariantsContent])],
})
export class InventoryVariantsModule {}
