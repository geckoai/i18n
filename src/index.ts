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

const LOCALES = Symbol.for('locales');
const DEFAULT = Symbol.for('default');
const CURRENT = Symbol.for('current');
const PROXY = Symbol.for('proxy');

/**
 * @class I18n<object>
 */
export class I18n<T extends object> {
  /**
   * 判断是否为对象
   * @param v
   * @private
   */
  private static __isObject(v: any): boolean {
    return typeof v === 'object' && v.constructor === Object;
  }

  /**
   * 获取语言包
   * @param proxy
   * @private
   */
  public static locales<T>(proxy: DepLocale<T>): Record<string, T> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return (proxy as any)[PROXY]() as Record<string, T>;
  }

  /**
   * 获取当前语言的内容
   * @param proxy
   */
  public static current<T>(proxy: DepLocale<T>): T {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return (proxy as any)[CURRENT]() as T;
  }

  /**
   * 获取默认语言包的内容
   * @param proxy
   */
  public static default<T>(proxy: DepLocale<T>): T {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return (proxy as any)[DEFAULT]() as T;
  }

  /**
   * Create proxy  method
   * @private
   */
  private static [PROXY]<T extends object>(
    i18n: I18n<any>,
    locales: Map<string, T>
  ): DepLocale<T> {
    const data: Record<string, any> = {};
    const def = locales.get(i18n.default());
    locales.forEach((v, k) => {
      data[k] = v ?? def;
    });
    return new Proxy<DepLocale<T>>(data as any, {
      /**
       * get property
       * @param target
       * @param property
       * @param receiver
       */
      get: (target: Record<string, any>, property, receiver): any => {
        if (property === PROXY) {
          return (): any => {
            const values: Record<string, any> = {};
            locales.forEach((v, k) => {
              if (
                (I18n.__isObject(def) || I18n.__isObject(v)) &&
                k !== i18n.default()
              ) {
                values[k] = merge({}, def, v);
              } else {
                values[k] = v ?? def;
              }
            });
            return values;
          };
        } else if (property === DEFAULT) {
          return (): any => target[i18n.default()];
        } else if (property === CURRENT) {
          if (I18n.__isObject(def) || I18n.__isObject(target[i18n.locale()])) {
            return (): any =>
              merge({}, target[i18n.default()], target[i18n.locale()]);
          }
          return (): any => target[i18n.locale()] ?? target[i18n.default()];
        }
        const childMap = new Map();
        locales.forEach((v: any, k) => {
          childMap.set(k, v?.[property]);
        });
        return I18n[PROXY](i18n, childMap);
      },
    });
  }

  private [LOCALES]: Map<string, LocaleType<T>> = new Map();

  private [DEFAULT]: string;

  private [CURRENT]: string;

  /**
   * constructor
   * @param defaultLocale
   */
  public constructor(defaultLocale: LocaleType<T>) {
    if (!defaultLocale.code) {
      throw new Exception('Code cannot be empty!');
    }
    this[DEFAULT] = defaultLocale.code;
    this[CURRENT] = defaultLocale.code;
    this[LOCALES].set(defaultLocale.code, defaultLocale);
    this.localeData = this.localeData.bind(this);
    this.locale = this.locale.bind(this);
    this.locales = this.locales.bind(this);
  }

  /**
   * 获取语言包
   */
  public localeData(): DepLocale<T>;
  /**
   * 获取指定语言的语言数据
   * @param key
   */
  public localeData(key: string): LocaleType<T>;
  /**
   * 实现
   * @param key
   */
  public localeData(key?: string): DepLocale<T> | LocaleType<T> {
    if (key) {
      return I18n.locales(I18n[PROXY](this, this[LOCALES]))?.[key];
    }
    return I18n[PROXY](this, this[LOCALES]);
  }

  /**
   * 获取所有语言的 code[]
   */
  public locales(): string[] {
    return Array.from(this[LOCALES].keys());
  }

  /**
   * 设置/获取当前语言的 code
   * @param code
   */
  public locale(code?: string): string {
    if (code && this.locales().includes(code)) {
      this[CURRENT] = code;
      return code;
    }
    return this[CURRENT];
  }

  /**
   * 获取默认语言的code
   */
  public default(): string {
    return this[DEFAULT];
  }

  /**
   * 更新语言包
   * @param locale
   */
  public update(locale: LocaleType<DepPartial<T>>): void {
    const oldValues = this[LOCALES].get(locale.code);
    this[LOCALES].set(locale.code, merge({}, oldValues, locale));
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

export type LocaleType<T extends object> = BaseLocale & T;

export type DepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DepPartial<T[P]> : T[P];
};

export type DepLocale<T> = {
  [P in keyof T]: DepLocale<T[P]>;
};

export { Exception };

export default I18n;
