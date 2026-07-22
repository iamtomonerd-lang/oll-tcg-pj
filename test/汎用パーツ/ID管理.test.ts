/**
 * 汎用パーツ：ID管理 - テスト
 *
 * テスト対象：
 * - ID生成・管理
 * - 一意性確保
 * - 種類管理
 * - メタデータ管理
 * - ID削除・再利用禁止
 * - ID検索
 * - 履歴管理
 * - イミュータビリティ
 * - ゲーム非依存性確認
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  ID管理,
  はID同一か,
  はID種類を持つか,
  はメタデータキーを持つか,
  メタデータ値を取得
} from '../../src/汎用パーツ/ID管理/index';

describe('ID管理 - ユーティリティ関数', () => {
  describe('ID比較', () => {
    it('同じIDを比較できる', () => {
      expect(はID同一か('id_1', 'id_1')).toBe(true);
    });

    it('異なるIDを比較できる', () => {
      expect(はID同一か('id_1', 'id_2')).toBe(false);
    });
  });

  describe('種類判定', () => {
    it('種類を持つIDを判定できる', () => {
      const ID情報 = {
        id: 'id_1',
        種類: 'type_a',
        作成日時: Date.now()
      };
      expect(はID種類を持つか(ID情報, 'type_a')).toBe(true);
      expect(はID種類を持つか(ID情報, 'type_b')).toBe(false);
    });

    it('種類を持たないIDを判定できる', () => {
      const ID情報 = {
        id: 'id_1',
        作成日時: Date.now()
      };
      expect(はID種類を持つか(ID情報, 'type_a')).toBe(false);
    });
  });

  describe('メタデータ関数', () => {
    it('メタデータキーを持つか判定できる', () => {
      const ID情報 = {
        id: 'id_1',
        作成日時: Date.now(),
        メタデータ: { name: 'test', value: 123 }
      };
      expect(はメタデータキーを持つか(ID情報, 'name')).toBe(true);
      expect(はメタデータキーを持つか(ID情報, 'missing')).toBe(false);
    });

    it('メタデータがない場合を処理できる', () => {
      const ID情報 = {
        id: 'id_1',
        作成日時: Date.now()
      };
      expect(はメタデータキーを持つか(ID情報, 'any')).toBe(false);
    });

    it('メタデータの値を取得できる', () => {
      const ID情報 = {
        id: 'id_1',
        作成日時: Date.now(),
        メタデータ: { name: 'test', value: 123 }
      };
      expect(メタデータ値を取得(ID情報, 'name')).toBe('test');
      expect(メタデータ値を取得(ID情報, 'value')).toBe(123);
      expect(メタデータ値を取得(ID情報, 'missing')).toBe(undefined);
    });
  });
});

describe('ID管理 - 管理クラス', () => {
  let ID管: ID管理;

  beforeEach(() => {
    ID管 = new ID管理('manager-1');
  });

  describe('初期状態', () => {
    it('管理IDが保持される', () => {
      expect(ID管.管理ID).toBe('manager-1');
    });

    it('ID一覧が空', () => {
      expect(ID管.ID数を取得()).toBe(0);
    });

    it('削除済みID一覧が空', () => {
      expect(ID管.削除済みID数を取得()).toBe(0);
    });

    it('履歴が空', () => {
      expect(ID管.履歴が空か()).toBe(true);
    });
  });

  describe('ID生成', () => {
    it('IDを生成できる', () => {
      const ID管2 = ID管.IDを生成();
      expect(ID管2.すべてのIDを取得().length).toBe(1);
      expect(ID管2.ID数を取得()).toBe(1);
    });

    it('生成されたIDは一意である', () => {
      let ID管実例 = ID管;
      const ID一覧: string[] = [];
      for (let i = 0; i < 10; i++) {
        ID管実例 = ID管実例.IDを生成();
        const ID情報 = ID管実例.すべてのIDを取得();
        ID一覧.push(ID情報[ID情報.length - 1].id);
      }
      const 一意なID = new Set(ID一覧);
      expect(一意なID.size).toBe(10);
    });

    it('生成されたIDは「id_」プレフィックスを持つ', () => {
      const ID管2 = ID管.IDを生成();
      const ID情報 = ID管2.IDを取得(ID管2.すべてのIDを取得()[0].id)!;
      expect(ID情報.id).toMatch(/^id_\d+$/);
    });

    it('種類付きで生成できる', () => {
      const ID管2 = ID管.IDを生成('card');
      const ID一覧 = ID管2.すべてのIDを取得();
      expect(ID一覧[0].種類).toBe('card');
    });

    it('メタデータ付きで生成できる', () => {
      const ID管2 = ID管.IDを生成('card', { name: 'test', power: 5 });
      const ID一覧 = ID管2.すべてのIDを取得();
      expect(ID一覧[0].メタデータ).toEqual({ name: 'test', power: 5 });
    });

    it('履歴に記録される', () => {
      const ID管2 = ID管.IDを生成('card');
      expect(ID管2.履歴のサイズ()).toBe(1);
      expect(ID管2.最新履歴を取得()?.種類).toBe('生成');
    });
  });

  describe('種類付きID生成', () => {
    it('種類付きIDを生成できる', () => {
      const ID管2 = ID管.種類付きIDを生成('object');
      const ID一覧 = ID管2.すべてのIDを取得();
      expect(ID一覧[0].id).toMatch(/^object_\d+$/);
      expect(ID一覧[0].種類).toBe('object');
    });

    it('複数の種類付きIDを生成できる', () => {
      let ID管実例 = ID管;
      ID管実例 = ID管実例.種類付きIDを生成('card');
      ID管実例 = ID管実例.種類付きIDを生成('player');
      ID管実例 = ID管実例.種類付きIDを生成('zone');

      const ID一覧 = ID管実例.すべてのIDを取得();
      expect(ID一覧.length).toBe(3);
      expect(ID一覧[0].id).toMatch(/^card_/);
      expect(ID一覧[1].id).toMatch(/^player_/);
      expect(ID一覧[2].id).toMatch(/^zone_/);
    });

    it('同じ種類でもIDは一意である', () => {
      let ID管実例 = ID管;
      ID管実例 = ID管実例.種類付きIDを生成('card');
      ID管実例 = ID管実例.種類付きIDを生成('card');
      ID管実例 = ID管実例.種類付きIDを生成('card');

      const ID一覧 = ID管実例.すべてのIDを取得();
      const ID = ID一覧.map(i => i.id);
      expect(new Set(ID).size).toBe(3);
    });

    it('メタデータ付きで生成できる', () => {
      const ID管2 = ID管.種類付きIDを生成('card', { name: 'test' });
      const ID一覧 = ID管2.すべてのIDを取得();
      expect(ID一覧[0].メタデータ).toEqual({ name: 'test' });
    });
  });

  describe('ID登録', () => {
    it('外部IDを登録できる', () => {
      const ID管2 = ID管.IDを登録('external-id-001');
      expect(ID管2.はID存在するか('external-id-001')).toBe(true);
      expect(ID管2.ID数を取得()).toBe(1);
    });

    it('種類付きで登録できる', () => {
      const ID管2 = ID管.IDを登録('external-id-001', 'card');
      const ID情報 = ID管2.IDを取得('external-id-001')!;
      expect(ID情報.種類).toBe('card');
    });

    it('メタデータ付きで登録できる', () => {
      const ID管2 = ID管.IDを登録('external-id-001', 'card', { power: 5 });
      const ID情報 = ID管2.IDを取得('external-id-001')!;
      expect(ID情報.メタデータ).toEqual({ power: 5 });
    });

    it('既に登録済みのIDは登録されない', () => {
      let ID管実例 = ID管;
      ID管実例 = ID管実例.IDを登録('id-1', 'type-a');
      ID管実例 = ID管実例.IDを登録('id-1', 'type-b');

      const ID情報 = ID管実例.IDを取得('id-1')!;
      expect(ID情報.種類).toBe('type-a'); // 最初の登録が保持される
    });

    it('同じインスタンスを返す場合がある', () => {
      const ID管2 = ID管.IDを登録('id-1', 'type');
      const ID管3 = ID管2.IDを登録('id-1', 'type');
      expect(ID管2).toBe(ID管3);
    });

    it('削除済みIDは再利用できない', () => {
      let ID管実例 = ID管;
      const ID管2 = ID管実例.IDを生成();
      const ID一覧 = ID管2.すべてのIDを取得();
      const 生成されたID = ID一覧[0].id;

      const ID管3 = ID管2.IDを削除(生成されたID);
      expect(() => ID管3.IDを登録(生成されたID)).toThrow('削除済みID');
    });

    it('履歴に記録される', () => {
      const ID管2 = ID管.IDを登録('id-1', 'type');
      expect(ID管2.履歴のサイズ()).toBe(1);
      expect(ID管2.最新履歴を取得()?.種類).toBe('登録');
    });
  });

  describe('ID取得', () => {
    it('IDを取得できる', () => {
      const ID管2 = ID管.IDを生成('card');
      const ID一覧 = ID管2.すべてのIDを取得();
      const ID = ID一覧[0].id;

      const ID情報 = ID管2.IDを取得(ID);
      expect(ID情報).not.toBe(null);
      expect(ID情報?.id).toBe(ID);
      expect(ID情報?.種類).toBe('card');
    });

    it('存在しないIDはnullを返す', () => {
      const ID情報 = ID管.IDを取得('non-existent');
      expect(ID情報).toBe(null);
    });

    it('IDが存在するか確認できる', () => {
      const ID管2 = ID管.IDを生成();
      const ID一覧 = ID管2.すべてのIDを取得();
      const ID = ID一覧[0].id;

      expect(ID管2.はID存在するか(ID)).toBe(true);
      expect(ID管2.はID存在するか('non-existent')).toBe(false);
    });

    it('作成日時が保持される', () => {
      const 開始時刻 = Date.now();
      const ID管2 = ID管.IDを生成();
      const 終了時刻 = Date.now();

      const ID一覧 = ID管2.すべてのIDを取得();
      const ID情報 = ID一覧[0];
      expect(ID情報.作成日時).toBeGreaterThanOrEqual(開始時刻);
      expect(ID情報.作成日時).toBeLessThanOrEqual(終了時刻);
    });
  });

  describe('ID削除', () => {
    it('IDを削除できる', () => {
      const ID管2 = ID管.IDを生成();
      const ID一覧 = ID管2.すべてのIDを取得();
      const ID = ID一覧[0].id;

      const ID管3 = ID管2.IDを削除(ID);
      expect(ID管3.ID数を取得()).toBe(0);
      expect(ID管3.はID存在するか(ID)).toBe(false);
    });

    it('削除されたIDは削除済み一覧に追加される', () => {
      const ID管2 = ID管.IDを生成();
      const ID一覧 = ID管2.すべてのIDを取得();
      const ID = ID一覧[0].id;

      const ID管3 = ID管2.IDを削除(ID);
      expect(ID管3.はID削除済みか(ID)).toBe(true);
      expect(ID管3.削除済みID数を取得()).toBe(1);
    });

    it('存在しないIDを削除は何もしない', () => {
      const ID管2 = ID管.IDを削除('non-existent');
      expect(ID管2).toBe(ID管);
    });

    it('複数IDを削除できる', () => {
      let ID管実例 = ID管;
      ID管実例 = ID管実例.IDを生成();
      ID管実例 = ID管実例.IDを生成();
      ID管実例 = ID管実例.IDを生成();

      const ID一覧 = ID管実例.すべてのIDを取得();
      const ID配列 = ID一覧.map(i => i.id);

      const ID管2 = ID管実例.複数IDを削除(ID配列);
      expect(ID管2.ID数を取得()).toBe(0);
      expect(ID管2.削除済みID数を取得()).toBe(3);
    });

    it('削除済みIDは再利用できない', () => {
      const ID管2 = ID管.IDを生成();
      const ID一覧 = ID管2.すべてのIDを取得();
      const ID = ID一覧[0].id;

      const ID管3 = ID管2.IDを削除(ID);
      expect(() => ID管3.IDを登録(ID)).toThrow('削除済みID');
    });

    it('履歴に記録される', () => {
      const ID管2 = ID管.IDを生成();
      const ID一覧 = ID管2.すべてのIDを取得();
      const ID = ID一覧[0].id;

      const ID管3 = ID管2.IDを削除(ID);
      expect(ID管3.履歴のサイズ()).toBe(2);
      expect(ID管3.最新履歴を取得()?.種類).toBe('削除');
    });
  });

  describe('ID検索', () => {
    it('種類でIDを検索できる', () => {
      let ID管実例 = ID管;
      ID管実例 = ID管実例.IDを生成('card');
      ID管実例 = ID管実例.IDを生成('card');
      ID管実例 = ID管実例.IDを生成('player');

      const カード一覧 = ID管実例.種類で検索('card');
      expect(カード一覧.length).toBe(2);
      expect(カード一覧.every(i => i.種類 === 'card')).toBe(true);
    });

    it('存在しない種類の検索は空配列を返す', () => {
      const 結果 = ID管.種類で検索('non-existent');
      expect(結果).toEqual([]);
    });

    it('メタデータで検索できる', () => {
      let ID管実例 = ID管;
      ID管実例 = ID管実例.IDを生成('card', { type: 'monster', power: 5 });
      ID管実例 = ID管実例.IDを生成('card', { type: 'spell' });
      ID管実例 = ID管実例.IDを生成('player', { type: 'monster', power: 3 });

      const キー検索 = ID管実例.メタデータで検索('type');
      expect(キー検索.length).toBe(3);

      const 値検索 = ID管実例.メタデータで検索('type', 'monster');
      expect(値検索.length).toBe(2);
    });

    it('メタデータがないIDは検索結果に含まれない', () => {
      let ID管実例 = ID管;
      ID管実例 = ID管実例.IDを生成('card', { type: 'monster' });
      ID管実例 = ID管実例.IDを生成('card');

      const 結果 = ID管実例.メタデータで検索('type');
      expect(結果.length).toBe(1);
    });

    it('すべてのIDを取得できる', () => {
      let ID管実例 = ID管;
      ID管実例 = ID管実例.IDを生成();
      ID管実例 = ID管実例.IDを生成();
      ID管実例 = ID管実例.IDを生成();

      const 全ID = ID管実例.すべてのIDを取得();
      expect(全ID.length).toBe(3);
    });
  });

  describe('履歴管理', () => {
    it('操作で履歴が増える', () => {
      let ID管実例 = ID管;
      expect(ID管実例.履歴のサイズ()).toBe(0);

      ID管実例 = ID管実例.IDを生成();
      expect(ID管実例.履歴のサイズ()).toBe(1);

      ID管実例 = ID管実例.IDを登録('external-id');
      expect(ID管実例.履歴のサイズ()).toBe(2);
    });

    it('複数の操作の履歴が保持される', () => {
      let ID管実例 = ID管;
      ID管実例 = ID管実例.IDを生成('card');
      ID管実例 = ID管実例.IDを登録('external-id', 'player');
      const ID一覧 = ID管実例.すべてのIDを取得();
      ID管実例 = ID管実例.IDを削除(ID一覧[0].id);

      const 履歴 = ID管実例.履歴を取得();
      expect(履歴.length).toBe(3);
      expect(履歴[0].種類).toBe('生成');
      expect(履歴[1].種類).toBe('登録');
      expect(履歴[2].種類).toBe('削除');
    });

    it('最新履歴を取得できる', () => {
      const ID管2 = ID管.IDを生成();
      const 最新 = ID管2.最新履歴を取得();
      expect(最新).not.toBe(null);
      expect(最新?.種類).toBe('生成');
    });

    it('最新履歴が存在しない場合はnullを返す', () => {
      expect(ID管.最新履歴を取得()).toBe(null);
    });

    it('履歴をクリアできる', () => {
      const ID管2 = ID管.IDを生成();
      expect(ID管2.履歴のサイズ()).toBe(1);

      const ID管3 = ID管2.履歴をクリア();
      expect(ID管3.履歴が空か()).toBe(true);
      expect(ID管3.ID数を取得()).toBe(1); // IDは保持される
    });

    it('空の履歴をクリアは同じインスタンスを返す', () => {
      const ID管2 = ID管.履歴をクリア();
      expect(ID管2).toBe(ID管);
    });
  });

  describe('リセット', () => {
    it('リセットでIDがクリアされる', () => {
      const ID管2 = ID管.IDを生成().IDを生成().IDを生成();
      expect(ID管2.ID数を取得()).toBe(3);

      const ID管3 = ID管2.リセット();
      expect(ID管3.ID数を取得()).toBe(0);
    });

    it('リセットで削除済みIDは保持される', () => {
      let ID管実例 = ID管;
      ID管実例 = ID管実例.IDを生成();
      const ID一覧 = ID管実例.すべてのIDを取得();
      ID管実例 = ID管実例.IDを削除(ID一覧[0].id);

      const ID管2 = ID管実例.リセット();
      expect(ID管2.削除済みID数を取得()).toBe(1);
      expect(ID管2.ID数を取得()).toBe(0);
    });

    it('リセットで履歴は保持される', () => {
      const ID管2 = ID管.IDを生成();
      expect(ID管2.履歴のサイズ()).toBe(1);

      const ID管3 = ID管2.リセット();
      expect(ID管3.履歴のサイズ()).toBe(2); // リセット履歴が追加される
    });

    it('何もしない状態でのリセットは同じインスタンスを返す', () => {
      const ID管2 = ID管.リセット();
      expect(ID管2).toBe(ID管);
    });
  });

  describe('完全リセット', () => {
    it('完全リセットですべてがクリアされる', () => {
      let ID管実例 = ID管;
      ID管実例 = ID管実例.IDを生成().IDを生成();
      const ID一覧 = ID管実例.すべてのIDを取得();
      ID管実例 = ID管実例.IDを削除(ID一覧[0].id);

      const ID管2 = ID管実例.完全リセット();
      expect(ID管2.ID数を取得()).toBe(0);
      expect(ID管2.削除済みID数を取得()).toBe(0);
      expect(ID管2.履歴が空か()).toBe(true);
    });

    it('初期状態での完全リセットは同じインスタンスを返す', () => {
      const ID管2 = ID管.完全リセット();
      expect(ID管2).toBe(ID管);
    });

    it('完全リセット後に管理IDは保持される', () => {
      const ID管2 = ID管.IDを生成().完全リセット();
      expect(ID管2.管理ID).toBe(ID管.管理ID);
    });
  });

  describe('イミュータビリティ', () => {
    it('IDを生成は新規インスタンスを返す', () => {
      const ID管2 = ID管.IDを生成();
      expect(ID管2).not.toBe(ID管);
      expect(ID管.ID数を取得()).toBe(0);
    });

    it('IDを登録は新規インスタンスを返す', () => {
      const ID管2 = ID管.IDを登録('id-1');
      expect(ID管2).not.toBe(ID管);
    });

    it('IDを削除は新規インスタンスを返す', () => {
      const ID管2 = ID管.IDを生成();
      const ID一覧 = ID管2.すべてのIDを取得();
      const ID管3 = ID管2.IDを削除(ID一覧[0].id);
      expect(ID管3).not.toBe(ID管2);
    });

    it('ID一覧は参照を保護される', () => {
      const ID管2 = ID管.IDを生成();
      const ID一覧1 = ID管2.すべてのIDを取得();
      const ID一覧2 = ID管2.すべてのIDを取得();
      expect(ID一覧1).not.toBe(ID一覧2);
      expect(ID一覧1).toEqual(ID一覧2);
    });

    it('履歴配列は参照を保護される', () => {
      const ID管2 = ID管.IDを生成();
      const 履歴1 = ID管2.履歴を取得();
      const 履歴2 = ID管2.履歴を取得();
      expect(履歴1).not.toBe(履歴2);
      expect(履歴1).toEqual(履歴2);
    });
  });

  describe('連鎖操作', () => {
    it('複数の操作を連鎖実行できる', () => {
      const ID管2 = ID管
        .IDを生成('card')
        .IDを生成('player')
        .IDを登録('external-id', 'zone')
        .リセット();

      expect(ID管2.ID数を取得()).toBe(0);
      expect(ID管2.削除済みID数を取得()).toBe(0);
      expect(ID管2.履歴のサイズ()).toBe(4);
    });
  });

  describe('ゲーム非依存性確認', () => {
    it('ゲーム固有概念を含まない', () => {
      const コード = JSON.stringify(ID管);
      expect(コード).not.toContain('カード');
      expect(コード).not.toContain('プレイヤー');
      expect(コード).not.toContain('ターン');
      expect(コード).not.toContain('勝敗');
      expect(コード).not.toContain('コスト');
    });

    it('汎用的なIDのみを管理する', () => {
      // あらゆる種類のIDを生成可能
      const ID管2 = ID管
        .種類付きIDを生成('entity')
        .種類付きIDを生成('zone')
        .種類付きIDを生成('player')
        .種類付きIDを生成('card');

      const 種類一覧 = ID管2.すべてのIDを取得().map(i => i.種類);
      expect(種類一覧).toContain('entity');
      expect(種類一覧).toContain('zone');
      expect(種類一覧).toContain('player');
      expect(種類一覧).toContain('card');
    });
  });

  describe('エッジケース', () => {
    it('大量のIDを生成できる', () => {
      let ID管実例 = ID管;
      for (let i = 0; i < 100; i++) {
        ID管実例 = ID管実例.IDを生成();
      }
      expect(ID管実例.ID数を取得()).toBe(100);
    });

    it('複雑なメタデータを保持できる', () => {
      const 複雑なメタデータ = {
        name: 'test',
        nested: {
          value: 123,
          array: [1, 2, 3]
        },
        array: ['a', 'b', 'c']
      };
      const ID管2 = ID管.IDを生成('complex', 複雑なメタデータ);
      const ID一覧 = ID管2.すべてのIDを取得();
      expect(ID一覧[0].メタデータ).toEqual(複雑なメタデータ);
    });
  });
});
