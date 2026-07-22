/**
 * 汎用パーツ：ID管理
 *
 * 複数のシステムで再利用可能なID管理モジュール
 * 責務：ID生成・管理・履歴管理のみ
 */

export type {
  ID情報,
  ID管理変更履歴
} from './ID';
export {
  はID同一か,
  はID種類を持つか,
  はメタデータキーを持つか,
  メタデータ値を取得
} from './ID';

export { ID管理 } from './ID管理';
