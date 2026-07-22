/**
 * 汎用パーツ：条件管理
 *
 * 条件を一元管理し、再利用・共有する
 */

import type { 条件, 条件評価結果 } from './条件';

/**
 * 条件を管理・保存する
 */
export class 条件管理 {
  private 条件レジストリ: Map<string, 条件> = new Map();

  /**
   * 条件を登録する
   */
  登録(名前: string, 条件: 条件): void {
    this.条件レジストリ.set(名前, 条件);
  }

  /**
   * 登録されている条件を取得する
   */
  取得(名前: string): 条件 | undefined {
    return this.条件レジストリ.get(名前);
  }

  /**
   * 条件が登録されているか確認する
   */
  が存在するか(名前: string): boolean {
    return this.条件レジストリ.has(名前);
  }

  /**
   * 登録されている条件を評価する
   */
  評価(名前: string, 対象: unknown): 条件評価結果 {
    const 条件 = this.取得(名前);
    if (!条件) {
      return {
        成功: false,
        理由: `条件 "${名前}" が登録されていない`
      };
    }
    return 条件.評価(対象);
  }

  /**
   * 複数の条件を評価する
   */
  複数評価(名前たち: string[], 対象: unknown): 条件評価結果[] {
    return 名前たち.map(名前 => this.評価(名前, 対象));
  }

  /**
   * すべての条件を満たすか確認する
   */
  すべてが満たすか(名前たち: string[], 対象: unknown): boolean {
    return this.複数評価(名前たち, 対象).every(結果 => 結果.成功);
  }

  /**
   * いずれかの条件を満たすか確認する
   */
  いずれかが満たすか(名前たち: string[], 対象: unknown): boolean {
    return this.複数評価(名前たち, 対象).some(結果 => 結果.成功);
  }

  /**
   * 条件を削除する
   */
  削除(名前: string): boolean {
    return this.条件レジストリ.delete(名前);
  }

  /**
   * すべての条件を削除する
   */
  クリア(): void {
    this.条件レジストリ.clear();
  }

  /**
   * 登録されている条件の名前一覧を取得する
   */
  名前一覧を取得(): string[] {
    return Array.from(this.条件レジストリ.keys());
  }

  /**
   * 登録されている条件の数を取得する
   */
  数を取得(): number {
    return this.条件レジストリ.size;
  }

  /**
   * デバッグ情報を取得する
   */
  デバッグ情報(): { 名前: string; 条件名: string }[] {
    return Array.from(this.条件レジストリ.entries()).map(([名前, 条件]) => ({
      名前,
      条件名: 条件.名前
    }));
  }
}
