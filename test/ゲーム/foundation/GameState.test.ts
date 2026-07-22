/**
 * GameState テスト
 *
 * ゲーム進行状態・ターン情報・フェイズ・プレイヤー・ゾーン・終了情報を
 * 一元管理するゲーム状態クラスのテスト
 *
 * テスト方針：
 * - 初期状態の検証
 * - 状態変更と新インスタンス生成の確認
 * - イミュータブル設計の検証
 * - ゲーム特定コード不要（ゲームルールのみ保持）
 */

import { GameState } from '../../../src/ゲーム/foundation/GameState';

describe('GameState', () => {
  // 初期状態テスト
  describe('初期状態', () => {
    it('ゲームIDで初期化される', () => {
      const gameState = new GameState('game_001');
      expect(gameState.ゲームID).toBe('game_001');
    });

    it('進行状態は開始前になる', () => {
      const gameState = new GameState('game_001');
      expect(gameState.進行状態).toBe('開始前');
    });

    it('ターン情報はnullである', () => {
      const gameState = new GameState('game_001');
      expect(gameState.ターン情報).toBeNull();
    });

    it('現在フェイズはnullである', () => {
      const gameState = new GameState('game_001');
      expect(gameState.現在フェイズ).toBeNull();
    });

    it('プレイヤー一覧は空である', () => {
      const gameState = new GameState('game_001');
      expect(gameState.プレイヤー一覧).toEqual([]);
    });

    it('ゾーン一覧は空である', () => {
      const gameState = new GameState('game_001');
      expect(gameState.ゾーン一覧).toEqual([]);
    });

    it('ゲーム終了情報はnullである', () => {
      const gameState = new GameState('game_001');
      expect(gameState.終了情報).toBeNull();
    });

    it('は開始前か() trueを返す', () => {
      const gameState = new GameState('game_001');
      expect(gameState.は開始前か()).toBe(true);
    });

    it('は進行中か() falseを返す', () => {
      const gameState = new GameState('game_001');
      expect(gameState.は進行中か()).toBe(false);
    });

    it('は終了か() falseを返す', () => {
      const gameState = new GameState('game_001');
      expect(gameState.は終了か()).toBe(false);
    });

    it('現在プレイヤーIDはnullである', () => {
      const gameState = new GameState('game_001');
      expect(gameState.現在プレイヤーID).toBeNull();
    });

    it('現在ターン番号はnullである', () => {
      const gameState = new GameState('game_001');
      expect(gameState.現在ターン番号).toBeNull();
    });
  });

  // 進行状態変更テスト
  describe('進行状態を変更', () => {
    it('開始前から進行中に変更できる', () => {
      const gameState1 = new GameState('game_001');
      const gameState2 = gameState1.進行状態を変更('進行中');

      expect(gameState2.進行状態).toBe('進行中');
      expect(gameState2.は進行中か()).toBe(true);
    });

    it('進行中から終了に変更できる', () => {
      const gameState1 = new GameState('game_001');
      const gameState2 = gameState1.進行状態を変更('進行中');
      const gameState3 = gameState2.進行状態を変更('終了');

      expect(gameState3.進行状態).toBe('終了');
      expect(gameState3.は終了か()).toBe(true);
    });

    it('同じ状態に変更した場合、同じインスタンスを返す', () => {
      const gameState1 = new GameState('game_001');
      const gameState2 = gameState1.進行状態を変更('開始前');

      expect(gameState2).toBe(gameState1);
    });

    it('状態変更後も元インスタンスは変わらない', () => {
      const gameState1 = new GameState('game_001');
      const gameState2 = gameState1.進行状態を変更('進行中');

      expect(gameState1.進行状態).toBe('開始前');
      expect(gameState2.進行状態).toBe('進行中');
    });
  });

  // ターン情報設定テスト
  describe('ターン情報を設定', () => {
    it('ターン番号を保持する', () => {
      const gameState = new GameState('game_001');
      const updated = gameState.ターン情報を設定(1, 'player_001');

      expect(updated.ターン情報).not.toBeNull();
      expect(updated.ターン情報?.ターン番号).toBe(1);
    });

    it('プレイヤーIDを保持する', () => {
      const gameState = new GameState('game_001');
      const updated = gameState.ターン情報を設定(1, 'player_001');

      expect(updated.ターン情報?.現在プレイヤーID).toBe('player_001');
    });

    it('開始日時を保持する', () => {
      const gameState = new GameState('game_001');
      const now = Date.now();
      const updated = gameState.ターン情報を設定(1, 'player_001', now);

      expect(updated.ターン情報?.開始日時).toBe(now);
    });

    it('開始日時が指定されない場合、現在時刻を使用する', () => {
      const gameState = new GameState('game_001');
      const before = Date.now();
      const updated = gameState.ターン情報を設定(1, 'player_001');
      const after = Date.now();

      expect(updated.ターン情報?.開始日時).toBeGreaterThanOrEqual(before);
      expect(updated.ターン情報?.開始日時).toBeLessThanOrEqual(after);
    });

    it('現在プレイヤーIDを取得できる', () => {
      const gameState = new GameState('game_001');
      const updated = gameState.ターン情報を設定(1, 'player_001');

      expect(updated.現在プレイヤーID).toBe('player_001');
    });

    it('現在ターン番号を取得できる', () => {
      const gameState = new GameState('game_001');
      const updated = gameState.ターン情報を設定(5, 'player_002');

      expect(updated.現在ターン番号).toBe(5);
    });

    it('同じターン番号とプレイヤーで更新した場合、同じインスタンスを返す', () => {
      const gameState = new GameState('game_001');
      const updated1 = gameState.ターン情報を設定(1, 'player_001', 1000);
      const updated2 = updated1.ターン情報を設定(1, 'player_001');

      expect(updated2).toBe(updated1);
    });

    it('ターン情報を複数回更新できる', () => {
      const gameState = new GameState('game_001');
      const state1 = gameState.ターン情報を設定(1, 'player_001');
      const state2 = state1.ターン情報を設定(1, 'player_002');
      const state3 = state2.ターン情報を設定(2, 'player_001');

      expect(state1.ターン情報?.現在プレイヤーID).toBe('player_001');
      expect(state2.ターン情報?.現在プレイヤーID).toBe('player_002');
      expect(state3.ターン情報?.ターン番号).toBe(2);
    });
  });

  // フェイズ設定テスト
  describe('フェイズを設定', () => {
    it('フェイズを任意文字列で保持できる', () => {
      const gameState = new GameState('game_001');
      const updated = gameState.フェイズを設定('メインフェイズ');

      expect(updated.現在フェイズ).toBe('メインフェイズ');
    });

    it('複数のフェイズに変更できる', () => {
      const gameState = new GameState('game_001');
      const state1 = gameState.フェイズを設定('フェイズA');
      const state2 = state1.フェイズを設定('フェイズB');
      const state3 = state2.フェイズを設定('フェイズC');

      expect(state1.現在フェイズ).toBe('フェイズA');
      expect(state2.現在フェイズ).toBe('フェイズB');
      expect(state3.現在フェイズ).toBe('フェイズC');
    });

    it('同じフェイズで更新した場合、同じインスタンスを返す', () => {
      const gameState = new GameState('game_001');
      const state1 = gameState.フェイズを設定('メイン');
      const state2 = state1.フェイズを設定('メイン');

      expect(state2).toBe(state1);
    });

    it('フェイズをnullに戻せる', () => {
      const gameState = new GameState('game_001');
      const state1 = gameState.フェイズを設定('フェイズA');
      const state2 = state1.フェイズを設定(null);

      expect(state2.現在フェイズ).toBeNull();
    });
  });

  // プレイヤー一覧設定テスト
  describe('プレイヤー一覧を設定', () => {
    it('プレイヤー一覧を保持できる', () => {
      const gameState = new GameState('game_001');
      const players = [
        { ID: 'p1', 名前: 'プレイヤー1' },
        { ID: 'p2', 名前: 'プレイヤー2' }
      ];
      const updated = gameState.プレイヤー一覧を設定(players);

      expect(updated.プレイヤー一覧).toHaveLength(2);
      expect(updated.プレイヤー一覧[0].ID).toBe('p1');
    });

    it('複数プレイヤーを管理できる', () => {
      const gameState = new GameState('game_001');
      const players = [
        { ID: 'p1', 名前: 'プレイヤー1' },
        { ID: 'p2', 名前: 'プレイヤー2' },
        { ID: 'p3', 名前: 'プレイヤー3' }
      ];
      const updated = gameState.プレイヤー一覧を設定(players);

      expect(updated.プレイヤー一覧).toHaveLength(3);
    });

    it('同じプレイヤーで更新した場合、同じインスタンスを返す', () => {
      const gameState = new GameState('game_001');
      const players = [
        { ID: 'p1', 名前: 'プレイヤー1' },
        { ID: 'p2', 名前: 'プレイヤー2' }
      ];
      const state1 = gameState.プレイヤー一覧を設定(players);
      const state2 = state1.プレイヤー一覧を設定(players);

      expect(state2).toBe(state1);
    });

    it('プレイヤー一覧を複数回更新できる', () => {
      const gameState = new GameState('game_001');
      const players1 = [{ ID: 'p1', 名前: 'プレイヤー1' }];
      const players2 = [
        { ID: 'p1', 名前: 'プレイヤー1' },
        { ID: 'p2', 名前: 'プレイヤー2' }
      ];

      const state1 = gameState.プレイヤー一覧を設定(players1);
      const state2 = state1.プレイヤー一覧を設定(players2);

      expect(state1.プレイヤー一覧).toHaveLength(1);
      expect(state2.プレイヤー一覧).toHaveLength(2);
    });

    it('プレイヤーIDが異なる場合は新インスタンスを返す', () => {
      const gameState = new GameState('game_001');
      const players1 = [{ ID: 'p1', 名前: 'プレイヤー1' }];
      const players2 = [{ ID: 'p2', 名前: 'プレイヤー2' }];

      const state1 = gameState.プレイヤー一覧を設定(players1);
      const state2 = state1.プレイヤー一覧を設定(players2);

      expect(state2).not.toBe(state1);
    });
  });

  // ゾーン一覧設定テスト
  describe('ゾーン一覧を設定', () => {
    it('ゾーン一覧を保持できる', () => {
      const gameState = new GameState('game_001');
      const zones = [
        { ID: 'zone1', 所有者ID: 'p1', 名前: 'デッキ' }
      ];
      const updated = gameState.ゾーン一覧を設定(zones);

      expect(updated.ゾーン一覧).toHaveLength(1);
      expect(updated.ゾーン一覧[0].ID).toBe('zone1');
    });

    it('複数ゾーンを管理できる', () => {
      const gameState = new GameState('game_001');
      const zones = [
        { ID: 'zone1', 所有者ID: 'p1', 名前: 'デッキ' },
        { ID: 'zone2', 所有者ID: 'p1', 名前: '手札' },
        { ID: 'zone3', 所有者ID: 'p1', 名前: 'フィールド' }
      ];
      const updated = gameState.ゾーン一覧を設定(zones);

      expect(updated.ゾーン一覧).toHaveLength(3);
    });

    it('同じゾーンで更新した場合、同じインスタンスを返す', () => {
      const gameState = new GameState('game_001');
      const zones = [{ ID: 'zone1', 所有者ID: 'p1', 名前: 'デッキ' }];
      const state1 = gameState.ゾーン一覧を設定(zones);
      const state2 = state1.ゾーン一覧を設定(zones);

      expect(state2).toBe(state1);
    });

    it('ゾーン一覧を複数回更新できる', () => {
      const gameState = new GameState('game_001');
      const zones1 = [{ ID: 'zone1', 所有者ID: 'p1', 名前: 'デッキ' }];
      const zones2 = [
        { ID: 'zone1', 所有者ID: 'p1', 名前: 'デッキ' },
        { ID: 'zone2', 所有者ID: 'p1', 名前: '手札' }
      ];

      const state1 = gameState.ゾーン一覧を設定(zones1);
      const state2 = state1.ゾーン一覧を設定(zones2);

      expect(state1.ゾーン一覧).toHaveLength(1);
      expect(state2.ゾーン一覧).toHaveLength(2);
    });

    it('ゾーンIDが異なる場合は新インスタンスを返す', () => {
      const gameState = new GameState('game_001');
      const zones1 = [{ ID: 'zone1', 所有者ID: 'p1', 名前: 'デッキ' }];
      const zones2 = [{ ID: 'zone2', 所有者ID: 'p1', 名前: 'デッキ' }];

      const state1 = gameState.ゾーン一覧を設定(zones1);
      const state2 = state1.ゾーン一覧を設定(zones2);

      expect(state2).not.toBe(state1);
    });
  });

  // ゲーム終了情報設定テスト
  describe('ゲーム終了情報を設定', () => {
    it('ゲーム終了情報を保持できる', () => {
      const gameState = new GameState('game_001');
      const endInfo = {
        終了理由: 'ライフ0',
        勝敗結果: {
          勝者ID: 'p1',
          敗者ID一覧: ['p2']
        },
        終了日時: 1000
      };
      const updated = gameState.ゲーム終了情報を設定(endInfo);

      expect(updated.終了情報).toEqual(endInfo);
    });

    it('進行状態が終了に変わる', () => {
      const gameState = new GameState('game_001');
      const endInfo = {
        終了理由: 'ライフ0',
        勝敗結果: {
          勝者ID: 'p1',
          敗者ID一覧: ['p2']
        },
        終了日時: 1000
      };
      const updated = gameState.ゲーム終了情報を設定(endInfo);

      expect(updated.進行状態).toBe('終了');
      expect(updated.は終了か()).toBe(true);
    });

    it('既に終了している場合は変更しない', () => {
      const gameState = new GameState('game_001');
      const endInfo1 = {
        終了理由: 'ライフ0',
        勝敗結果: {
          勝者ID: 'p1',
          敗者ID一覧: ['p2']
        },
        終了日時: 1000
      };
      const endInfo2 = {
        終了理由: 'サレンダー',
        勝敗結果: {
          勝者ID: 'p2',
          敗者ID一覧: ['p1']
        },
        終了日時: 2000
      };

      const state1 = gameState.ゲーム終了情報を設定(endInfo1);
      const state2 = state1.ゲーム終了情報を設定(endInfo2);

      expect(state2.終了情報).toEqual(endInfo1);
      expect(state2).toBe(state1);
    });

    it('複数敗者を記録できる', () => {
      const gameState = new GameState('game_001');
      const endInfo = {
        終了理由: '最後の1人',
        勝敗結果: {
          勝者ID: 'p1',
          敗者ID一覧: ['p2', 'p3', 'p4']
        },
        終了日時: 1000
      };
      const updated = gameState.ゲーム終了情報を設定(endInfo);

      expect(updated.終了情報?.勝敗結果.敗者ID一覧).toHaveLength(3);
    });

    it('引き分けを記録できる', () => {
      const gameState = new GameState('game_001');
      const endInfo = {
        終了理由: '同時败北',
        勝敗結果: {
          勝者ID: null,
          敗者ID一覧: ['p1', 'p2']
        },
        終了日時: 1000
      };
      const updated = gameState.ゲーム終了情報を設定(endInfo);

      expect(updated.終了情報?.勝敗結果.勝者ID).toBeNull();
    });
  });

  // イミュータブル設計テスト
  describe('イミュータブル設計', () => {
    it('状態変更後も元インスタンスは変わらない', () => {
      const gameState1 = new GameState('game_001');
      const gameState2 = gameState1.進行状態を変更('進行中');

      expect(gameState1.進行状態).toBe('開始前');
      expect(gameState2.進行状態).toBe('進行中');
    });

    it('ターン情報設定後も元インスタンスは変わらない', () => {
      const gameState1 = new GameState('game_001');
      const gameState2 = gameState1.ターン情報を設定(1, 'player_001');

      expect(gameState1.ターン情報).toBeNull();
      expect(gameState2.ターン情報).not.toBeNull();
    });

    it('フェイズ設定後も元インスタンスは変わらない', () => {
      const gameState1 = new GameState('game_001');
      const gameState2 = gameState1.フェイズを設定('メイン');

      expect(gameState1.現在フェイズ).toBeNull();
      expect(gameState2.現在フェイズ).toBe('メイン');
    });

    it('プレイヤー一覧設定後も元インスタンスは変わらない', () => {
      const gameState1 = new GameState('game_001');
      const players = [{ ID: 'p1', 名前: 'プレイヤー1' }];
      const gameState2 = gameState1.プレイヤー一覧を設定(players);

      expect(gameState1.プレイヤー一覧).toHaveLength(0);
      expect(gameState2.プレイヤー一覧).toHaveLength(1);
    });

    it('ゾーン一覧設定後も元インスタンスは変わらない', () => {
      const gameState1 = new GameState('game_001');
      const zones = [{ ID: 'zone1', 所有者ID: 'p1', 名前: 'デッキ' }];
      const gameState2 = gameState1.ゾーン一覧を設定(zones);

      expect(gameState1.ゾーン一覧).toHaveLength(0);
      expect(gameState2.ゾーン一覧).toHaveLength(1);
    });

    it('返されたプレイヤー一覧を変更しても元状態に影響しない', () => {
      const gameState = new GameState('game_001');
      const players = [{ ID: 'p1', 名前: 'プレイヤー1' }];
      const updated = gameState.プレイヤー一覧を設定(players);

      const playerList = updated.プレイヤー一覧 as any[];
      playerList.push({ ID: 'p2', 名前: 'プレイヤー2' });

      expect(updated.プレイヤー一覧).toHaveLength(1);
    });

    it('返されたゾーン一覧を変更しても元状態に影響しない', () => {
      const gameState = new GameState('game_001');
      const zones = [{ ID: 'zone1', 所有者ID: 'p1', 名前: 'デッキ' }];
      const updated = gameState.ゾーン一覧を設定(zones);

      const zoneList = updated.ゾーン一覧 as any[];
      zoneList.push({ ID: 'zone2', 所有者ID: 'p1', 名前: '手札' });

      expect(updated.ゾーン一覧).toHaveLength(1);
    });
  });

  // 複合シナリオテスト
  describe('複合シナリオ', () => {
    it('ゲーム初期化から開始までのフロー', () => {
      const gameState = new GameState('game_001');

      const state1 = gameState.進行状態を変更('進行中');
      const state2 = state1.プレイヤー一覧を設定([
        { ID: 'p1', 名前: 'プレイヤー1' },
        { ID: 'p2', 名前: 'プレイヤー2' }
      ]);
      const state3 = state2.ゾーン一覧を設定([
        { ID: 'z1', 所有者ID: 'p1', 名前: 'デッキ' },
        { ID: 'z2', 所有者ID: 'p2', 名前: 'デッキ' }
      ]);
      const state4 = state3.ターン情報を設定(1, 'p1');
      const state5 = state4.フェイズを設定('メインフェイズ');

      expect(state5.進行状態).toBe('進行中');
      expect(state5.プレイヤー一覧).toHaveLength(2);
      expect(state5.ゾーン一覧).toHaveLength(2);
      expect(state5.現在プレイヤーID).toBe('p1');
      expect(state5.現在フェイズ).toBe('メインフェイズ');
    });

    it('複数のターン進行', () => {
      const gameState = new GameState('game_001');
      const state1 = gameState.進行状態を変更('進行中');

      const state2 = state1.ターン情報を設定(1, 'p1');
      const state3 = state2.ターン情報を設定(1, 'p2');
      const state4 = state3.ターン情報を設定(2, 'p1');
      const state5 = state4.ターン情報を設定(2, 'p2');

      expect(state2.現在ターン番号).toBe(1);
      expect(state2.現在プレイヤーID).toBe('p1');
      expect(state3.現在プレイヤーID).toBe('p2');
      expect(state4.現在ターン番号).toBe(2);
      expect(state5.現在プレイヤーID).toBe('p2');
    });

    it('ゲーム終了までのフロー', () => {
      const gameState = new GameState('game_001');
      const state1 = gameState.進行状態を変更('進行中');
      const state2 = state1.ターン情報を設定(5, 'p1');

      const endInfo = {
        終了理由: 'ライフ0',
        勝敗結果: {
          勝者ID: 'p2',
          敗者ID一覧: ['p1']
        },
        終了日時: Date.now()
      };

      const state3 = state2.ゲーム終了情報を設定(endInfo);

      expect(state3.進行状態).toBe('終了');
      expect(state3.は終了か()).toBe(true);
      expect(state3.終了情報?.終了理由).toBe('ライフ0');
    });

    it('複数の状態変更が独立して機能する', () => {
      const gameState = new GameState('game_001');

      const branchA = gameState.進行状態を変更('進行中');
      const branchB = gameState.ターン情報を設定(1, 'p1');

      expect(branchA.進行状態).toBe('進行中');
      expect(branchA.ターン情報).toBeNull();

      expect(branchB.進行状態).toBe('開始前');
      expect(branchB.ターン情報).not.toBeNull();
    });
  });

  // ゲーム独立性テスト
  describe('ゲーム独立性', () => {
    it('複数のゲームIDで独立した状態を管理できる', () => {
      const game1 = new GameState('game_001');
      const game2 = new GameState('game_002');

      const state1 = game1.進行状態を変更('進行中');
      const state2 = game2.進行状態を変更('終了');

      expect(state1.ゲームID).toBe('game_001');
      expect(state2.ゲームID).toBe('game_002');
      expect(state1.進行状態).toBe('進行中');
      expect(state2.進行状態).toBe('終了');
    });

    it('異なるゲーム間の状態が相互に影響しない', () => {
      const game1 = new GameState('game_001');
      const game2 = new GameState('game_002');

      const state1 = game1.ターン情報を設定(1, 'p1');
      const state2 = game2.ターン情報を設定(5, 'p2');

      expect(game1.ターン情報).toBeNull();
      expect(game2.ターン情報).toBeNull();
      expect(state1.現在ターン番号).toBe(1);
      expect(state2.現在ターン番号).toBe(5);
    });
  });

  // 責務分離テスト
  describe('責務分離', () => {
    it('状態保持のみで状態変更処理を含まない', () => {
      const gameState = new GameState('game_001');

      // 存在するべきメソッドの確認
      expect(gameState.進行状態を変更).toBeDefined();
      expect(gameState.ターン情報を設定).toBeDefined();
      expect(gameState.フェイズを設定).toBeDefined();

      // 存在しないべきメソッド確認（状態変更ロジック）
      expect((gameState as any).ターンを開始).toBeUndefined();
      expect((gameState as any).フェイズを移動).toBeUndefined();
      expect((gameState as any).ターンを終了).toBeUndefined();
    });

    it('ゲームルールに特定の用語が含まれていない', () => {
      const gameState = new GameState('game_001');

      // ゲーム固有メソッドが存在しないことを確認
      expect((gameState as any).カードを使用).toBeUndefined();
      expect((gameState as any).攻撃).toBeUndefined();
      expect((gameState as any).効果を発動).toBeUndefined();
    });

    it('型定義がゲーム中立的', () => {
      const gameState = new GameState('game_001');

      // フェイズは任意文字列で保持
      const state1 = gameState.フェイズを設定('任意のフェイズ1');
      const state2 = state1.フェイズを設定('別のゲームのフェイズ');
      const state3 = state2.フェイズを設定('日本語でない文字列');

      expect(state1.現在フェイズ).toBe('任意のフェイズ1');
      expect(state2.現在フェイズ).toBe('別のゲームのフェイズ');
      expect(state3.現在フェイズ).toBe('日本語でない文字列');
    });
  });
});
