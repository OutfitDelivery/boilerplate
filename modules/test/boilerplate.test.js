const boilerplate = require('../boilerplate').default;

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
    expect(template.allowLegacyRendering).toStrictEqual(false);
    expect(template.exportReduceFont).toStrictEqual(0);
    expect(template.firefoxReduceFont).toStrictEqual(0);
    expect(template.variables).toStrictEqual({});
  });
  test('check values can be changed', () => {
    var template = new boilerplate({
      fonts : ['Test'],
      ensureImagesLoad : false,
      allowLegacyRendering : true,
      exportReduceFont : 0.4,
      firefoxReduceFont : 555,
      variables: { var1: 'test' }
    });
    expect(template.fonts).toStrictEqual(['Test']);
    expect(template.ensureImagesLoad).toStrictEqual(false);
    expect(template.allowLegacyRendering).toStrictEqual(true);
    expect(template.exportReduceFont).toStrictEqual(0.4);
    expect(template.firefoxReduceFont).toStrictEqual(555);
    expect(template.variables).toStrictEqual({
      var1: 'test'
    });
  });
  test('check start() error get thrown if no html is found', async () => {
    var template = new boilerplate({variables: { test: 'hey'}});
    return template.start().then(d => {
      // there should always be an error meaning this line is used to detect when an error isn't thrown
      expect(true).toBe(false); 
    }).catch(e => {
      expect(e).toBe("No fonts were put in the boilerplate config. For example { fonts: ['IBM Plex Sans'] }");
    });
  });
});
describe('defaultsRemoved', function () {
  afterEach(() => {
    jest.resetModules();
  });

  test('check start() throws expected errors if title is missing', () => {
    let template = new boilerplate();
    document.head.innerHTML = `
      <title>PUT_TEMPLATE_NAME_HERE</title>`;
    return template.defaultsRemoved().then(() => {
      expect(true).toBe(false);
    }).catch(e => {
      expect(e).toBe('Please put the name of the template in the title of the document');
    });
  });
  test('check start() throws expected errors if title is missing 2', () => {
    let template = new boilerplate();
    document.head.innerHTML = `<title></title>`;
    return template.defaultsRemoved().then(() => {
      expect(true).toBe(false);
    }).catch(e => {
      expect(e).toBe('Please put the name of the template in the title of the document');
    });
  });
  test('check start() throws expected errors if html meta tag name is missing', async () => {
    let template = new boilerplate();
    document.head.innerHTML = `
      <title>Title</title>
      <meta name="template-built-by" content="PUT_YOUR_NAME_HERE"/>`
      return template.defaultsRemoved().then(() => {
        expect(true).toBe(false);
        }).catch(e => {
        expect(e).toBe('Please add your name in the document meta tags');
      })
  })
  test('check start() throws expected errors if html meta tag name is missing 2', async () => {
    let template = new boilerplate();
    document.head.innerHTML = `
    <title>Title</title>
    <meta name="template-built-by" content=""/>`
    return template.defaultsRemoved().then(() => {
      expect(true).toBe(false);
    }).catch(e => {
      expect(e).toBe('Please add your name in the document meta tags');
    })
  });
  test('check start() throws expected errors if html meta tag scope is missing', async () => {
    let template = new boilerplate();
    document.head.innerHTML = `
    <title>Title</title>
    <meta name="template-built-by" content="Sam"/>
    <meta name="scope" content="DTB-PUT_JIRA_NUMBER_HERE"/>`
    return template.defaultsRemoved().then(() => {
      expect(true).toBe(false);
    }).catch(e => {
      expect(e).toBe('Please add the scope card ID in the document meta tags');
    })
  });
  test('check start() throws expected errors if html meta tag scope is missing 2', async () => {
    let template = new boilerplate();
    document.head.innerHTML = `
    <title>Title</title>
    <meta name="template-built-by" content="Sam"/>
    <meta name="scope" content=""/>`
    return template.defaultsRemoved().then(() => {
      expect(true).toBe(false);
    }).catch(e => {
      expect(e).toBe('Please add the scope card ID in the document meta tags');
    })
  });
  test('check start() throws expected errors if html meta tag build is missing', async () => {
    let template = new boilerplate();
    document.head.innerHTML = `
    <title>Title</title>
    <meta name="template-built-by" content="Sam"/>
    <meta name="scope" content="DTB-123"/>
    <meta name="build" content="DTB-PUT_JIRA_NUMBER_HERE"/>`
    return template.defaultsRemoved().then(() => {
      expect(true).toBe(false);
    }).catch(e => {
      expect(e).toBe('Please add the build card ID in the document meta tags');
    })
  });
  test('check start() throws expected errors if html meta tag build is missing', async () => {
    let template = new boilerplate();
    document.head.innerHTML = `
    <title>Title</title>
    <meta name="template-built-by" content="Sam"/>
    <meta name="scope" content="DTB-123"/>
    <meta name="build" content=""/>`
    return template.defaultsRemoved().then(() => {
      expect(true).toBe(false);
    }).catch(e => {
      expect(e).toBe('Please add the build card ID in the document meta tags');
    })
  });
  test('check start() throws expected errors if "Template Admin Build Instructions" comment has not been removed', async () => {
    let template = new boilerplate();
    document.head.innerHTML = `<!--  Template Admin Build Instructions 
      1. Fill Out Title Meta-Data
      2. Fill Out Scope Card Meta-Data (you can find this number linked on the Jira Card)
      3. Fill Out Build Card Meta-Data
      4. Remove this comment
    -->
    <title>Title</title>
    <meta name="template-built-by" content="Sam"/>
    <meta name="scope" content="DTB-123"/>
    <meta name="build" content="DTB-456"/>`
    return template.defaultsRemoved().then(() => {
      expect(true).toBe(false);
    }).catch(e => {
      expect(e).toBe('Please remove the "Template Admin Build Instructions" comment from the top of the document');
    })
  });
});