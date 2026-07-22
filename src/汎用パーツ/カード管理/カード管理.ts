/**
 * 汎用パーツ：カード管理
 *
 * ゲーム固有のカード概念を持たないオブジェクト管理システム
 * イミュータブル：すべての操作が新しいインスタンスを返す
 *
 * 責務：カード状態・属性・履歴管理のみ
 * ゲームルール判定は層2以上で実装
 */

import type { カード, カード変更履歴 } from './カード';

/**
 * カードを管理する
 * イミュータブル：すべての操作が新しいインスタンスを返す
 *
 * 層外共有資産として、純粋にカード状態を管理する
 */
export class カード管理 implements カード {
  readonly ID: string;
  private 名前内部: string;
  private 種類一覧内部: string[] = [];
  private データ内部: Record<string, unknown> = {};
  private 状態内部: Record<string, unknown> = {};
  private 変更履歴: カード変更履歴[] = [];

  constructor(
    ID: string,
    名前: string,
    種類一覧?: string[],
    データ?: Record<string, unknown>,
    状態?: Record<string, unknown>
  ) {
    this.ID = ID;
    this.名前内部 = 名前;
    if (種類一覧) {
      this.種類一覧内部 = [...種類一覧];
    }
    if (データ) {
      this.データ内部 = { ...データ };
    }
    if (状態) {
      this.状態内部 = { ...状態 };
    }
  }

  /**
   * 名前を取得
   */
  get 名前(): string {
    return this.名前内部;
  }

  /**
   * 種類一覧を取得
   */
  get 種類一覧(): readonly string[] {
    return [...this.種類一覧内部];
  }

  /**
   * データを取得
   */
  get データ(): Readonly<Record<string, unknown>> {
    return Object.freeze({ ...this.データ内部 });
  }

  /**
   * 状態を取得
   */
  get 状態(): Readonly<Record<string, unknown>> {
    return Object.freeze({ ...this.状態内部 });
  }

  /**
   * 名前を変更（イミュータブル）
   */
  名前を変更(新しい名前: string): カード管理 {
    if (新しい名前 === this.名前内部) {
      return this;
    }

    const 新しいカード = new カード管理(
      this.ID,
      新しい名前,
      this.種類一覧内部,
      this.データ内部,
      this.状態内部
    );
    新しいカード.変更履歴 = [...this.変更履歴];

    新しいカード.変更履歴.push({
      種類: '名前変更',
      対象: '名前',
      変更前: this.名前内部,
      変更後: 新しい名前,
      時刻: Date.now()
    });

    return 新しいカード;
  }

  /**
   * 種類を追加（イミュータブル）
   */
  種類を追加(種類: string): カード管理 {
    if (this.種類一覧内部.includes(種類)) {
      return this;
    }

    const 新しいカード = new カード管理(
      this.ID,
      this.名前内部,
      [...this.種類一覧内部, 種類],
      this.データ内部,
      this.状態内部
    );
    新しいカード.変更履歴 = [...this.変更履歴];

    新しいカード.変更履歴.push({
      種類: '種類追加',
      対象: 種類,
      変更前: [...this.種類一覧内部],
      変更後: [...新しいカード.種類一覧内部],
      時刻: Date.now()
    });

    return 新しいカード;
  }

  /**
   * 複数の種類を追加（イミュータブル）
   */
  複数種類を追加(種類一覧: string[]): カード管理 {
    const 追加する種類 = 種類一覧.filter(t => !this.種類一覧内部.includes(t));

    if (追加する種類.length === 0) {
      return this;
    }

    const 新しい種類一覧 = [...this.種類一覧内部, ...追加する種類];

    const 新しいカード = new カード管理(
      this.ID,
      this.名前内部,
      新しい種類一覧,
      this.データ内部,
      this.状態内部
    );
    新しいカード.変更履歴 = [...this.変更履歴];

    新しいカード.変更履歴.push({
      種類: '種類追加',
      対象: 追加する種類.join(','),
      変更前: [...this.種類一覧内部],
      変更後: [...新しい種類一覧],
      時刻: Date.now()
    });

    return 新しいカード;
  }

  /**
   * 種類を削除（イミュータブル）
   */
  種類を削除(種類: string): カード管理 {
    const インデックス = this.種類一覧内部.indexOf(種類);
    if (インデックス === -1) {
      return this;
    }

    const 新しい種類一覧 = this.種類一覧内部.filter((_, idx) => idx !== インデックス);

    const 新しいカード = new カード管理(
      this.ID,
      this.名前内部,
      新しい種類一覧,
      this.データ内部,
      this.状態内部
    );
    新しいカード.変更履歴 = [...this.変更履歴];

    新しいカード.変更履歴.push({
      種類: '種類削除',
      対象: 種類,
      変更前: [...this.種類一覧内部],
      変更後: [...新しい種類一覧],
      時刻: Date.now()
    });

    return 新しいカード;
  }

