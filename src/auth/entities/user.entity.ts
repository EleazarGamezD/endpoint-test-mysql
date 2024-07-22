import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserDetails } from './user-details.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Variant } from 'src/inventory_variants/entitites/variant.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'user Email (unique)',
    nullable: false,
    minLength: 1,
    example: 'cI8Bh@example.com',
  })
  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string;

  @ApiProperty({
    description:
      'User Password,The password must have a Uppercase, lowercase letter and a number',
    nullable: false,
    minLength: 6,
    maxLength: 50,
    example: '123456$$#%%aAAa',
  })
  @Column('varchar', { select: false, length: 255 })
  password: string;

  @ApiProperty({
    description: 'user fullName',
    nullable: false,
    minLength: 1,
    example: 'John Doe',
  })
  @Column('varchar', { length: 255 })
  fullName: string;

  @ApiProperty({
    description: 'userName',
    nullable: false,
    minLength: 1,
    example: 'johndoe',
  })
  @Column({ type: 'varchar', length: 255 })
  userName?: string;

  @ApiProperty({
    description: 'user Status, true=active, false=inactive',
    nullable: false,
    minLength: 1,
    example: 'true',
  })
  @ApiProperty()
  @Column('tinyint', { default: 1 })
  isActive: boolean;

  @ApiProperty({
    description: 'User Roles [admin, user, super-user]',
    nullable: false,
    minLength: 1,
    example: 'user',
  })
  @Column('json')
  roles: string[];

  //relacion uno a muchos con la tabla Detalles de usuarios
  @ApiProperty({
    description: 'list of details of the user (address, cellphone or phone)',
    nullable: true,
    minLength: 1,
  })
  @OneToMany(() => UserDetails, (userDetails) => userDetails.user, {
    cascade: true,
    eager: true,
  })
  details?: UserDetails[];

  //relacion uno a muchos con la tabla variants
  @ApiProperty({
    description: 'list of variants of the user (color, size, etc.)',
    nullable: true,
    minLength: 1,
  })
  @OneToMany(() => Variant, (variant) => variant.user, {
    cascade: true,
    eager: true,
  })
  variant?: Variant[];

  @BeforeInsert()
  /**
   * Checks the fields before inserting them.
   *
   * @param {type} paramName - description of parameter
   * @return {type} description of return value
   */
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
  @BeforeInsert()
  checkUserName() {
    if (this.userName) {
      this.userName = this.userName.toLowerCase().trim();
    }
    if (!this.userName) {
      this.userName = '';
    }
  }

  @BeforeInsert()
  setDefaultPassword() {
    // Asignar un valor por defecto para roles si no está definido
    if (!this.password) {
      this.password = '';
    }
  }
  @BeforeInsert()
  setDefaultRoles() {
    // Asignar un valor por defecto para roles si no está definido
    if (!this.roles) {
      this.roles = ['user'];
    }
  }

  @BeforeUpdate()
  /**
   * Performs a check on the fields before updating.
   *
   * @param {type} paramName - description of parameter
   * @return {type} description of return value
   */
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
