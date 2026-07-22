/**
 * 汎用パーツ：ランダム管理
 *
 * ゲーム非依存のランダム生成・管理機能
 * 責務：ランダム結果生成・再現性確保・履歴管理のみ
 */

import type {
  ランダム,
  ランダム変更履歴,
  ランダム方式,
  ランダム結果
} from './ランダム';

/**
 * シード付き疑似乱数生成器
 * 同じシードで同じ値を生成可能にする
 */
class 疑似乱数生成器 {
  private シード: number;

  constructor(シード: number) {
    this.シード = Math.abs(シード) % 2147483647 || 1;
  }

  /**
   * 次の乱数を生成（0以上1未満）
   */
  次(): number {
    this.シード = (this.シード * 16807) % 2147483647;
    return this.シード / 2147483647;
  }

  /**
   * 最小値以上最大値以下の整数を生成
   */
  整数(最小値: number, 最大値: number): number {
    const min = Math.ceil(最小値);
    const max = Math.floor(最大値);
    return min + Math.floor(this.次() * (max - min + 1));
  }
}

/**
 * ランダム管理クラス
 *
 * イミュータブル設計：すべての操作が新規インスタンスを返却
 */
export class ランダム管理 implements ランダム {
  readonly ID: string;
  private readonly 現在の方式内部: ランダム方式 | null;
  private readonly 最新結果内部: ランダム結果 | null;
  private readonly シード内部: number | null;
  private readonly 履歴内部: ランダム変更履歴[];

  /**
   * コンストラクタ
   * @param ID ランダム管理の識別子
   */
  constructor(ID: string) {
    this.ID = ID;
    this.現在の方式内部 = null;
    this.最新結果内部 = null;
    this.シード内部 = null;
    this.履歴内部 = [];
  }

  /**
   * プライベートコンストラクタ用ヘルパー
   */
  private static 複製作成(
    ID: string,
     方式: ランダム方式 | null,
    結果: ランダム結果 | null,
    シード: number | null,
    履歴: ランダム変更履歴[]
  ): ランダム管理 {
    const インスタンス = new ランダム管理(ID);
    (インスタンス as any).現在の方式内部 = 方式;
    (インスタンス as any).最新結果内部 = 結果;
    (インスタンス as any).シード内部 = シード;
    (インスタンス as any).履歴内部 = 履歴;
    return インスタンス;
  }

  /**
   * 現在の方式を取得
   */
  get 現在の方式(): ランダム方式 | null {
    return this.現在の方式内部;
  }

  /**
   * 最新結果を取得
   */
  get 最新結果(): ランダム結果 | null {
    return this.最新結果内部;
  }

  /**
   * シードを取得
   */
  get シード(): number | null {
    return this.シード内部;
  }

  /**
   * 履歴一覧を取得
   */
  get 履歴一覧(): readonly ランダム変更履歴[] {
    return [...this.履歴内部];
  }

  /**
   * シードを設定
   */
  シードを設定(シード: number): ランダム管理 {
    if (this.シード内部 === シード) {
      return this;
    }

    const 新しい管理 = ランダム管理.複製作成(
      this.ID,
      this.現在の方式内部,
      this.最新結果内部,
      シード,
      [...this.履歴内部]
    );

    新しい管理.履歴内部.push({
      種類: 'シード設定',
      方式: this.現在の方式内部 || '整数生成',
      入力: シード,
      結果: シード,
      時刻: Date.now(),
      詳細: { シード }
    });

    return 新しい管理;
  }

  /**
   * 範囲内の整数をランダム生成
   * @param 最小値 範囲の最小値（含む）
   * @param 最大値 範囲の最大値（含む）
   */
  整数を生成(最小値: number, 最大値: number): ランダム管理 {
    const 入力 = { 最小値, 最大値 };
    const 生成器 = this.シード内部 !== null
      ? new 疑似乱数生成器(this.シード内部)
      : new 疑似乱数生成器(Date.now());

    const 結果値 = 生成器.整数(最小値, 最大値);
    const 結果オブジェクト: ランダム結果 = {
      値: 結果値,
      方式: '整数生成',
      入力,
      時刻: Date.now()
    };

    const 新しい管理 = ランダム管理.複製作成(
      this.ID,
      '整数生成',
      結果オブジェクト,
      this.シード内部,
      [...this.履歴内部]
    );

    新しい管理.履歴内部.push({
      種類: '方式実行',
      方式: '整数生成',
      入力,
      結果: 結果値,
      時刻: Date.now()
    });

    return 新しい管理;
  }

  /**
   * 配列から1つの要素をランダム選択
   * @param 候補一覧 選択対象の配列
   */
  要素を選択<T>(候補一覧: readonly T[]): ランダム管理 {
    if (候補一覧.length === 0) {
      throw new Error('候補一覧が空です');
    }

    const 生成器 = this.シード内部 !== null
      ? new 疑似乱数生成器(this.シード内部)
      : new 疑似乱数生成器(Date.now());

    const インデックス = 生成器.整数(0, 候補一覧.length - 1);
    const 結果値 = 候補一覧[インデックス];
    const 入力 = {
      候補数: 候補一覧.length,
      選択インデックス: インデックス
    };

    const 結果オブジェクト: ランダム結果 = {
      値: 結果値,
      方式: '要素選択',
      入力,
      時刻: Date.now()
    };

    const 新しい管理 = ランダム管理.複製作成(
      this.ID,
      '要素選択',
      結果オブジェクト,
      this.シード内部,
      [...this.履歴内部]
    );

    新しい管理.履歴内部.push({
      種類: '方式実行',
      方式: '要素選択',
      入力,
      結果: 結果値,
      時刻: Date.now()
    });

    return 新しい管理;
  }

