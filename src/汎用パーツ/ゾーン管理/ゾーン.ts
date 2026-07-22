/**
 * 汎用パーツ：ゾーン管理
 *
 * ゲーム非依存の汎用ゾーン型定義
 * ゲーム側が「山札」「手札」などの意味を付与する
 * 複数のシステムで再利用可能
 */

/**
 * 公開設定の種類
 */
export type 公開種類 = '全員公開' | '所有者のみ' | '非公開' | '指定公開';

/**
 * ゾーンの公開設定
 */
export interface 公開設定 {
  readonly 種類: 公開種類;
  readonly 公開対象プレイヤーID?: readonly string[];
}

/**
 * ゾーン変更履歴レコード
 */
export interface ゾーン変更履歴 {
  readonly 種類: 'オブジェクト追加' | 'オブジェクト削除' | 'ゾーン間移動' | '順序変更';
  readonly 変更前オブジェクト数: number;
  readonly 変更後オブジェクト数: number;
  readonly 時刻: number;
  readonly 詳細?: {
    readonly 移動元ゾーンID?: string;
    readonly 移動先ゾーンID?: string;
  };
}

/**
 * ゾーンの状態（読み取り専用インターフェース）
 */
export interface ゾーン {
  readonly ID: string;
  readonly 名前: string;
  readonly オブジェクト一覧: readonly unknown[];
  readonly 順序管理: boolean;
  readonly 公開設定: 公開設定;
}

/**
 * 公開種類を取得
 */
export function 公開種類を取得(公開設定: 公開設定): 公開種類 {
  return 公開設定.種類;
}

/**
 * 全員公開か確認
 */
export function は全員公開か(公開設定: 公開設定): boolean {
  return 公開設定.種類 === '全員公開';
}

/**
 * 所有者のみか確認
 */
export function は所有者のみか(公開設定: 公開設定): boolean {
  return 公開設定.種類 === '所有者のみ';
}

/**
 * 非公開か確認
 */
export function は非公開か(公開設定: 公開設定): boolean {
  return 公開設定.種類 === '非公開';
}

/**
 * 指定公開か確認
 */
export function は指定公開か(公開設定: 公開設定): boolean {
  return 公開設定.種類 === '指定公開';
}

/**
 * プレイヤーに公開されているか確認
 * （判定は行わず、公開範囲情報を返すだけ）
 */
export function 公開対象プレイヤーIDを取得(公開設定: 公開設定): string[] {
  return 公開設定.公開対象プレイヤーID ? [...公開設定.公開対象プレイヤーID] : [];
}
