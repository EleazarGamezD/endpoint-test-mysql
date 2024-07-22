import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { InventoryVariantsService } from './inventory_variants.service';
import { CreateInventoryVariantDto } from './dto/create-inventory_variant.dto';
import { UpdateInventoryVariantDto } from './dto/update-inventory_variant.dto';
import { GetUser } from 'src/auth/decorator';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Variant } from './entitites/variant.entity';

@ApiTags('Inventory variants')
@Controller('inventory-variants')
export class InventoryVariantsController {
  constructor(
    private readonly inventoryVariantsService: InventoryVariantsService,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createInventoryVariantDto: CreateInventoryVariantDto,
    @GetUser() user: User,
  ) {
    return this.inventoryVariantsService.create(
      createInventoryVariantDto,
      user,
    );
  }

  @Get('getall')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'All Variants', type: Variant })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden, Token related' })
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() paginationDto: PaginationDto, @GetUser() user: User) {
    return this.inventoryVariantsService.findAll(paginationDto, user);
  }

  @Get('getby/:term')
  findOne(@Param('term') term: string) {
    return this.inventoryVariantsService.findOne(term);
  }

  @Patch('update-term/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInventoryVariantDto: UpdateInventoryVariantDto,
  ) {
    return this.inventoryVariantsService.updateVariant(
      id,
      updateInventoryVariantDto,
    );
  }
  @Patch('update-variant/:id')
  updateVariantType(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryVariantsService.updateVariantType(id);
  }
  @Delete('delete-variant/:id')
  @UseGuards(AuthGuard('jwt'))
  remove(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryVariantsService.remove(id, user);
  }
}
