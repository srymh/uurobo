import {create} from './create';

describe('最小コストで作る', () => {
  test('ねがいのかたまり', () => {
    const result = create('ねがいのかたまり');
    expect(result.length).toBe(16);
    expect(result.find((x) => x.type === 'かくとう')).toBeTruthy();
    const r = result.filter((x) => x.type === 'かくとう')[0];
    expect(r.lists.length).toBe(1350);
    // includes の特性上、[10, 10, 10, 12] は含まれるが次のテストは成功しない
    // expect(kakutou.list.includes([10, 10, 10, 12])).toBeTruthy();
  });
  test('10まんボルト', () => {
    const result = create('10まんボルト');
    expect(result.length).toBe(1);
    expect(result.find((x) => x.type === 'でんき')).toBeTruthy();
    const r = result.filter((x) => x.type === 'でんき')[0];
    expect(r.lists.length).toBe(2800);
  });
  test('ポイントアップ', () => {
    const result = create('ポイントアップ');
    expect(result.length).toBe(18);
    expect(result.find((x) => x.type === 'でんき')).toBeTruthy();
    const r = result.filter((x) => x.type === 'でんき')[0];
    expect(r.lists.length).toBe(35);
  });
});
