/**
 * 汎用パーツ：カード管理
 *
 * ゲーム非依存の汎用カード型定義
 * ゲーム側が「攻撃力」「コスト」などの意味を付与する
 * 複数のシステムで再利用可能
 */

/**
 * カード変更履歴レコード
 */
export interface カード変更履歴 {
  readonly 種類: '名前変更' | '種類追加' | '種類削除' | 'データ変更' | '状態変更';
  readonly 対象: string;
  readonly 変更前: unknown;
  readonly 変更後: unknown;
  readonly 時刻: number;
}

/**
 * カードの状態（読み取り専用インターフェース）
 */
export interface カード {
  readonly ID: string;
  readonly 名前: string;
  readonly 種類一覧: readonly string[];
  readonly データ: Readonly<Record<string, unknown>>;
  readonly 状態: Readonly<Record<string, unknown>>;
}

/**
 * 種類を含むか確認
 */
export function は種類を含むか(カード: カード, 種類: string): boolean {
  return カード.種類一覧.includes(種類);
}

/**
 * 複数の種類を含むか確認
 */
export function は複数種類を含むか(カード: カード, 種類一覧: string[]): boolean {
  return 種類一覧.every(種類 => カード.種類一覧.includes(種類));
}

/**
 * データキーが存在するか確認
 */
export function はデータキーを持つか(カード: カード, キー: string): boolean {
  return キー in カード.データ;
}

/**
 * データの値を取得
 */
export function データ値を取得(カード: カード, キー: string): unknown {
  return カード.データ[キー];
}

/**
 * 状態キーが存在するか確認
 */
export function は状態キーを持つか(カード: カード, キー: string): boolean {
  return キー in カード.状態;
}

/**
 * 状態の値を取得
 */
export function 状態値を取得(カード: カード, キー: string): unknown {
  return カード.状態[キー];
}
