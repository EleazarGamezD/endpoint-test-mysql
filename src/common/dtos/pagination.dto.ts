import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'how many row do you need',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // transformamos el dato a un numero
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'how many row do you skip',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // transformamos el dato a un numero
  offset?: number;
}
