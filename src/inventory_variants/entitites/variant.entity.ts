import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VariantsContent } from './variants-content.entity';

@Entity('variants')
export class Variant {
  @ApiProperty({
    description: 'product id variant (unique)',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'product variant name (unique)',
    nullable: false,
    minLength: 1,
    example: 'Talla',
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToOne(() => User, (user) => user.variant, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(
    () => VariantsContent,
    (variantContent) => variantContent.variants,
    {
      cascade: true,
      eager: true,
    },
  )
  variantTypes?: VariantsContent[];

  @BeforeInsert()
  nameToLowerCase() {
    this.name = this.name.toLowerCase();
  }
  @BeforeUpdate()
  updateNameToLowerCase() {
    this.name = this.name.toLowerCase();
  }
}
