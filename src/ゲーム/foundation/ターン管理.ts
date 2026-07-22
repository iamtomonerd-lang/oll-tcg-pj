/**
 * ゲーム基盤層：ターン管理
 *
 * ゲーム進行の時間管理を担当
 * 役割：「ターン番号・プレイヤー・フェイズの進行を管理する」
 *
 * 担当する責務：
 * - ターン番号管理
 * - 現在プレイヤー管理
 * - フェイズ管理
 * - ターン開始
 * - フェイズ変更
 * - ターン終了
 * - プレイヤー交代
 *
 * 担当しない責務：
 * - カード処理（カード管理パーツ）
 * - コスト回復（ゲームエンジン）
 * - リソース増加（ゲームエンジン）
 * - 攻撃処理（攻撃エンジン）
 * - 効果解決（層2エンジン）
 * - 勝利判定（勝利判定パーツ）
 * - イベント通知（イベント管理）
 */

import { GameState } from './GameState';

/**
 * ターン情報
 */
export interface ターン情報 {
  readonly ターン番号: number;
  readonly プレイヤーID: string;
  readonly フェイズ: string;
  readonly 開始日時: number;
}

/**
 * ターン管理
 *
 * ゲーム進行の時間軸を管理
 * イミュータブル設計：すべての操作が新規インスタンスを返す
 */
export class ターン管理 {
  readonly ゲームID: string;
  private readonly 現在のターン情報内部: ターン情報 | null;
  private readonly プレイヤーID一覧内部: readonly string[];

  /**
   * コンストラクタ
   * @param ゲームID ゲーム識別子
   * @param プレイヤーID一覧 プレイヤーID一覧（順序固定）
   */
  constructor(ゲームID: string, プレイヤーID一覧: readonly string[]) {
    this.ゲームID = ゲームID;
    this.現在のターン情報内部 = null;
    this.プレイヤーID一覧内部 = [...プレイヤーID一覧];
  }

  /**
   * プライベートコンストラクタ用ヘルパー
   */
  private static 複製作成(
    ゲームID: string,
    ターン情報: ターン情報 | null,
    プレイヤーID一覧: readonly string[]
  ): ターン管理 {
    const インスタンス = new ターン管理(ゲームID, プレイヤーID一覧);
    (インスタンス as any).現在のターン情報内部 = ターン情報;
    return インスタンス;
  }

  /**
   * 現在のターン情報を取得
   */
  get 現在のターン情報(): ターン情報 | null {
    return this.現在のターン情報内部;
  }

  /**
   * 現在ターン番号を取得
   */
  get 現在ターン番号(): number | null {
    return this.現在のターン情報内部?.ターン番号 || null;
  }

  /**
   * 現在プレイヤーを取得
   */
  get 現在プレイヤーID(): string | null {
    return this.現在のターン情報内部?.プレイヤーID || null;
  }

  /**
   * 現在フェイズを取得
   */
  get 現在フェイズ(): string | null {
    return this.現在のターン情報内部?.フェイズ || null;
  }

  /**
   * プレイヤー一覧を取得
   */
  get プレイヤーID一覧(): readonly string[] {
    return [...this.プレイヤーID一覧内部];
  }

  /**
   * ターンが開始しているか確認
   */
  はターン中か(): boolean {
    return this.現在のターン情報内部 !== null;
  }

  /**
   * ターンを開始
   *
   * @param ターン番号 開始するターン番号
   * @param プレイヤーID 先手プレイヤーID
   * @param 初期フェイズ 初期フェイズ
   * @param 開始日時 開始日時（省略時はDate.now()）
   * @returns 更新されたターン管理
   */
  ターンを開始(
    ターン番号: number,
    プレイヤーID: string,
    初期フェイズ: string,
    開始日時: number = Date.now()
  ): ターン管理 {
    // プレイヤーIDが存在することを確認
    if (!this.プレイヤーID一覧内部.includes(プレイヤーID)) {
      throw new Error(`プレイヤー「${プレイヤーID}」はゲームに参加していません`);
    }

    const 新しいターン情報: ターン情報 = {
      ターン番号,
      プレイヤーID,
      フェイズ: 初期フェイズ,
      開始日時
    };

    return ターン管理.複製作成(
      this.ゲームID,
      新しいターン情報,
      this.プレイヤーID一覧内部
    );
  }

  /**
   * フェイズを変更
   * 注意：フェイズ順序の判断は行わない
   *
   * @param 新しいフェイズ 変更後のフェイズ
   * @returns 更新されたターン管理
   */
  フェイズを変更(新しいフェイズ: string): ターン管理 {
    if (!this.現在のターン情報内部) {
      throw new Error('ターンが開始していません');
    }

    if (this.現在のターン情報内部.フェイズ === 新しいフェイズ) {
      return this;
    }

    const 新しいターン情報: ターン情報 = {
      ターン番号: this.現在のターン情報内部.ターン番号,
      プレイヤーID: this.現在のターン情報内部.プレイヤーID,
      フェイズ: 新しいフェイズ,
      開始日時: this.現在のターン情報内部.開始日時
    };

    return ターン管理.複製作成(
      this.ゲームID,
      新しいターン情報,
      this.プレイヤーID一覧内部
    );
  }

  /**
   * ターンを終了してプレイヤーを交代
   * 注意：全プレイヤーがターンを終えたときのみターン番号を増加させる
   *
   * @returns 更新されたターン管理
   */
  ターンを終了(): ターン管理 {
    if (!this.現在のターン情報内部) {
      throw new Error('ターンが開始していません');
    }

    // 次プレイヤーインデックスを計算
    const 現在のプレイヤーIndex = this.プレイヤーID一覧内部.indexOf(
      this.現在のターン情報内部.プレイヤーID
    );
    const 次のプレイヤーIndex = (現在のプレイヤーIndex + 1) % this.プレイヤーID一覧内部.length;

    // 全プレイヤーが一周したかを判定
    const 全プレイヤーが一周した = 次のプレイヤーIndex === 0;
    const 次のターン番号 = 全プレイヤーが一周した
      ? this.現在のターン情報内部.ターン番号 + 1
      : this.現在のターン情報内部.ターン番号;

    const 次のプレイヤーID = this.プレイヤーID一覧内部[次のプレイヤーIndex];

    const 新しいターン情報: ターン情報 = {
      ターン番号: 次のターン番号,
      プレイヤーID: 次のプレイヤーID,
      フェイズ: 'スタート',
      開始日時: Date.now()
    };

    return ターン管理.複製作成(
      this.ゲームID,
      新しいターン情報,
      this.プレイヤーID一覧内部
    );
  }

  /**
   * GameStateを更新
   * ターン情報をGameStateに反映
   *
   * @param gameState 対象GameState
   * @returns 更新されたGameState
   */
  GameStateを更新(gameState: GameState): GameState {
    if (!this.現在のターン情報内部) {
      return gameState;
    }

    let 更新後の状態 = gameState.ターン情報を設定(
      this.現在のターン情報内部.ターン番号,
      this.現在のターン情報内部.プレイヤーID,
      this.現在のターン情報内部.開始日時
    );

    更新後の状態 = 更新後の状態.フェイズを設定(this.現在のターン情報内部.フェイズ);

    return 更新後の状態;
  }

  /**
   * ゲームを開始状態に戻す（デバッグ用）
   *
   * @returns ターン情報をクリアしたターン管理
   */
  リセット(): ターン管理 {
    return ターン管理.複製作成(
      this.ゲームID,
      null,
      this.プレイヤーID一覧内部
    );
  }
}
