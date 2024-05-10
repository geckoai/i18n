import 'reflect-metadata';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import I18n from '../src';

describe('index.spec.ts', () => {
  const i18n = new I18n({
    label: 'English',
    code: 'en_US',
    UI: {
      NEW: 'New',
      SAVE: 'Save',
      SUBMIT: 'Submit',
    },
  });

  i18n.update({
    label: '中文简体',
    code: 'zh_CN',
    UI: {
      NEW: '新建',
      SAVE: '存储',
    },
  });

  i18n.update({
    label: '中文繁體',
    code: 'zh_HK',
    UI: {
      NEW: '新建',
      SAVE: '存儲',
    },
  });

  const locale = i18n.localeData();

  const SUBMIT_LOCALES = I18n.locales(locale.UI.SUBMIT);
  const SUBMIT_DEFAULT = I18n.default(locale.UI.SUBMIT);
  const SAVE_LOCALES = I18n.locales(locale.UI.SAVE);

  it('should ', () => {
    expect(SUBMIT_LOCALES.en_US).eq('Submit');
    expect(SUBMIT_LOCALES.zh_CN).eq('Submit');
    expect(SUBMIT_LOCALES.zh_HK).eq('Submit');
    expect(SUBMIT_DEFAULT).eq(SUBMIT_LOCALES.en_US);
  });

  it('should ', () => {
    i18n.locale('zh_CN');
    expect(I18n.current(locale.UI.SAVE)).eq(SAVE_LOCALES.zh_CN);
  });
});