  /**
   * 複数の種類を削除（イミュータブル）
   */
  複数種類を削除(種類一覧: string[]): カード管理 {
    const 削除する種類セット = new Set(種類一覧);
    const 新しい種類一覧 = this.種類一覧内部.filter(t => !削除する種類セット.has(t));

    if (新しい種類一覧.length === this.種類一覧内部.length) {
      return this;
    }

    const 削除された種類 = this.種類一覧内部.filter(t => 削除する種類セット.has(t));

    const 新しいカード = new カード管理(
      this.ID,
      this.名前内部,
      新しい種類一覧,
      this.データ内部,
      this.状態内部
    );
    新しいカード.変更履歴 = [...this.変更履歴];

    新しいカード.変更履歴.push({
      種類: '種類削除',
      対象: 削除された種類.join(','),
      変更前: [...this.種類一覧内部],
      変更後: [...新しい種類一覧],
      時刻: Date.now()
    });

    return 新しいカード;
  }

  /**
   * すべての種類を削除（イミュータブル）
   */
  すべての種類を削除(): カード管理 {
    if (this.種類一覧内部.length === 0) {
      return this;
    }

    const 新しいカード = new カード管理(
      this.ID,
      this.名前内部,
      [],
      this.データ内部,
      this.状態内部
    );
    新しいカード.変更履歴 = [...this.変更履歴];

    新しいカード.変更履歴.push({
      種類: '種類削除',
      対象: 'すべて',
      変更前: [...this.種類一覧内部],
      変更後: [],
      時刻: Date.now()
    });

    return 新しいカード;
  }

  /**
   * データを設定（イミュータブル）
   * 既存データはマージされる
   */
  データを設定(キー: string, 値: unknown): カード管理 {
    if (キー in this.データ内部 && this.データ内部[キー] === 値) {
      return this;
    }

    const 新しいデータ = { ...this.データ内部, [キー]: 値 };

    const 新しいカード = new カード管理(
      this.ID,
      this.名前内部,
      this.種類一覧内部,
      新しいデータ,
      this.状態内部
    );
    新しいカード.変更履歴 = [...this.変更履歴];

    新しいカード.変更履歴.push({
      種類: 'データ変更',
      対象: キー,
      変更前: this.データ内部[キー],
      変更後: 値,
      時刻: Date.now()
    });

    return 新しいカード;
  }

  /**
   * 複数のデータを設定（イミュータブル）
   */
  複数データを設定(データ: Record<string, unknown>): カード管理 {
    const 変更があるか = Object.entries(データ).some(
      ([キー, 値]) => !(キー in this.データ内部) || this.データ内部[キー] !== 値
    );

    if (!変更があるか) {
      return this;
    }

    const 新しいデータ = { ...this.データ内部, ...データ };

    const 新しいカード = new カード管理(
      this.ID,
      this.名前内部,
      this.種類一覧内部,
      新しいデータ,
      this.状態内部
    );
    新しいカード.変更履歴 = [...this.変更履歴];

    Object.entries(データ).forEach(([キー, 値]) => {
      新しいカード.変更履歴.push({
        種類: 'データ変更',
        対象: キー,
        変更前: this.データ内部[キー],
        変更後: 値,
        時刻: Date.now()
      });
    });

    return 新しいカード;
  }

  /**
   * データを削除（イミュータブル）
   */
  データを削除(キー: string): カード管理 {
    if (!(キー in this.データ内部)) {
      return this;
    }

    const 新しいデータ = { ...this.データ内部 };
    const 削除前の値 = 新しいデータ[キー];
    delete 新しいデータ[キー];

    const 新しいカード = new カード管理(
      this.ID,
      this.名前内部,
      this.種類一覧内部,
      新しいデータ,
      this.状態内部
    );
    新しいカード.変更履歴 = [...this.変更履歴];

    新しいカード.変更履歴.push({
      種類: 'データ変更',
      対象: キー,
      変更前: 削除前の値,
      変更後: undefined,
      時刻: Date.now()
    });

    return 新しいカード;
  }

  /**
   * すべてのデータを削除（イミュータブル）
   */
  すべてのデータを削除(): カード管理 {
    if (Object.keys(this.データ内部).length === 0) {
      return this;
    }

    const 新しいカード = new カード管理(
      this.ID,
      this.名前内部,
      this.種類一覧内部,
      {},
      this.状態内部
    );
    新しいカード.変更履歴 = [...this.変更履歴];

    新しいカード.変更履歴.push({
      種類: 'データ変更',
      対象: 'すべて',
      変更前: { ...this.データ内部 },
      変更後: {},
      時刻: Date.now()
    });

    return 新しいカード;
  }

