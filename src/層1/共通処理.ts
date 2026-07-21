/**
 * 層1：共通処理
 *
 * どのTCGでも利用できる共通的な処理を提供する。
 *
 * この層の役割：
 * - ゲーム内のエンティティに対する基本的な操作
 * - 汎用的なユーティリティ機能
 * - すべてのTCGで使える共通機能
 *
 * この層が提供しない機能：
 * - TCG固有のルール
 * - 具体的なゲーム処理（ターン進行など）
 * - エンティティの生成（層3で行う）
 */

/**
 * ランダムな整数を生成
 *
 * @param min 最小値（包括）
 * @param max 最大値（包括）
 * @returns min から max の間のランダムな整数
 */
export function ランダム整数(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 配列をシャッフル（Fisher-Yates アルゴリズム）
 *
 * @param 配列 シャッフルする配列
 * @returns シャッフルされた配列（元の配列は変更されない）
 */
export function シャッフル<T>(配列: T[]): T[] {
  const シャッフル済み = [...配列];

  for (let i = シャッフル済み.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [シャッフル済み[i], シャッフル済み[j]] = [シャッフル済み[j], シャッフル済み[i]];
  }

  return シャッフル済み;
}

/**
 * 配列をランダムに並び替え（シャッフルのエイリアス）
 *
 * @param 配列 並び替える配列
 * @returns ランダムに並び替えられた配列
 */
export function ランダム並び替え<T>(配列: T[]): T[] {
  return シャッフル(配列);
}

/**
 * 配列から特定の条件を満たす要素を検索
 *
 * @param 配列 検索対象の配列
 * @param 条件 検索条件（述語関数）
 * @returns 条件を満たす最初の要素、なければ undefined
 */
export function 検索<T>(配列: T[], 条件: (要素: T) => boolean): T | undefined {
  return 配列.find(条件);
}

/**
 * 配列から特定の条件を満たすすべての要素を検索
 *
 * @param 配列 検索対象の配列
 * @param 条件 検索条件（述語関数）
 * @returns 条件を満たすすべての要素の配列
 */
export function 検索すべて<T>(配列: T[], 条件: (要素: T) => boolean): T[] {
  return 配列.filter(条件);
}

/**
 * 配列から特定の条件を満たす要素の個数を取得
 *
 * @param 配列 対象の配列
 * @param 条件 検索条件（述語関数）
 * @returns 条件を満たす要素の個数
 */
export function 個数(配列: unknown[], 条件?: (要素: unknown) => boolean): number {
  if (条件) {
    return 配列.filter(条件).length;
  }
  return 配列.length;
}

/**
 * 配列に特定の要素が含まれているか判定
 *
 * @param 配列 対象の配列
 * @param 要素 検索する要素
 * @returns 要素が含まれているか
 */
export function 含む<T>(配列: T[], 要素: T): boolean {
  return 配列.includes(要素);
}

/**
 * 配列から特定の条件を満たす要素を削除
 *
 * @param 配列 対象の配列
 * @param 条件 削除条件（述語関数）
 * @returns 条件を満たさない要素のみの新しい配列
 */
export function 削除<T>(配列: T[], 条件: (要素: T) => boolean): T[] {
  return 配列.filter((要素) => !条件(要素));
}

/**
 * 配列の指定位置に要素を挿入
 *
 * @param 配列 対象の配列
 * @param インデックス 挿入位置
 * @param 要素 挿入する要素
 * @returns 要素が挿入された新しい配列
 */
export function 挿入<T>(配列: T[], インデックス: number, 要素: T): T[] {
  const 新しい配列 = [...配列];
  新しい配列.splice(インデックス, 0, 要素);
  return 新しい配列;
}

/**
 * 配列の指定位置から要素を取得し、その要素を含まない新しい配列を返す
 *
 * @param 配列 対象の配列
 * @param インデックス 取得する位置
 * @returns [取得した要素, 更新後の配列]
 */
export function 取り出す<T>(配列: T[], インデックス: number): [T | undefined, T[]] {
  if (インデックス < 0 || インデックス >= 配列.length) {
    return [undefined, [...配列]];
  }

  const 取得した要素 = 配列[インデックス];
  const 更新後の配列 = 配列.filter((_, i) => i !== インデックス);

  return [取得した要素, 更新後の配列];
}

/**
 * オブジェクトが空か判定
 *
 * @param オブジェクト 判定するオブジェクト
 * @returns オブジェクトが空か
 */
export function 空か(オブジェクト: unknown): boolean {
  if (オブジェクト === null || オブジェクト === undefined) {
    return true;
  }

  if (Array.isArray(オブジェクト)) {
    return オブジェクト.length === 0;
  }

  if (typeof オブジェクト === 'object') {
    return Object.keys(オブジェクト).length === 0;
  }

  return false;
}

/**
 * ログを出力（デバッグ用）
 *
 * @param タイトル ログのタイトル
 * @param 内容 ログの内容
 */
export function ログ(タイトル: string, 内容?: unknown): void {
  if (内容 !== undefined) {
    console.log(`[${タイトル}]`, 内容);
  } else {
    console.log(タイトル);
  }
}
