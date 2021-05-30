const boilerplate = require('../boilerplate').default;
const utilities = require('../utilities');

test('1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
});
describe('import tests', () => {
  test('boilerpalte import', () => {
      var template = new boilerplate({});
      expect(template);
  });
  test('boilerpalte import without object', () => {
    var template = new boilerplate();
    expect(template);
  });
  test('boilerpalte import can set values 1', () => {
    var template = new boilerplate({fonts: 'PUT_ALL_FONT_NAMES_HERE'});
    expect(template.fonts).toBe('PUT_ALL_FONT_NAMES_HERE');
  });
  test('check default values are be set', () => {
    var template = new boilerplate({});
    expect(template.fonts).toStrictEqual([]);
    expect(template.ensureImagesLoad).toStrictEqual(true);
    expect(template.exportReduceFont).toStrictEqual(0);
    // expect(template.variables).toStrictEqual({});
  });
  test('check values can be changed', () => {
    var template = new boilerplate({
      fonts : ['Test'],
      ensureImagesLoad : false,
      addCrop : false,
      allowLegacyRendering : true,
      exportReduceFont : 0.4,
      cssVariables: '--plum: red;', 
      random: 'this will not be saved as it\'s not something I know what to do with'
    });
    expect(template.fonts).toStrictEqual(['Test']);
    expect(template.ensureImagesLoad).toStrictEqual(false);
    expect(template.exportReduceFont).toStrictEqual(0.4);
  });
  test('check error get thrown if no html is found', async () => {
    try {
      var template = new boilerplate({variables: { test: 'hey' }});
    } catch (e) {
      expect(e).toBe("No fonts were put in the boilerplate config. For example { fonts: ['IBM Plex Sans'] }");
    }
  });
});
// I want to test this but I hvaven't worked out how to check console logs TODO
// describe('defaultsRemoved', function () {
//   afterEach(() => {
//     jest.resetModules();
//   });

//   test('check start() throws expected errors if title is missing', () => {
//     let template = new boilerplate();
//     document.head.innerHTML = `
//       <title>PUT_TEMPLATE_NAME_HERE</title>`;
//     return utilities.defaultsRemoved().then(() => {
//       expect(true).toBe(false);
//     }).catch(e => {
//       expect(e).to.include('Please put the name of the template in the title of the document');
//     });
//   });
//   test('check start() throws expected errors if title is missing 2', () => {
//     let template = new boilerplate();
//     document.head.innerHTML = `<title></title>`;
//     return utilities.defaultsRemoved().then(() => {
//       expect(true).toBe(false);
//     }).catch(e => {
//       expect(e).to.include('Please put the name of the template in the title of the document');
//     });
//   });
//   test('check start() throws expected errors if html meta tag name is missing', async () => {
//     let template = new boilerplate();
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
//     let template = new boilerplate();
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
//     let template = new boilerplate();
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
//     let template = new boilerplate();
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
//     let template = new boilerplate();
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
//     let template = new boilerplate();
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
//   test('check start() throws expected errors if "Template Admin Build Instructions" comment has not been removed', async () => {
//     let template = new boilerplate();
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
//       expect(e).to.include('Please remove the "Template Admin Build Instructions" comment from the top of the document');
//     })
//   });
// });