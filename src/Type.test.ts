import {
  isIngredient,
  isStandardProduct,
  isGuaranteedProduct,
  isBallProduct,
  isProduct,
} from './Types';

describe('Types', () => {
  test('isIngredient', () => {
    expect(isIngredient('しろぼんぐり')).toBeTruthy();
    expect(isIngredient('あまーいりんご')).toBeTruthy();
    expect(isIngredient('からぶりほけん')).toBeTruthy();
    expect(isIngredient('おおきなキノコ')).toBeTruthy();
    expect(isIngredient('とくせいカプセル')).toBeTruthy();
    expect(isIngredient('モンスターボール')).toBeFalsy(); // ボールは素材にできない
  });

  test('isStandardProduct', () => {
    expect(isStandardProduct('しろぼんぐり')).toBeFalsy();
    expect(isStandardProduct('あまーいりんご')).toBeFalsy();
    expect(isStandardProduct('からぶりほけん')).toBeTruthy();
    expect(isStandardProduct('おおきなキノコ')).toBeTruthy(); // おおきなキノコは通常レシピにも固定レシピにもある
    expect(isStandardProduct('とくせいカプセル')).toBeFalsy();
    expect(isStandardProduct('モンスターボール')).toBeFalsy();
  });

  test('isGuaranteedProduct', () => {
    expect(isGuaranteedProduct('しろぼんぐり')).toBeFalsy();
    expect(isGuaranteedProduct('あまーいりんご')).toBeFalsy();
    expect(isGuaranteedProduct('からぶりほけん')).toBeFalsy();
    expect(isGuaranteedProduct('おおきなキノコ')).toBeTruthy(); // おおきなキノコは通常レシピにも固定レシピにもある
    expect(isGuaranteedProduct('とくせいカプセル')).toBeTruthy();
    expect(isGuaranteedProduct('モンスターボール')).toBeFalsy();
  });

  test('isBallProduct', () => {
    expect(isBallProduct('しろぼんぐり')).toBeFalsy();
    expect(isBallProduct('あまーいりんご')).toBeFalsy();
    expect(isBallProduct('からぶりほけん')).toBeFalsy();
    expect(isBallProduct('おおきなキノコ')).toBeFalsy();
    expect(isBallProduct('とくせいカプセル')).toBeFalsy();
    expect(isBallProduct('モンスターボール')).toBeTruthy();
  });

  test('isProduct', () => {
    expect(isProduct('しろぼんぐり')).toBeFalsy();
    expect(isProduct('あまーいりんご')).toBeFalsy();
    expect(isProduct('からぶりほけん')).toBeTruthy();
    expect(isProduct('おおきなキノコ')).toBeTruthy();
    expect(isProduct('とくせいカプセル')).toBeTruthy();
    expect(isProduct('モンスターボール')).toBeTruthy();
  });
});
