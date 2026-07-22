/**
 * 汎用パーツ：数値管理
 *
 * 数値データを管理する汎用的な型。
 * ゲーム固有ルールは含まない。
 * 複数のシステムで再利用可能。
 */

/**
 * 単一の数値を表す
 */
export interface 数値 {
  readonly 現在値: number;
  readonly 最大値: number | null;
}

/**
 * 数値を生成する
 */
export function 数値を作成(現在値: number, 最大値: number | null = null): 数値 {
  return { 現在値, 最大値 };
}

/**
 * 数値が最大値に到達しているかを確認する
 */
export function は最大か(数値: 数値): boolean {
  if (数値.最大値 === null) {
    return false;
  }
  return 数値.現在値 >= 数値.最大値;
}

/**
 * 数値がゼロ以下かを確認する
 */
export function はゼロ以下か(数値: 数値): boolean {
  return 数値.現在値 <= 0;
}

/**
 * 現在値の割合を計算する（0-1）
 */
export function 割合を取得(数値: 数値): number {
  if (数値.最大値 === null || 数値.最大値 === 0) {
    return 0;
  }
  return Math.max(0, Math.min(1, 数値.現在値 / 数値.最大値));
}
