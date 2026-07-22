/**
 * 汎用パーツ：プレイヤー管理 - テスト
 *
 * テスト対象：
 * - プレイヤー作成・管理
 * - ID・名前・状態管理
 * - パーツ追加・取得・削除
 * - 変更履歴管理
 * - イミュータビリティ
 * - ゲーム固有概念の不在確認
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  プレイヤーを作成,
  は有効か,
  は無効か,
  パーツを保持しているか,
  保持パーツ数を取得,
  プレイヤー管理
} from '../../src/汎用パーツ/プレイヤー管理/index';

describe('プレイヤー管理 - ユーティリティ関数', () => {
  describe('プレイヤーを作成', () => {
    it('IDと名前でプレイヤーを作成', () => {
      const プレイヤー = プレイヤーを作成('player_001', 'Player One');
      expect(プレイヤー.ID).toBe('player_001');
      expect(プレイヤー.名前).toBe('Player One');
      expect(プレイヤー.状態).toBe('有効');
    });

    it('状態を指定できる', () => {
      const プレイヤー = プレイヤーを作成('player_001', 'Player One', '無効');
      expect(プレイヤー.状態).toBe('無効');
    });

    it('パーツキー一覧は初期状態で空', () => {
      const プレイヤー = プレイヤーを作成('player_001', 'Player One');
      expect(プレイヤー.パーツキー一覧).toEqual([]);
    });
  });

  describe('は有効か', () => {
    it('有効なプレイヤーではtrueを返す', () => {
      const プレイヤー = プレイヤーを作成('p1', 'Player', '有効');
      expect(は有効か(プレイヤー)).toBe(true);
    });

    it('無効なプレイヤーではfalseを返す', () => {
      const プレイヤー = プレイヤーを作成('p1', 'Player', '無効');
      expect(は有効か(プレイヤー)).toBe(false);
    });
  });

  describe('は無効か', () => {
    it('無効なプレイヤーではtrueを返す', () => {
      const プレイヤー = プレイヤーを作成('p1', 'Player', '無効');
      expect(は無効か(プレイヤー)).toBe(true);
    });

    it('有効なプレイヤーではfalseを返す', () => {
      const プレイヤー = プレイヤーを作成('p1', 'Player', '有効');
      expect(は無効か(プレイヤー)).toBe(false);
    });
  });

  describe('パーツを保持しているか', () => {
    it('パーツなしではfalseを返す', () => {
      const プレイヤー = プレイヤーを作成('p1', 'Player');
      expect(パーツを保持しているか(プレイヤー, 'part_001')).toBe(false);
    });

    it('パーツありではtrueを返す', () => {
      const プレイヤー = プレイヤーを作成('p1', 'Player');
      const withParts = { ...プレイヤー, パーツキー一覧: ['part_001'] };
      expect(パーツを保持しているか(withParts, 'part_001')).toBe(true);
    });
  });

  describe('保持パーツ数を取得', () => {
    it('パーツ数を返す', () => {
      const プレイヤー = プレイヤーを作成('p1', 'Player');
      expect(保持パーツ数を取得(プレイヤー)).toBe(0);

      const withParts = { ...プレイヤー, パーツキー一覧: ['p1', 'p2'] };
      expect(保持パーツ数を取得(withParts)).toBe(2);
    });
  });
});

describe('プレイヤー管理 - 管理クラス', () => {
  let 管理: プレイヤー管理;

  beforeEach(() => {
    管理 = new プレイヤー管理('player_001', 'Player One');
  });

  describe('作成・初期化', () => {
    it('IDと名前で作成できる', () => {
      expect(管理.IDを取得()).toBe('player_001');
      expect(管理.名前を取得()).toBe('Player One');
    });

    it('状態は初期状態で有効', () => {
      expect(管理.状態を取得()).toBe('有効');
    });

    it('初期状態で無効に作成できる', () => {
      const 無効 = new プレイヤー管理('p1', 'Player', '無効');
      expect(無効.状態を取得()).toBe('無効');
    });

    it('パーツキー一覧は初期状態で空', () => {
      expect(管理.パーツキー一覧を取得()).toEqual([]);
    });

    it('保持パーツ数は0', () => {
      expect(管理.保持パーツ数を取得()).toBe(0);
    });
  });

  describe('取得操作', () => {
    it('プレイヤー全体を取得できる', () => {
      const プレイヤー = 管理.取得();
      expect(プレイヤー.ID).toBe('player_001');
      expect(プレイヤー.名前).toBe('Player One');
      expect(プレイヤー.状態).toBe('有効');
    });

    it('IDを取得できる', () => {
      expect(管理.IDを取得()).toBe('player_001');
    });

    it('名前を取得できる', () => {
      expect(管理.名前を取得()).toBe('Player One');
    });

    it('状態を取得できる', () => {
      expect(管理.状態を取得()).toBe('有効');
    });

    it('パーツキー一覧を取得できる', () => {
      const キー一覧 = 管理.パーツキー一覧を取得();
      expect(Array.isArray(キー一覧)).toBe(true);
      expect(キー一覧.length).toBe(0);
    });
  });

  describe('イミュータビリティ', () => {
    it('名前の変更は新しい管理インスタンスを返す', () => {
      const 新管理 = 管理.名前を変更('Player Two');
      expect(管理).not.toBe(新管理);
      expect(管理.名前を取得()).toBe('Player One');
      expect(新管理.名前を取得()).toBe('Player Two');
    });

    it('状態の変更は新しい管理インスタンスを返す', () => {
      const 新管理 = 管理.状態を変更('無効');
      expect(管理).not.toBe(新管理);
      expect(管理.状態を取得()).toBe('有効');
      expect(新管理.状態を取得()).toBe('無効');
    });

    it('パーツ追加は新しい管理インスタンスを返す', () => {
      const 新管理 = 管理.パーツを追加('part_001', { value: 100 });
      expect(管理).not.toBe(新管理);
      expect(管理.保持パーツ数を取得()).toBe(0);
      expect(新管理.保持パーツ数を取得()).toBe(1);
    });
  });

  describe('名前操作', () => {
    it('名前を変更できる', () => {
      const 新管理 = 管理.名前を変更('New Name');
      expect(新管理.名前を取得()).toBe('New Name');
    });

    it('同じ名前に変更すると元のインスタンスを返す', () => {
      const 新管理 = 管理.名前を変更('Player One');
      expect(新管理).toBe(管理);
    });

    it('複数回の名前変更ができる', () => {
      const m1 = 管理.名前を変更('Name Two');
      const m2 = m1.名前を変更('Name Three');
      expect(m2.名前を取得()).toBe('Name Three');
    });
  });

  describe('状態操作', () => {
    it('状態を有効に変更できる', () => {
      const 無効 = 管理.状態を変更('無効');
      const 有効 = 無効.状態を変更('有効');
      expect(有効.状態を取得()).toBe('有効');
    });

    it('状態を無効に変更できる', () => {
      const 新管理 = 管理.状態を変更('無効');
      expect(新管理.状態を取得()).toBe('無効');
    });

    it('同じ状態に変更すると元のインスタンスを返す', () => {
      const 新管理 = 管理.状態を変更('有効');
      expect(新管理).toBe(管理);
    });
  });

  describe('パーツ追加', () => {
    it('パーツを追加できる', () => {
      const 新管理 = 管理.パーツを追加('part_001', { hp: 100 });
      expect(新管理.パーツを保持しているか('part_001')).toBe(true);
    });

    it('複数のパーツを追加できる', () => {
      const m1 = 管理.パーツを追加('part_001', { value: 1 });
      const m2 = m1.パーツを追加('part_002', { value: 2 });
      const m3 = m2.パーツを追加('part_003', { value: 3 });

      expect(m3.保持パーツ数を取得()).toBe(3);
      expect(m3.パーツキー一覧を取得()).toEqual(['part_001', 'part_002', 'part_003']);
    });

    it('パーツキー一覧に反映される', () => {
      const 新管理 = 管理.パーツを追加('resource_001', {});
      const キー一覧 = 新管理.パーツキー一覧を取得();
      expect(キー一覧).toContain('resource_001');
    });

    it('既に存在するパーツは追加されない', () => {
      const m1 = 管理.パーツを追加('part_001', { v: 1 });
      const m2 = m1.パーツを追加('part_001', { v: 2 });

      expect(m2).toBe(m1);
      expect(m2.保持パーツ数を取得()).toBe(1);
    });
  });

  describe('パーツ取得', () => {
    it('追加したパーツを取得できる', () => {
      const パーツ = { hp: 100, mp: 50 };
      const 新管理 = 管理.パーツを追加('part_001', パーツ);

      const 取得 = 新管理.パーツを取得('part_001');
      expect(取得).toEqual(パーツ);
    });

    it('存在しないパーツはundefinedを返す', () => {
      expect(管理.パーツを取得('non_existent')).toBeUndefined();
    });

    it('複数のパーツから特定のものを取得', () => {
      const m1 = 管理.パーツを追加('part_A', { name: 'A' });
      const m2 = m1.パーツを追加('part_B', { name: 'B' });
      const m3 = m2.パーツを追加('part_C', { name: 'C' });

      expect(m3.パーツを取得('part_B')).toEqual({ name: 'B' });
    });
  });

  describe('パーツ保持確認', () => {
    it('パーツを保持しているかを確認', () => {
      const 新管理 = 管理.パーツを追加('part_001', {});
      expect(新管理.パーツを保持しているか('part_001')).toBe(true);
    });

    it('保持していないパーツではfalseを返す', () => {
      const 新管理 = 管理.パーツを追加('part_001', {});
      expect(新管理.パーツを保持しているか('part_002')).toBe(false);
    });
  });

  describe('パーツ削除', () => {
    it('パーツを削除できる', () => {
      const m1 = 管理.パーツを追加('part_001', {});
      const m2 = m1.パーツを削除('part_001');

      expect(m2.パーツを保持しているか('part_001')).toBe(false);
      expect(m2.保持パーツ数を取得()).toBe(0);
    });

    it('複数のパーツから1つを削除', () => {
      const m1 = 管理.パーツを追加('p1', {}).パーツを追加('p2', {}).パーツを追加('p3', {});
      const m2 = m1.パーツを削除('p2');

      expect(m2.保持パーツ数を取得()).toBe(2);
      expect(m2.パーツを保持しているか('p2')).toBe(false);
      expect(m2.パーツを保持しているか('p1')).toBe(true);
      expect(m2.パーツを保持しているか('p3')).toBe(true);
    });

    it('存在しないパーツを削除すると元のインスタンスを返す', () => {
      const 新管理 = 管理.パーツを削除('non_existent');
      expect(新管理).toBe(管理);
    });

    it('パーツキー一覧から削除されたキーが消える', () => {
      const m1 = 管理.パーツを追加('p1', {}).パーツを追加('p2', {});
      const m2 = m1.パーツを削除('p1');

      expect(m2.パーツキー一覧を取得()).toEqual(['p2']);
    });
  });

  describe('パーツすべて削除', () => {
    it('すべてのパーツを削除できる', () => {
      const m1 = 管理.パーツを追加('p1', {}).パーツを追加('p2', {}).パーツを追加('p3', {});
      const m2 = m1.パーツをすべて削除();

      expect(m2.保持パーツ数を取得()).toBe(0);
      expect(m2.パーツキー一覧を取得()).toEqual([]);
    });

    it('パーツなしですべて削除すると元のインスタンスを返す', () => {
      const 新管理 = 管理.パーツをすべて削除();
      expect(新管理).toBe(管理);
    });
  });

  describe('履歴管理 - 名前変更', () => {
    it('名前変更が履歴に記録される', () => {
      const 新管理 = 管理.名前を変更('New Name');
      expect(新管理.履歴のサイズ()).toBe(1);
    });

    it('履歴から変更前後の値を取得できる', () => {
      const 新管理 = 管理.名前を変更('New Name');
      const 履歴 = 新管理.履歴を取得();

      expect(履歴[0].変更種類).toBe('名前変更');
      expect(履歴[0].変更前.名前).toBe('Player One');
      expect(履歴[0].変更後.名前).toBe('New Name');
    });

    it('履歴に詳細情報が含まれる', () => {
      const 新管理 = 管理.名前を変更('New Name');
      const 履歴 = 新管理.履歴を取得();

      expect(履歴[0].詳細).toEqual({
        旧名前: 'Player One',
        新名前: 'New Name'
      });
    });

    it('変更日時が記録される', () => {
      const 新管理 = 管理.名前を変更('New Name');
      const 履歴 = 新管理.履歴を取得();

      expect(履歴[0].変更日時).toBeGreaterThan(0);
      expect(typeof 履歴[0].変更日時).toBe('number');
    });
  });

  describe('履歴管理 - 状態変更', () => {
    it('状態変更が履歴に記録される', () => {
      const 新管理 = 管理.状態を変更('無効');
      expect(新管理.履歴のサイズ()).toBe(1);
    });

    it('状態変更履歴の詳細情報', () => {
      const 新管理 = 管理.状態を変更('無効');
      const 履歴 = 新管理.履歴を取得();

      expect(履歴[0].変更種類).toBe('状態変更');
      expect(履歴[0].詳細).toEqual({
        旧状態: '有効',
        新状態: '無効'
      });
    });
  });

  describe('履歴管理 - パーツ操作', () => {
    it('パーツ追加が履歴に記録される', () => {
      const 新管理 = 管理.パーツを追加('part_001', {});
      expect(新管理.履歴のサイズ()).toBe(1);
      expect(新管理.履歴を取得()[0].変更種類).toBe('パーツ追加');
    });

    it('パーツ削除が履歴に記録される', () => {
      const m1 = 管理.パーツを追加('part_001', {});
      const m2 = m1.パーツを削除('part_001');
      expect(m2.履歴のサイズ()).toBe(2);
      expect(m2.履歴を取得()[1].変更種類).toBe('パーツ削除');
    });

    it('複数の操作が履歴に記録される', () => {
      const m1 = 管理.名前を変更('Name Two');
      const m2 = m1.状態を変更('無効');
      const m3 = m2.パーツを追加('part_001', {});

      expect(m3.履歴のサイズ()).toBe(3);
      expect(m3.履歴を取得().map(r => r.変更種類)).toEqual(['名前変更', '状態変更', 'パーツ追加']);
    });
  });

  describe('履歴取得・管理', () => {
    it('最新の変更を取得できる', () => {
      const m1 = 管理.名前を変更('Name Two');
      const m2 = m1.状態を変更('無効');

      const 最新 = m2.最新の変更を取得();
      expect(最新?.変更種類).toBe('状態変更');
    });

    it('履歴が空の場合は未定義を返す', () => {
      expect(管理.最新の変更を取得()).toBeUndefined();
    });

    it('履歴が空かを確認できる', () => {
      expect(管理.履歴が空か()).toBe(true);
      const 新管理 = 管理.名前を変更('New');
      expect(新管理.履歴が空か()).toBe(false);
    });

    it('履歴をリセットできる', () => {
      const m1 = 管理.名前を変更('Name Two');
      const m2 = m1.状態を変更('無効');

      expect(m2.履歴のサイズ()).toBe(2);

      const リセット = m2.履歴をリセット();
      expect(リセット.履歴のサイズ()).toBe(0);
      expect(リセット.名前を取得()).toBe('Name Two');
      expect(リセット.状態を取得()).toBe('無効');
    });
  });

  describe('ゲーム固有概念の不在確認', () => {
    it('勝敗判定メソッドがない', () => {
      expect((管理 as any).勝ったか).toBeUndefined();
      expect((管理 as any).負けたか).toBeUndefined();
    });

    it('ターン管理メソッドがない', () => {
      expect((管理 as any).ターンを開始).toBeUndefined();
      expect((管理 as any).ターンを終了).toBeUndefined();
    });

    it('攻撃メソッドがない', () => {
      expect((管理 as any).攻撃).toBeUndefined();
      expect((管理 as any).攻撃可能か).toBeUndefined();
    });

    it('ゲーム用語がない', () => {
      // "状態" は単なるプレイヤー状態（有効/無効）で、
      // "ターン中" や "攻撃可能" などゲーム固有の状態ではない
      const 状態 = 管理.状態を取得();
      expect(['有効', '無効']).toContain(状態);
    });
  });

  describe('層依存性の確認', () => {
    it('層0への依存がない', () => {
      expect((管理 as any).カード).toBeUndefined();
    });

    it('層1への依存がない', () => {
      expect((管理 as any).処理を実行).toBeUndefined();
    });

    it('層2への依存がない', () => {
      expect((管理 as any).状態を通知).toBeUndefined();
      expect((管理 as any).リスナーを登録).toBeUndefined();
    });
  });

  describe('実践的なシナリオ', () => {
    it('複数のプレイヤーを独立して管理', () => {
      const p1 = new プレイヤー管理('p1', 'Player One');
      const p2 = new プレイヤー管理('p2', 'Player Two');

      const p1_after = p1.名前を変更('P1 Renamed');
      const p2_after = p2.パーツを追加('res_001', {});

      expect(p1_after.名前を取得()).toBe('P1 Renamed');
      expect(p2.名前を取得()).toBe('Player Two');
      expect(p2_after.保持パーツ数を取得()).toBe(1);
    });

    it('ゲーム側で意味を付与', () => {
      // パーツ側では単なるキー-値ペア
      const プレイヤー = new プレイヤー管理('player_001', 'resource_001');

      // ゲーム側でこれをライフとして意味付け
      const ライフ = プレイヤー.パーツを追加('attribute_hp', { 最大値: 100, 現在値: 100 });

      // ゲーム側でこれをマナとして意味付け
      const マナ = ライフ.パーツを追加('attribute_mp', { 最大値: 50, 現在値: 50 });

      expect(マナ.保持パーツ数を取得()).toBe(2);
    });

    it('チェーン操作で複数変更', () => {
      const 結果 = 管理
        .名前を変更('New Name')
        .状態を変更('無効')
        .パーツを追加('p1', { v: 1 })
        .パーツを追加('p2', { v: 2 });

      expect(結果.名前を取得()).toBe('New Name');
      expect(結果.状態を取得()).toBe('無効');
      expect(結果.保持パーツ数を取得()).toBe(2);
      expect(結果.履歴のサイズ()).toBe(4);
    });
  });
});
