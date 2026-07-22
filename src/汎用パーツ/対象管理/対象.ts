/**
 * 汎用パーツ：対象管理
 *
 * ゲーム非依存の汎用対象型定義
 * 複数のシステムで再利用可能
 */

/**
 * 対象の最小単位
 * ゲーム側が内容を自由に拡張可能
 */
export interface 対象 {
  readonly id: string;
  readonly データ?: unknown;
}

/**
 * 対象管理の状態
 */
export type 対象管理状態 = '未開始' | '候補設定済み' | '選択中' | '確定' | 'キャンセル';

/**
 * 対象管理変更履歴レコード
 */
export interface 対象管理変更履歴 {
  readonly 種類: '候補設定' | '候補追加' | '候補削除' | '対象追加' | '対象削除' | '状態変更';
  readonly 変更前: unknown;
  readonly 変更後: unknown;
  readonly 時刻: number;
  readonly 詳細?: {
    readonly 詳細内容?: string;
  };
}

/**
 * 状態が未開始か確認
 */
export function は未開始か(状態: 対象管理状態): boolean {
  return 状態 === '未開始';
}

/**
 * 状態が候補設定済みか確認
 */
export function は候補設定済みか(状態: 対象管理状態): boolean {
  return 状態 === '候補設定済み';
}

/**
 * 状態が選択中か確認
 */
export function は選択中か(状態: 対象管理状態): boolean {
  return 状態 === '選択中';
}

/**
 * 状態が確定か確認
 */
export function は確定か(状態: 対象管理状態): boolean {
  return 状態 === '確定';
}

/**
 * 状態がキャンセルか確認
 */
export function はキャンセルか(状態: 対象管理状態): boolean {
  return 状態 === 'キャンセル';
}
