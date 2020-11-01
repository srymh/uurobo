import {Type, Product, StandardProduct, StandardProductList} from './Types';
import {getProductRecipes} from './tableReader';
import {ingredientSpecTable} from './tables';

const scores = ingredientSpecTable
  .map((x) => x.score)
  .filter((v, i, s) => s.indexOf(v) === i)
  .sort((a, b) => a - b);

export function create(item: Product): Array<{type: Type; lists: number[][]}> {
  // https://stackoverflow.com/questions/56565528/typescript-const-assertions-how-to-use-array-prototype-includes
  // as const した string 配列で includes メソッドを使う方法
  if ((StandardProductList as ReadonlyArray<string>).includes(item)) {
    const searched = getProductRecipes(item as StandardProduct, {
      onlyMinCost: true,
    }).standard;

    if (searched) {
      if (searched.length > 0) {
        const combinations = [];
        for (let i = 0; i < searched.length; i++) {
          combinations.push({
            type: searched[i].type,
            lists: calcCombinations(scores, searched[i].scores[0], 4).sort(
              (a, b) => a[0] - b[0]
            ),
          });
        }
        return combinations;
      }
    }
  }
  // Not found
  return [];
}

/**
 * 整数の組 a を与えたときそれらの整数のうち K 個の整数を使って和が A となるよなすべての組み合わせを求める
 * @param a 整数の組
 * @param A 総和
 * @param K 整数を K 個使っての総和 A となるようにする
 */
function calcCombinations(a: number[], A: number, K: number): number[][] {
  const n = a.length;

  if (A > 200 || n > 100) throw new Error('メモリ足りないかも');

  /**
   * 和が i となるような整数の順列(注1)の配列
   * 注1: [2, 3] と [3, 2] を区別する、という意味合いでここでは表現している。
   * 逆に [2, 3] と [3, 2] を区別しないのを「組み合わせ」と呼ぶ。
   *
   * a = [2, 3, 5] とする。
   * このうち、1 番目までの整数 (a[0] = 2, a[1] = 3) を使って
   * 和を i = 5 にするような整数の組み合わせの配列を dp[i] = dp[5] と表現する。
   * ここで 2 + 3 = 5 なので組み合わせの1つは [2, 3] である。
   * もう1つは [3, 2] である。
   * したがって、1 番目までの整数を使った場合には dp[5] = [[2, 3], [3, 2]] である。
   * 次に 2 番目までの整数 (a[0] = 2, a[1] = 3, a[2] = 5) を使った場合には
   * 和が 5 となる組み合わせに [5] を追加する。
   * したがって、2 番目までの整数を使った場合には dp[5] = [[2, 3], [3, 2], [5]] である。
   * 1 番目までの整数を使った場合の組み合わせをわざわざ覚えておく必要はない。はず。
   */
  const dp: number[][][] = new Array(A + 1);
  for (let i = 0; i <= A; i++) {
    dp[i] = [];
  }

  dp[0][0] = [];

  for (let i = 0; i <= A; i++) {
    for (let j = 0; j < n; j++) {
      if (i < a[j]) break;
      const dp_i_aj = dp[i - a[j]];
      for (let k = 0; k < dp_i_aj.length; k++) {
        // 整数の数が K 個未満なら新しい組み合わせとして保存する
        if (dp_i_aj[k].length < K) {
          dp[i].push([...dp_i_aj[k], a[j]]);
        }
      }
    }
  }

  return dp[A].filter((x) => x.length === K);
}
