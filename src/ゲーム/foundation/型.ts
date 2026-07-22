/**
 * ゲーム基盤層：型定義
 *
 * ゲーム状態・設定・プレイヤーなど、基本となる型を定義
 * 汎用パーツに対して、ゲーム固有の意味を付与する
 */

/**
 * ゲームフェイズ
 */
export type ゲームフェイズ = '開始' | 'メイン1' | '攻撃' | 'メイン2' | '終了';

/**
 * ゲーム状態
 */
export type ゲーム状態 = '初期化前' | 'プレイ中' | '終了';

/**
 * プレイヤーの基本情報
 */
export interface プレイヤー情報 {
  readonly ID: string;
  readonly 名前: string;
  readonly ライフ: number;
  readonly ターン番号: number;
}

/**
 * ゾーン情報
 */
export interface ゾーン情報 {
  readonly ID: string;
  readonly 所有者ID: string;
  readonly 名前: string;
  readonly 内容: readonly any[];
}

/**
 * ゲーム設定
 */
export interface ゲーム設定 {
  readonly プレイヤー数: number;
  readonly 初期ライフ: number;
  readonly デッキ枚数: number;
  readonly 初期手札数: number;
}

/**
 * ターン情報
 */
export interface ターン情報 {
  readonly ターン番号: number;
  readonly 現在のプレイヤーID: string;
  readonly 現在のフェイズ: ゲームフェイズ;
}

/**
 * ゲーム勝敗結果
 */
export interface ゲーム結果 {
  readonly 勝者ID: string | null;
  readonly 敗者ID一覧: string[];
  readonly 理由: string;
  readonly 終了時刻: number;
}

/**
 * ゲーム操作履歴
 */
export interface ゲーム操作履歴 {
  readonly 種類: '初期化' | 'ターン開始' | 'フェイズ移動' | 'ターン終了' | 'ゲーム終了' | 'その他';
  readonly プレイヤーID?: string;
  readonly 内容?: unknown;
  readonly 時刻: number;
}
