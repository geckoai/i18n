# i18n
The @geckoai/i18n module is used to support internationalization.

[![npm (scoped)](https://img.shields.io/npm/v/@geckoai/i18n)](https://www.npmjs.com/package/@geckoai/i18n)

## Installing

```shell
npm i @geckoai/i18n
#or
yarn add @geckoai/i18n
```

## Example Usage

```ts
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
```

## Documentation
- [ApiDocs](https://geckoai.github.io/i18n/)
- [samples](https://github.com/geckoai/i18n/tree/master/sample)


## Issues
Create [issues](https://github.com/geckoai/i18n/issues) in this repository for anything related to the Class Decorator. When creating issues please search for existing issues to avoid duplicates.


## License
Licensed under the [MIT](https://github.com/geckoai/i18n/blob/master/LICENSE) License.
