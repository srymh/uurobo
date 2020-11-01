import {ingredientSpecTable} from './tables';
import {UuRobo} from './UuRobo';

describe('ウッウロボ', () => {
  describe('インスタンスを作らないで動かす', () => {
    describe('混ぜる', () => {
      test('通常レシピ', () => {
        expect(
          UuRobo.mix('あついいわ', 'かたいいし', 'しんじゅ', 'リリバのみ')
        ).toEqual([{name: 'ブレイズキック', rate: 100}]);
      });

      test('特殊レシピ', () => {
        expect(
          UuRobo.mix(
            'ふしぎなアメ',
            'ふしぎなアメ',
            'ふしぎなアメ',
            'ふしぎなアメ'
          )
        ).toEqual([{name: 'とくせいカプセル', rate: 100}]);
      });

      test('ボールレシピ', () => {
        expect(
          UuRobo.mix(
            'きぼんぐり',
            'きぼんぐり',
            'きぼんぐり',
            'きぼんぐり'
          ).sort((a, b) => a.rate - b.rate)
        ).toEqual(
          [
            {name: 'モンスターボール', rate: 25},
            {name: 'スーパーボール', rate: 25},
            {name: 'ハイパーボール', rate: 25},
            {name: 'クイックボール', rate: 25},
            {name: 'ムーンボール', rate: 1},
            {name: 'サファリボール', rate: 0.1},
            {name: 'コンペボール', rate: 0.1},
          ].sort((a, b) => a.rate - b.rate)
        );
      });
    });

    describe('最小コストで作る', () => {
      test('ねがいのかたまり', () => {
        const result = UuRobo.getRequiredIngredients('ねがいのかたまり');
        expect(result.length).toBe(13058);
      });
      test('10まんボルト', () => {
        const result = UuRobo.getRequiredIngredients('10まんボルト');
        expect(result.length).toBe(678);
      });
      test('ポイントアップ', () => {
        const result = UuRobo.getRequiredIngredients('ポイントアップ');
        expect(result.length).toBe(307);
      });
      test('スターアメざいく', () => {
        const result = UuRobo.getRequiredIngredients('スターアメざいく');
        expect(result.length).toBe(1004);
        for (let i = 0; i < result.length; i++) {
          expect(result[i][0][0].type).toBe('フェアリー');
          expect(
            result[i][0][0].score +
              result[i][1][0].score +
              result[i][2][0].score +
              result[i][3][0].score
          ).toBeGreaterThanOrEqual(112);
          expect(
            result[i][0][0].score +
              result[i][1][0].score +
              result[i][2][0].score +
              result[i][3][0].score
          ).toBeLessThanOrEqual(120);
        }
      });
    });
  });

  describe('インスタンスを生成して動かす', () => {
    describe('ねがいのかたまりの作り方を調べる', () => {
      test('1つめの必要アイテム', () => {
        const uuRobo = new UuRobo();
        uuRobo.setTarget('ねがいのかたまり');
        expect(
          uuRobo
            .getRequiredIngredients(1)
            ?.find((x) => x.name === 'あおぼんぐり')?.name
        ).toBe('あおぼんぐり');
        uuRobo.setIngredient(1, 'あおぼんぐり');
        expect(
          uuRobo
            .getRequiredIngredients(2)
            ?.find((x) => x.name === 'あおぼんぐり')?.name
        ).toBe('あおぼんぐり');
        uuRobo.setIngredient(2, 'あおぼんぐり');
        expect(
          uuRobo.getRequiredIngredients(3)?.find((x) => x.name === 'あまいミツ')
            ?.name
        ).toBe('あまいミツ');
        uuRobo.setIngredient(3, 'あまいミツ');
        expect(
          uuRobo
            .getRequiredIngredients(4)
            ?.find((x) => x.name === 'ふしぎなアメ')?.name
        ).toBe('ふしぎなアメ');
        uuRobo.setIngredient(4, 'ふしぎなアメ');
        expect(uuRobo.mix()[0]?.name).toBe('ねがいのかたまり');
      });

      test('どくばりができないようにする', () => {
        const uuRobo = new UuRobo();
        uuRobo.setTarget('ねがいのかたまり');
        expect(
          uuRobo
            .getRequiredIngredients(1)
            ?.find((x) => x.name === 'ポイズンメモリ')?.name
        ).toBe('ポイズンメモリ');
        uuRobo.setIngredient(1, 'ポイズンメモリ');

        // いわタイプの合計スコア92 - 100に引っかからないようにする
        // ここを通すとどくばりができてしまう。
        expect(() => {
          uuRobo.setIngredient(2, 'ポイズンメモリ');
        }).toThrowError();

        expect(
          uuRobo.getRequiredIngredients(2)?.find((x) => x.name === 'カゴのみ')
            ?.name
        ).toBe('カゴのみ');
        uuRobo.setIngredient(2, 'カゴのみ');
        expect(
          uuRobo
            .getRequiredIngredients(3)
            ?.find((x) => x.name === 'あおぼんぐり')?.name
        ).toBe('あおぼんぐり');
        uuRobo.setIngredient(3, 'あおぼんぐり');
        expect(
          uuRobo
            .getRequiredIngredients(4)
            ?.find((x) => x.name === 'あおぼんぐり')?.name
        ).toBe('あおぼんぐり');
        uuRobo.setIngredient(4, 'あおぼんぐり');
        expect(uuRobo.mix()[0]?.name).toBe('ねがいのかたまり');
      });
    });

    describe('10まんボルトの作り方を調べる', () => {
      const uuRobo = new UuRobo();
      uuRobo.setTarget('10まんボルト');

      test('1つめの必要アイテム', () => {
        const result = uuRobo.getRequiredIngredients(1);
        const itemStat = result?.find((x) => x.name === 'あおぼんぐり');
        expect(itemStat?.name).toBe('あおぼんぐり');
        expect(itemStat?.score).toBe(0);
        expect(itemStat?.type).toBe('でんき');
        uuRobo.setIngredient(1, 'あおぼんぐり');
      });
      test('2つめの必要アイテム', () => {
        const result = uuRobo.getRequiredIngredients(2);
        // console.table(result);
        const itemStat = result?.find((x) => x.name === 'あやしいパッチ');
        expect(itemStat?.name).toBe('あやしいパッチ');
        expect(itemStat?.score).toBe(32);
        uuRobo.setIngredient(2, 'あやしいパッチ');
      });
      test('3つめの必要アイテム', () => {
        const result = uuRobo.getRequiredIngredients(3);
        // console.table(result);
        const itemStat = result?.find((x) => x.name === 'バグメモリ');
        expect(itemStat?.name).toBe('バグメモリ');
        expect(itemStat?.score).toBe(40);
        uuRobo.setIngredient(3, 'バグメモリ');
      });
      test('4つめの必要アイテム', () => {
        const result = uuRobo.getRequiredIngredients(4);
        // console.table(result);
        const itemStat = result?.find((x) => x.name === 'バグメモリ');
        expect(itemStat?.name).toBe('バグメモリ');
        expect(itemStat?.score).toBe(40);
        uuRobo.setIngredient(4, 'バグメモリ');
      });
      test('10まんボルトが作れることを確認する', () => {
        const result = uuRobo.mix();
        expect(result[0]?.name).toBe('10まんボルト');
      });
    });
    describe('アイアンテール', () => {
      test('作る', () => {
        const uuRobo = new UuRobo();
        uuRobo.setTarget('アイアンテール');
        expect(uuRobo.getRequiredIngredients(1)?.length).toBe(9);
      });
    });
    describe('通常レシピと特殊レシピの両方があるパターン', () => {
      test('通常レシピ「ねがいのかたまり」の中から特殊レシピ「おおきなキノコ」のパターンを除外する', () => {
        const uuRobo = new UuRobo();
        uuRobo.setTarget('ねがいのかたまり');
        expect(
          uuRobo
            .getRequiredIngredients(1)
            ?.find((x) => x.name === 'ちいさなキノコ')?.name
        ).toBe('ちいさなキノコ');
        uuRobo.setIngredient(1, 'ちいさなキノコ');
        expect(
          uuRobo
            .getRequiredIngredients(2)
            ?.find((x) => x.name === 'かけたポット')?.name
        ).toBe('かけたポット');
        uuRobo.setIngredient(2, 'かけたポット');
        expect(
          uuRobo
            .getRequiredIngredients(3)
            ?.find((x) => x.name === 'ちいさなキノコ')?.name
        ).toBe('ちいさなキノコ');
        uuRobo.setIngredient(3, 'ちいさなキノコ');
        // ちいさなキノコを入れるとスコア合計は合うが、特殊レシピに該当しておおきなキノコができる。
        // そのため、needItem(4)の結果にちいさなキノコが含まれていてはいけない。
        expect(
          uuRobo
            .getRequiredIngredients(4)
            ?.find((x) => x.name === 'ちいさなキノコ')?.name
        ).toBeUndefined();
        // それでも無理やり入れた場合にはエラーをスローする。
        expect(() => {
          uuRobo.setIngredient(4, 'ちいさなキノコ');
        }).toThrowError();
      });

      describe('「かおるキノコ」を作る', () => {
        test('通常レシピで作る', () => {
          const uuRobo = new UuRobo();
          uuRobo.setTarget('かおるキノコ');
          expect(
            uuRobo
              .getRequiredIngredients(1)
              ?.find((x) => x.name === 'ぎんのこな')?.name
          ).toBe('ぎんのこな');
          uuRobo.setIngredient(1, 'ぎんのこな');
          expect(
            uuRobo
              .getRequiredIngredients(2)
              ?.find((x) => x.name === 'とつげきチョッキ')?.name
          ).toBe('とつげきチョッキ');
          uuRobo.setIngredient(2, 'とつげきチョッキ');
          expect(
            uuRobo
              .getRequiredIngredients(3)
              ?.find((x) => x.name === 'かわらずのいし')?.name
          ).toBe('かわらずのいし');
          uuRobo.setIngredient(3, 'かわらずのいし');
          expect(
            uuRobo
              .getRequiredIngredients(4)
              ?.find((x) => x.name === 'ピントレンズ')?.name
          ).toBe('ピントレンズ');
          uuRobo.setIngredient(4, 'ピントレンズ');
          expect(uuRobo.mix()[0].name).toBe('かおるキノコ');
        });

        test('特殊レシピで作る', () => {
          const uuRobo = new UuRobo();
          uuRobo.setTarget('かおるキノコ');
          expect(
            uuRobo
              .getRequiredIngredients(1)
              ?.find((x) => x.name === 'おおきなキノコ')?.name
          ).toBe('おおきなキノコ');
          uuRobo.setIngredient(1, 'おおきなキノコ');
          expect(
            uuRobo
              .getRequiredIngredients(2)
              ?.find((x) => x.name === 'おおきなキノコ')?.name
          ).toBe('おおきなキノコ');
          uuRobo.setIngredient(2, 'おおきなキノコ');
          expect(
            uuRobo
              .getRequiredIngredients(3)
              ?.find((x) => x.name === 'おおきなキノコ')?.name
          ).toBe('おおきなキノコ');
          uuRobo.setIngredient(3, 'おおきなキノコ');
          expect(
            uuRobo
              .getRequiredIngredients(4)
              ?.find((x) => x.name === 'おおきなキノコ')?.name
          ).toBe('おおきなキノコ');
          uuRobo.setIngredient(4, 'おおきなキノコ');
          expect(uuRobo.mix()[0].name).toBe('かおるキノコ');
        });

        test('特殊レシピで作り始めたら通常レシピの要求素材を表示しない', () => {
          const uuRobo = new UuRobo();
          uuRobo.setTarget('かおるキノコ');
          expect(
            uuRobo
              .getRequiredIngredients(1)
              ?.find((x) => x.name === 'おおきなキノコ')?.name
          ).toBe('おおきなキノコ');
          uuRobo.setIngredient(1, 'おおきなキノコ');
          expect(
            uuRobo
              .getRequiredIngredients(2)
              ?.find((x) => x.name === 'すいせいのかけら')?.name
          ).toBe('すいせいのかけら');
          uuRobo.setIngredient(2, 'すいせいのかけら');
          expect(uuRobo.getRequiredIngredients(3)?.length).toBe(1);
          expect(
            uuRobo
              .getRequiredIngredients(3)
              ?.find((x) => x.name === 'おおきなキノコ')?.name
          ).toBe('おおきなキノコ');
          uuRobo.setIngredient(3, 'おおきなキノコ');
          expect(uuRobo.getRequiredIngredients(4)?.length).toBe(1);
          expect(
            uuRobo
              .getRequiredIngredients(4)
              ?.find((x) => x.name === 'おおきなキノコ')?.name
          ).toBe('おおきなキノコ');
          uuRobo.setIngredient(4, 'おおきなキノコ');
          expect(uuRobo.mix()[0].name).toBe('かおるキノコ');
        });
      });

      describe('「おだんごしんじゅ」を作る', () => {
        test('特殊レシピで作る', () => {
          const uuRobo = new UuRobo();
          uuRobo.setTarget('おだんごしんじゅ');
          expect(
            uuRobo
              .getRequiredIngredients(1)
              ?.find((x) => x.name === 'おおきなしんじゅ')?.name
          ).toBe('おおきなしんじゅ');
          uuRobo.setIngredient(1, 'おおきなしんじゅ');
          expect(
            uuRobo
              .getRequiredIngredients(2)
              ?.find((x) => x.name === 'とつげきチョッキ')?.name
          ).toBe('とつげきチョッキ');
          uuRobo.setIngredient(2, 'とつげきチョッキ');
          expect(
            uuRobo
              .getRequiredIngredients(3)
              ?.find((x) => x.name === 'おおきなしんじゅ')?.name
          ).toBe('おおきなしんじゅ');
          uuRobo.setIngredient(3, 'おおきなしんじゅ');
          expect(
            uuRobo
              .getRequiredIngredients(4)
              ?.find((x) => x.name === 'おおきなしんじゅ')?.name
          ).toBe('おおきなしんじゅ');
          uuRobo.setIngredient(4, 'おおきなしんじゅ');
          expect(uuRobo.mix()[0].name).toBe('おだんごしんじゅ');
        });
      });

      test('通常レシピで作る', () => {
        const uuRobo = new UuRobo();
        uuRobo.setTarget('おだんごしんじゅ');
        expect(
          uuRobo
            .getRequiredIngredients(1)
            ?.find((x) => x.name === 'ウオーターメモリ')?.name
        ).toBe('ウオーターメモリ');
        uuRobo.setIngredient(1, 'ウオーターメモリ');
        expect(
          uuRobo
            .getRequiredIngredients(2)
            ?.find((x) => x.name === 'かわらずのいし')?.name
        ).toBe('かわらずのいし');
        uuRobo.setIngredient(2, 'かわらずのいし');
        expect(
          uuRobo
            .getRequiredIngredients(3)
            ?.find((x) => x.name === 'かわらずのいし')?.name
        ).toBe('かわらずのいし');
        uuRobo.setIngredient(3, 'かわらずのいし');
        expect(
          uuRobo
            .getRequiredIngredients(4)
            ?.find((x) => x.name === 'しめったいわ')?.name
        ).toBe('しめったいわ');
        uuRobo.setIngredient(4, 'しめったいわ');
        expect(uuRobo.mix()[0].name).toBe('おだんごしんじゅ');
      });

      test('中途半端に特殊レシピの要求素材を候補に挙げない', () => {
        const uuRobo = new UuRobo();
        uuRobo.setTarget('おだんごしんじゅ');
        expect(
          uuRobo
            .getRequiredIngredients(1)
            ?.find((x) => x.name === 'ウオーターメモリ')?.name
        ).toBe('ウオーターメモリ');
        uuRobo.setIngredient(1, 'ウオーターメモリ');
        expect(
          uuRobo
            .getRequiredIngredients(2)
            ?.find((x) => x.name === 'ウオーターメモリ')?.name
        ).toBe('ウオーターメモリ');
        uuRobo.setIngredient(2, 'ウオーターメモリ');
        expect(
          uuRobo
            .getRequiredIngredients(3)
            ?.find((x) => x.name === 'しめったいわ')?.name
        ).toBe('しめったいわ');
        uuRobo.setIngredient(3, 'しめったいわ');
        expect(
          uuRobo
            .getRequiredIngredients(4)
            ?.find((x) => x.name === 'おおきなしんじゅ')?.name
        ).toBeUndefined();
        expect(() => {
          uuRobo.setIngredient(4, 'おおきなしんじゅ');
        }).toThrowError();
      });
    });

    describe('とくせいカプセルの作り方を調べる', () => {
      test('とくせいカプセル', () => {
        const uuRobo = new UuRobo();
        uuRobo.setTarget('とくせいカプセル');
        const firstRequiredItem = uuRobo.getRequiredIngredients(1);
        expect(firstRequiredItem?.length).toBe(1);
        expect(
          firstRequiredItem?.map((x) => x.name).includes('ふしぎなアメ')
        ).toBeTruthy();
        uuRobo.setIngredient(1, 'ふしぎなアメ');

        expect(uuRobo.getRequiredIngredients(2)?.length).toBe(
          ingredientSpecTable.length
        );
        expect(
          uuRobo
            .getRequiredIngredients(2)
            ?.map((x) => x.name)
            .includes('けいけんアメS')
        ).toBeTruthy();
        uuRobo.setIngredient(2, 'けいけんアメS');

        expect(uuRobo.getRequiredIngredients(3)?.length).toBe(1);
        expect(
          uuRobo
            .getRequiredIngredients(3)
            ?.map((x) => x.name)
            .includes('ふしぎなアメ')
        ).toBeTruthy();
        uuRobo.setIngredient(3, 'ふしぎなアメ');

        expect(uuRobo.getRequiredIngredients(4)?.length).toBe(1);
        expect(
          uuRobo
            .getRequiredIngredients(4)
            ?.map((x) => x.name)
            .includes('ふしぎなアメ')
        ).toBeTruthy();
        uuRobo.setIngredient(4, 'ふしぎなアメ');

        expect(uuRobo.mix()[0]?.name).toBe('とくせいカプセル');
      });
    });

    describe('ボールレシピ', () => {
      test('「モンスターボール」を作る', () => {
        const uuRobo = new UuRobo();
        uuRobo.setTarget('モンスターボール');
        expect(
          uuRobo
            .getRequiredIngredients(1)
            ?.find((x) => x.name === 'くろぼんぐり')?.name
        ).toBe('くろぼんぐり');
        uuRobo.setIngredient(1, 'くろぼんぐり');
        expect(
          uuRobo
            .getRequiredIngredients(2)
            ?.find((x) => x.name === 'くろぼんぐり')?.name
        ).toBe('くろぼんぐり');
        uuRobo.setIngredient(2, 'くろぼんぐり');
        expect(
          uuRobo
            .getRequiredIngredients(3)
            ?.find((x) => x.name === 'くろぼんぐり')?.name
        ).toBe('くろぼんぐり');
        uuRobo.setIngredient(3, 'くろぼんぐり');
        expect(
          uuRobo
            .getRequiredIngredients(4)
            ?.find((x) => x.name === 'くろぼんぐり')?.name
        ).toBe('くろぼんぐり');
        uuRobo.setIngredient(4, 'くろぼんぐり');
        const productPossibilities = uuRobo.mix();
        expect(productPossibilities.length).not.toBe(0);
        const product = productPossibilities.find(
          (x) => x.name === 'モンスターボール'
        );
        expect(product).not.toBeUndefined();
        if (product) {
          expect(product.name).toBe('モンスターボール');
          expect(product.rate).toBeCloseTo(25);
        }
      });

      test('「ヘビーボール」を作る', () => {
        const uuRobo = new UuRobo();
        uuRobo.setTarget('ヘビーボール');
        expect(
          uuRobo
            .getRequiredIngredients(1)
            ?.find((x) => x.name === 'くろぼんぐり')?.name
        ).toBe('くろぼんぐり');
        uuRobo.setIngredient(1, 'くろぼんぐり');
        expect(
          uuRobo
            .getRequiredIngredients(2)
            ?.find((x) => x.name === 'くろぼんぐり')?.name
        ).toBe('くろぼんぐり');
        uuRobo.setIngredient(2, 'くろぼんぐり');
        expect(
          uuRobo
            .getRequiredIngredients(3)
            ?.find((x) => x.name === 'くろぼんぐり')?.name
        ).toBe('くろぼんぐり');
        uuRobo.setIngredient(3, 'くろぼんぐり');
        expect(
          uuRobo
            .getRequiredIngredients(4)
            ?.find((x) => x.name === 'くろぼんぐり')?.name
        ).toBe('くろぼんぐり');
        uuRobo.setIngredient(4, 'くろぼんぐり');
        const productPossibilities = uuRobo.mix();
        expect(productPossibilities.length).not.toBe(0);
        const product = productPossibilities.find(
          (x) => x.name === 'ヘビーボール'
        );
        expect(product).not.toBeUndefined();
        if (product) {
          expect(product.name).toBe('ヘビーボール');
          expect(product.rate).toBeCloseTo(1);
        }
      });

      test('「コンペボール」を作る', () => {
        const uuRobo = new UuRobo();
        uuRobo.setTarget('コンペボール');
        expect(
          uuRobo
            .getRequiredIngredients(1)
            ?.find((x) => x.name === 'くろぼんぐり')?.name
        ).toBe('くろぼんぐり');
        uuRobo.setIngredient(1, 'くろぼんぐり');
        expect(
          uuRobo
            .getRequiredIngredients(2)
            ?.find((x) => x.name === 'くろぼんぐり')?.name
        ).toBe('くろぼんぐり');
        uuRobo.setIngredient(2, 'くろぼんぐり');
        expect(
          uuRobo
            .getRequiredIngredients(3)
            ?.find((x) => x.name === 'くろぼんぐり')?.name
        ).toBe('くろぼんぐり');
        uuRobo.setIngredient(3, 'くろぼんぐり');
        expect(
          uuRobo
            .getRequiredIngredients(4)
            ?.find((x) => x.name === 'くろぼんぐり')?.name
        ).toBe('くろぼんぐり');
        uuRobo.setIngredient(4, 'くろぼんぐり');
        const productPossibilities = uuRobo.mix();
        expect(productPossibilities.length).not.toBe(0);
        const product = productPossibilities.find(
          (x) => x.name === 'コンペボール'
        );
        expect(product).not.toBeUndefined();
        if (product) {
          expect(product.name).toBe('コンペボール');
          expect(product.rate).toBeCloseTo(0.1);
        }
      });
    });

    describe('アメざいく', () => {
      test('いちごアメざいく 1', () => {
        const uuRobo = new UuRobo();
        uuRobo.setTarget('いちごアメざいく');
        uuRobo.setIngredient(1, 'フェアリーメモリ');
        uuRobo.setIngredient(2, 'フェアリーメモリ');
        uuRobo.setIngredient(3, 'サイコシード');
        uuRobo.setIngredient(4, 'サイコシード');
        expect(
          uuRobo
            .mix()
            ?.map((x) => x.name)
            .includes('いちごアメざいく')
        ).toBeTruthy();
      });
      test('いちごアメざいく 2', () => {
        const uuRobo = new UuRobo();
        uuRobo.setTarget('いちごアメざいく');
        uuRobo.setIngredient(1, 'フェアリーメモリ');
        uuRobo.setIngredient(2, 'フェアリーメモリ');
        uuRobo.setIngredient(3, 'サイコシード');
        uuRobo.setIngredient(4, 'スピードパウダー');
        expect(
          uuRobo
            .mix()
            ?.map((x) => x.name)
            .includes('いちごアメざいく')
        ).toBeTruthy();
      });
      test('ベリーあめざいく', () => {
        const uuRobo = new UuRobo();
        uuRobo.setTarget('ベリーアメざいく');
        uuRobo.setIngredient(1, 'フェアリーメモリ');
        uuRobo.setIngredient(2, 'フェアリーメモリ');
        uuRobo.setIngredient(3, 'サイコシード');
        uuRobo.setIngredient(4, 'サイコシード');
        expect(
          uuRobo
            .mix()
            ?.map((x) => x.name)
            .includes('ベリーアメざいく')
        ).toBeTruthy();
      });
      test('スターアメざいく', () => {
        const uuRobo = new UuRobo();
        uuRobo.setTarget('スターアメざいく');
        uuRobo.setIngredient(1, 'フェアリーメモリ');
        uuRobo.setIngredient(2, 'フェアリーメモリ');
        uuRobo.setIngredient(3, 'サイコシード');
        uuRobo.setIngredient(4, 'スピードパウダー');
        expect(
          uuRobo
            .mix()
            ?.map((x) => x.name)
            .includes('スターアメざいく')
        ).toBeTruthy();
      });
    });

    test('3番目のアイテムの選択を取り消すと4番目の選択も取り消される', () => {
      const uuRobo = new UuRobo();
      uuRobo.setTarget('たつじんのおび');
      uuRobo.setIngredient(1, 'くろおび');
      uuRobo.setIngredient(2, 'くろおび');
      uuRobo.setIngredient(3, 'アップグレード');
      uuRobo.setIngredient(4, 'すいせいのかけら');

      uuRobo.removeIngredientsFrom(3);
      expect(uuRobo.getIngredient(3)).toBeNull();
      expect(uuRobo.getIngredient(4)).toBeNull();

      uuRobo.setIngredient(3, 'アップグレード');
      uuRobo.setIngredient(4, 'すいせいのかけら');
      expect(uuRobo.mix()[0]?.name).toBe('たつじんのおび');
    });

    test('3番目のアイテムの選択を変更すると4番目の選択が取り消される', () => {
      const uuRobo = new UuRobo();
      uuRobo.setTarget('たつじんのおび');
      uuRobo.setIngredient(1, 'くろおび');
      uuRobo.setIngredient(2, 'くろおび');
      uuRobo.setIngredient(3, 'アップグレード');
      uuRobo.setIngredient(4, 'すいせいのかけら');

      uuRobo.setIngredient(3, 'おだんごしんじゅ');

      expect(uuRobo.getIngredient(4)).toBeNull();

      uuRobo.setIngredient(4, 'すいせいのかけら');
      expect(uuRobo.mix()[0]?.name).toBe('たつじんのおび');
    });
  });
});
