/**
 * MIT License
 * Copyright (c) 2021 RanYunLong<549510622@qq.com> @geckoai/i18n
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import merge from 'lodash.merge';
import { Exception } from './exception';

export type DepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DepPartial<T[P]> : T[P];
};

/**
 * @class I18n<object>
 */
export class I18n<T extends object> {
  private _locales = new Map<string, DepPartial<T>>();

  private current: string;

  private default: string;

  /**
   * 构造函数
   * @param defaultLocale 默认语言配置
   */
  public constructor(private defaultLocale: BaseLocale & T) {
    if (!defaultLocale.code) {
      throw new Exception('locale code cannot be empty!');
    }
    this.default = defaultLocale.code;
    this.current = defaultLocale.code;
    this.defined(defaultLocale);
  }

  /**
   * 定义语言
   * @param locale
   */
  public defined(locale: BaseLocale & DepPartial<T>): void {
    this._locales.set(locale.code, merge({}, this.defaultLocale, locale));
  }

  /**
   * 获取当前语言
   */
  public locale(): string;
  /**
   * 设置当前语言
   * @param code
   */
  public locale(code: string): void;
  /**
   * 实现方法
   * @param code
   */
  public locale(code?: string): string | void {
    if (code) {
      if (!this._locales.has(code)) {
        throw new Exception(`Not defined locale ${code}!`);
      }
      this.current = code;
    }

    return this.current;
  }

  /**
   * 获取当前语言配置
   */
  public localeData(code?: string): BaseLocale & T {
    return (
      (this._locales.get(code || this.current) as BaseLocale & T) ||
      this.defaultLocale
    );
  }

  /**
   * 根据key获取locale Data
   * @param callback
   */
  public getLocaleDataByKey<K extends string, V = any>(
    callback: (data: BaseLocale & T) => V
  ): Record<K, V> {
    const record: Record<string, V> = {};
    this.locales().forEach((locale) => {
      record[locale.code] = callback(locale);
    });
    return record;
  }

  /**
   * 已定义语言列表
   */
  public locales(): Array<BaseLocale & T> {
    return Array.from(this._locales.keys()).map((code) =>
      this.localeData(code)
    );
  }

  /**
   * 已定义语言code列表
   */
  public localeCodes(): string[] {
    return Array.from(this._locales.keys());
  }
}

export interface BaseLocale {
  /**
   * 语言名称
   */
  code: string;

  /**
   * 语言名称
   */
  label: string;
}

export { Exception };

export default I18n;
