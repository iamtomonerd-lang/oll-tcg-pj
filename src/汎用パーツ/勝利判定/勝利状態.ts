/**
 * 汎用パーツ：勝利判定
 *
 * ゲーム結果の状態を管理する汎用的な型
 * ゲーム固有ルールは含まない
 * 複数のシステムで再利用可能
 */

/**
 * 勝敗状態の定義
 * ゲーム非依存のシンプルな状態のみ
 */
export type 勝敗状態 = '未決定' | '勝利' | '敗北' | '引き分け';

/**
 * 判定履歴レコード
 */
export interface 判定履歴 {
  readonly 変更前: 勝敗状態;
  readonly 変更後: 勝敗状態;
  readonly 時刻: number;
}

/**
 * 勝敗状態が確定しているか確認
 */
export function は確定しているか(状態: 勝敗状態): boolean {
  return 状態 !== '未決定';
}

/**
 * 勝敗状態が勝利か確認
 */
export function は勝利か(状態: 勝敗状態): boolean {
  return 状態 === '勝利';
}

/**
 * 勝敗状態が敗北か確認
 */
export function は敗北か(状態: 勝敗状態): boolean {
  return 状態 === '敗北';
}

/**
 * 勝敗状態が引き分けか確認
 */
export function は引き分けか(状態: 勝敗状態): boolean {
  return 状態 === '引き分け';
}

/**
 * 勝敗状態が未決定か確認
 */
export function は未決定か(状態: 勝敗状態): boolean {
  return 状態 === '未決定';
}
