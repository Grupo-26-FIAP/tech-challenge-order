export class CreateOrderEntity {
  constructor(
    public productOrders: CreateProductOrderEntity[],
    public userId?: number,
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
