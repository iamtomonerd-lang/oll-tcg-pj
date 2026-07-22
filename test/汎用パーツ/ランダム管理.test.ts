/**
 * 汎用パーツ：ランダム管理 - テスト
 *
 * テスト対象：
 * - ランダム結果生成
 * - 整数生成・要素選択・複数選択・シャッフル
 * - シード対応（再現性）
 * - 履歴管理
 * - イミュータビリティ
 * - ゲーム非依存性確認
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  ランダム管理,
  は履歴が空か,
  履歴のサイズを取得
} from '../../src/汎用パーツ/ランダム管理/index';

describe('ランダム管理 - ユーティリティ関数', () => {
  describe('履歴判定', () => {
    it('空の履歴を判定できる', () => {
      const r = new ランダム管理('random-1');
      expect(は履歴が空か(r.履歴一覧)).toBe(true);
    });

    it('履歴のサイズを取得できる', () => {
      const r = new ランダム管理('random-1');
      expect(履歴のサイズを取得(r.履歴一覧)).toBe(0);
    });
  });
});

describe('ランダム管理 - 管理クラス', () => {
  let ランダム: ランダム管理;

  beforeEach(() => {
    ランダム = new ランダム管理('random-1');
  });

  describe('初期状態', () => {
    it('IDが保持される', () => {
      expect(ランダム.ID).toBe('random-1');
    });

    it('方式が未設定', () => {
      expect(ランダム.現在の方式).toBe(null);
    });

    it('結果が未設定', () => {
      expect(ランダム.最新結果).toBe(null);
    });

    it('シードが未設定', () => {
      expect(ランダム.シード).toBe(null);
    });

    it('履歴が空', () => {
      expect(ランダム.履歴が空か()).toBe(true);
    });

    it('履歴のサイズが0', () => {
      expect(ランダム.履歴のサイズ()).toBe(0);
    });
  });

  describe('シード設定', () => {
    it('シードを設定できる', () => {
      const r2 = ランダム.シードを設定(12345);
      expect(r2.シード).toBe(12345);
    });

    it('同じシードは新規インスタンスを返さない', () => {
      const r1 = ランダム.シードを設定(12345);
      const r2 = r1.シードを設定(12345);
      expect(r1).toBe(r2);
    });

    it('異なるシードは新規インスタンスを返す', () => {
      const r1 = ランダム.シードを設定(12345);
      const r2 = r1.シードを設定(54321);
      expect(r1).not.toBe(r2);
      expect(r2.シード).toBe(54321);
    });

    it('シード設定時に履歴が増える', () => {
      const r2 = ランダム.シードを設定(12345);
      expect(r2.履歴のサイズ()).toBe(1);
      expect(r2.最新履歴を取得()?.種類).toBe('シード設定');
    });
  });

  describe('整数生成', () => {
    it('範囲内の整数を生成できる', () => {
      const r2 = ランダム.整数を生成(1, 100);
      expect(r2.最新結果).not.toBe(null);
      expect(typeof r2.最新結果?.値).toBe('number');
      const 値 = r2.最新結果?.値 as number;
      expect(値).toBeGreaterThanOrEqual(1);
      expect(値).toBeLessThanOrEqual(100);
    });

    it('最小値のみの場合を処理できる', () => {
      const r2 = ランダム.整数を生成(1, 1);
      expect(r2.最新結果?.値).toBe(1);
    });

    it('負の数を含む範囲を処理できる', () => {
      const r2 = ランダム.整数を生成(-50, 50);
      const 値 = r2.最新結果?.値 as number;
      expect(値).toBeGreaterThanOrEqual(-50);
      expect(値).toBeLessThanOrEqual(50);
    });

    it('方式が「整数生成」に設定される', () => {
      const r2 = ランダム.整数を生成(1, 100);
      expect(r2.現在の方式).toBe('整数生成');
    });

    it('履歴に記録される', () => {
      const r2 = ランダム.整数を生成(1, 100);
      expect(r2.履歴のサイズ()).toBe(1);
      expect(r2.最新履歴を取得()?.種類).toBe('方式実行');
      expect(r2.最新履歴を取得()?.方式).toBe('整数生成');
    });
  });

  describe('要素選択', () => {
    it('配列から1つの要素を選択できる', () => {
      const 候補 = ['A', 'B', 'C'];
      const r2 = ランダム.要素を選択(候補);
      expect(候補).toContain(r2.最新結果?.値);
    });

    it('候補が1つの場合はそれを返す', () => {
      const 候補 = ['単一'];
      const r2 = ランダム.要素を選択(候補);
      expect(r2.最新結果?.値).toBe('単一');
    });

    it('方式が「要素選択」に設定される', () => {
      const 候補 = ['A', 'B', 'C'];
      const r2 = ランダム.要素を選択(候補);
      expect(r2.現在の方式).toBe('要素選択');
    });

    it('空の配列でエラーが発生する', () => {
      expect(() => ランダム.要素を選択([])).toThrow('候補一覧が空です');
    });

    it('履歴に記録される', () => {
      const 候補 = ['A', 'B', 'C'];
      const r2 = ランダム.要素を選択(候補);
      expect(r2.履歴のサイズ()).toBe(1);
      expect(r2.最新履歴を取得()?.方式).toBe('要素選択');
    });
  });

  describe('複数要素選択', () => {
    it('重複なしで複数要素を選択できる', () => {
      const 候補 = ['A', 'B', 'C', 'D', 'E'];
      const r2 = ランダム.複数要素を選択(候補, 3, false);
      const 結果 = r2.最新結果?.値 as string[];
      expect(結果.length).toBe(3);
      expect(結果.every(e => 候補.includes(e))).toBe(true);
      // 重複がないことを確認
      expect(new Set(結果).size).toBe(3);
    });

    it('重複ありで複数要素を選択できる', () => {
      const 候補 = ['A', 'B', 'C'];
      const r2 = ランダム.複数要素を選択(候補, 5, true);
      const 結果 = r2.最新結果?.値 as string[];
      expect(結果.length).toBe(5);
      expect(結果.every(e => 候補.includes(e))).toBe(true);
    });

    it('選択数が候補数を超える場合、重複なしでエラーが発生する', () => {
      const 候補 = ['A', 'B', 'C'];
      expect(() => ランダム.複数要素を選択(候補, 5, false)).toThrow();
    });

    it('選択数が0以下でエラーが発生する', () => {
      const 候補 = ['A', 'B', 'C'];
      expect(() => ランダム.複数要素を選択(候補, 0, false)).toThrow();
    });

    it('方式が「複数要素選択」に設定される', () => {
      const 候補 = ['A', 'B', 'C', 'D', 'E'];
      const r2 = ランダム.複数要素を選択(候補, 3, false);
      expect(r2.現在の方式).toBe('複数要素選択');
    });

    it('履歴に記録される', () => {
      const 候補 = ['A', 'B', 'C', 'D', 'E'];
      const r2 = ランダム.複数要素を選択(候補, 3, false);
      expect(r2.履歴のサイズ()).toBe(1);
      expect(r2.最新履歴を取得()?.方式).toBe('複数要素選択');
    });
  });

  describe('シャッフル', () => {
    it('配列をシャッフルできる', () => {
      const 元の配列 = ['A', 'B', 'C', 'D', 'E'];
      const r2 = ランダム.シャッフル(元の配列);
      const シャッフル済み = r2.最新結果?.値 as string[];
      expect(シャッフル済み.length).toBe(5);
      expect(シャッフル済み.sort()).toEqual(['A', 'B', 'C', 'D', 'E']);
    });

    it('元の配列を変更しない', () => {
      const 元の配列 = ['A', 'B', 'C', 'D', 'E'];
      const コピー = [...元の配列];
      ランダム.シャッフル(元の配列);
      expect(元の配列).toEqual(コピー);
    });

    it('単一要素のシャッフルは変わらない', () => {
      const 元の配列 = ['A'];
      const r2 = ランダム.シャッフル(元の配列);
      const シャッフル済み = r2.最新結果?.値 as string[];
      expect(シャッフル済み).toEqual(['A']);
    });

    it('方式が「シャッフル」に設定される', () => {
      const 元の配列 = ['A', 'B', 'C', 'D', 'E'];
      const r2 = ランダム.シャッフル(元の配列);
      expect(r2.現在の方式).toBe('シャッフル');
    });

    it('履歴に記録される', () => {
      const 元の配列 = ['A', 'B', 'C', 'D', 'E'];
      const r2 = ランダム.シャッフル(元の配列);
      expect(r2.履歴のサイズ()).toBe(1);
      expect(r2.最新履歴を取得()?.方式).toBe('シャッフル');
    });
  });

  describe('シード再現性', () => {
    it('同じシードで同じ整数を生成できる', () => {
      const r1 = ランダム.シードを設定(42);
      const 結果1 = r1.整数を生成(1, 100).最新結果?.値;

      const r2 = new ランダム管理('random-2').シードを設定(42);
      const 結果2 = r2.整数を生成(1, 100).最新結果?.値;

      expect(結果1).toBe(結果2);
    });

    it('異なるシードで異なる整数を生成する（統計的に高確率）', () => {
      // より広い範囲を使用して、異なるシードが異なる値を生成する確率を高める
      const r1 = ランダム.シードを設定(42);
      const 結果1 = r1.整数を生成(1, 1000000).最新結果?.値;

      const r2 = new ランダム管理('random-2').シードを設定(43);
      const 結果2 = r2.整数を生成(1, 1000000).最新結果?.値;

      expect(結果1).not.toBe(結果2);
    });

    it('同じシードで同じ要素を選択できる', () => {
      const 候補 = ['A', 'B', 'C', 'D', 'E'];
      const r1 = ランダム.シードを設定(42);
      const 結果1 = r1.要素を選択(候補).最新結果?.値;

      const r2 = new ランダム管理('random-2').シードを設定(42);
      const 結果2 = r2.要素を選択(候補).最新結果?.値;

      expect(結果1).toBe(結果2);
    });

    it('同じシードで同じシャッフル結果を得られる', () => {
      const 元の配列 = ['A', 'B', 'C', 'D', 'E'];
      const r1 = ランダム.シードを設定(42);
      const 結果1 = r1.シャッフル(元の配列).最新結果?.値;

      const r2 = new ランダム管理('random-2').シードを設定(42);
      const 結果2 = r2.シャッフル(元の配列).最新結果?.値;

      expect(結果1).toEqual(結果2);
    });
  });

  describe('履歴管理', () => {
    it('操作で履歴が増える', () => {
      let r: ランダム管理 = ランダム;
      expect(r.履歴のサイズ()).toBe(0);

      r = r.整数を生成(1, 100);
      expect(r.履歴のサイズ()).toBe(1);

      r = r.整数を生成(1, 100);
      expect(r.履歴のサイズ()).toBe(2);
    });

    it('複数の操作の履歴が保持される', () => {
      let r: ランダム管理 = ランダム;
      r = r.シードを設定(42);
      r = r.整数を生成(1, 100);
      r = r.要素を選択(['A', 'B', 'C']);
      r = r.シャッフル(['X', 'Y', 'Z']);

      expect(r.履歴のサイズ()).toBe(4);
      const 履歴 = r.履歴を取得();
      expect(履歴[0].種類).toBe('シード設定');
      expect(履歴[1].方式).toBe('整数生成');
      expect(履歴[2].方式).toBe('要素選択');
      expect(履歴[3].方式).toBe('シャッフル');
    });

    it('最新履歴を取得できる', () => {
      const r = ランダム.整数を生成(1, 100);
      const 最新 = r.最新履歴を取得();
      expect(最新).not.toBe(null);
      expect(最新?.方式).toBe('整数生成');
    });

    it('最新履歴が存在しない場合はnullを返す', () => {
      expect(ランダム.最新履歴を取得()).toBe(null);
    });

    it('履歴をクリアできる', () => {
      const r = ランダム.整数を生成(1, 100);
      expect(r.履歴のサイズ()).toBe(1);

      const r2 = r.履歴をクリア();
      expect(r2.履歴が空か()).toBe(true);
      expect(r2.最新結果).toEqual(r.最新結果);
    });

    it('空の履歴をクリアは同じインスタンスを返す', () => {
      const r2 = ランダム.履歴をクリア();
      expect(r2).toBe(ランダム);
    });
  });

  describe('リセット', () => {
    it('リセットで結果・方式がクリアされる', () => {
      const r = ランダム.整数を生成(1, 100);
      expect(r.最新結果).not.toBe(null);
      expect(r.現在の方式).toBe('整数生成');

      const r2 = r.リセット();
      expect(r2.最新結果).toBe(null);
      expect(r2.現在の方式).toBe(null);
    });

    it('リセットでシードは保持される', () => {
      const r = ランダム.シードを設定(42).整数を生成(1, 100);
      expect(r.シード).toBe(42);

      const r2 = r.リセット();
      expect(r2.シード).toBe(42);
    });

    it('リセットで履歴は保持される', () => {
      const r = ランダム.シードを設定(42).整数を生成(1, 100);
      expect(r.履歴のサイズ()).toBe(2);

      const r2 = r.リセット();
      expect(r2.履歴のサイズ()).toBe(3); // リセット履歴が追加される
    });

    it('リセット後に新しい操作ができる', () => {
      let r: ランダム管理 = ランダム.整数を生成(1, 100);
      r = r.リセット();
      r = r.整数を生成(1, 50);

      expect(r.最新結果).not.toBe(null);
      const 値 = r.最新結果?.値 as number;
      expect(値).toBeGreaterThanOrEqual(1);
      expect(値).toBeLessThanOrEqual(50);
    });

    it('何もしない状態でのリセットは同じインスタンスを返す', () => {
      const r2 = ランダム.リセット();
      expect(r2).toBe(ランダム);
    });
  });

  describe('完全リセット', () => {
    it('完全リセットですべてがクリアされる', () => {
      const r = ランダム.シードを設定(42).整数を生成(1, 100);
      expect(r.シード).toBe(42);
      expect(r.最新結果).not.toBe(null);
      expect(r.履歴のサイズ()).toBe(2);

      const r2 = r.完全リセット();
      expect(r2.シード).toBe(null);
      expect(r2.最新結果).toBe(null);
      expect(r2.現在の方式).toBe(null);
      expect(r2.履歴が空か()).toBe(true);
    });

    it('初期状態での完全リセットは同じインスタンスを返す', () => {
      const r2 = ランダム.完全リセット();
      expect(r2).toBe(ランダム);
    });

    it('完全リセット後にID は保持される', () => {
      const r = ランダム.シードを設定(42).整数を生成(1, 100);
      const r2 = r.完全リセット();
      expect(r2.ID).toBe(ランダム.ID);
    });
  });

  describe('イミュータビリティ', () => {
    it('整数生成は新規インスタンスを返す', () => {
      const r2 = ランダム.整数を生成(1, 100);
      expect(r2).not.toBe(ランダム);
      expect(ランダム.最新結果).toBe(null);
    });

    it('要素選択は新規インスタンスを返す', () => {
      const r2 = ランダム.要素を選択(['A', 'B', 'C']);
      expect(r2).not.toBe(ランダム);
      expect(ランダム.最新結果).toBe(null);
    });

    it('複数要素選択は新規インスタンスを返す', () => {
      const r2 = ランダム.複数要素を選択(['A', 'B', 'C'], 2, false);
      expect(r2).not.toBe(ランダム);
    });

    it('シャッフルは新規インスタンスを返す', () => {
      const r2 = ランダム.シャッフル(['A', 'B', 'C']);
      expect(r2).not.toBe(ランダム);
    });

    it('リセットは新規インスタンスを返す', () => {
      const r = ランダム.整数を生成(1, 100);
      const r2 = r.リセット();
      expect(r2).not.toBe(r);
    });

    it('履歴配列は参照を保護される', () => {
      const r = ランダム.整数を生成(1, 100);
      const 履歴1 = r.履歴を取得();
      const 履歴2 = r.履歴を取得();
      expect(履歴1).not.toBe(履歴2);
      expect(履歴1).toEqual(履歴2);
    });
  });

  describe('連鎖操作', () => {
    it('複数の操作を連鎖実行できる', () => {
      let r: ランダム管理 = ランダム
        .シードを設定(42)
        .整数を生成(1, 100)
        .リセット()
        .要素を選択(['A', 'B', 'C'])
        .シャッフル(['X', 'Y', 'Z', 'W']);

      expect(r.履歴のサイズ()).toBe(5);
      expect(r.現在の方式).toBe('シャッフル');
    });
  });

  describe('ゲーム非依存性確認', () => {
    it('ゲーム固有概念を含まない', () => {
      // 以下のゲーム固有概念が使用されていないことを確認
      const コード = JSON.stringify(ランダム);
      expect(コード).not.toContain('カード');
      expect(コード).not.toContain('山札');
      expect(コード).not.toContain('ドロー');
      expect(コード).not.toContain('ガチャ');
      expect(コード).not.toContain('ダメージ');
      expect(コード).not.toContain('クリティカル');
    });

    it('汎用的な要素のみを管理する', () => {
      // 汎用型の使用を確認
      const r = ランダム
        .整数を生成(1, 100)
        .要素を選択([1, 2, 3, 4, 5])
        .リセット()
        .複数要素を選択({ a: 1, b: 2 } as any, 1, false);

      // あらゆる型の結果を保持可能
      expect(r).toBeDefined();
    });
  });
});
