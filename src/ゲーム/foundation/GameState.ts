/**
 * ゲーム基盤層：GameState
 *
 * ゲーム中の現在状態を一元管理する
 * 責務：状態保持・参照のみ
 *
 * 責務分離：
 * - 状態を保持する（GameState）
 * - 状態を変更する（ゲーム状態管理など）
 * - 状態変更時の処理（層2エンジンなど）
 */

/**
 * ゲーム進行状態
 */
export type ゲーム進行状態 = '開始前' | '進行中' | '終了';

/**
 * ゲーム終了情報
 */
export interface ゲーム終了情報 {
  readonly 終了理由: string;
  readonly 勝敗結果: {
    readonly 勝者ID: string | null;
    readonly 敗者ID一覧: readonly string[];
  };
  readonly 終了日時: number;
}

/**
 * ターン情報
 */
export interface ターン情報 {
  readonly ターン番号: number;
  readonly 現在プレイヤーID: string;
  readonly 開始日時: number;
}

/**
 * プレイヤー情報（参照用）
 */
export interface プレイヤー情報 {
  readonly ID: string;
  readonly 名前: string;
}

/**
 * ゾーン情報（参照用）
 */
export interface ゾーン情報 {
  readonly ID: string;
  readonly 所有者ID: string;
  readonly 名前: string;
}

/**
 * GameState
 *
 * ゲーム中の現在状態を保持
 * イミュータブル設計で状態の追跡性を確保
 */
export class GameState {
  /**
   * ゲームID
   */
  readonly ゲームID: string;

  /**
   * ゲーム進行状態
   */
  private readonly 進行状態内部: ゲーム進行状態;

  /**
   * ターン情報
   */
  private readonly ターン情報内部: ターン情報 | null;

  /**
   * 現在フェイズ
   */
  private readonly 現在フェイズ内部: string | null;

  /**
   * プレイヤー一覧（参照）
   */
  private readonly プレイヤー一覧内部: readonly プレイヤー情報[];

  /**
   * ゾーン一覧（参照）
   */
  private readonly ゾーン一覧内部: readonly ゾーン情報[];

  /**
   * ゲーム終了情報
   */
  private readonly 終了情報内部: ゲーム終了情報 | null;

  /**
   * コンストラクタ
   */
  constructor(ゲームID: string) {
    this.ゲームID = ゲームID;
    this.進行状態内部 = '開始前';
    this.ターン情報内部 = null;
    this.現在フェイズ内部 = null;
    this.プレイヤー一覧内部 = [];
    this.ゾーン一覧内部 = [];
    this.終了情報内部 = null;
  }

  /**
   * プライベートコンストラクタ用ヘルパー
   */
  private static 複製作成(
    ゲームID: string,
    進行状態: ゲーム進行状態,
    ターン情報: ターン情報 | null,
    フェイズ: string | null,
    プレイヤー一覧: readonly プレイヤー情報[],
    ゾーン一覧: readonly ゾーン情報[],
    終了情報: ゲーム終了情報 | null
  ): GameState {
    const インスタンス = new GameState(ゲームID);
    (インスタンス as any).進行状態内部 = 進行状態;
    (インスタンス as any).ターン情報内部 = ターン情報;
    (インスタンス as any).現在フェイズ内部 = フェイズ;
    (インスタンス as any).プレイヤー一覧内部 = プレイヤー一覧;
    (インスタンス as any).ゾーン一覧内部 = ゾーン一覧;
    (インスタンス as any).終了情報内部 = 終了情報;
    return インスタンス;
  }

  /**
   * ゲーム進行状態を取得
   */
  get 進行状態(): ゲーム進行状態 {
    return this.進行状態内部;
  }

  /**
   * ターン情報を取得
   */
  get ターン情報(): ターン情報 | null {
    return this.ターン情報内部;
  }

  /**
   * 現在フェイズを取得
   */
  get 現在フェイズ(): string | null {
    return this.現在フェイズ内部;
  }

  /**
   * プレイヤー一覧を取得
   */
  get プレイヤー一覧(): readonly プレイヤー情報[] {
    return [...this.プレイヤー一覧内部];
  }

  /**
   * ゾーン一覧を取得
   */
  get ゾーン一覧(): readonly ゾーン情報[] {
    return [...this.ゾーン一覧内部];
  }

