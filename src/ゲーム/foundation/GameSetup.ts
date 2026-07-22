/**
 * ゲーム基盤層：ゲーム初期化
 *
 * ゲーム開始に必要なオブジェクトを生成し、初期ゲーム状態を構築する
 * 役割：「ゲーム開始前の準備を行い、開始可能なGameStateを生成する」
 *
 * 担当する責務：
 * - ゲーム設定読み込み
 * - プレイヤー生成
 * - 初期ゾーン生成
 * - 初期数値設定
 * - GameState生成
 * - 初期配置処理
 *
 * 担当しない責務：
 * - ターン進行（ゲーム状態管理）
 * - カード効果処理（カード効果エンジン）
 * - 攻撃処理（攻撃エンジン）
 * - 勝利判定処理（勝利判定パーツ）
 * - シャッフル処理そのもの（ランダム管理）
 * - カードルール判断（ゲームエンジン）
 */

import { GameState, プレイヤー情報, ゾーン情報 } from './GameState';

/**
 * ゲーム設定
 * ゲーム開始に必要な基本設定を保持
 */
export interface ゲーム設定 {
  readonly プレイヤー人数: number;
  readonly 初期ライフ: number;
  readonly 使用ゾーン一覧: readonly ゾーン設定[];
}

/**
 * ゾーン設定
 */
export interface ゾーン設定 {
  readonly 名前: string;
  readonly プレイヤー所有: boolean;
}

/**
 * ゲーム初期化クラス
 *
 * イミュータブル設計：
 * - GameSetup自体は状態を保持しない
 * - 入力：GameConfig + プレイヤー情報 + デッキ情報など
 * - 出力：新しいGameState
 */
export class GameSetup {
  /**
   * ゲームを初期化してGameStateを生成
   *
   * @param ゲームID ゲーム識別子
   * @param 設定 ゲーム設定
   * @returns 初期化されたGameState
   */
  static ゲームを初期化(
    ゲームID: string,
    設定: ゲーム設定
  ): GameState {
    // GameStateを生成（初期状態は開始前）
    let gameState = new GameState(ゲームID);

    // プレイヤー一覧を生成
    const プレイヤー一覧 = GameSetup.プレイヤーを生成(設定.プレイヤー人数, 設定.初期ライフ);
    gameState = gameState.プレイヤー一覧を設定(プレイヤー一覧);

    // ゾーン一覧を生成
    const ゾーン一覧 = GameSetup.ゾーンを生成(設定.使用ゾーン一覧, プレイヤー一覧);
    gameState = gameState.ゾーン一覧を設定(ゾーン一覧);

    return gameState;
  }

  /**
   * プレイヤー一覧を生成
   *
   * @param プレイヤー人数 生成するプレイヤー数
   * @param 初期ライフ 初期ライフ値
   * @returns 生成されたプレイヤー一覧
   */
  private static プレイヤーを生成(
    プレイヤー人数: number,
    初期ライフ: number
  ): readonly プレイヤー情報[] {
    const プレイヤー一覧: プレイヤー情報[] = [];

    for (let i = 0; i < プレイヤー人数; i++) {
      プレイヤー一覧.push({
        ID: `player_${String(i + 1).padStart(3, '0')}`,
        名前: `プレイヤー${i + 1}`
      });
    }

    return プレイヤー一覧;
  }

  /**
   * ゾーン一覧を生成
   *
   * @param ゾーン設定一覧 ゾーン設定のリスト
   * @param プレイヤー一覧 プレイヤー一覧
   * @returns 生成されたゾーン一覧
   */
  private static ゾーンを生成(
    ゾーン設定一覧: readonly ゾーン設定[],
    プレイヤー一覧: readonly プレイヤー情報[]
  ): readonly ゾーン情報[] {
    const ゾーン一覧: ゾーン情報[] = [];
    let ゾーンIndex = 0;

    // プレイヤーが所有するゾーンを生成
    for (const プレイヤー of プレイヤー一覧) {
      for (const ゾーン設定 of ゾーン設定一覧) {
        if (ゾーン設定.プレイヤー所有) {
          ゾーン一覧.push({
            ID: `zone_${String(ゾーンIndex + 1).padStart(3, '0')}`,
            所有者ID: プレイヤー.ID,
            名前: ゾーン設定.名前
          });
          ゾーンIndex++;
        }
      }
    }

    // 全体ゾーン（プレイヤー非所有）を生成
    for (const ゾーン設定 of ゾーン設定一覧) {
      if (!ゾーン設定.プレイヤー所有) {
        ゾーン一覧.push({
          ID: `zone_${String(ゾーンIndex + 1).padStart(3, '0')}`,
          所有者ID: 'system',
          名前: ゾーン設定.名前
        });
        ゾーンIndex++;
      }
    }

    return ゾーン一覧;
  }

  /**
   * デッキをゾーンに配置
   * （デッキ内容はGameSetupが決定せず、外部から受け取る）
   *
   * @param gameState ゲーム状態
   * @param プレイヤーID プレイヤーID
   * @param デッキゾーンID デッキゾーンID
   * @param デッキ内容 配置するデッキ内容
   * @returns 更新されたGameState
   */
  static デッキを配置(
    gameState: GameState,
    プレイヤーID: string,
    デッキゾーンID: string,
    デッキ内容: readonly unknown[]
  ): GameState {
    // 注意：実装は層が進む時点で、実際のカード管理と統合される
    // ここでは構造を定義するのみ
    return gameState;
  }

  /**
   * 先攻を決定
   * （方法はゲーム側で指定：ランダム選択 または 外部指定）
   *
   * @param gameState ゲーム状態
   * @param 先攻プレイヤーID 先攻するプレイヤーのID
   * @returns ターン情報が設定されたGameState
   */
  static 先攻を決定(
    gameState: GameState,
    先攻プレイヤーID: string
  ): GameState {
    return gameState.ターン情報を設定(1, 先攻プレイヤーID);
  }
}
