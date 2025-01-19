import { ProductResponseDto } from '@Application/dtos/response/product/product.response.dto';

export interface IProductService {
  findProducts(): Promise<ProductResponseDto[]>;
}

export const IProductService = Symbol('IProductService');
