/**
 * 汎用パーツ：ID管理
 *
 * ゲーム非依存の汎用ID型定義
 * 複数のシステムで再利用可能
 */

/**
 * ID情報
 */
export interface ID情報 {
  readonly id: string;
  readonly 種類?: string;
  readonly 作成日時: number;
  readonly メタデータ?: unknown;
}

/**
 * ID管理変更履歴レコード
 */
export interface ID管理変更履歴 {
  readonly 種類: '生成' | '登録' | '削除' | 'リセット';
  readonly 対象ID: string;
  readonly 時刻: number;
  readonly 詳細?: {
    readonly 元の種類?: string;
    readonly メタデータ?: unknown;
  };
}

/**
 * ID比較
 */
export function はID同一か(id1: string, id2: string): boolean {
  return id1 === id2;
}

/**
 * ID情報が種類を持つか確認
 */
export function はID種類を持つか(ID情報: ID情報, 種類: string): boolean {
  return ID情報.種類 === 種類;
}

/**
 * ID情報がメタデータキーを持つか確認
 */
export function はメタデータキーを持つか(ID情報: ID情報, キー: string): boolean {
  if (!ID情報.メタデータ || typeof ID情報.メタデータ !== 'object') {
    return false;
  }
  return キー in ID情報.メタデータ;
}

/**
 * メタデータの値を取得
 */
export function メタデータ値を取得(ID情報: ID情報, キー: string): unknown {
  if (!ID情報.メタデータ || typeof ID情報.メタデータ !== 'object') {
    return undefined;
  }
  return (ID情報.メタデータ as Record<string, unknown>)[キー];
}
