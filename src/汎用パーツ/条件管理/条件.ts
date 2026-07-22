/**
 * 汎用パーツ：条件管理
 *
 * 条件を定義・評価する汎用的なシステム
 * ゲーム固有ルールは含まない
 */

/**
 * 条件の評価結果
 */
export interface 条件評価結果 {
  readonly 成功: boolean;
  readonly 理由?: string;
}

/**
 * 基本的な条件インターフェース
 */
export interface 条件 {
  readonly 名前: string;
  評価(対象: unknown): 条件評価結果;
}

/**
 * シンプルな条件を作成する
 */
export function シンプルな条件を作成(
  名前: string,
  評価関数: (対象: unknown) => boolean,
  失敗理由?: string
): 条件 {
  return {
    名前,
    評価: (対象: unknown): 条件評価結果 => {
      const 成功 = 評価関数(対象);
      return {
        成功,
        理由: 成功 ? undefined : (失敗理由 ?? `${名前}を満たさない`)
      };
    }
  };
}

/**
 * 複数の条件をAND結合する
 */
export function 条件をAND結合(...条件たち: 条件[]): 条件 {
  return {
    名前: `(${条件たち.map(c => c.名前).join(' AND ')})`,
    評価: (対象: unknown): 条件評価結果 => {
      for (const 条件 of 条件たち) {
        const 結果 = 条件.評価(対象);
        if (!結果.成功) {
          return {
            成功: false,
            理由: 結果.理由
          };
        }
      }
      return { 成功: true };
    }
  };
}

/**
 * 複数の条件をOR結合する
 */
export function 条件をOR結合(...条件たち: 条件[]): 条件 {
  return {
    名前: `(${条件たち.map(c => c.名前).join(' OR ')})`,
    評価: (対象: unknown): 条件評価結果 => {
      const 失敗理由たち: string[] = [];

      for (const 条件 of 条件たち) {
        const 結果 = 条件.評価(対象);
        if (結果.成功) {
          return { 成功: true };
        }
        if (結果.理由) {
          失敗理由たち.push(結果.理由);
        }
      }

      return {
        成功: false,
        理由: `${失敗理由たち.join(', ')}`
      };
    }
  };
}

/**
 * 条件を反転する
 */
export function 条件を反転(条件: 条件): 条件 {
  return {
    名前: `NOT(${条件.名前})`,
    評価: (対象: unknown): 条件評価結果 => {
      const 結果 = 条件.評価(対象);
      return {
        成功: !結果.成功,
        理由: !結果.成功 ? undefined : `条件が満たされている: ${条件.名前}`
      };
    }
  };
}

/**
 * 複数の対象に対して条件を評価する
 */
export function 複数を評価(条件: 条件, 対象たち: unknown[]): 条件評価結果[] {
  return 対象たち.map(対象 => 条件.評価(対象));
}

/**
 * 条件を満たす要素をフィルタリング
 */
export function フィルタリング(条件: 条件, 対象たち: unknown[]): unknown[] {
  return 対象たち.filter(対象 => 条件.評価(対象).成功);
}

/**
 * すべての対象が条件を満たすか確認
 */
export function すべてが満たすか(条件: 条件, 対象たち: unknown[]): boolean {
  return 対象たち.every(対象 => 条件.評価(対象).成功);
}

/**
 * いずれかの対象が条件を満たすか確認
 */
export function いずれかが満たすか(条件: 条件, 対象たち: unknown[]): boolean {
  return 対象たち.some(対象 => 条件.評価(対象).成功);
}
