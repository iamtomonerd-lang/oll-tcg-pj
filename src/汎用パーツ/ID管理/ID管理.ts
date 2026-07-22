/**
 * 汎用パーツ：ID管理
 *
 * ゲーム非依存のID生成・管理機能
 * 責務：ID生成・管理・履歴管理のみ
 */

import type {
  ID情報,
  ID管理変更履歴
} from './ID';

/**
 * ID管理クラス
 *
 * イミュータブル設計：すべての操作が新規インスタンスを返却
 */
export class ID管理 {
  readonly 管理ID: string;
  private readonly ID一覧内部: Map<string, ID情報>;
  private readonly 削除済みID内部: Set<string>;
  private readonly 次のカウンター内部: number;
  private readonly 変更履歴: ID管理変更履歴[];

  /**
   * コンストラクタ
   * @param 管理ID ID管理者の識別子
   */
  constructor(管理ID: string) {
    this.管理ID = 管理ID;
    this.ID一覧内部 = new Map();
    this.削除済みID内部 = new Set();
    this.次のカウンター内部 = 0;
    this.変更履歴 = [];
  }

  /**
   * プライベートコンストラクタ用ヘルパー
   */
  private static 複製作成(
    管理ID: string,
    ID一覧: Map<string, ID情報>,
    削除済みID: Set<string>,
    カウンター: number,
    履歴: ID管理変更履歴[]
  ): ID管理 {
    const インスタンス = new ID管理(管理ID);
    (インスタンス as any).ID一覧内部 = new Map(ID一覧);
    (インスタンス as any).削除済みID内部 = new Set(削除済みID);
    (インスタンス as any).次のカウンター内部 = カウンター;
    (インスタンス as any).変更履歴 = 履歴;
    return インスタンス;
  }

  /**
   * 一意なIDを生成（内部用）
   */
  private 次の一意ID(): string {
    let ID: string;
    do {
      ID = `id_${this.次のカウンター内部.toString().padStart(8, '0')}`;
      (this as any).次のカウンター内部++;
    } while (this.削除済みID内部.has(ID));
    return ID;
  }

  /**
   * IDを生成
   * @param 種類 ID の種類（オプション）
   * @param メタデータ IDに付与するメタデータ（オプション）
   */
  IDを生成(種類?: string, メタデータ?: unknown): ID管理 {
    const 新しいID = this.次の一意ID();
    const ID情報: ID情報 = {
      id: 新しいID,
      種類,
      作成日時: Date.now(),
      メタデータ
    };

    const 新しいID一覧 = new Map(this.ID一覧内部);
    新しいID一覧.set(新しいID, ID情報);

    const 新しい管理 = ID管理.複製作成(
      this.管理ID,
      新しいID一覧,
      this.削除済みID内部,
      this.次のカウンター内部,
      [...this.変更履歴]
    );

    新しい管理.変更履歴.push({
      種類: '生成',
      対象ID: 新しいID,
      時刻: Date.now(),
      詳細: {
        元の種類: 種類,
        メタデータ
      }
    });

    return 新しい管理;
  }

  /**
   * 種類付きIDを生成
   * @param 種類 ID の種類プレフィックス
   * @param メタデータ IDに付与するメタデータ（オプション）
   */
  種類付きIDを生成(種類: string, メタデータ?: unknown): ID管理 {
    const 新しいID = `${種類}_${this.次のカウンター内部.toString().padStart(8, '0')}`;
    (this as any).次のカウンター内部++;

    const ID情報: ID情報 = {
      id: 新しいID,
      種類,
      作成日時: Date.now(),
      メタデータ
    };

    const 新しいID一覧 = new Map(this.ID一覧内部);
    新しいID一覧.set(新しいID, ID情報);

    const 新しい管理 = ID管理.複製作成(
      this.管理ID,
      新しいID一覧,
      this.削除済みID内部,
      this.次のカウンター内部,
      [...this.変更履歴]
    );

    新しい管理.変更履歴.push({
      種類: '生成',
      対象ID: 新しいID,
      時刻: Date.now(),
      詳細: {
        元の種類: 種類,
        メタデータ
      }
    });

    return 新しい管理;
  }

  /**
   * IDを登録（既に存在するIDを管理対象に追加）
   * @param id 登録するID
   * @param 種類 ID の種類（オプション）
   * @param メタデータ IDに付与するメタデータ（オプション）
   */
  IDを登録(id: string, 種類?: string, メタデータ?: unknown): ID管理 {
    if (this.ID一覧内部.has(id)) {
      return this;
    }

    if (this.削除済みID内部.has(id)) {
      // 削除済みIDの再利用は禁止
      throw new Error(`削除済みID「${id}」は再利用できません`);
    }

    const ID情報: ID情報 = {
      id,
      種類,
      作成日時: Date.now(),
      メタデータ
    };

    const 新しいID一覧 = new Map(this.ID一覧内部);
    新しいID一覧.set(id, ID情報);

    const 新しい管理 = ID管理.複製作成(
      this.管理ID,
      新しいID一覧,
      this.削除済みID内部,
      this.次のカウンター内部,
      [...this.変更履歴]
    );

    新しい管理.変更履歴.push({
      種類: '登録',
      対象ID: id,
      時刻: Date.now(),
      詳細: {
        元の種類: 種類,
        メタデータ
      }
    });

    return 新しい管理;
  }

