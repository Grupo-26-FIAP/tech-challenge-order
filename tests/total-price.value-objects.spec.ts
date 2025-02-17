import { TotalPriceValueObject } from '@Domain/value-objects/total-price.value-objects';

describe('TotalPriceValueObject', () => {
  it('should create a TotalPriceValueObject with a valid value', () => {
    const value = 100;
    const totalPrice = new TotalPriceValueObject(value);
    expect(totalPrice.getValue()).toBe(value);
    expect(totalPrice.toString()).toBe('100.00');
  });

  it('should throw an error if the value is negative', () => {
    expect(() => new TotalPriceValueObject(-1)).toThrowError(
      'O preço total deve ser um valor positivo.',
    );
  });

  it('should return the value as a string with two decimal places', () => {
    const value = 123.456;
    const totalPrice = new TotalPriceValueObject(value);
    expect(totalPrice.toString()).toBe('123.46');
  });

  it('should return the value as a number', () => {
    const value = 50.5;
    const totalPrice = new TotalPriceValueObject(value);
    expect(totalPrice.getValue()).toBe(value);
  });
});
