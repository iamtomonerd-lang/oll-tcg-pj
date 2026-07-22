/**
 * 汎用パーツ：対象管理 - テスト
 *
 * テスト対象：
 * - 対象管理初期化
 * - 候補管理（設定・追加・削除・取得）
 * - 対象選択管理
 * - 確定管理
 * - キャンセル管理
 * - 履歴管理
 * - イミュータビリティ
 * - ゲーム非依存性確認
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  対象管理,
  は未開始か,
  は候補設定済みか,
  は選択中か,
  は確定か,
  はキャンセルか
} from '../../src/汎用パーツ/対象管理/index';
import type { 対象 } from '../../src/汎用パーツ/対象管理/index';

describe('対象管理 - ユーティリティ関数', () => {
  describe('状態判定', () => {
    it('未開始判定', () => {
      expect(は未開始か('未開始')).toBe(true);
      expect(は未開始か('候補設定済み')).toBe(false);
    });

    it('候補設定済み判定', () => {
      expect(は候補設定済みか('候補設定済み')).toBe(true);
      expect(は候補設定済みか('未開始')).toBe(false);
    });

    it('選択中判定', () => {
      expect(は選択中か('選択中')).toBe(true);
      expect(は選択中か('確定')).toBe(false);
    });

    it('確定判定', () => {
      expect(は確定か('確定')).toBe(true);
      expect(は確定か('キャンセル')).toBe(false);
    });

    it('キャンセル判定', () => {
      expect(はキャンセルか('キャンセル')).toBe(true);
      expect(はキャンセルか('未開始')).toBe(false);
    });
  });
});

describe('対象管理 - 管理クラス', () => {
  let 管理: 対象管理;
  const 対象A: 対象 = { id: 'obj-a', データ: { name: 'A' } };
  const 対象B: 対象 = { id: 'obj-b', データ: { name: 'B' } };
  const 対象C: 対象 = { id: 'obj-c', データ: { name: 'C' } };

  beforeEach(() => {
    管理 = new 対象管理('target-mgr-1');
  });

  describe('初期状態', () => {
    it('IDが保持される', () => {
      expect(管理.ID).toBe('target-mgr-1');
    });

    it('初期状態は未開始', () => {
      expect(管理.状態).toBe('未開始');
      expect(は未開始か(管理.状態)).toBe(true);
    });

    it('候補一覧が空', () => {
      expect(管理.候補一覧).toEqual([]);
    });

    it('確定対象一覧が空', () => {
      expect(管理.確定対象一覧).toEqual([]);
    });

    it('履歴が空', () => {
      expect(管理.履歴が空か()).toBe(true);
    });
  });

  describe('候補管理 - 設定', () => {
    it('候補を設定できる', () => {
      const m = 管理.候補を設定([対象A, 対象B]);
      expect(m.候補一覧).toEqual([対象A, 対象B]);
      expect(m.状態).toBe('候補設定済み');
    });

    it('候補設定時に最小・最大選択数を指定できる', () => {
      const m = 管理.候補を設定([対象A, 対象B, 対象C], 1, 2);
      expect(m.最小選択数).toBe(1);
      expect(m.最大選択数).toBe(2);
    });

    it('候補設定時に履歴が記録される', () => {
      const m = 管理.候補を設定([対象A, 対象B]);
      expect(m.履歴のサイズ()).toBe(1);
      expect(m.最新履歴を取得()?.種類).toBe('候補設定');
    });
  });

  describe('候補管理 - 追加', () => {
    it('候補を追加できる', () => {
      const m1 = 管理.候補を設定([対象A]);
      const m2 = m1.候補を追加(対象B);

      expect(m2.候補一覧).toEqual([対象A, 対象B]);
    });

    it('複数候補を追加できる', () => {
      const m1 = 管理.候補を設定([対象A]);
      const m2 = m1.複数候補を追加([対象B, 対象C]);

      expect(m2.候補一覧).toEqual([対象A, 対象B, 対象C]);
    });

    it('重複する候補は追加されない', () => {
      const m1 = 管理.候補を設定([対象A]);
      const m2 = m1.候補を追加(対象A);

      expect(m2).toBe(m1);
    });

    it('候補追加時に履歴が記録される', () => {
      const m1 = 管理.候補を設定([対象A]);
      const m2 = m1.候補を追加(対象B);

      expect(m2.履歴のサイズ()).toBe(2);
    });
  });

  describe('候補管理 - 削除', () => {
    it('候補を削除できる', () => {
      const m1 = 管理.候補を設定([対象A, 対象B, 対象C]);
      const m2 = m1.候補を削除('obj-b');

      expect(m2.候補一覧).toEqual([対象A, 対象C]);
    });

    it('存在しない候補削除は元のインスタンスを返す', () => {
      const m1 = 管理.候補を設定([対象A]);
      const m2 = m1.候補を削除('obj-z');

      expect(m2).toBe(m1);
    });
  });

  describe('対象選択 - 追加', () => {
    it('候補から対象を選択できる', () => {
      const m1 = 管理.候補を設定([対象A, 対象B], 0, 2);
      const m2 = m1.対象を追加(対象A);

      expect(m2.確定対象一覧).toEqual([対象A]);
      expect(m2.状態).toBe('選択中');
    });

    it('複数対象を選択できる', () => {
      const m1 = 管理.候補を設定([対象A, 対象B, 対象C], 0, 3);
      const m2 = m1.対象を追加(対象A);
      const m3 = m2.対象を追加(対象B);

      expect(m3.確定対象一覧).toEqual([対象A, 対象B]);
    });

    it('最大選択数に達していれば追加できない', () => {
      const m1 = 管理.候補を設定([対象A, 対象B, 対象C], 0, 1);
      const m2 = m1.対象を追加(対象A);
      const m3 = m2.対象を追加(対象B);

      expect(m3).toBe(m2);
    });

    it('候補にない対象は追加できない', () => {
      const m1 = 管理.候補を設定([対象A]);
      const m2 = m1.対象を追加(対象B);

      expect(m2).toBe(m1);
    });

    it('対象選択時に履歴が記録される', () => {
      const m1 = 管理.候補を設定([対象A]);
      const m2 = m1.対象を追加(対象A);

      expect(m2.履歴のサイズ()).toBe(2);
      expect(m2.最新履歴を取得()?.種類).toBe('対象追加');
    });
  });

  describe('対象選択 - 削除', () => {
    it('選択した対象を削除できる', () => {
      const m1 = 管理.候補を設定([対象A, 対象B], 0, 2);
      const m2 = m1.対象を追加(対象A);
      const m3 = m2.対象を追加(対象B);
      const m4 = m3.対象を削除('obj-a');

      expect(m4.確定対象一覧).toEqual([対象B]);
    });

    it('存在しない対象削除は元のインスタンスを返す', () => {
      const m1 = 管理.候補を設定([対象A]);
      const m2 = m1.対象を追加(対象A);
      const m3 = m2.対象を削除('obj-z');

      expect(m3).toBe(m2);
    });
  });

  describe('選択数管理', () => {
    it('確定対象数を取得できる', () => {
      const m1 = 管理.候補を設定([対象A, 対象B], 0, 2);
      const m2 = m1.対象を追加(対象A);
      const m3 = m2.対象を追加(対象B);

      expect(m3.確定対象数を取得()).toBe(2);
    });

    it('最小選択数以上か確認できる', () => {
      const m1 = 管理.候補を設定([対象A, 対象B], 1, 2);
      const m2 = m1.対象を追加(対象A);

      expect(m2.は最小選択数以上か()).toBe(true);
      expect(m1.は最小選択数以上か()).toBe(false);
    });

    it('最大選択数に達しているか確認できる', () => {
      const m1 = 管理.候補を設定([対象A, 対象B], 0, 1);
      const m2 = m1.対象を追加(対象A);

      expect(m2.は最大選択数に達しているか()).toBe(true);
      expect(m1.は最大選択数に達しているか()).toBe(false);
    });

    it('選択完了か確認できる', () => {
      const m1 = 管理.候補を設定([対象A, 対象B], 1, 2);
      const m2 = m1.対象を追加(対象A);

      expect(m2.は選択完了か()).toBe(true);
      expect(m1.は選択完了か()).toBe(false);
    });
  });

  describe('対象確定', () => {
    it('対象を確定できる', () => {
      const m1 = 管理.候補を設定([対象A, 対象B], 1, 2);
      const m2 = m1.対象を追加(対象A);
      const m3 = m2.対象を確定();

      expect(m3.状態).toBe('確定');
      expect(は確定か(m3.状態)).toBe(true);
    });

    it('最小選択数に達していない場合は確定できない', () => {
      const m1 = 管理.候補を設定([対象A, 対象B], 1, 2);
      const m2 = m1.対象を確定();

      expect(m2).toBe(m1);
    });

    it('確定後は確定対象一覧が変わらない', () => {
      const m1 = 管理.候補を設定([対象A, 対象B], 1, 2);
      const m2 = m1.対象を追加(対象A);
      const m3 = m2.対象を確定();

      expect(m3.確定対象一覧).toEqual([対象A]);
    });

    it('確定状態か確認できる', () => {
      const m1 = 管理.候補を設定([対象A], 1, 1);
      const m2 = m1.対象を追加(対象A);
      const m3 = m2.対象を確定();

      expect(m3.は確定済みか()).toBe(true);
      expect(m2.は確定済みか()).toBe(false);
    });

    it('確定時に履歴が記録される', () => {
      const m1 = 管理.候補を設定([対象A], 1, 1);
      const m2 = m1.対象を追加(対象A);
      const m3 = m2.対象を確定();

      expect(m3.最新履歴を取得()?.種類).toBe('状態変更');
    });
  });

  describe('キャンセル', () => {
    it('選択をキャンセルできる', () => {
      const m1 = 管理.候補を設定([対象A, 対象B]);
      const m2 = m1.対象を追加(対象A);
      const m3 = m2.選択をキャンセル();

      expect(m3.状態).toBe('キャンセル');
      expect(m3.確定対象一覧).toEqual([]);
    });

    it('キャンセル状態か確認できる', () => {
      const m1 = 管理.候補を設定([対象A]);
      const m2 = m1.選択をキャンセル();

      expect(m2.はキャンセル済みか()).toBe(true);
      expect(m1.はキャンセル済みか()).toBe(false);
    });

    it('キャンセル時に履歴が記録される', () => {
      const m1 = 管理.候補を設定([対象A]);
      const m2 = m1.選択をキャンセル();

      expect(m2.最新履歴を取得()?.種類).toBe('状態変更');
    });
  });

  describe('イミュータビリティ', () => {
    it('候補設定で新規インスタンスが返される', () => {
      const m = 管理.候補を設定([対象A]);
      expect(m).not.toBe(管理);
      expect(管理.候補一覧).toEqual([]);
      expect(m.候補一覧).toEqual([対象A]);
    });

    it('対象追加で新規インスタンスが返される', () => {
      const m1 = 管理.候補を設定([対象A, 対象B]);
      const m2 = m1.対象を追加(対象A);

      expect(m2).not.toBe(m1);
      expect(m1.確定対象一覧).toEqual([]);
      expect(m2.確定対象一覧).toEqual([対象A]);
    });

    it('候補一覧は複製を返す', () => {
      const m1 = 管理.候補を設定([対象A, 対象B]);
      const list1 = m1.候補一覧;
      const list2 = m1.候補一覧;

      expect(list1).not.toBe(list2);
      expect(list1).toEqual(list2);
    });

    it('確定対象一覧は複製を返す', () => {
      const m1 = 管理.候補を設定([対象A]);
      const m2 = m1.対象を追加(対象A);
      const list1 = m2.確定対象一覧;
      const list2 = m2.確定対象一覧;

      expect(list1).not.toBe(list2);
      expect(list1).toEqual(list2);
    });

    it('履歴は複製を返す', () => {
      const m1 = 管理.候補を設定([対象A]);
      const hist1 = m1.履歴を取得();
      const hist2 = m1.履歴を取得();

      expect(hist1).not.toBe(hist2);
      expect(hist1).toEqual(hist2);
    });
  });

  describe('履歴管理', () => {
    it('複数操作の履歴が記録される', () => {
      const m1 = 管理.候補を設定([対象A, 対象B]);
      expect(m1.履歴のサイズ()).toBe(1);

      const m2 = m1.対象を追加(対象A);
      expect(m2.履歴のサイズ()).toBe(2);

      const m3 = m2.対象を確定();
      expect(m3.履歴のサイズ()).toBe(3);
    });

    it('履歴に時刻が記録される', () => {
      const m1 = 管理.候補を設定([対象A]);
      const 履歴 = m1.最新履歴を取得();

      expect(履歴?.時刻).toBeGreaterThan(0);
      expect(typeof 履歴?.時刻).toBe('number');
    });

    it('履歴をクリアできる', () => {
      const m1 = 管理.候補を設定([対象A]);
      const m2 = m1.対象を追加(対象A);
      expect(m2.履歴のサイズ()).toBe(2);

      const m3 = m2.履歴をクリア();
      expect(m3.履歴のサイズ()).toBe(0);
      expect(m3.候補一覧).toEqual([対象A]);
      expect(m3.確定対象一覧).toEqual([対象A]);
    });

    it('履歴が空の場合クリアは元のインスタンスを返す', () => {
      const m = 管理.履歴をクリア();
      expect(m).toBe(管理);
    });
  });

  describe('リセット', () => {
    it('状態をリセットできる', () => {
      const m1 = 管理.候補を設定([対象A]);
      const m2 = m1.リセット();

      expect(m2.状態).toBe('未開始');
      expect(m2.候補一覧).toEqual([対象A]);
    });

    it('リセット後も履歴は保持される', () => {
      const m1 = 管理.候補を設定([対象A]);
      const m2 = m1.リセット();

      expect(m2.履歴のサイズ()).toBe(2);
    });

    it('完全リセットですべてをリセット', () => {
      const m1 = 管理.候補を設定([対象A, 対象B]);
      const m2 = m1.対象を追加(対象A);
      const m3 = m2.完全リセット();

      expect(m3.状態).toBe('未開始');
      expect(m3.候補一覧).toEqual([]);
      expect(m3.確定対象一覧).toEqual([]);
      expect(m3.履歴が空か()).toBe(true);
    });
  });

  describe('ゲーム非依存性確認', () => {
    it('ゲーム固有の状態がない', () => {
      expect((管理 as any).攻撃対象).toBeUndefined();
      expect((管理 as any).防御対象).toBeUndefined();
      expect((管理 as any).破壊対象).toBeUndefined();
    });

    it('ゲーム固有メソッドがない', () => {
      expect((管理 as any).攻撃を実行).toBeUndefined();
      expect((管理 as any).ダメージを与える).toBeUndefined();
    });

    it('層0への依存がない', () => {
      expect((管理 as any).カード).toBeUndefined();
      expect((管理 as any).プレイヤー).toBeUndefined();
    });

    it('層1への依存がない', () => {
      expect((管理 as any).効果を処理).toBeUndefined();
      expect((管理 as any).条件を判定).toBeUndefined();
    });

    it('層2への依存がない', () => {
      expect((管理 as any).リスナーを登録).toBeUndefined();
      expect((管理 as any).状態を通知).toBeUndefined();
    });
  });

  describe('実践的なシナリオ', () => {
    it('ゲーム側で攻撃対象を選択できる', () => {
      // ゲーム側での使用例：敵ユニットを攻撃対象として選択
      const 敵1 = { id: 'enemy-1', データ: { name: '敵1', hp: 10 } };
      const 敵2 = { id: 'enemy-2', データ: { name: '敵2', hp: 8 } };
      const 敵3 = { id: 'enemy-3', データ: { name: '敵3', hp: 5 } };

      let 管理 = new 対象管理('attack-target');
      管理 = 管理.候補を設定([敵1, 敵2, 敵3], 1, 1);
      管理 = 管理.対象を追加(敵1);
      管理 = 管理.対象を確定();

      expect(管理.確定対象一覧).toEqual([敵1]);
      expect(管理.は確定済みか()).toBe(true);
    });

    it('複数対象選択シナリオ', () => {
      // 複数の味方を対象として選択
      const 味方A = { id: 'ally-a', データ: { name: '戦士' } };
      const 味方B = { id: 'ally-b', データ: { name: '魔術師' } };
      const 味方C = { id: 'ally-c', データ: { name: '僧侶' } };

      let 管理 = new 対象管理('support-target');
      管理 = 管理.候補を設定([味方A, 味方B, 味方C], 1, 2);
      管理 = 管理.対象を追加(味方A);
      管理 = 管理.対象を追加(味方B);
      管理 = 管理.対象を確定();

      expect(管理.確定対象一覧).toEqual([味方A, 味方B]);
      expect(管理.確定対象数を取得()).toBe(2);
    });

    it('複数ゲームで独立して使用', () => {
      // ゲームA：戦闘システム
      const 敵A = { id: 'enemy-a' };
      let 攻撃管理 = new 対象管理('attack');
      攻撃管理 = 攻撃管理.候補を設定([敵A], 1, 1);

      // ゲームB：支援システム
      const 味方B = { id: 'ally-b' };
      let 支援管理 = new 対象管理('support');
      支援管理 = 支援管理.候補を設定([味方B], 1, 1);

      expect(攻撃管理.ID).toBe('attack');
      expect(支援管理.ID).toBe('support');
    });

    it('キャンセル・やり直しシナリオ', () => {
      const 対象A = { id: 'a' };
      const 対象B = { id: 'b' };

      // 最初の選択
      let 管理 = new 対象管理('selection');
      管理 = 管理.候補を設定([対象A, 対象B], 1, 1);
      管理 = 管理.対象を追加(対象A);

      // キャンセル
      const キャンセル後 = 管理.選択をキャンセル();
      expect(キャンセル後.はキャンセル済みか()).toBe(true);
      expect(キャンセル後.確定対象一覧).toEqual([]);

      // やり直し
      const リセット後 = キャンセル後.リセット();
      const 新選択 = リセット後.対象を追加(対象B);
      expect(新選択.確定対象一覧).toEqual([対象B]);
    });
  });
});
