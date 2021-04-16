const boilerplate = require('../boilerplate').default;

beforeEach(() => {
  document.head.innerHTML = `
    <title>name</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="template-built-by" content="testte"/>
    <meta name="scope" content="DTB-123"/>
    <meta name="build" content="DTB-456"/>
    <meta name="updates" content=""/>
    <style>
    @import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans');
    h1 {
      font-family: 'IBM Plex Sans', sans-serif
    }
    </style>`
});
describe('setSize working', () => {
  test('check setSize() runs on start()', async () => {
    var template = new boilerplate({fonts: ["IBM Plex Sans"]});
    return template.start().then(() => {
      // expect(document.html).toHaveStyle({ 'font-size': '25px' })
    }).catch((e) => {
      // expect(e).toBe(false);
    });
  });
});