/* eslint-disable import/no-named-as-default */
// eslint-disable-next-line import/no-named-as-default-member
import Boilerplate from '../boilerplate';

test('1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});
describe('import tests', () => {
  test('boilerpalte import', () => {
    const template = new Boilerplate({});
    expect(template);
  });
  test('boilerpalte import without object', () => {
    const template = new Boilerplate();
    expect(template);
  });
  test('boilerpalte import without fonts', () => {
    const template = new Boilerplate();
    expect(template.fonts).toBe(undefined);
    expect(template.textFit).toBeInstanceOf(Function);
  });
  test('boilerpalte fonts will be turned into arrays ', () => {
    const template = new Boilerplate({ fonts: 'PUT_ALL_FONT_NAMES_HERE' });
    expect(template.fonts).toStrictEqual(['PUT_ALL_FONT_NAMES_HERE']);
  });
  test('boilerpalte fonts can be an array', () => {
    const template = new Boilerplate({ fonts: ['PUT_ALL_FONT_NAMES_HERE'] });
    expect(template.fonts).toStrictEqual(['PUT_ALL_FONT_NAMES_HERE']);
  });
  test('boilerpalte blank font arrays ', () => {
    const template = new Boilerplate({ fonts: [] });
    expect(template.fonts).toStrictEqual([]);
  });
  test('boilerpalte fonts can be an array of many items', () => {
    const template = new Boilerplate({ fonts: ['Outfit', 'Bendgio Sans'] });
    expect(template.fonts).toStrictEqual(['Outfit', 'Bendgio Sans']);
  });
  test('check default values are be set', () => {
    const template = new Boilerplate();
    expect(template.fonts).toStrictEqual(undefined);
    expect(template.ensureImagesLoad).toStrictEqual(true);
    expect(template.exportReduceFont).toStrictEqual(0);
    // expect(template.variables).toStrictEqual({});
  });
  test('check values can be changed', () => {
    const template = new Boilerplate({
      fonts: ['Test'],
      ensureImagesLoad: false,
      addCrop: false,
      exportReduceFont: 0.4,
      cssVariables: '--plum: red;',
      random:
        "this will not be saved as it's not something I know what to do with",
    });
    expect(template.fonts).toStrictEqual(['Test']);
    expect(template.ensureImagesLoad).toStrictEqual(false);
    expect(template.exportReduceFont).toStrictEqual(0.4);
    expect(template.random).toStrictEqual(undefined);
  });
  test('check error get thrown if no html is found', async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const template = new Boilerplate({ variables: { test: 'hey' } });
    } catch (e) {
      expect(e).toBe(
        "No fonts were put in the boilerplate config. For example { fonts: ['IBM Plex Sans'] }",
      );
    }
  });
});
// I want to test this but I hvaven't worked out how to check console logs TODO
// describe('defaultsRemoved', function () {
//   afterEach(() => {
//     jest.resetModules();
//   });

//   test('check start() throws expected errors if title is missing', () => {
//     let template = new Boilerplate();
//     document.head.innerHTML = `
//       <title>PUT_TEMPLATE_NAME_HERE</title>`;
//     return utilities.defaultsRemoved().then(() => {
//       expect(true).toBe(false);
//     }).catch(e => {
//       expect(e).to.include('Please put the name of the template in the title of the document');
//     });
//   });
//   test('check start() throws expected errors if title is missing 2', () => {
//     let template = new Boilerplate();
//     document.head.innerHTML = `<title></title>`;
//     return utilities.defaultsRemoved().then(() => {
//       expect(true).toBe(false);
//     }).catch(e => {
//       expect(e).to.include('Please put the name of the template in the title of the document');
//     });
//   });
//   test('check start() throws expected errors if html meta tag name is missing', async () => {
//     let template = new Boilerplate();
//     document.head.innerHTML = `
//       <title>Title</title>
//       <meta name="template-built-by" content="PUT_YOUR_NAME_HERE"/>`
//       return utilities.defaultsRemoved().then(() => {
//         expect(true).toBe(false);
//         }).catch(e => {
//         expect(e).to.include('Please add your name in the document meta tags');
//       })
//   })
//   test('check start() throws expected errors if html meta tag name is missing 2', async () => {
//     let template = new Boilerplate();
//     document.head.innerHTML = `
//     <title>Title</title>
//     <meta name="template-built-by" content=""/>`
//     return utilities.defaultsRemoved().then(() => {
//       expect(true).toBe(false);
//     }).catch(e => {
//       expect(e).to.include('Please add your name in the document meta tags');
//     })
//   });
//   test('check start() throws expected errors if html meta tag scope is missing', async () => {
//     let template = new Boilerplate();
//     document.head.innerHTML = `
//     <title>Title</title>
//     <meta name="template-built-by" content="Sam"/>
//     <meta name="scope" content="DTB-PUT_JIRA_NUMBER_HERE"/>`
//     return utilities.defaultsRemoved().then(() => {
//       expect(true).toBe(false);
//     }).catch(e => {
//       expect(e).to.include('Please add the scope card ID in the document meta tags');
//     })
//   });
//   test('check start() throws expected errors if html meta tag scope is missing 2', async () => {
//     let template = new Boilerplate();
//     document.head.innerHTML = `
//     <title>Title</title>
//     <meta name="template-built-by" content="Sam"/>
//     <meta name="scope" content=""/>`
//     return utilities.defaultsRemoved().then(() => {
//       expect(true).toBe(false);
//     }).catch(e => {
//       expect(e).to.include('Please add the scope card ID in the document meta tags');
//     })
//   });
//   test('check start() throws expected errors if html meta tag build is missing', async () => {
//     let template = new Boilerplate();
//     document.head.innerHTML = `
//     <title>Title</title>
//     <meta name="template-built-by" content="Sam"/>
//     <meta name="scope" content="DTB-123"/>
//     <meta name="build" content="DTB-PUT_JIRA_NUMBER_HERE"/>`
//     return utilities.defaultsRemoved().then(() => {
//       expect(true).toBe(false);
//     }).catch(e => {
//       expect(e).to.include('Please add the build card ID in the document meta tags');
//     })
//   });
//   test('check start() throws expected errors if html meta tag build is missing', async () => {
//     let template = new Boilerplate();
//     document.head.innerHTML = `
//     <title>Title</title>
//     <meta name="template-built-by" content="Sam"/>
//     <meta name="scope" content="DTB-123"/>
//     <meta name="build" content=""/>`
//     return utilities.defaultsRemoved().then(() => {
//       expect(true).toBe(false);
//     }).catch(e => {
//       expect(e).to.include('Please add the build card ID in the document meta tags');
//     })
//   });
// eslint-disable-next-line max-len
//   test('check start() throws expected errors if "Template Admin Build Instructions" comment has not been removed', async () => {
//     let template = new Boilerplate();
//     document.head.innerHTML = `<!--  Template Admin Build Instructions
//       1. Fill Out Title Meta-Data
//       2. Fill Out Scope Card Meta-Data (you can find this number linked on the Jira Card)
//       3. Fill Out Build Card Meta-Data
//       4. Remove this comment
//     -->
//     <title>Title</title>
//     <meta name="template-built-by" content="Sam"/>
//     <meta name="scope" content="DTB-123"/>
//     <meta name="build" content="DTB-456"/>`
//     return utilities.defaultsRemoved().then(() => {
//       expect(true).toBe(false);
//     }).catch(e => {
// eslint-disable-next-line max-len
//       expect(e).to.include('Please remove the "Template Admin Build Instructions" comment from the top of the document');
//     })
//   });
// });
