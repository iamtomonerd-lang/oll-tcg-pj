/**
 * ゲーム基盤層
 *
 * ゲーム状態・管理・初期化の基本的な責務を分離
 * - GameState：現在のゲーム状態を保持（状態ホルダー）
 * - ゲーム状態管理：ゲーム進行ロジック（状態変更管理）
 * - GameSetup：ゲーム初期化（初期状態構築）
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
export type { ゲーム設定 as GameSetupConfig, ゾーン設定 } from './GameSetup';
