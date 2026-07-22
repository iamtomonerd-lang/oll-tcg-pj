/**
 * 行動管理 テスト
 *
 * プレイヤー操作としての行動管理システムのテスト
 *
 * テスト方針：
 * - 行動作成・登録
 * - 行動状態管理
 * - 行動可能性チェック
 * - 複数行動の独立管理
 * - イミュータブル設計
 * - 責務分離
 */

import { 行動管理, 行動情報, 行動状態 } from '../../../src/ゲーム/foundation/行動管理';

describe('行動管理', () => {
  // 初期化テスト
  describe('初期化', () => {
    it('ゲームIDで初期化される', () => {
      const 管理 = new 行動管理('game_001');
      expect(管理.ゲームID).toBe('game_001');
    });

    it('初期状態では行動履歴が空である', () => {
      const 管理 = new 行動管理('game_001');
      expect(管理.行動履歴).toHaveLength(0);
    });

    it('初期状態では行動数が0である', () => {
      const 管理 = new 行動管理('game_001');
      expect(管理.行動数).toBe(0);
    });

    it('初期状態では最後の行動がない', () => {
      const 管理 = new 行動管理('game_001');
      expect(管理.最後の行動).toBeUndefined();
    });
  });

  // 行動作成テスト
  describe('行動を作成', () => {
    it('行動を作成できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動] = 管理.行動を作成('play_card', 'player_001');

      expect(行動).toBeDefined();
      expect(行動.行動ID).toBeDefined();
    });

    it('行動IDを生成する', () => {
      let 管理 = new 行動管理('game_001');
      const [行動1, 管理1] = 管理.行動を作成('play_card', 'player_001');
      const [行動2] = 管理1.行動を作成('attack', 'player_001');

      expect(行動1.行動ID).not.toEqual(行動2.行動ID);
    });

    it('行動IDがゲームIDを含む', () => {
      let 管理 = new 行動管理('game_001');
      const [行動] = 管理.行動を作成('play_card', 'player_001');

      expect(行動.行動ID).toContain('game_001');
    });

    it('行動種類を保持する', () => {
      let 管理 = new 行動管理('game_001');
      const [行動] = 管理.行動を作成('play_card', 'player_001');

      expect(行動.行動種類).toBe('play_card');
    });

    it('実行者IDを保持する', () => {
      let 管理 = new 行動管理('game_001');
      const [行動] = 管理.行動を作成('play_card', 'player_001');

      expect(行動.実行者ID).toBe('player_001');
    });

    it('対象情報を保持できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動] = 管理.行動を作成('play_card', 'player_001', { カードID: 'card_001' });

      expect(行動.対象情報).toEqual({ カードID: 'card_001' });
    });

    it('パラメータを保持できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動] = 管理.行動を作成('attack', 'player_001', undefined, { 対象: 'player_002' });

      expect(行動.パラメータ).toEqual({ 対象: 'player_002' });
    });

    it('初期状態は未実行である', () => {
      let 管理 = new 行動管理('game_001');
      const [行動] = 管理.行動を作成('play_card', 'player_001');

      expect(行動.状態).toBe('未実行');
    });

    it('作成日時を記録する', () => {
      let 管理 = new 行動管理('game_001');
      const 前 = Date.now();
      const [行動] = 管理.行動を作成('play_card', 'player_001');
      const 後 = Date.now();

      expect(行動.作成日時).toBeGreaterThanOrEqual(前);
      expect(行動.作成日時).toBeLessThanOrEqual(後);
    });
  });

  // 行動登録テスト
  describe('行動を登録', () => {
    it('行動を登録できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001');

      管理 = 管理1.行動を登録(行動);

      expect(管理.行動数).toBe(1);
    });

    it('複数行動を登録できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動1, 管理1] = 管理.行動を作成('play_card', 'player_001');
      const [行動2, 管理2] = 管理1.行動を作成('attack', 'player_001');
      const [行動3, 管理3] = 管理2.行動を作成('pass', 'player_001');

      管理 = 管理3.行動を登録(行動1);
      管理 = 管理.行動を登録(行動2);
      管理 = 管理.行動を登録(行動3);

      expect(管理.行動数).toBe(3);
    });

    it('行動の順番が保持される', () => {
      let 管理 = new 行動管理('game_001');
      const [行動1, 管理1] = 管理.行動を作成('play_card', 'player_001');
      const [行動2, 管理2] = 管理1.行動を作成('attack', 'player_001');

      管理 = 管理2.行動を登録(行動1);
      管理 = 管理.行動を登録(行動2);

      expect(管理.行動履歴[0].行動種類).toBe('play_card');
      expect(管理.行動履歴[1].行動種類).toBe('attack');
    });

    it('最後の行動を取得できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動1, 管理1] = 管理.行動を作成('play_card', 'player_001');
      const [行動2, 管理2] = 管理1.行動を作成('attack', 'player_001');

      管理 = 管理2.行動を登録(行動1);
      管理 = 管理.行動を登録(行動2);

      expect(管理.最後の行動?.行動種類).toBe('attack');
    });
  });

  // 行動状態変更テスト
  describe('行動の状態を更新', () => {
    it('状態を成功に変更できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001');

      管理 = 管理1.行動を登録(行動);
      管理 = 管理.行動の状態を更新(行動.行動ID, '成功');

      const 更新行動 = 管理.行動を取得(行動.行動ID);
      expect(更新行動?.状態).toBe('成功');
    });

    it('状態を失敗に変更できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001');

      管理 = 管理1.行動を登録(行動);
      管理 = 管理.行動の状態を更新(行動.行動ID, '失敗');

      const 更新行動 = 管理.行動を取得(行動.行動ID);
      expect(更新行動?.状態).toBe('失敗');
    });

    it('状態をキャンセルに変更できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001');

      管理 = 管理1.行動を登録(行動);
      管理 = 管理.行動の状態を更新(行動.行動ID, 'キャンセル');

      const 更新行動 = 管理.行動を取得(行動.行動ID);
      expect(更新行動?.状態).toBe('キャンセル');
    });

    it('状態を実行中に変更できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001');

      管理 = 管理1.行動を登録(行動);
      管理 = 管理.行動の状態を更新(行動.行動ID, '実行中');

      const 更新行動 = 管理.行動を取得(行動.行動ID);
      expect(更新行動?.状態).toBe('実行中');
    });

    it('同じ状態に変更した場合、同じインスタンスを返す', () => {
      let 管理1 = new 行動管理('game_001');
      const [行動, 管理1a] = 管理1.行動を作成('play_card', 'player_001');

      管理1 = 管理1a.行動を登録(行動);
      const 管理2 = 管理1.行動の状態を更新(行動.行動ID, '未実行');

      expect(管理2).toBe(管理1);
    });

    it('登録されていない行動は例外を発生させる', () => {
      const 管理 = new 行動管理('game_001');

      expect(() => {
        管理.行動の状態を更新('存在しない行動', '成功');
      }).toThrow('行動「存在しない行動」は登録されていません');
    });

    it('状態遷移が複数回できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001');

      管理 = 管理1.行動を登録(行動);
      管理 = 管理.行動の状態を更新(行動.行動ID, '実行中');
      管理 = 管理.行動の状態を更新(行動.行動ID, '成功');

      const 最終行動 = 管理.行動を取得(行動.行動ID);
      expect(最終行動?.状態).toBe('成功');
    });
  });

  // 行動可能確認テスト
  describe('行動が可能か', () => {
    it('確認関数がない場合、常に可能である', () => {
      let 管理 = new 行動管理('game_001');
      const [行動] = 管理.行動を作成('play_card', 'player_001');

      const 結果 = 管理.行動が可能か(行動);
      expect(結果.可能).toBe(true);
    });

    it('確認関数で可能と判定できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001');

      const 確認 = (a: 行動情報) => ({ 可能: true });
      管理 = 管理1.行動可能確認を設定(確認);

      const 結果 = 管理.行動が可能か(行動);
      expect(結果.可能).toBe(true);
    });

    it('確認関数で不可と判定できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001');

      const 確認 = (a: 行動情報) => ({ 可能: false, 理由: 'メインフェイズではありません' });
      管理 = 管理1.行動可能確認を設定(確認);

      const 結果 = 管理.行動が可能か(行動);
      expect(結果.可能).toBe(false);
      expect(結果.理由).toBe('メインフェイズではありません');
    });

    it('確認関数が行動内容に基づいて判定できる', () => {
      let 管理 = new 行動管理('game_001');

      const 確認 = (a: 行動情報) => {
        if (a.行動種類 === 'play_card') {
          return { 可能: true };
        }
        return { 可能: false, 理由: '無効な行動' };
      };

      管理 = 管理.行動可能確認を設定(確認);

      const [カード行動, 管理1] = 管理.行動を作成('play_card', 'player_001');
      const [攻撃行動] = 管理1.行動を作成('attack', 'player_001');

      expect(管理.行動が可能か(カード行動).可能).toBe(true);
      expect(管理.行動が可能か(攻撃行動).可能).toBe(false);
    });
  });

  // 行動実行テスト
  describe('行動を実行', () => {
    it('行動を実行できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001');

      const [更新後, 結果] = 管理1.行動を実行(行動);

      expect(結果.実行可能).toBe(true);
    });

    it('実行できない行動は失敗状態になる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001');

      const 確認 = (a: 行動情報) => ({ 可能: false, 理由: 'テスト失敗' });
      管理 = 管理1.行動可能確認を設定(確認);

      const [更新後, 結果] = 管理.行動を実行(行動);

      expect(結果.実行可能).toBe(false);
      expect(結果.理由).toBe('テスト失敗');

      const 実行後の行動 = 更新後.行動を取得(行動.行動ID);
      expect(実行後の行動?.状態).toBe('失敗');
    });

    it('実行可能な行動は実行中状態になる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001');

      const [更新後, 結果] = 管理1.行動を実行(行動);

      const 実行後の行動 = 更新後.行動を取得(行動.行動ID);
      expect(実行後の行動?.状態).toBe('実行中');
    });

    it('未登録の行動を実行すると登録される', () => {
      let 管理 = new 行動管理('game_001');
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001');

      expect(管理1.行動数).toBe(0);

      const [更新後] = 管理1.行動を実行(行動);

      expect(更新後.行動数).toBe(1);
    });

    it('複数の行動を実行できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動1, 管理1] = 管理.行動を作成('play_card', 'player_001');
      const [行動2, 管理2] = 管理1.行動を作成('attack', 'player_001');

      let [更新後] = 管理2.行動を実行(行動1);
      [更新後] = 更新後.行動を実行(行動2);

      expect(更新後.行動数).toBe(2);
    });
  });

  // 行動完了テスト
  describe('行動を成功で完了', () => {
    it('行動を成功で完了できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001');

      管理 = 管理1.行動を登録(行動);
      管理 = 管理.行動を成功で完了(行動.行動ID);

      const 最終行動 = 管理.行動を取得(行動.行動ID);
      expect(最終行動?.状態).toBe('成功');
    });
  });

  describe('行動を失敗で完了', () => {
    it('行動を失敗で完了できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001');

      管理 = 管理1.行動を登録(行動);
      管理 = 管理.行動を失敗で完了(行動.行動ID);

      const 最終行動 = 管理.行動を取得(行動.行動ID);
      expect(最終行動?.状態).toBe('失敗');
    });
  });

  describe('行動をキャンセル', () => {
    it('行動をキャンセルできる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001');

      管理 = 管理1.行動を登録(行動);
      管理 = 管理.行動をキャンセル(行動.行動ID);

      const 最終行動 = 管理.行動を取得(行動.行動ID);
      expect(最終行動?.状態).toBe('キャンセル');
    });
  });

  // 行動取得テスト
  describe('行動を取得', () => {
    it('登録された行動を取得できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001');

      管理 = 管理1.行動を登録(行動);
      const 取得行動 = 管理.行動を取得(行動.行動ID);

      expect(取得行動?.行動種類).toBe('play_card');
    });

    it('登録されていない行動はundefineである', () => {
      const 管理 = new 行動管理('game_001');
      const 取得行動 = 管理.行動を取得('存在しない行動');

      expect(取得行動).toBeUndefined();
    });

    it('状態で行動をフィルタリングできる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動1, 管理1] = 管理.行動を作成('play_card', 'player_001');
      const [行動2, 管理2] = 管理1.行動を作成('attack', 'player_001');
      const [行動3, 管理3] = 管理2.行動を作成('pass', 'player_001');

      管理 = 管理3.行動を登録(行動1);
      管理 = 管理.行動を登録(行動2);
      管理 = 管理.行動を登録(行動3);

      管理 = 管理.行動の状態を更新(行動1.行動ID, '成功');
      管理 = 管理.行動の状態を更新(行動2.行動ID, '成功');

      const 成功行動 = 管理.状態で行動を取得('成功');
      expect(成功行動).toHaveLength(2);

      const 未実行行動 = 管理.状態で行動を取得('未実行');
      expect(未実行行動).toHaveLength(1);
    });

    it('実行者でフィルタリングできる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動1, 管理1] = 管理.行動を作成('play_card', 'player_001');
      const [行動2, 管理2] = 管理1.行動を作成('attack', 'player_002');
      const [行動3, 管理3] = 管理2.行動を作成('pass', 'player_001');

      管理 = 管理3.行動を登録(行動1);
      管理 = 管理.行動を登録(行動2);
      管理 = 管理.行動を登録(行動3);

      const player001行動 = 管理.実行者で行動を取得('player_001');
      expect(player001行動).toHaveLength(2);

      const player002行動 = 管理.実行者で行動を取得('player_002');
      expect(player002行動).toHaveLength(1);
    });

    it('種類でフィルタリングできる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動1, 管理1] = 管理.行動を作成('play_card', 'player_001');
      const [行動2, 管理2] = 管理1.行動を作成('attack', 'player_001');
      const [行動3, 管理3] = 管理2.行動を作成('play_card', 'player_001');

      管理 = 管理3.行動を登録(行動1);
      管理 = 管理.行動を登録(行動2);
      管理 = 管理.行動を登録(行動3);

      const カード使用 = 管理.種類で行動を取得('play_card');
      expect(カード使用).toHaveLength(2);

      const 攻撃 = 管理.種類で行動を取得('attack');
      expect(攻撃).toHaveLength(1);
    });
  });

  // イミュータブル設計テスト
  describe('イミュータブル設計', () => {
    it('行動登録後も元インスタンスは変わらない', () => {
      const 管理1 = new 行動管理('game_001');
      const [行動, 管理1a] = 管理1.行動を作成('play_card', 'player_001');

      const 管理2 = 管理1a.行動を登録(行動);

      expect(管理1.行動数).toBe(0);
      expect(管理2.行動数).toBe(1);
    });

    it('状態変更後も元インスタンスは変わらない', () => {
      let 管理1 = new 行動管理('game_001');
      const [行動, 管理1a] = 管理1.行動を作成('play_card', 'player_001');

      管理1 = 管理1a.行動を登録(行動);
      const 管理2 = 管理1.行動の状態を更新(行動.行動ID, '成功');

      const 行動1 = 管理1.行動を取得(行動.行動ID);
      const 行動2 = 管理2.行動を取得(行動.行動ID);

      expect(行動1?.状態).toBe('未実行');
      expect(行動2?.状態).toBe('成功');
    });

    it('確認関数設定後も元インスタンスは変わらない', () => {
      const 管理1 = new 行動管理('game_001');
      const 確認 = (a: 行動情報) => ({ 可能: true });

      const 管理2 = 管理1.行動可能確認を設定(確認);

      const [行動, _] = 管理1.行動を作成('play_card', 'player_001');
      const 結果1 = 管理1.行動が可能か(行動);
      const 結果2 = 管理2.行動が可能か(行動);

      // 確認関数が設定されていないため常に可能
      expect(結果1.可能).toBe(true);
      // 確認関数が設定されているため確認関数の結果を返す
      expect(結果2.可能).toBe(true);
    });
  });

  // 複合シナリオテスト
  describe('複合シナリオ', () => {
    it('完全な行動フロー', () => {
      let 管理 = new 行動管理('game_001');

      // 確認関数を設定
      const 確認 = (a: 行動情報) => {
        if (a.行動種類 === 'play_card') {
          return { 可能: true };
        }
        return { 可能: false, 理由: '無効な行動' };
      };
      管理 = 管理.行動可能確認を設定(確認);

      // 行動を作成
      const [行動, 管理1] = 管理.行動を作成('play_card', 'player_001', { カードID: 'card_001' });

      // 行動を実行
      let [更新後, 結果] = 管理1.行動を実行(行動);
      expect(結果.実行可能).toBe(true);

      // 行動を完了
      更新後 = 更新後.行動を成功で完了(行動.行動ID);

      // 行動を確認
      const 最終行動 = 更新後.行動を取得(行動.行動ID);
      expect(最終行動?.状態).toBe('成功');
    });

    it('複数プレイヤーの行動管理', () => {
      let 管理 = new 行動管理('game_001');

      const [p1行動1, 管理1] = 管理.行動を作成('play_card', 'player_001');
      const [p1行動2, 管理2] = 管理1.行動を作成('attack', 'player_001');
      const [p2行動1, 管理3] = 管理2.行動を作成('play_card', 'player_002');
      const [p2行動2, 管理4] = 管理3.行動を作成('pass', 'player_002');

      管理 = 管理4.行動を登録(p1行動1);
      管理 = 管理.行動を登録(p1行動2);
      管理 = 管理.行動を登録(p2行動1);
      管理 = 管理.行動を登録(p2行動2);

      管理 = 管理.行動の状態を更新(p1行動1.行動ID, '成功');
      管理 = 管理.行動の状態を更新(p1行動2.行動ID, '失敗');

      const p1行動 = 管理.実行者で行動を取得('player_001');
      expect(p1行動).toHaveLength(2);

      const p2行動 = 管理.実行者で行動を取得('player_002');
      expect(p2行動).toHaveLength(2);
    });

    it('10行動の完全なシーケンス', () => {
      let 管理 = new 行動管理('game_001');

      for (let i = 0; i < 10; i++) {
        const 行動種類 = i % 3 === 0 ? 'play_card' : i % 3 === 1 ? 'attack' : 'pass';
        const プレイヤー = i % 2 === 0 ? 'player_001' : 'player_002';
        const [行動, 管理1] = 管理.行動を作成(行動種類, プレイヤー);

        let [更新後] = 管理1.行動を実行(行動);
        if (i % 4 === 0) {
          更新後 = 更新後.行動を成功で完了(行動.行動ID);
        } else if (i % 4 === 1) {
          更新後 = 更新後.行動を失敗で完了(行動.行動ID);
        } else if (i % 4 === 2) {
          更新後 = 更新後.行動をキャンセル(行動.行動ID);
        }

        管理 = 更新後;
      }

      expect(管理.行動数).toBe(10);
    });
  });

  // 責務分離テスト
  describe('責務分離', () => {
    it('カード効果処理メソッドがない', () => {
      const 管理 = new 行動管理('game_001');
      expect((管理 as any).効果を発動).toBeUndefined();
      expect((管理 as any).カード効果を処理).toBeUndefined();
    });

    it('ダメージ計算メソッドがない', () => {
      const 管理 = new 行動管理('game_001');
      expect((管理 as any).ダメージを計算).toBeUndefined();
      expect((管理 as any).ダメージを与える).toBeUndefined();
    });

    it('コスト処理メソッドがない', () => {
      const 管理 = new 行動管理('game_001');
      expect((管理 as any).コストを消費).toBeUndefined();
      expect((管理 as any).コストを回復).toBeUndefined();
    });

    it('勝利判定メソッドがない', () => {
      const 管理 = new 行動管理('game_001');
      expect((管理 as any).勝者を判定).toBeUndefined();
      expect((管理 as any).ゲームを終了).toBeUndefined();
    });

    it('ターン進行メソッドがない', () => {
      const 管理 = new 行動管理('game_001');
      expect((管理 as any).ターンを進める).toBeUndefined();
      expect((管理 as any).ターンを終了).toBeUndefined();
    });

    it('フェイズ進行メソッドがない', () => {
      const 管理 = new 行動管理('game_001');
      expect((管理 as any).フェイズを移動).toBeUndefined();
      expect((管理 as any).フェイズを進める).toBeUndefined();
    });
  });

  // リセットテスト
  describe('リセット', () => {
    it('すべての行動をクリアできる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動1, 管理1] = 管理.行動を作成('play_card', 'player_001');
      const [行動2, 管理2] = 管理1.行動を作成('attack', 'player_001');

      管理 = 管理2.行動を登録(行動1);
      管理 = 管理.行動を登録(行動2);
      expect(管理.行動数).toBe(2);

      管理 = 管理.リセット();
      expect(管理.行動数).toBe(0);
    });

    it('リセット後、新しい行動を登録できる', () => {
      let 管理 = new 行動管理('game_001');
      const [行動1, 管理1] = 管理.行動を作成('play_card', 'player_001');

      管理 = 管理1.行動を登録(行動1);
      管理 = 管理.リセット();

      const [行動2, 管理2] = 管理.行動を作成('attack', 'player_001');
      管理 = 管理2.行動を登録(行動2);

      expect(管理.行動数).toBe(1);
    });
  });
});