  /**
   * 状態を設定（イミュータブル）
   */
  状態を設定(キー: string, 値: unknown): カード管理 {
    if (キー in this.状態内部 && this.状態内部[キー] === 値) {
      return this;
    }

    const 新しい状態 = { ...this.状態内部, [キー]: 値 };

    const 新しいカード = new カード管理(
      this.ID,
      this.名前内部,
      this.種類一覧内部,
      this.データ内部,
      新しい状態
    );
    新しいカード.変更履歴 = [...this.変更履歴];

    新しいカード.変更履歴.push({
      種類: '状態変更',
      対象: キー,
      変更前: this.状態内部[キー],
      変更後: 値,
      時刻: Date.now()
    });

    return 新しいカード;
  }

  /**
   * 複数の状態を設定（イミュータブル）
   */
  複数状態を設定(状態: Record<string, unknown>): カード管理 {
    const 変更があるか = Object.entries(状態).some(
      ([キー, 値]) => !(キー in this.状態内部) || this.状態内部[キー] !== 値
    );

    if (!変更があるか) {
      return this;
    }

    const 新しい状態 = { ...this.状態内部, ...状態 };

    const 新しいカード = new カード管理(
      this.ID,
      this.名前内部,
      this.種類一覧内部,
      this.データ内部,
      新しい状態
    );
    新しいカード.変更履歴 = [...this.変更履歴];

    Object.entries(状態).forEach(([キー, 値]) => {
      新しいカード.変更履歴.push({
        種類: '状態変更',
        対象: キー,
        変更前: this.状態内部[キー],
        変更後: 値,
        時刻: Date.now()
      });
    });

    return 新しいカード;
  }

  /**
   * 状態を削除（イミュータブル）
   */
  状態を削除(キー: string): カード管理 {
    if (!(キー in this.状態内部)) {
      return this;
    }

    const 新しい状態 = { ...this.状態内部 };
    const 削除前の値 = 新しい状態[キー];
    delete 新しい状態[キー];

    const 新しいカード = new カード管理(
      this.ID,
      this.名前内部,
      this.種類一覧内部,
      this.データ内部,
      新しい状態
    );
    新しいカード.変更履歴 = [...this.変更履歴];

    新しいカード.変更履歴.push({
      種類: '状態変更',
      対象: キー,
      変更前: 削除前の値,
      変更後: undefined,
      時刻: Date.now()
    });

    return 新しいカード;
  }

  /**
   * すべての状態を削除（イミュータブル）
   */
  すべての状態を削除(): カード管理 {
    if (Object.keys(this.状態内部).length === 0) {
      return this;
    }

    const 新しいカード = new カード管理(
      this.ID,
      this.名前内部,
      this.種類一覧内部,
      this.データ内部,
      {}
    );
    新しいカード.変更履歴 = [...this.変更履歴];

    新しいカード.変更履歴.push({
      種類: '状態変更',
      対象: 'すべて',
      変更前: { ...this.状態内部 },
      変更後: {},
      時刻: Date.now()
    });

    return 新しいカード;
  }

  /**
   * 履歴を取得
   */
  履歴を取得(): カード変更履歴[] {
    return [...this.変更履歴];
  }

  /**
   * 最新の履歴を取得
   */
  最新履歴を取得(): カード変更履歴 | undefined {
    if (this.変更履歴.length === 0) {
      return undefined;
    }
    return { ...this.変更履歴[this.変更履歴.length - 1] };
  }

  /**
   * 履歴のサイズを取得
   */
  履歴のサイズ(): number {
    return this.変更履歴.length;
  }

  /**
   * 履歴が空かを確認
   */
  履歴が空か(): boolean {
    return this.変更履歴.length === 0;
  }

  /**
   * 履歴をクリア（イミュータブル）
   */
  履歴をクリア(): カード管理 {
    if (this.変更履歴.length === 0) {
      return this;
    }

    const 新しいカード = new カード管理(
      this.ID,
      this.名前内部,
      this.種類一覧内部,
      this.データ内部,
      this.状態内部
    );

    return 新しいカード;
  }

  /**
   * リセット（イミュータブル）
   * 名前以外をリセット、履歴は保持
   */
  リセット(): カード管理 {
    const 新しいカード = new カード管理(this.ID, this.名前内部);
    新しいカード.変更履歴 = [...this.変更履歴];

    return 新しいカード;
  }

  /**
   * 完全リセット（イミュータブル）
   * すべてをリセット
   */
  完全リセット(): カード管理 {
    return new カード管理(this.ID, this.名前内部);
  }
}
