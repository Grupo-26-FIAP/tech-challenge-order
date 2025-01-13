export class ProductOrderEntity {
  constructor(
    public quantity: number,
    public product: any,
    public createdAt: Date,
    public id?: number,
  ) {}
}
