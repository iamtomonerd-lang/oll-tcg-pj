/**
 * 汎用パーツ：データ管理
 *
 * 任意のデータを型安全に管理する汎用的なシステム
 * ゲーム固有ルールは含まない
 */

/**
 * データストレージ（任意のデータを管理）
 */
export type データストレージ = Record<string, unknown>;

/**
 * データの変更情報
 */
export interface データ変更 {
  readonly キー: string;
  readonly 変更前: unknown;
  readonly 変更後: unknown;
}

/**
 * データのバリデーション関数
 */
export type データバリデーター = (
  キー: string,
  値: unknown
) => { 有効: boolean; エラー?: string };

/**
 * キーが存在するかチェック
 */
export function キーが存在するか(
  データ: データストレージ,
  キー: string
): boolean {
  return キー in データ;
}

/**
 * 値を取得する
 */
export function 値を取得<T = unknown>(
  データ: データストレージ,
  キー: string,
  デフォルト?: T
): T | undefined {
  if (キー in データ) {
    return データ[キー] as T;
  }
  return デフォルト;
}

/**
 * 複数のキーから値を取得する
 */
export function 複数を取得(
  データ: データストレージ,
  キーたち: string[]
): Record<string, unknown> {
  const 結果: データストレージ = {};
  for (const キー of キーたち) {
    if (キー in データ) {
      結果[キー] = データ[キー];
    }
  }
  return 結果;
}

/**
 * すべてのキーを取得する
 */
export function キーたちを取得(データ: データストレージ): string[] {
  return Object.keys(データ);
}

/**
 * データのサイズを取得する
 */
export function サイズを取得(データ: データストレージ): number {
  return Object.keys(データ).length;
}

/**
 * データが空かチェック
 */
export function が空か(データ: データストレージ): boolean {
  return サイズを取得(データ) === 0;
}

/**
 * データを深くコピー（シンプル実装）
 */
export function 深くコピー(データ: データストレージ): データストレージ {
  return JSON.parse(JSON.stringify(データ));
}

/**
 * 条件に合致するキーを取得
 */
export function キーをフィルタリング(
  データ: データストレージ,
  述語: (キー: string, 値: unknown) => boolean
): string[] {
  return Object.entries(データ)
    .filter(([キー, 値]) => 述語(キー, 値))
    .map(([キー]) => キー);
}
