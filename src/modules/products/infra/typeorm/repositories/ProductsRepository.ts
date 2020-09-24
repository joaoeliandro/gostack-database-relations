import { getRepository, Repository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: { name },
    });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const ids = products.map(prod => prod.id);

    const productsObjs = await this.ormRepository.findByIds(ids);

    return productsObjs;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const ids = products.map(product => product.id);

    const productsToUpdate = await this.ormRepository.findByIds(ids);

    productsToUpdate.map(prodToUpdate => {
      const reference = products.find(el => el.id === prodToUpdate.id);

      if (reference) {
        prodToUpdate.quantity = reference.quantity;
      }
    });

    await this.ormRepository.save(productsToUpdate);

    return productsToUpdate;
  }
}

export default ProductsRepository;
