/**
 * 汎用パーツ：カード管理 - テスト
 *
 * テスト対象：
 * - カード作成・管理
 * - ID管理・保持
 * - 名前変更
 * - 種類管理（追加・削除・複数管理）
 * - データ管理（キー・バリュー）
 * - 状態管理
 * - 変更履歴管理
 * - イミュータビリティ
 * - ゲーム非依存性確認
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  カード管理,
  は種類を含むか,
  は複数種類を含むか,
  はデータキーを持つか,
  データ値を取得,
  は状態キーを持つか,
  状態値を取得
} from '../../src/汎用パーツ/カード管理/index';

describe('カード管理 - ユーティリティ関数', () => {
  let カード: カード管理;

  beforeEach(() => {
    カード = new カード管理('card-1', 'テストカード', ['タイプA', 'タイプB']);
  });

  describe('種類判定', () => {
    it('種類を含むかを判定できる', () => {
      expect(は種類を含むか(カード, 'タイプA')).toBe(true);
      expect(は種類を含むか(カード, 'タイプC')).toBe(false);
    });

    it('複数種類をすべて含むか判定できる', () => {
      expect(は複数種類を含むか(カード, ['タイプA', 'タイプB'])).toBe(true);
      expect(は複数種類を含むか(カード, ['タイプA', 'タイプC'])).toBe(false);
    });
  });

  describe('データ関数', () => {
    it('データキーを持つか判定できる', () => {
      const c = カード.データを設定('攻撃力', 5);
      expect(はデータキーを持つか(c, '攻撃力')).toBe(true);
      expect(はデータキーを持つか(c, '防御力')).toBe(false);
    });

    it('データ値を取得できる', () => {
      const c = カード.データを設定('攻撃力', 5);
      expect(データ値を取得(c, '攻撃力')).toBe(5);
    });
  });

  describe('状態関数', () => {
    it('状態キーを持つか判定できる', () => {
      const c = カード.状態を設定('タップ', true);
      expect(は状態キーを持つか(c, 'タップ')).toBe(true);
      expect(は状態キーを持つか(c, '疲労')).toBe(false);
    });

    it('状態値を取得できる', () => {
      const c = カード.状態を設定('タップ', true);
      expect(状態値を取得(c, 'タップ')).toBe(true);
    });
  });
});

describe('カード管理 - 管理クラス', () => {
  let カード: カード管理;

  beforeEach(() => {
    カード = new カード管理('card-1', 'テストカード');
  });

  describe('初期状態', () => {
    it('IDが保持される', () => {
      expect(カード.ID).toBe('card-1');
    });

    it('名前が保持される', () => {
      expect(カード.名前).toBe('テストカード');
    });

    it('種類一覧が空', () => {
      expect(カード.種類一覧).toEqual([]);
    });

    it('データが空', () => {
      expect(Object.keys(カード.データ)).toEqual([]);
    });

    it('状態が空', () => {
      expect(Object.keys(カード.状態)).toEqual([]);
    });

    it('履歴が空', () => {
      expect(カード.履歴が空か()).toBe(true);
    });
  });

  describe('初期化オプション', () => {
    it('初期種類を指定できる', () => {
      const c = new カード管理('card-1', 'テスト', ['タイプA', 'タイプB']);
      expect(c.種類一覧).toEqual(['タイプA', 'タイプB']);
    });

    it('初期データを指定できる', () => {
      const c = new カード管理('card-1', 'テスト', undefined, { 攻撃力: 5, コスト: 3 });
      expect(c.データ).toEqual({ 攻撃力: 5, コスト: 3 });
    });

    it('初期状態を指定できる', () => {
      const c = new カード管理('card-1', 'テスト', undefined, undefined, { タップ: true });
      expect(c.状態).toEqual({ タップ: true });
    });
  });

  describe('名前変更', () => {
    it('名前を変更できる', () => {
      const c = カード.名前を変更('新しい名前');
      expect(c.名前).toBe('新しい名前');
    });

    it('同じ名前に変更すると元のインスタンスを返す', () => {
      const c = カード.名前を変更('テストカード');
      expect(c).toBe(カード);
    });

    it('名前変更で履歴が記録される', () => {
      const c = カード.名前を変更('新しい名前');
      expect(c.履歴のサイズ()).toBe(1);
      expect(c.最新履歴を取得()?.種類).toBe('名前変更');
    });
  });

  describe('種類管理 - 追加', () => {
    it('種類を追加できる', () => {
      const c = カード.種類を追加('タイプA');
      expect(c.種類一覧).toEqual(['タイプA']);
    });

    it('複数の種類を順序を保持して追加できる', () => {
      const c1 = カード.種類を追加('タイプA');
      const c2 = c1.種類を追加('タイプB');
      const c3 = c2.種類を追加('タイプC');

      expect(c3.種類一覧).toEqual(['タイプA', 'タイプB', 'タイプC']);
    });

    it('複数種類をまとめて追加できる', () => {
      const c = カード.複数種類を追加(['タイプA', 'タイプB', 'タイプC']);
      expect(c.種類一覧).toEqual(['タイプA', 'タイプB', 'タイプC']);
    });

    it('既に存在する種類の追加は元のインスタンスを返す', () => {
      const c1 = カード.種類を追加('タイプA');
      const c2 = c1.種類を追加('タイプA');
      expect(c2).toBe(c1);
    });

    it('種類追加時に履歴が記録される', () => {
      const c = カード.種類を追加('タイプA');
      expect(c.履歴のサイズ()).toBe(1);
      expect(c.最新履歴を取得()?.種類).toBe('種類追加');
    });
  });

  describe('種類管理 - 削除', () => {
    it('種類を削除できる', () => {
      const c1 = カード.複数種類を追加(['タイプA', 'タイプB', 'タイプC']);
      const c2 = c1.種類を削除('タイプB');

      expect(c2.種類一覧).toEqual(['タイプA', 'タイプC']);
    });

    it('複数種類を削除できる', () => {
      const c1 = カード.複数種類を追加(['タイプA', 'タイプB', 'タイプC']);
      const c2 = c1.複数種類を削除(['タイプA', 'タイプC']);

      expect(c2.種類一覧).toEqual(['タイプB']);
    });

    it('すべての種類を削除できる', () => {
      const c1 = カード.複数種類を追加(['タイプA', 'タイプB']);
      const c2 = c1.すべての種類を削除();

      expect(c2.種類一覧).toEqual([]);
    });

    it('存在しない種類の削除は元のインスタンスを返す', () => {
      const c1 = カード.複数種類を追加(['タイプA']);
      const c2 = c1.種類を削除('タイプZ');

      expect(c2).toBe(c1);
    });

    it('種類削除時に履歴が記録される', () => {
      const c1 = カード.複数種類を追加(['タイプA', 'タイプB']);
      const c2 = c1.種類を削除('タイプA');

      expect(c2.履歴のサイズ()).toBe(2);
      const 最新 = c2.最新履歴を取得();
      expect(最新?.種類).toBe('種類削除');
    });
  });

  describe('データ管理 - 設定', () => {
    it('データを設定できる', () => {
      const c = カード.データを設定('攻撃力', 5);
      expect(c.データ).toEqual({ 攻撃力: 5 });
    });

    it('複数のデータを設定できる', () => {
      const c = カード.複数データを設定({ 攻撃力: 5, コスト: 3, HP: 10 });
      expect(c.データ).toEqual({ 攻撃力: 5, コスト: 3, HP: 10 });
    });

    it('同じ値を設定すると元のインスタンスを返す', () => {
      const c1 = カード.データを設定('攻撃力', 5);
      const c2 = c1.データを設定('攻撃力', 5);

      expect(c2).toBe(c1);
    });

    it('データを上書きできる', () => {
      const c1 = カード.データを設定('攻撃力', 5);
      const c2 = c1.データを設定('攻撃力', 10);

      expect(c2.データ).toEqual({ 攻撃力: 10 });
    });

    it('複数のデータを段階的に設定できる', () => {
      const c1 = カード.データを設定('攻撃力', 5);
      const c2 = c1.データを設定('コスト', 3);
      const c3 = c2.データを設定('HP', 10);

      expect(c3.データ).toEqual({ 攻撃力: 5, コスト: 3, HP: 10 });
    });

    it('データ設定時に履歴が記録される', () => {
      const c = カード.データを設定('攻撃力', 5);
      expect(c.履歴のサイズ()).toBe(1);
      expect(c.最新履歴を取得()?.種類).toBe('データ変更');
    });
  });

  describe('データ管理 - 削除', () => {
    it('データキーを削除できる', () => {
      const c1 = カード.複数データを設定({ 攻撃力: 5, コスト: 3 });
      const c2 = c1.データを削除('攻撃力');

      expect(c2.データ).toEqual({ コスト: 3 });
    });

    it('すべてのデータを削除できる', () => {
      const c1 = カード.複数データを設定({ 攻撃力: 5, コスト: 3 });
      const c2 = c1.すべてのデータを削除();

      expect(c2.データ).toEqual({});
    });

    it('存在しないキー削除は元のインスタンスを返す', () => {
      const c1 = カード.データを設定('攻撃力', 5);
      const c2 = c1.データを削除('防御力');

      expect(c2).toBe(c1);
    });
  });

  describe('状態管理 - 設定', () => {
    it('状態を設定できる', () => {
      const c = カード.状態を設定('タップ', true);
      expect(c.状態).toEqual({ タップ: true });
    });

    it('複数の状態を設定できる', () => {
      const c = カード.複数状態を設定({ タップ: true, 疲労: false });
      expect(c.状態).toEqual({ タップ: true, 疲労: false });
    });

    it('同じ値を設定すると元のインスタンスを返す', () => {
      const c1 = カード.状態を設定('タップ', true);
      const c2 = c1.状態を設定('タップ', true);

      expect(c2).toBe(c1);
    });

    it('状態を上書きできる', () => {
      const c1 = カード.状態を設定('タップ', true);
      const c2 = c1.状態を設定('タップ', false);

      expect(c2.状態).toEqual({ タップ: false });
    });

    it('状態設定時に履歴が記録される', () => {
      const c = カード.状態を設定('タップ', true);
      expect(c.履歴のサイズ()).toBe(1);
      expect(c.最新履歴を取得()?.種類).toBe('状態変更');
    });
  });

  describe('状態管理 - 削除', () => {
    it('状態キーを削除できる', () => {
      const c1 = カード.複数状態を設定({ タップ: true, 疲労: false });
      const c2 = c1.状態を削除('タップ');

      expect(c2.状態).toEqual({ 疲労: false });
    });

    it('すべての状態を削除できる', () => {
      const c1 = カード.複数状態を設定({ タップ: true, 疲労: false });
      const c2 = c1.すべての状態を削除();

      expect(c2.状態).toEqual({});
    });

    it('存在しないキー削除は元のインスタンスを返す', () => {
      const c1 = カード.状態を設定('タップ', true);
      const c2 = c1.状態を削除('疲労');

      expect(c2).toBe(c1);
    });
  });

  describe('イミュータビリティ', () => {
    it('名前変更で新規インスタンスが返される', () => {
      const c = カード.名前を変更('新しい名前');
      expect(c).not.toBe(カード);
      expect(カード.名前).toBe('テストカード');
      expect(c.名前).toBe('新しい名前');
    });

    it('種類追加で新規インスタンスが返される', () => {
      const c = カード.種類を追加('タイプA');
      expect(c).not.toBe(カード);
      expect(カード.種類一覧).toEqual([]);
      expect(c.種類一覧).toEqual(['タイプA']);
    });

    it('データ設定で新規インスタンスが返される', () => {
      const c = カード.データを設定('攻撃力', 5);
      expect(c).not.toBe(カード);
      expect(Object.keys(カード.データ)).toEqual([]);
      expect(c.データ).toEqual({ 攻撃力: 5 });
    });

    it('状態設定で新規インスタンスが返される', () => {
      const c = カード.状態を設定('タップ', true);
      expect(c).not.toBe(カード);
      expect(Object.keys(カード.状態)).toEqual([]);
      expect(c.状態).toEqual({ タップ: true });
    });

    it('データは複製を返す', () => {
      const c = カード.データを設定('攻撃力', 5);
      const data1 = c.データ;
      const data2 = c.データ;

      expect(data1).not.toBe(data2);
      expect(data1).toEqual(data2);
    });

    it('状態は複製を返す', () => {
      const c = カード.状態を設定('タップ', true);
      const state1 = c.状態;
      const state2 = c.状態;

      expect(state1).not.toBe(state2);
      expect(state1).toEqual(state2);
    });

    it('種類一覧は複製を返す', () => {
      const c = カード.種類を追加('タイプA');
      const types1 = c.種類一覧;
      const types2 = c.種類一覧;

      expect(types1).not.toBe(types2);
      expect(types1).toEqual(types2);
    });
  });

  describe('履歴管理', () => {
    it('複数操作の履歴が記録される', () => {
      const c1 = カード.名前を変更('新しい名前');
      expect(c1.履歴のサイズ()).toBe(1);

      const c2 = c1.種類を追加('タイプA');
      expect(c2.履歴のサイズ()).toBe(2);

      const c3 = c2.データを設定('攻撃力', 5);
      expect(c3.履歴のサイズ()).toBe(3);
    });

    it('履歴に時刻が記録される', () => {
      const c = カード.データを設定('攻撃力', 5);
      const 履歴 = c.最新履歴を取得();

      expect(履歴?.時刻).toBeGreaterThan(0);
      expect(typeof 履歴?.時刻).toBe('number');
    });

    it('複数データ設定で複数履歴が記録される', () => {
      const c = カード.複数データを設定({ 攻撃力: 5, コスト: 3 });
      expect(c.履歴のサイズ()).toBe(2);
    });

    it('複数状態設定で複数履歴が記録される', () => {
      const c = カード.複数状態を設定({ タップ: true, 疲労: false });
      expect(c.履歴のサイズ()).toBe(2);
    });

    it('履歴をクリアできる', () => {
      const c1 = カード.データを設定('攻撃力', 5);
      expect(c1.履歴のサイズ()).toBe(1);

      const c2 = c1.履歴をクリア();
      expect(c2.履歴のサイズ()).toBe(0);
      expect(c2.データ).toEqual({ 攻撃力: 5 });
    });

    it('履歴が空の場合クリアは元のインスタンスを返す', () => {
      const c = カード.履歴をクリア();
      expect(c).toBe(カード);
    });
  });

  describe('リセット', () => {
    it('リセットで種類・データ・状態をクリアできる', () => {
      const c1 = new カード管理(
        'card-1',
        'テスト',
        ['タイプA'],
        { 攻撃力: 5 },
        { タップ: true }
      );
      const c2 = c1.リセット();

      expect(c2.種類一覧).toEqual([]);
      expect(c2.データ).toEqual({});
      expect(c2.状態).toEqual({});
      expect(c2.名前).toBe('テスト');
      expect(c2.ID).toBe('card-1');
    });

    it('リセット後も履歴は保持される', () => {
      const c1 = カード.データを設定('攻撃力', 5);
      const c2 = c1.リセット();

      expect(c2.履歴が空か()).toBe(false);
      expect(c2.履歴のサイズ()).toBe(1);
    });

    it('完全リセットで名前以外をすべてリセット', () => {
      const c1 = new カード管理(
        'card-1',
        'テスト',
        ['タイプA'],
        { 攻撃力: 5 },
        { タップ: true }
      );
      const c2 = c1.完全リセット();

      expect(c2.ID).toBe('card-1');
      expect(c2.名前).toBe('テスト');
      expect(c2.種類一覧).toEqual([]);
      expect(c2.データ).toEqual({});
      expect(c2.状態).toEqual({});
      expect(c2.履歴が空か()).toBe(true);
    });
  });

  describe('ゲーム非依存性確認', () => {
    it('ゲーム固有の状態がない', () => {
      expect((カード as any).ドロー).toBeUndefined();
      expect((カード as any).召喚).toBeUndefined();
      expect((カード as any).破壊).toBeUndefined();
    });

    it('ゲーム固有メソッドがない', () => {
      expect((カード as any).攻撃する).toBeUndefined();
      expect((カード as any).コストを支払う).toBeUndefined();
      expect((カード as any).効果を発動).toBeUndefined();
    });

    it('層0への依存がない', () => {
      expect((カード as any).プレイヤー).toBeUndefined();
      expect((カード as any).ゲーム).toBeUndefined();
    });

    it('層1への依存がない', () => {
      expect((カード as any).ダメージを計算).toBeUndefined();
      expect((カード as any).効果を処理).toBeUndefined();
    });

    it('層2への依存がない', () => {
      expect((カード as any).リスナーを登録).toBeUndefined();
      expect((カード as any).状態を通知).toBeUndefined();
    });
  });

  describe('実践的なシナリオ', () => {
    it('複数カードを独立して管理できる', () => {
      const カードA = new カード管理('card-a', 'ユニットA', ['ユニット', 'ファイター']);
      const カードB = new カード管理('card-b', 'スペル', ['スペル', 'ダメージ']);

      const A = カードA.データを設定('攻撃力', 5);
      const B = カードB.データを設定('ダメージ', 3);

      expect(A.データ).toEqual({ 攻撃力: 5 });
      expect(B.データ).toEqual({ ダメージ: 3 });
    });

    it('カード状態をシミュレートできる', () => {
      let カード = new カード管理('card-1', 'ユニット');
      カード = カード.複数データを設定({ 攻撃力: 5, HP: 10 });
      カード = カード.複数状態を設定({ タップ: false, 疲労: false });

      // ユニットが攻撃
      カード = カード.状態を設定('タップ', true);

      // ユニットがダメージを受ける
      カード = カード.データを設定('HP', 7);

      expect(カード.データ).toEqual({ 攻撃力: 5, HP: 7 });
      expect(カード.状態).toEqual({ タップ: true, 疲労: false });
    });

    it('ゲーム側で異なるセマンティクスで使用できる', () => {
      // ゲームA：モンスターカード
      const モンスター = new カード管理(
        'mon-1',
        'スライム',
        ['モンスター', 'スライム'],
        { 攻撃力: 3, 防御力: 2, HP: 5 },
        { 捕捉状態: false }
      );

      // ゲームB：同じシステムを魔法カードで使用
      const 魔法 = new カード管理(
        'spell-1',
        'ファイアボール',
        ['魔法', 'ダメージ'],
        { ダメージ量: 5, コスト: 3 },
        { 使用済み: false }
      );

      expect(モンスター.データ).toEqual({ 攻撃力: 3, 防御力: 2, HP: 5 });
      expect(魔法.データ).toEqual({ ダメージ量: 5, コスト: 3 });
    });

    it('複数ゲームで同じパーツを再利用', () => {
      // ゲームA：TCG
      const TCGカード = new カード管理('tcg-1', 'クリーチャー', ['クリーチャー']);

      // ゲームB：デッキビルディング
      const deckカード = new カード管理('deck-1', 'カード', ['カード']);

      const A = TCGカード.データを設定('コスト', 3);
      const B = deckカード.データを設定('パワー', 5);

      expect(A.データ).toEqual({ コスト: 3 });
      expect(B.データ).toEqual({ パワー: 5 });
    });

    it('カード複製をシミュレートできる', () => {
      let 元のカード = new カード管理('orig-1', 'オリジナル');
      元のカード = 元のカード.複数データを設定({ 攻撃力: 5, HP: 10 });

      // 複製（コピーコンストラクタ）
      let 複製 = new カード管理(
        'copy-1',
        元のカード.名前,
        [...元のカード.種類一覧],
        { ...元のカード.データ },
        { ...元のカード.状態 }
      );

      // 複製にダメージ
      複製 = 複製.データを設定('HP', 5);

      expect(元のカード.データ).toEqual({ 攻撃力: 5, HP: 10 });
      expect(複製.データ).toEqual({ 攻撃力: 5, HP: 5 });
    });
  });
});
