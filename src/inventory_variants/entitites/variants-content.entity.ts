import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Variant } from './variant.entity';

@Entity('variants_content')
export class VariantsContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  type: string;

  @ManyToOne(() => Variant, (variant) => variant.variantTypes, {
    onDelete: 'CASCADE',
  })
  variants: Variant;

  @BeforeInsert()
  nameToLowerCase() {
    this.type = this.type.toLowerCase();
  }
  @BeforeUpdate()
  updateNameToLowerCase() {
    this.type = this.type.toLowerCase();
  }
}
