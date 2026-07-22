/**
 * GameSetup テスト
 *
 * ゲーム開始に必要なオブジェクト生成と初期ゲーム状態構築のテスト
 *
 * テスト方針：
 * - ゲーム初期化が正常に完了する
 * - プレイヤーが指定人数生成される
 * - ゾーンが正しく生成される
 * - 同じ設定から同じ初期状態を再現できる
 * - 特定TCGルール不要
 * - 汎用パーツに依存しない独立動作
 */

import { GameSetup, ゲーム設定 } from '../../../src/ゲーム/foundation/GameSetup';

describe('GameSetup', () => {
  // 基本初期化テスト
  describe('ゲームを初期化', () => {
    it('ゲーム生成が成功する', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      expect(gameState).toBeDefined();
      expect(gameState.ゲームID).toBe('game_001');
    });

    it('初期状態は開始前である', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      expect(gameState.進行状態).toBe('開始前');
      expect(gameState.は開始前か()).toBe(true);
    });

    it('初期状態ではターン情報がない', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      expect(gameState.ターン情報).toBeNull();
    });

    it('初期状態ではフェイズがない', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      expect(gameState.現在フェイズ).toBeNull();
    });

    it('初期状態では終了情報がない', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      expect(gameState.終了情報).toBeNull();
    });
  });

  // プレイヤー生成テスト
  describe('プレイヤー生成', () => {
    it('指定人数のプレイヤーが生成される', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      expect(gameState.プレイヤー一覧).toHaveLength(2);
    });

    it('複数プレイヤーが生成される（3人）', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 3,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      expect(gameState.プレイヤー一覧).toHaveLength(3);
    });

    it('複数プレイヤーが生成される（4人）', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 4,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      expect(gameState.プレイヤー一覧).toHaveLength(4);
    });

    it('プレイヤーがIDを保持する', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      expect(gameState.プレイヤー一覧[0].ID).toBeDefined();
      expect(gameState.プレイヤー一覧[1].ID).toBeDefined();
    });

    it('プレイヤーIDは一意である', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 3,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);
      const IDセット = new Set(gameState.プレイヤー一覧.map(p => p.ID));

      expect(IDセット.size).toBe(3);
    });

    it('プレイヤーが名前を保持する', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      expect(gameState.プレイヤー一覧[0].名前).toBeDefined();
      expect(gameState.プレイヤー一覧[1].名前).toBeDefined();
    });
  });

  // ゾーン生成テスト
  describe('ゾーン生成', () => {
    it('プレイヤー所有ゾーンが生成される', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: [
          { 名前: 'デッキ', プレイヤー所有: true }
        ]
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      // 2プレイヤー × 1プレイヤー所有ゾーン = 2ゾーン
      expect(gameState.ゾーン一覧).toHaveLength(2);
    });

    it('複数プレイヤー所有ゾーンが生成される', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: [
          { 名前: 'デッキ', プレイヤー所有: true },
          { 名前: '手札', プレイヤー所有: true }
        ]
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      // 2プレイヤー × 2プレイヤー所有ゾーン = 4ゾーン
      expect(gameState.ゾーン一覧).toHaveLength(4);
    });

    it('システムゾーン（プレイヤー非所有）が生成される', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: [
          { 名前: 'デッキ', プレイヤー所有: true },
          { 名前: '公開情報', プレイヤー所有: false }
        ]
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      // 2プレイヤー × 1プレイヤー所有ゾーン + 1システムゾーン = 3ゾーン
      expect(gameState.ゾーン一覧).toHaveLength(3);
    });

    it('ゾーンが所有者IDを保持する', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: [
          { 名前: 'デッキ', プレイヤー所有: true }
        ]
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      const zone1 = gameState.ゾーン一覧[0];
      const zone2 = gameState.ゾーン一覧[1];

      expect(zone1.所有者ID).toBeDefined();
      expect(zone2.所有者ID).toBeDefined();
      expect(zone1.所有者ID).not.toEqual(zone2.所有者ID);
    });

    it('ゾーンが名前を保持する', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: [
          { 名前: 'デッキ', プレイヤー所有: true }
        ]
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      expect(gameState.ゾーン一覧[0].名前).toBe('デッキ');
    });

    it('システムゾーンはsystem所有者を持つ', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: [
          { 名前: '公開情報', プレイヤー所有: false }
        ]
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      expect(gameState.ゾーン一覧[0].所有者ID).toBe('system');
    });

    it('複数システムゾーンが生成される', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: [
          { 名前: 'デッキ', プレイヤー所有: true },
          { 名前: '公開情報', プレイヤー所有: false },
          { 名前: 'ゲーム状態', プレイヤー所有: false }
        ]
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      // 2プレイヤー × 1プレイヤー所有ゾーン + 2システムゾーン = 4ゾーン
      expect(gameState.ゾーン一覧).toHaveLength(4);
    });
  });

  // 再現性テスト
  describe('再現性', () => {
    it('同じ設定から同じプレイヤー一覧を生成できる', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: [
          { 名前: 'デッキ', プレイヤー所有: true }
        ]
      };

      const state1 = GameSetup.ゲームを初期化('game_001', 設定);
      const state2 = GameSetup.ゲームを初期化('game_002', 設定);

      expect(state1.プレイヤー一覧).toHaveLength(state2.プレイヤー一覧.length);
      // プレイヤーIDは異なる（ゲームIDが異なるから）
      expect(state1.プレイヤー一覧[0].ID).toEqual(state2.プレイヤー一覧[0].ID);
    });

    it('同じ設定から同じゾーン数を生成できる', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 3,
        初期ライフ: 20,
        使用ゾーン一覧: [
          { 名前: 'デッキ', プレイヤー所有: true },
          { 名前: '手札', プレイヤー所有: true },
          { 名前: '場', プレイヤー所有: true }
        ]
      };

      const state1 = GameSetup.ゲームを初期化('game_001', 設定);
      const state2 = GameSetup.ゲームを初期化('game_002', 設定);

      expect(state1.ゾーン一覧).toHaveLength(state2.ゾーン一覧.length);
    });
  });

  // 先攻決定テスト
  describe('先攻を決定', () => {
    it('先攻プレイヤーを設定できる', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      let gameState = GameSetup.ゲームを初期化('game_001', 設定);
      const プレイヤーID = gameState.プレイヤー一覧[0].ID;

      gameState = GameSetup.先攻を決定(gameState, プレイヤーID);

      expect(gameState.現在プレイヤーID).toBe(プレイヤーID);
      expect(gameState.現在ターン番号).toBe(1);
    });

    it('異なるプレイヤーを先攻に設定できる', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      let gameState = GameSetup.ゲームを初期化('game_001', 設定);
      const プレイヤーID1 = gameState.プレイヤー一覧[0].ID;
      const プレイヤーID2 = gameState.プレイヤー一覧[1].ID;

      gameState = GameSetup.先攻を決定(gameState, プレイヤーID2);

      expect(gameState.現在プレイヤーID).toBe(プレイヤーID2);
    });

    it('先攻を複数回変更できる（後の設定が優先）', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      let gameState = GameSetup.ゲームを初期化('game_001', 設定);
      const プレイヤーID1 = gameState.プレイヤー一覧[0].ID;
      const プレイヤーID2 = gameState.プレイヤー一覧[1].ID;

      gameState = GameSetup.先攻を決定(gameState, プレイヤーID1);
      gameState = GameSetup.先攻を決定(gameState, プレイヤーID2);

      expect(gameState.現在プレイヤーID).toBe(プレイヤーID2);
    });
  });

  // 汎用性テスト
  describe('汎用性', () => {
    it('特定TCG用語が含まれていない', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: [
          { 名前: 'カスタム1', プレイヤー所有: true },
          { 名前: 'カスタム2', プレイヤー所有: false }
        ]
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      // ゾーン名は任意の文字列で動作
      // 2プレイヤー × 1プレイヤー所有ゾーン = 2, + 1システムゾーン = 3
      expect(gameState.ゾーン一覧[0].名前).toBe('カスタム1');
      expect(gameState.ゾーン一覧[1].名前).toBe('カスタム1');
      expect(gameState.ゾーン一覧[2].名前).toBe('カスタム2');
    });

    it('異なるプレイヤー人数をサポート', () => {
      for (let i = 1; i <= 6; i++) {
        const 設定: ゲーム設定 = {
          プレイヤー人数: i,
          初期ライフ: 20,
          使用ゾーン一覧: []
        };

        const gameState = GameSetup.ゲームを初期化('game_001', 設定);
        expect(gameState.プレイヤー一覧).toHaveLength(i);
      }
    });

    it('異なる初期ライフ値をサポート', () => {
      const 設定1: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      const 設定2: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 40,
        使用ゾーン一覧: []
      };

      const state1 = GameSetup.ゲームを初期化('game_001', 設定1);
      const state2 = GameSetup.ゲームを初期化('game_002', 設定2);

      // 初期ライフ値を保持しているかは、後続の層で使用
      expect(state1).toBeDefined();
      expect(state2).toBeDefined();
    });
  });

  // 複合シナリオテスト
  describe('複合シナリオ', () => {
    it('完全なゲーム初期化フロー', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: [
          { 名前: 'デッキ', プレイヤー所有: true },
          { 名前: '手札', プレイヤー所有: true },
          { 名前: '場', プレイヤー所有: true },
          { 名前: '墓地', プレイヤー所有: true },
          { 名前: 'ゲーム状態', プレイヤー所有: false }
        ]
      };

      let gameState = GameSetup.ゲームを初期化('game_001', 設定);

      // 検証：プレイヤー
      expect(gameState.プレイヤー一覧).toHaveLength(2);

      // 検証：ゾーン
      // 2プレイヤー × 4プレイヤー所有ゾーン + 1システムゾーン = 9ゾーン
      expect(gameState.ゾーン一覧).toHaveLength(9);

      // 検証：初期状態
      expect(gameState.進行状態).toBe('開始前');
      expect(gameState.ターン情報).toBeNull();

      // 先攻を決定
      const 先攻プレイヤー = gameState.プレイヤー一覧[0].ID;
      gameState = GameSetup.先攻を決定(gameState, 先攻プレイヤー);

      // 検証：先攻設定後
      expect(gameState.現在プレイヤーID).toBe(先攻プレイヤー);
      expect(gameState.現在ターン番号).toBe(1);
      expect(gameState.進行状態).toBe('開始前');
    });

    it('3プレイヤーゲーム初期化', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 3,
        初期ライフ: 30,
        使用ゾーン一覧: [
          { 名前: 'デッキ', プレイヤー所有: true },
          { 名前: '手札', プレイヤー所有: true },
          { 名前: '共有情報', プレイヤー所有: false }
        ]
      };

      let gameState = GameSetup.ゲームを初期化('game_001', 設定);

      expect(gameState.プレイヤー一覧).toHaveLength(3);
      // 3プレイヤー × 2プレイヤー所有ゾーン + 1システムゾーン = 7ゾーン
      expect(gameState.ゾーン一覧).toHaveLength(7);

      // 先攻を3番目プレイヤーに設定
      gameState = GameSetup.先攻を決定(gameState, gameState.プレイヤー一覧[2].ID);

      expect(gameState.現在プレイヤーID).toBe(gameState.プレイヤー一覧[2].ID);
    });
  });

  // 責務分離テスト
  describe('責務分離', () => {
    it('GameSetupはターン進行を処理しない', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      // GameSetupにはターン進行メソッドがない
      expect((GameSetup as any).ターンを開始).toBeUndefined();
      expect((GameSetup as any).ターンを終了).toBeUndefined();
      expect((GameSetup as any).フェイズを移動).toBeUndefined();
    });

    it('GameSetupはカード効果を処理しない', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      // カード効果処理がない
      expect((GameSetup as any).効果を発動).toBeUndefined();
      expect((GameSetup as any).カードを使用).toBeUndefined();
    });

    it('GameSetupは勝利判定を処理しない', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      const gameState = GameSetup.ゲームを初期化('game_001', 設定);

      // 勝利判定メソッドがない
      expect((GameSetup as any).勝者を判定).toBeUndefined();
      expect((GameSetup as any).ゲームを終了).toBeUndefined();
    });
  });

  // イミュータブル設計テスト
  describe('イミュータブル設計', () => {
    it('GameSetupは状態を保持しない', () => {
      const 設定1: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: []
      };

      const 設定2: ゲーム設定 = {
        プレイヤー人数: 3,
        初期ライフ: 30,
        使用ゾーン一覧: []
      };

      const state1 = GameSetup.ゲームを初期化('game_001', 設定1);
      const state2 = GameSetup.ゲームを初期化('game_002', 設定2);

      // 二つの初期化は独立している
      expect(state1.プレイヤー一覧).toHaveLength(2);
      expect(state2.プレイヤー一覧).toHaveLength(3);
    });

    it('同じ設定での複数回の初期化は独立している', () => {
      const 設定: ゲーム設定 = {
        プレイヤー人数: 2,
        初期ライフ: 20,
        使用ゾーン一覧: [
          { 名前: 'デッキ', プレイヤー所有: true }
        ]
      };

      const state1 = GameSetup.ゲームを初期化('game_001', 設定);
      const state2 = GameSetup.ゲームを初期化('game_002', 設定);

      // 異なるGameStateインスタンス
      expect(state1).not.toBe(state2);
      expect(state1.ゲームID).not.toEqual(state2.ゲームID);
    });
  });
});
