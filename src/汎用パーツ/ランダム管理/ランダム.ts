/**
 * 汎用パーツ：ランダム管理
 *
 * ゲーム非依存の汎用ランダム型定義
 * 複数のシステムで再利用可能
 */

/**
 * ランダム方式
 */
export type ランダム方式 = '整数生成' | '範囲生成' | '要素選択' | '複数要素選択' | 'シャッフル';

/**
 * ランダム変更履歴レコード
 */
export interface ランダム変更履歴 {
  readonly 種類: '方式実行' | '結果確定' | 'シード設定' | 'リセット';
  readonly 方式: ランダム方式;
  readonly 入力: unknown;
  readonly 結果: unknown;
  readonly 時刻: number;
  readonly 詳細?: {
    readonly シード?: number;
  };
}

/**
 * ランダム生成結果の型定義
 */
export interface ランダム結果 {
  readonly 値: unknown;
  readonly 方式: ランダム方式;
  readonly 入力: unknown;
  readonly 時刻: number;
}

/**
 * ランダム管理の状態（読み取り専用インターフェース）
 */
export interface ランダム {
  readonly ID: string;
  readonly 現在の方式: ランダム方式 | null;
  readonly 最新結果: ランダム結果 | null;
  readonly シード: number | null;
  readonly 履歴一覧: readonly ランダム変更履歴[];
}

/**
 * 履歴が空か確認
 */
export function は履歴が空か(履歴: readonly ランダム変更履歴[]): boolean {
  return 履歴.length === 0;
}

/**
 * 履歴のサイズを取得
 */
export function 履歴のサイズを取得(履歴: readonly ランダム変更履歴[]): number {
  return 履歴.length;
}
