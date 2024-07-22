import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateInventoryVariantDto } from './dto/create-inventory_variant.dto';
import { UpdateInventoryVariantDto } from './dto/update-inventory_variant.dto';
import {
  VariantRepository,
  VariantsTypeRepository,
} from 'src/repositories/variants-repository';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { isUUID } from 'class-validator';
import { Variant } from './entitites/variant.entity';

@Injectable()
export class InventoryVariantsService {
  logger = new Logger(InventoryVariantsService.name);
  constructor(
    private readonly variantRepository: VariantRepository,
    private readonly variantTypeRepository: VariantsTypeRepository,
  ) {}

  /**
   * A method to create a new inventory variant.
   *
   * @param {CreateInventoryVariantDto} createInventoryVariantDto - the data to create the new inventory variant
   * @param {User} user - the user creating the inventory variant
   * @return {Promise<object>} the response object with the name of the variant and its types
   */
  async create(
    createInventoryVariantDto: CreateInventoryVariantDto,
    user: User,
  ) {
    try {
      const { variantsType = [], name } = createInventoryVariantDto;
      const userId = user.id;

      const filterVariantsType = [...new Set(variantsType)]; // Elimina duplicados

      // Verificar si la variante ya existe
      const existingVariant = await this.variantRepository.findVariantByName(
        name,
        userId,
      );
      if (existingVariant) {
        return { error: 'Variant already exists', existingVariant };
      } else {
        // Crear instancias de VariantsContent y guardarlas
        const createdVariantTypes = await Promise.all(
          filterVariantsType.map(async (name) => {
            const variantType = this.variantTypeRepository.create({
              type: name,
            });
            console.log(variantType, name);
            return await this.variantTypeRepository.save(variantType);
          }),
        );
        console.log(createdVariantTypes);
        // Crear la instancia de Variant y asignar las instancias de VariantsContent
        const variant = this.variantRepository.create({
          name,
          user,
          variantTypes: createdVariantTypes,
        });

        // Guardar la instancia de Variant en la base de datos
        const savedVariant = await this.variantRepository.save(variant);
        // Crear la respuesta con el nombre de la variante y sus tipos
        const response = {
          name: savedVariant.name,
          variantTypes: savedVariant.variantTypes.map((type) => type.type),
        };
        return response;
      }
    } catch (error) {
      console.log(error);
      this.handleException(error);
    }
  }

  /**
   * A method to find all variants.
   *
   * @param {PaginationDto} paginationDto - the pagination data transfer object
   * @param {User} user - the user object
   * @return {Promise<any>} the variants found
   */
  async findAll(paginationDto: PaginationDto, user: User) {
    const userId = user.id;
    //buscamos todas las variantes
    const variants = await this.variantRepository.findAllVariantsByUser(
      paginationDto,
      userId,
    );

    return variants;
  }

  /**
   * Finds a variant by the given term, which can be an id or name.
   *
   * @param {string} term - the id or name of the variant
   * @return {Promise<Variant>} the found variant
   */
  async findOne(term: string) {
    let variant: Variant;
    if (isUUID(term)) {
      variant = await this.variantRepository.findOneBy({ id: term });
    } else {
      variant = await this.variantRepository.findVariant(term);
    }
    if (!variant) {
      throw new NotFoundException(`Variant with id or name ${term} not found`);
    }
    return variant;
  }

  async updateVariant(
    id: string,
    updateInventoryVariantDto: UpdateInventoryVariantDto,
  ) {
    const { name } = updateInventoryVariantDto;
    const editVariant = await this.variantRepository.updateVariantById(
      id,
      name,
    );

    return editVariant;
  }

  async updateVariantType(id: string) {
    return `This action updates a #${id} inventoryVariant`;
  }

  /**
   * Removes a variant from the user's inventory.
   *
   * @param {any} variantId - The ID of the variant to be removed.
   * @param {any} user - The user object.
   * @throws {NotFoundException} If the variant is not found for the user.
   * @return {Promise<void>} A promise that resolves when the variant is successfully removed.
   */
  async remove(variantId, user) {
    // Buscar la variante dentro de las variantes del usuario
    const variant = user.variant.find((variant) => variant.id === variantId);

    if (!variant) {
      throw new NotFoundException('Variant not found for this user');
    }

    // Eliminar la variante del usuario
    const index = user.variant.indexOf(variant);
    user.variant.splice(index, 1);

    // Eliminar la variante de la base de datos
    await this.variantRepository.delete(variantId);
    return {
      message: `Variant ${variantId} deleted successfully`,
    };
  }

  // creacion de metodo privado de manejo de errores
  private handleException(error: any) {
    if (error.code === '23505') throw new BadGatewayException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, Check Server Logs',
      error,
    );
  }
}
