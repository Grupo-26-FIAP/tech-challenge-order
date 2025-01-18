export class OrderItemEntity {
  constructor(
    public quantity: number,
    public productId: number,
    public createdAt: Date,
    public id?: number,
  ) {}
}
