/**
 * 汎用パーツ：プレイヤー管理
 *
 * プレイヤーを表現する汎用的な型
 * ゲーム固有ルールは含まない
 * 複数のシステムで再利用可能
 */

/**
 * プレイヤー状態
 * シンプルな状態のみ（ゲーム状態は層2で管理）
 */
export type プレイヤー状態 = '有効' | '無効';

/**
 * 単一のプレイヤーを表す
 */
export interface プレイヤー {
  readonly ID: string;
  readonly 名前: string;
  readonly 状態: プレイヤー状態;
  readonly パーツキー一覧: string[];
}

/**
 * プレイヤーを生成する
 */
export function プレイヤーを作成(
  ID: string,
  名前: string,
  状態: プレイヤー状態 = '有効'
): プレイヤー {
  return {
    ID,
    名前,
    状態,
    パーツキー一覧: []
  };
}

/**
 * プレイヤーが有効かを確認
 */
export function は有効か(プレイヤー: プレイヤー): boolean {
  return プレイヤー.状態 === '有効';
}

/**
 * プレイヤーが無効かを確認
 */
export function は無効か(プレイヤー: プレイヤー): boolean {
  return プレイヤー.状態 === '無効';
}

/**
 * パーツを保持しているかを確認
 */
export function パーツを保持しているか(
  プレイヤー: プレイヤー,
  パーツキー: string
): boolean {
  return プレイヤー.パーツキー一覧.includes(パーツキー);
}

/**
 * 保持しているパーツ数を取得
 */
export function 保持パーツ数を取得(プレイヤー: プレイヤー): number {
  return プレイヤー.パーツキー一覧.length;
}
