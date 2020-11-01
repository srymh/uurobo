import {getProductRecipes} from './tableReader';

describe('table', () => {
  test('タイプと必要な最小合計スコアを standard result table から検索', () => {
    const result = getProductRecipes('ねがいのかたまり').standard;
    // console.table(result);
    expect(result?.length).toBe(16);
  });
  describe('タイプと必要なすべての合計スコアを standard result table から検索', () => {
    test('ねがいのかたまり', () => {
      const result = getProductRecipes('ねがいのかたまり', {onlyMinCost: false})
        .standard;
      // console.table(result);
      expect(result?.length).toBe(17);
    });
    test('10まんボルト', () => {
      const result = getProductRecipes('10まんボルト', {onlyMinCost: false})
        .standard;
      // console.table(result);
      expect(result?.length).toBe(1);
    });
  });
});
