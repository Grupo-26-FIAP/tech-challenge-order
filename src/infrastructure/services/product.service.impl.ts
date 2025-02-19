import { ProductResponseDto } from '@Application/dtos/response/product/product.response.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EnvironmentVariableService } from '@Shared/config/environment-variable/environment-variable.service';
import { lastValueFrom } from 'rxjs';
import { IProductService } from './product.service';

@Injectable()
export class ProductServiceImpl implements IProductService {
  constructor(
    private readonly httpService: HttpService,
    private readonly environmentVariableService: EnvironmentVariableService,
  ) {}

  async findProducts(): Promise<ProductResponseDto[]> {
    console.log(`${this.environmentVariableService.urlApiProduct}/products`);

    const { data } = await lastValueFrom(
      this.httpService.get<ProductResponseDto[]>(
        `${this.environmentVariableService.urlApiProduct}/products`,
      ),
    );
    return data;
  }
}