  /**
   * 配列から複数の要素をランダム選択
   * @param 候補一覧 選択対象の配列
   * @param 選択数 選択する要素数
   * @param 重複許可 重複を許可するか（デフォルト: false）
   */
  複数要素を選択<T>(
    候補一覧: readonly T[],
    選択数: number,
    重複許可: boolean = false
  ): ランダム管理 {
    if (候補一覧.length === 0) {
      throw new Error('候補一覧が空です');
    }

    if (選択数 < 1) {
      throw new Error('選択数は1以上である必要があります');
    }

    if (!重複許可 && 選択数 > 候補一覧.length) {
      throw new Error(`選択数が候補数を超えています（候補数: ${候補一覧.length}, 選択数: ${選択数}）`);
    }

    const 生成器 = this.シード内部 !== null
      ? new 疑似乱数生成器(this.シード内部)
      : new 疑似乱数生成器(Date.now());

    const 結果値: T[] = [];
    if (重複許可) {
      for (let i = 0; i < 選択数; i++) {
        const インデックス = 生成器.整数(0, 候補一覧.length - 1);
        結果値.push(候補一覧[インデックス]);
      }
    } else {
      const インデックス一覧 = Array.from({ length: 候補一覧.length }, (_, i) => i);
      for (let i = 0; i < 選択数; i++) {
        const 残り数 = インデックス一覧.length;
        const 選択インデックス = 生成器.整数(0, 残り数 - 1);
        const 元のインデックス = インデックス一覧[選択インデックス];
        結果値.push(候補一覧[元のインデックス]);
        インデックス一覧.splice(選択インデックス, 1);
      }
    }

    const 入力 = {
      候補数: 候補一覧.length,
      選択数,
      重複許可
    };

    const 結果オブジェクト: ランダム結果 = {
      値: 結果値,
      方式: '複数要素選択',
      入力,
      時刻: Date.now()
    };

    const 新しい管理 = ランダム管理.複製作成(
      this.ID,
      '複数要素選択',
      結果オブジェクト,
      this.シード内部,
      [...this.履歴内部]
    );

    新しい管理.履歴内部.push({
      種類: '方式実行',
      方式: '複数要素選択',
      入力,
      結果: 結果値,
      時刻: Date.now()
    });

    return 新しい管理;
  }

  /**
   * 配列をシャッフル
   * フィッシャー・イェーツ法を使用
   * @param 対象一覧 シャッフル対象の配列
   */
  シャッフル<T>(対象一覧: readonly T[]): ランダム管理 {
    const シャッフル済み = [...対象一覧];
    const 生成器 = this.シード内部 !== null
      ? new 疑似乱数生成器(this.シード内部)
      : new 疑似乱数生成器(Date.now());

    for (let i = シャッフル済み.length - 1; i > 0; i--) {
      const j = 生成器.整数(0, i);
      [シャッフル済み[i], シャッフル済み[j]] = [シャッフル済み[j], シャッフル済み[i]];
    }

    const 入力 = { 元の要素数: 対象一覧.length };
    const 結果オブジェクト: ランダム結果 = {
      値: シャッフル済み,
      方式: 'シャッフル',
      入力,
      時刻: Date.now()
    };

    const 新しい管理 = ランダム管理.複製作成(
      this.ID,
      'シャッフル',
      結果オブジェクト,
      this.シード内部,
      [...this.履歴内部]
    );

    新しい管理.履歴内部.push({
      種類: '方式実行',
      方式: 'シャッフル',
      入力,
      結果: シャッフル済み,
      時刻: Date.now()
    });

    return 新しい管理;
  }

  /**
   * 履歴を取得
   */
  履歴を取得(): readonly ランダム変更履歴[] {
    return [...this.履歴内部];
  }

  /**
   * 最新履歴を取得
   */
  最新履歴を取得(): ランダム変更履歴 | null {
    return this.履歴内部.length > 0
      ? this.履歴内部[this.履歴内部.length - 1]
      : null;
  }

  /**
   * 履歴のサイズを取得
   */
  履歴のサイズ(): number {
    return this.履歴内部.length;
  }

  /**
   * 履歴が空か確認
   */
  履歴が空か(): boolean {
    return this.履歴内部.length === 0;
  }

  /**
   * 履歴をクリア
   */
  履歴をクリア(): ランダム管理 {
    if (this.履歴が空か()) {
      return this;
    }

    const 新しい管理 = ランダム管理.複製作成(
      this.ID,
      this.現在の方式内部,
      this.最新結果内部,
      this.シード内部,
      []
    );

    return 新しい管理;
  }

  /**
   * リセット（結果・方式をクリア、シード・履歴は保持）
   */
  リセット(): ランダム管理 {
    if (this.現在の方式内部 === null && this.最新結果内部 === null) {
      return this;
    }

    const 新しい管理 = ランダム管理.複製作成(
      this.ID,
      null,
      null,
      this.シード内部,
      [...this.履歴内部]
    );

    新しい管理.履歴内部.push({
      種類: 'リセット',
      方式: this.現在の方式内部 || '整数生成',
      入力: null,
      結果: null,
      時刻: Date.now()
    });

    return 新しい管理;
  }

  /**
   * 完全リセット（すべてをリセット）
   */
  完全リセット(): ランダム管理 {
    if (this.履歴が空か() && this.現在の方式内部 === null && this.シード内部 === null) {
      return this;
    }

    return new ランダム管理(this.ID);
  }
}
