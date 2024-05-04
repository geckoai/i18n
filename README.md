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
describe('index.spec.ts', () => {
  // 创建国际化实例 定义默认语言包
  const i18n = new I18n({
    label: 'English',
    code: 'en_US',
    UI: {
      NEW: 'New',
      SAVE: 'Save',
      SUBMIT: 'Submit',
    }
  })

  // 定义语言1
  i18n.defined({
    label: '中文简体',
    code: 'zh_CN',
    UI: {
      SAVE: '存储',
    }
  })

  // 定义语言2
  i18n.defined({
    label: '中文繁體',
    code: 'zh_HK',
    UI: {
      NEW: '新建',
      SAVE: '存儲',
    }
  })

  it('当前语言 和 i18n.localeData().code 相等.', function () {
    expect(i18n.locale()).eq(i18n.localeData().code)
  });

  it('当繁体中文包含UI.NEW时 使用当前定义的值：此时结果为`新建`', function () {
    i18n.locale('zh_HK');
    expect('新建').eq(i18n.localeData().UI.NEW)
  });

  it('当简体中文不包含UI.NEW时 使用默认语言定义的值：此时结果为`New`', function () {
    i18n.locale('zh_CN');
    expect('New').eq(i18n.localeData().UI.NEW)
  });

  it('当其他语言都不包含时，使用默认语言的值', function () {
    i18n.locale('zh_CN');
    expect('Submit').eq(i18n.localeData().UI.SUBMIT)

    i18n.locale('zh_HK');
    expect('Submit').eq(i18n.localeData().UI.SUBMIT)
  });
});
```

## Documentation
- [ApiDocs](https://geckoai.github.io/i18n/)
- [samples](https://github.com/geckoai/i18n/tree/master/sample)


## Issues
Create [issues](https://github.com/geckoai/i18n/issues) in this repository for anything related to the Class Decorator. When creating issues please search for existing issues to avoid duplicates.


## License
Licensed under the [MIT](https://github.com/geckoai/i18n/blob/master/LICENSE) License.
