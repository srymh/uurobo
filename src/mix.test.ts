import {mix, standardRecipe, mixAccordingToBallRecipe} from './mix';

describe('mix', () => {
  test('ブレイズキック', () => {
    expect(mix('あついいわ', 'かたいいし', 'しんじゅ', 'リリバのみ')).toEqual([
      {name: 'ブレイズキック', rate: 100},
    ]);
  });

  test('確定特殊レシピ: でかいきんのたま', () => {
    expect(
      mix('きんのたま', 'かたいいし', 'きんのたま', 'きんのたま')
    ).toEqual([{name: 'でかいきんのたま', rate: 100}]);
  });

  test('確定特殊レシピ: すいせいのかけら', () => {
    expect(
      mix('ほしのかけら', 'かたいいし', 'ほしのかけら', 'ほしのかけら')
    ).toEqual([{name: 'すいせいのかけら', rate: 100}]);
  });
});

describe('standardRecipe', () => {
  describe('こおり', () => {
    test('1 - 20', () => {
      expect(() => standardRecipe('こおり', 0)).toThrow();
      expect(standardRecipe('こおり', 1)).toEqual([
        {name: 'ゆきだま', rate: 100},
      ]);
      expect(standardRecipe('こおり', 20)).toEqual([
        {name: 'ゆきだま', rate: 100},
      ]);
      expect(standardRecipe('こおり', 21)).not.toEqual([
        {name: 'ゆきだま', rate: 100},
      ]);
    });
  });

  describe('フェアリー', () => {
    test('50 - 60', () => {
      expect(standardRecipe('フェアリー', 50)).not.toEqual([
        {name: 'においぶくろ', rate: 100},
      ]);
      expect(standardRecipe('フェアリー', 51)).toEqual([
        {name: 'においぶくろ', rate: 100},
      ]);
      expect(standardRecipe('フェアリー', 60)).toEqual([
        {name: 'においぶくろ', rate: 100},
      ]);
      expect(standardRecipe('フェアリー', 61)).not.toEqual([
        {name: 'においぶくろ', rate: 100},
      ]);
    });
  });

  describe('はがね', () => {
    test('140 - 150', () => {
      expect(standardRecipe('はがね', 140)).not.toEqual([
        {name: 'ぎんのおうかん', rate: 100},
      ]);
      expect(standardRecipe('はがね', 141)).toEqual([
        {name: 'ぎんのおうかん', rate: 100},
      ]);
      expect(standardRecipe('はがね', 150)).toEqual([
        {name: 'ぎんのおうかん', rate: 100},
      ]);
      expect(standardRecipe('はがね', 151)).not.toEqual([
        {name: 'ぎんのおうかん', rate: 100},
      ]);
    });
  });

  describe('ひこう', () => {
    test('151 - ', () => {
      expect(standardRecipe('ひこう', 150)).not.toEqual([
        {name: 'ポイントアップ', rate: 100},
      ]);
      expect(standardRecipe('ひこう', 151)).toEqual([
        {name: 'ポイントアップ', rate: 100},
      ]);
      expect(standardRecipe('ひこう', 300)).toEqual([
        {name: 'ポイントアップ', rate: 100},
      ]);
    });
  });
});

describe('mixAccordingToBallRecipe', () => {
  test('あおぼんぐり4個', () => {
    expect(
      mixAccordingToBallRecipe(
        'あおぼんぐり',
        'あおぼんぐり',
        'あおぼんぐり',
        'あおぼんぐり'
      )
    ).toEqual([
      {name: 'モンスターボール', rate: 25},
      {name: 'スーパーボール', rate: 25},
      {name: 'ダイブボール', rate: 25},
      {name: 'ネットボール', rate: 25},
      {name: 'ルアーボール', rate: 1},
      {name: 'サファリボール', rate: 0.1},
      {name: 'コンペボール', rate: 0.1},
    ]);
  });

  test('あおぼんぐり2個, あかぼんぐり2個', () => {
    expect(
      mixAccordingToBallRecipe(
        'あおぼんぐり',
        'あおぼんぐり',
        'あかぼんぐり',
        'あかぼんぐり'
      ).sort((a, b) => a.rate - b.rate)
    ).toEqual(
      [
        {name: 'モンスターボール', rate: 25},
        {name: 'スーパーボール', rate: 25},
        {name: 'ダイブボール', rate: 12.5},
        {name: 'ネットボール', rate: 12.5},
        {name: 'ハイパーボール', rate: 12.5},
        {name: 'リピートボール', rate: 12.5},
        {name: 'ルアーボール', rate: 0.5},
        {name: 'レベルボール', rate: 0.5},
        {name: 'サファリボール', rate: 0.1},
        {name: 'コンペボール', rate: 0.1},
      ].sort((a, b) => a.rate - b.rate)
    );
  });
});
