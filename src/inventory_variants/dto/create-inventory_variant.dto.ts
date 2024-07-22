import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateInventoryVariantDto {
  @ApiProperty({
    description: 'Product Variant (unique)',
    nullable: false,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  @IsArray()
  variantsType?: string[];
}

export class CreateInventoryVariantTypeDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  type: string;
}
