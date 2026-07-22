/**
 * 汎用パーツ：条件管理 - テスト
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  シンプルな条件を作成,
  条件をAND結合,
  条件をOR結合,
  条件を反転,
  複数を評価,
  フィルタリング,
  すべてが満たすか,
  いずれかが満たすか,
  条件管理
} from '../../src/汎用パーツ/条件管理/index';

describe('条件管理 - 基本条件', () => {
  describe('シンプルな条件を作成', () => {
    it('条件を作成できる', () => {
      const 偶数条件 = シンプルな条件を作成(
        '偶数',
        (値: unknown) => typeof 値 === 'number' && 値 % 2 === 0
      );

      expect(偶数条件.名前).toBe('偶数');
      const 結果 = 偶数条件.評価(4);
      expect(結果.成功).toBe(true);
    });

    it('条件評価で失敗を返す', () => {
      const 偶数条件 = シンプルな条件を作成(
        '偶数',
        (値: unknown) => typeof 値 === 'number' && 値 % 2 === 0,
        '奇数です'
      );

      const 結果 = 偶数条件.評価(3);
      expect(結果.成功).toBe(false);
      expect(結果.理由).toBe('奇数です');
    });

    it('デフォルトの失敗理由を使用できる', () => {
      const 条件 = シンプルな条件を作成(
        'テスト',
        () => false
      );

      const 結果 = 条件.評価(123);
      expect(結果.成功).toBe(false);
      expect(結果.理由).toBe('テストを満たさない');
    });
  });

  describe('AND結合', () => {
    it('すべての条件を満たしている場合成功', () => {
      const 偶数 = シンプルな条件を作成(
        '偶数',
        (値: unknown) => typeof 値 === 'number' && 値 % 2 === 0
      );
      const 正数 = シンプルな条件を作成(
        '正数',
        (値: unknown) => typeof 値 === 'number' && 値 > 0
      );

      const 結合 = 条件をAND結合(偶数, 正数);
      expect(結合.評価(4).成功).toBe(true);
    });

    it('いずれかの条件を満たさない場合失敗', () => {
      const 偶数 = シンプルな条件を作成(
        '偶数',
        (値: unknown) => typeof 値 === 'number' && 値 % 2 === 0
      );
      const 正数 = シンプルな条件を作成(
        '正数',
        (値: unknown) => typeof 値 === 'number' && 値 > 0
      );

      const 結合 = 条件をAND結合(偶数, 正数);
      expect(結合.評価(-4).成功).toBe(false);
    });

    it('最初に失敗した条件の理由を返す', () => {
      const 条件1 = シンプルな条件を作成(
        '条件1',
        () => false,
        '条件1失敗'
      );
      const 条件2 = シンプルな条件を作成(
        '条件2',
        () => false,
        '条件2失敗'
      );

      const 結合 = 条件をAND結合(条件1, 条件2);
      const 結果 = 結合.評価(123);
      expect(結果.理由).toBe('条件1失敗');
    });
  });

  describe('OR結合', () => {
    it('いずれかの条件を満たしている場合成功', () => {
      const 偶数 = シンプルな条件を作成(
        '偶数',
        (値: unknown) => typeof 値 === 'number' && 値 % 2 === 0
      );
      const 負数 = シンプルな条件を作成(
        '負数',
        (値: unknown) => typeof 値 === 'number' && 値 < 0
      );

      const 結合 = 条件をOR結合(偶数, 負数);
      expect(結合.評価(4).成功).toBe(true);
      expect(結合.評価(-3).成功).toBe(true);
    });

    it('すべての条件を満たさない場合失敗', () => {
      const 偶数 = シンプルな条件を作成(
        '偶数',
        (値: unknown) => typeof 値 === 'number' && 値 % 2 === 0
      );
      const 負数 = シンプルな条件を作成(
        '負数',
        (値: unknown) => typeof 値 === 'number' && 値 < 0
      );

      const 結合 = 条件をOR結合(偶数, 負数);
      expect(結合.評価(3).成功).toBe(false);
    });

    it('失敗時に複数の失敗理由を結合', () => {
      const 条件1 = シンプルな条件を作成(
        '条件1',
        () => false,
        '失敗1'
      );
      const 条件2 = シンプルな条件を作成(
        '条件2',
        () => false,
        '失敗2'
      );

      const 結合 = 条件をOR結合(条件1, 条件2);
      const 結果 = 結合.評価(123);
      expect(結果.理由).toContain('失敗1');
      expect(結果.理由).toContain('失敗2');
    });
  });

  describe('条件を反転', () => {
    it('条件を反転できる', () => {
      const 偶数 = シンプルな条件を作成(
        '偶数',
        (値: unknown) => typeof 値 === 'number' && 値 % 2 === 0
      );
      const 反転 = 条件を反転(偶数);

      expect(反転.評価(4).成功).toBe(false);
      expect(反転.評価(3).成功).toBe(true);
    });

    it('反転した条件の名前に反転を含める', () => {
      const 条件 = シンプルな条件を作成(
        'テスト',
        () => true
      );
      const 反転 = 条件を反転(条件);

      expect(反転.名前).toContain('NOT');
      expect(反転.名前).toContain('テスト');
    });
  });
});

describe('条件管理 - ユーティリティ', () => {
  const 偶数 = シンプルな条件を作成(
    '偶数',
    (値: unknown) => typeof 値 === 'number' && 値 % 2 === 0
  );

  describe('複数を評価', () => {
    it('複数の対象に対して条件を評価できる', () => {
      const 結果 = 複数を評価(偶数, [2, 3, 4, 5]);
      expect(結果.length).toBe(4);
      expect(結果[0].成功).toBe(true);
      expect(結果[1].成功).toBe(false);
    });

    it('空の配列を評価できる', () => {
      const 結果 = 複数を評価(偶数, []);
      expect(結果).toEqual([]);
    });
  });

  describe('フィルタリング', () => {
    it('条件を満たす要素をフィルタリングできる', () => {
      const 結果 = フィルタリング(偶数, [1, 2, 3, 4, 5, 6]);
      expect(結果).toEqual([2, 4, 6]);
    });

    it('すべてが条件を満たさない場合空配列を返す', () => {
      const 結果 = フィルタリング(偶数, [1, 3, 5]);
      expect(結果).toEqual([]);
    });
  });

  describe('すべてが満たすか', () => {
    it('すべてが満たす場合true', () => {
      expect(すべてが満たすか(偶数, [2, 4, 6])).toBe(true);
    });

    it('いずれかが満たさない場合false', () => {
      expect(すべてが満たすか(偶数, [2, 3, 4])).toBe(false);
    });

    it('空配列の場合true', () => {
      expect(すべてが満たすか(偶数, [])).toBe(true);
    });
  });

  describe('いずれかが満たすか', () => {
    it('いずれかが満たす場合true', () => {
      expect(いずれかが満たすか(偶数, [1, 2, 3])).toBe(true);
    });

    it('いずれも満たさない場合false', () => {
      expect(いずれかが満たすか(偶数, [1, 3, 5])).toBe(false);
    });

    it('空配列の場合false', () => {
      expect(いずれかが満たすか(偶数, [])).toBe(false);
    });
  });
});

describe('条件管理 - 管理クラス', () => {
  let 管理: 条件管理;

  beforeEach(() => {
    管理 = new 条件管理();
  });

  describe('条件の登録・取得', () => {
    it('条件を登録できる', () => {
      const 条件 = シンプルな条件を作成(
        'テスト',
        () => true
      );

      管理.登録('テスト条件', 条件);

      expect(管理.が存在するか('テスト条件')).toBe(true);
    });

    it('登録された条件を取得できる', () => {
      const 条件 = シンプルな条件を作成(
        'テスト',
        () => true
      );

      管理.登録('テスト条件', 条件);
      const 取得 = 管理.取得('テスト条件');

      expect(取得).toBe(条件);
    });

    it('存在しない条件を取得するとundefinedを返す', () => {
      expect(管理.取得('存在しない')).toBeUndefined();
    });

    it('条件が登録されているか確認できる', () => {
      const 条件 = シンプルな条件を作成(
        'テスト',
        () => true
      );

      管理.登録('テスト条件', 条件);

      expect(管理.が存在するか('テスト条件')).toBe(true);
      expect(管理.が存在するか('存在しない')).toBe(false);
    });
  });

  describe('条件の評価', () => {
    it('登録された条件を名前で評価できる', () => {
      const 偶数 = シンプルな条件を作成(
        '偶数',
        (値: unknown) => typeof 値 === 'number' && 値 % 2 === 0
      );

      管理.登録('偶数判定', 偶数);
      const 結果 = 管理.評価('偶数判定', 4);

      expect(結果.成功).toBe(true);
    });

    it('存在しない条件を評価すると失敗を返す', () => {
      const 結果 = 管理.評価('存在しない', 123);

      expect(結果.成功).toBe(false);
      expect(結果.理由).toContain('存在しない');
    });
  });

  describe('複数条件の評価', () => {
    beforeEach(() => {
      const 偶数 = シンプルな条件を作成(
        '偶数',
        (値: unknown) => typeof 値 === 'number' && 値 % 2 === 0
      );
      const 正数 = シンプルな条件を作成(
        '正数',
        (値: unknown) => typeof 値 === 'number' && 値 > 0
      );

      管理.登録('偶数', 偶数);
      管理.登録('正数', 正数);
    });

    it('複数の条件を評価できる', () => {
      const 結果 = 管理.複数評価(['偶数', '正数'], 4);

      expect(結果).toHaveLength(2);
      expect(結果[0].成功).toBe(true);
      expect(結果[1].成功).toBe(true);
    });

    it('すべてが満たすか確認できる', () => {
      expect(管理.すべてが満たすか(['偶数', '正数'], 4)).toBe(true);
      expect(管理.すべてが満たすか(['偶数', '正数'], -4)).toBe(false);
    });

    it('いずれかが満たすか確認できる', () => {
      expect(管理.いずれかが満たすか(['偶数', '正数'], 3)).toBe(true);
      expect(管理.いずれかが満たすか(['偶数', '正数'], -2)).toBe(true);
      expect(管理.いずれかが満たすか(['偶数', '正数'], -3)).toBe(false);
    });
  });

  describe('条件の削除', () => {
    it('条件を削除できる', () => {
      const 条件 = シンプルな条件を作成(
        'テスト',
        () => true
      );

      管理.登録('テスト条件', 条件);
      expect(管理.が存在するか('テスト条件')).toBe(true);

      管理.削除('テスト条件');
      expect(管理.が存在するか('テスト条件')).toBe(false);
    });

    it('すべての条件をクリアできる', () => {
      管理.登録('条件1', シンプルな条件を作成('c1', () => true));
      管理.登録('条件2', シンプルな条件を作成('c2', () => true));

      管理.クリア();

      expect(管理.数を取得()).toBe(0);
    });
  });

  describe('情報取得', () => {
    beforeEach(() => {
      管理.登録('条件A', シンプルな条件を作成('A', () => true));
      管理.登録('条件B', シンプルな条件を作成('B', () => true));
    });

    it('条件の名前一覧を取得できる', () => {
      const 名前一覧 = 管理.名前一覧を取得();

      expect(名前一覧).toContain('条件A');
      expect(名前一覧).toContain('条件B');
      expect(名前一覧).toHaveLength(2);
    });

    it('登録されている条件の数を取得できる', () => {
      expect(管理.数を取得()).toBe(2);
    });

    it('デバッグ情報を取得できる', () => {
      const デバッグ = 管理.デバッグ情報();

      expect(デバッグ).toHaveLength(2);
      expect(デバッグ[0].名前).toBe('条件A');
      expect(デバッグ[0].条件名).toBe('A');
    });
  });
});

describe('条件管理 - 実践的なシナリオ', () => {
  it('ゲームカード選択条件をシミュレート', () => {
    const カード1 = { 名前: 'カードA', 対象: '敵', 属性: '火' };
    const カード2 = { 名前: 'カードB', 対象: '味方', 属性: '水' };
    const カード3 = { 名前: 'カードC', 対象: '敵', 属性: '水' };

    const 敵を対象とする = シンプルな条件を作成(
      '敵対象',
      (カード: unknown) =>
        typeof カード === 'object' &&
        カード !== null &&
        (カード as any).対象 === '敵'
    );

    const 水属性 = シンプルな条件を作成(
      '水属性',
      (カード: unknown) =>
        typeof カード === 'object' &&
        カード !== null &&
        (カード as any).属性 === '水'
    );

    const 敵かつ水 = 条件をAND結合(敵を対象とする, 水属性);

    const カード群 = [カード1, カード2, カード3];
    const 絞り込み = フィルタリング(敵かつ水, カード群);

    expect(絞り込み).toEqual([カード3]);
  });

  it('複数の条件管理システムを独立して運用', () => {
    const プレイヤー条件管理 = new 条件管理();
    const ユニット条件管理 = new 条件管理();

    プレイヤー条件管理.登録(
      'レベル10以上',
      シンプルな条件を作成(
        'lv10',
        (プレイヤー: unknown) =>
          typeof プレイヤー === 'object' &&
          プレイヤー !== null &&
          (プレイヤー as any).レベル >= 10
      )
    );

    ユニット条件管理.登録(
      'HP50以上',
      シンプルな条件を作成(
        'hp50',
        (ユニット: unknown) =>
          typeof ユニット === 'object' &&
          ユニット !== null &&
          (ユニット as any).HP >= 50
      )
    );

    const プレイヤー = { 名前: 'Hero', レベル: 15 };
    const ユニット = { 名前: 'Knight', HP: 60 };

    expect(プレイヤー条件管理.評価('レベル10以上', プレイヤー).成功).toBe(
      true
    );
    expect(ユニット条件管理.評価('HP50以上', ユニット).成功).toBe(true);
  });
});
