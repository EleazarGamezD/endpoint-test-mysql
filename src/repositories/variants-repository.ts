import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Variant } from 'src/inventory_variants/entitites/variant.entity';
import { VariantsContent } from 'src/inventory_variants/entitites/variants-content.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VariantRepository extends Repository<Variant> {
  /**
   * Creates a new instance of the constructor.
   *
   * @param {@InjectRepository(Variant)} repository - The repository for the User entity.
   */
  constructor(
    @InjectRepository(Variant)
    repository: Repository<Variant>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  // method to  find variant, when this method receive the vars "name or id" are converted to lowercase
  public findVariant(name?: string, id?: string, userId?: string) {
    const query = this.createQueryBuilder('variant').select([
      'variant.name',
      'variant.id',
      'variant.userId',
    ]);

    if (name) {
      query
        .andWhere('LOWER(variant.name) LIKE :name', {
          name: `%${name.toLowerCase()}%`,
        })
        .leftJoinAndSelect('variant.variantTypes', 'variantType');
    }
    if (id) {
      query
        .andWhere('variant.id = :id', { id })
        .leftJoinAndSelect('variant.variantTypes', 'variantType');
    }
    if (userId) {
      query
        .andWhere('variant.userId = :userId', { userId })
        .leftJoinAndSelect('variant.variantTypes', 'variantType');
    }

    return query.getOne();
  }

  /**
   * Finds a user by their ID.
   *
   * @param {string} id - The ID of the user.
   * @return {Promise<Variant>} A promise that resolves to the user found by the ID.
   */
  public async findAllVariantsByUser(
    paginationDto: PaginationDto,
    id?: string,
  ) {
    const { limit, offset } = paginationDto;

    try {
      let query = this.createQueryBuilder('variant')
        .leftJoinAndSelect('variant.variantTypes', 'variantType')
        .take(limit)
        .skip(offset);

      // Agregar la condición de filtrado por userId si está presente
      if (id) {
        query = query.where('variant.userId = :id', { id });
      }

      const variants = await query.getMany();
      if (variants.length === 0) {
        throw new Error('No se encontraron variantes para este usuario');
      }
      // Mapear las variantes y sus tipos
      const mappedVariants = variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        types: variant.variantTypes.map((type) => type.type),
      }));

      // return variants; //si se desea la respuesta con los Ids
      return mappedVariants; // si se quiere la respuesta limpia
    } catch (error) {
      // Manejo de errores
      return { message: error.message };
    }
  }

  public async findVariantByName(name: string, userId: string) {
    const queryBuilder = this.createQueryBuilder('variant');

    return queryBuilder
      .where('LOWER(variant.name) = :name', { name: name.toLowerCase() })
      .andWhere('variant.userId = :userId', { userId })
      .leftJoinAndSelect('variant.variantTypes', 'variantType')
      .getOne();
  }

  public async updateVariantById(id: string, newData: any) {
    const variantToUpdate = await this.findOne({
      where: { id },
      select: ['id', 'name'],
    });
    if (!variantToUpdate) {
      return null; // Si no se encuentra la variante, retornar null
    }

    variantToUpdate.name = newData; // Actualizar el nombre de la variante

    await this.save(variantToUpdate);
    return variantToUpdate; // Retornar la variante actualizada
  }
}

// UserDetails repository extension
@Injectable()
export class VariantsTypeRepository extends Repository<VariantsContent> {
  /**
   * Constructor function for the given class.
   *
   * @param {@InjectRepository(UserDetails)} detailRepository - The repository for User Details.
   */
  constructor(
    private readonly variantRepository: VariantRepository,
    @InjectRepository(VariantsContent)
    detailRepository: Repository<VariantsContent>,
  ) {
    super(
      detailRepository.target,
      detailRepository.manager,
      detailRepository.queryRunner,
    );
  }

  // extension of the save method of the VariantType repository
  public saveVariantType(variantId?: string, variantType?) {
    this.variantRepository.findVariant(variantId);
    return this.save(variantType);
  }
}