  /**
   * ゲーム終了情報を取得
   */
  get 終了情報(): ゲーム終了情報 | null {
    return this.終了情報内部;
  }

  /**
   * 状態が開始前か確認
   */
  は開始前か(): boolean {
    return this.進行状態内部 === '開始前';
  }

  /**
   * 状態が進行中か確認
   */
  は進行中か(): boolean {
    return this.進行状態内部 === '進行中';
  }

  /**
   * 状態が終了か確認
   */
  は終了か(): boolean {
    return this.進行状態内部 === '終了';
  }

  /**
   * 進行状態を変更
   */
  進行状態を変更(新しい状態: ゲーム進行状態): GameState {
    if (this.進行状態内部 === 新しい状態) {
      return this;
    }

    return GameState.複製作成(
      this.ゲームID,
      新しい状態,
      this.ターン情報内部,
      this.現在フェイズ内部,
      this.プレイヤー一覧内部,
      this.ゾーン一覧内部,
      this.終了情報内部
    );
  }

  /**
   * ターン情報を設定
   */
  ターン情報を設定(
    ターン番号: number,
    プレイヤーID: string,
    開始日時: number = Date.now()
  ): GameState {
    const 新しいターン情報: ターン情報 = {
      ターン番号,
      現在プレイヤーID: プレイヤーID,
      開始日時
    };

    if (
      this.ターン情報内部 &&
      this.ターン情報内部.ターン番号 === ターン番号 &&
      this.ターン情報内部.現在プレイヤーID === プレイヤーID
    ) {
      return this;
    }

    return GameState.複製作成(
      this.ゲームID,
      this.進行状態内部,
      新しいターン情報,
      this.現在フェイズ内部,
      this.プレイヤー一覧内部,
      this.ゾーン一覧内部,
      this.終了情報内部
    );
  }

  /**
   * フェイズを設定
   */
  フェイズを設定(フェイズ: string | null): GameState {
    if (this.現在フェイズ内部 === フェイズ) {
      return this;
    }

    return GameState.複製作成(
      this.ゲームID,
      this.進行状態内部,
      this.ターン情報内部,
      フェイズ,
      this.プレイヤー一覧内部,
      this.ゾーン一覧内部,
      this.終了情報内部
    );
  }

  /**
   * プレイヤー一覧を設定
   */
  プレイヤー一覧を設定(プレイヤー一覧: readonly プレイヤー情報[]): GameState {
    if (
      this.プレイヤー一覧内部.length === プレイヤー一覧.length &&
      this.プレイヤー一覧内部.every((p, i) => p.ID === プレイヤー一覧[i].ID)
    ) {
      return this;
    }

    return GameState.複製作成(
      this.ゲームID,
      this.進行状態内部,
      this.ターン情報内部,
      this.現在フェイズ内部,
      プレイヤー一覧,
      this.ゾーン一覧内部,
      this.終了情報内部
    );
  }

  /**
   * ゾーン一覧を設定
   */
  ゾーン一覧を設定(ゾーン一覧: readonly ゾーン情報[]): GameState {
    if (
      this.ゾーン一覧内部.length === ゾーン一覧.length &&
      this.ゾーン一覧内部.every((z, i) => z.ID === ゾーン一覧[i].ID)
    ) {
      return this;
    }

    return GameState.複製作成(
      this.ゲームID,
      this.進行状態内部,
      this.ターン情報内部,
      this.現在フェイズ内部,
      this.プレイヤー一覧内部,
      ゾーン一覧,
      this.終了情報内部
    );
  }

  /**
   * ゲーム終了情報を設定
   */
  ゲーム終了情報を設定(終了情報: ゲーム終了情報): GameState {
    if (this.終了情報内部) {
      // 既に終了している場合は変更しない
      return this;
    }

    return GameState.複製作成(
      this.ゲームID,
      '終了',
      this.ターン情報内部,
      this.現在フェイズ内部,
      this.プレイヤー一覧内部,
      this.ゾーン一覧内部,
      終了情報
    );
  }

  /**
   * 現在プレイヤーIDを取得
   */
  get 現在プレイヤーID(): string | null {
    return this.ターン情報内部?.現在プレイヤーID || null;
  }

  /**
   * 現在ターン番号を取得
   */
  get 現在ターン番号(): number | null {
    return this.ターン情報内部?.ターン番号 || null;
  }
}
