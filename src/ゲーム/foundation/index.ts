/**
 * ゲーム基盤層
 *
 * ゲーム状態・管理・初期化・ターン進行・フェイズ処理・基本行動の責務を分離
 * - GameState：現在のゲーム状態を保持（状態ホルダー）
 * - ゲーム状態管理：ゲーム進行ロジック（状態変更管理）
 * - GameSetup：ゲーム初期化（初期状態構築）
 * - ターン管理：ターン進行管理（時間軸管理）
 * - フェイズ処理システム：フェイズ内の処理管理（処理実行管理）
 * - 行動管理：プレイヤー操作としての基本行動管理（行動管理）
 */

export type {
  ゲーム状態,
  ゲーム設定,
  ターン情報,
  ゲーム結果,
  ゲーム操作履歴,
  プレイヤー情報,
  ゾーン情報
} from './型';

export { GameState } from './GameState';
export { ゲーム状態管理 } from './ゲーム状態';
export { GameSetup } from './GameSetup';
export { ターン管理 } from './ターン管理';
export { フェイズ処理システム } from './フェイズ処理';
export { 行動管理 } from './行動管理';
export type { ゲーム設定 as GameSetupConfig, ゾーン設定 } from './GameSetup';
export type { フェイズ処理 } from './フェイズ処理';
export type { 行動情報, 行動状態, 行動可能確認, 行動可能性チェック結果 } from './行動管理';