  /**
   * IDを取得
   */
  IDを取得(id: string): ID情報 | null {
    return this.ID一覧内部.get(id) || null;
  }

  /**
   * IDが存在するか確認
   */
  はID存在するか(id: string): boolean {
    return this.ID一覧内部.has(id);
  }

  /**
   * IDが削除済みか確認
   */
  はID削除済みか(id: string): boolean {
    return this.削除済みID内部.has(id);
  }

  /**
   * IDを削除
   */
  IDを削除(id: string): ID管理 {
    if (!this.ID一覧内部.has(id)) {
      return this;
    }

    const 新しいID一覧 = new Map(this.ID一覧内部);
    const 削除対象 = 新しいID一覧.get(id)!;
    新しいID一覧.delete(id);

    const 新しい削除済みID = new Set(this.削除済みID内部);
    新しい削除済みID.add(id);

    const 新しい管理 = ID管理.複製作成(
      this.管理ID,
      新しいID一覧,
      新しい削除済みID,
      this.次のカウンター内部,
      [...this.変更履歴]
    );

    新しい管理.変更履歴.push({
      種類: '削除',
      対象ID: id,
      時刻: Date.now(),
      詳細: {
        元の種類: 削除対象.種類,
        メタデータ: 削除対象.メタデータ
      }
    });

    return 新しい管理;
  }

  /**
   * 複数IDを削除
   */
  複数IDを削除(id一覧: string[]): ID管理 {
    let 管理: ID管理 = this;
    for (const id of id一覧) {
      管理 = 管理.IDを削除(id);
    }
    return 管理;
  }

  /**
   * 種類でIDを検索
   */
  種類で検索(種類: string): ID情報[] {
    const 結果: ID情報[] = [];
    for (const ID情報 of this.ID一覧内部.values()) {
      if (ID情報.種類 === 種類) {
        結果.push(ID情報);
      }
    }
    return 結果;
  }

  /**
   * メタデータキーでIDを検索
   */
  メタデータで検索(キー: string, 値?: unknown): ID情報[] {
    const 結果: ID情報[] = [];
    for (const ID情報 of this.ID一覧内部.values()) {
      if (ID情報.メタデータ && typeof ID情報.メタデータ === 'object') {
        const メタデータ = ID情報.メタデータ as Record<string, unknown>;
        if (キー in メタデータ) {
          if (値 === undefined || メタデータ[キー] === 値) {
            結果.push(ID情報);
          }
        }
      }
    }
    return 結果;
  }

  /**
   * すべてのIDを取得
   */
  すべてのIDを取得(): ID情報[] {
    return Array.from(this.ID一覧内部.values());
  }

  /**
   * ID数を取得
   */
  ID数を取得(): number {
    return this.ID一覧内部.size;
  }

  /**
   * 削除済みID数を取得
   */
  削除済みID数を取得(): number {
    return this.削除済みID内部.size;
  }

  /**
   * 履歴を取得
   */
  履歴を取得(): readonly ID管理変更履歴[] {
    return [...this.変更履歴];
  }

  /**
   * 最新履歴を取得
   */
  最新履歴を取得(): ID管理変更履歴 | null {
    return this.変更履歴.length > 0
      ? this.変更履歴[this.変更履歴.length - 1]
      : null;
  }

  /**
   * 履歴のサイズを取得
   */
  履歴のサイズ(): number {
    return this.変更履歴.length;
  }

  /**
   * 履歴が空か確認
   */
  履歴が空か(): boolean {
    return this.変更履歴.length === 0;
  }

  /**
   * 履歴をクリア
   */
  履歴をクリア(): ID管理 {
    if (this.履歴が空か()) {
      return this;
    }

    const 新しい管理 = ID管理.複製作成(
      this.管理ID,
      this.ID一覧内部,
      this.削除済みID内部,
      this.次のカウンター内部,
      []
    );

    return 新しい管理;
  }

  /**
   * リセット（IDをクリア、削除済みID一覧は保持）
   */
  リセット(): ID管理 {
    if (this.ID一覧内部.size === 0 && this.変更履歴.length === 0) {
      return this;
    }

    const 新しい管理 = ID管理.複製作成(
      this.管理ID,
      new Map(),
      this.削除済みID内部,
      this.次のカウンター内部,
      [...this.変更履歴]
    );

    新しい管理.変更履歴.push({
      種類: 'リセット',
      対象ID: '',
      時刻: Date.now()
    });

    return 新しい管理;
  }

  /**
   * 完全リセット（すべてをリセット）
   */
  完全リセット(): ID管理 {
    if (
      this.ID一覧内部.size === 0 &&
      this.削除済みID内部.size === 0 &&
      this.変更履歴.length === 0
    ) {
      return this;
    }

    return new ID管理(this.管理ID);
  }
}
