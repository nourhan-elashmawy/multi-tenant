import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class TenantProductService {
  async findAll(tenantConnection: DataSource): Promise<Product[]> {
    const productRepository = tenantConnection.getRepository(Product);
    return productRepository.find();
  }
}
