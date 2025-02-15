export class CreateOrderEntity {
  constructor(
    public orderItems: CreateProductOrderEntity[],
    public userId?: string,
  ) {}
}

export class CreateProductOrderEntity {
  constructor(
    public productId: number,
    public quantity: number,
    public preparationTime: number,
    public price: number,
  ) {}
}
