// import { setSize } from '../pageSetup.js'
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
  test('check setSize() runs', () => {
    let template = new boilerplate();
    return template.setSize().then(() => {
      expect(document.querySelector('html').style.fontSize).toBe('48.16748px')
    }).catch((e) => {
      expect(e).toBe(false);
    });
  });
  test('check setSize() runs at known size', () => {
    // Change the viewport to 500px.
    global.innerWidth = 500;
    global.innerHeight = 500;
    let template = new boilerplate();
    return template.setSize().then(() => {
      expect(document.querySelector('html').style.fontSize).toBe('30.11148px')
    }).catch((e) => {
      expect(e).toBe(false);
    });
  });
  test('check setSize() runs at known size2', () => {
    // Change the viewport to 500px.
    global.innerWidth = 1500;
    global.innerHeight = 1500;
    let template = new boilerplate();
    return template.setSize().then(() => {
      expect(document.querySelector('html').style.fontSize).toBe('84.11147999999999px')
    }).catch((e) => {
      expect(e).toBe(false);
    });
  });
  test('check setSize() runs at resize', async () => {
    let template = new boilerplate();
    // Change the viewport to 500px.
    global.innerWidth = 1500;
    global.innerHeight = 1500;

    await template.setSize()
    expect(document.querySelector('html').style.fontSize).toBe('84.11147999999999px');

    // Change the viewport to 500px.
    global.innerWidth = 100;
    global.innerHeight = 1500;
    global.dispatchEvent(new Event('resize'));

    expect(document.querySelector('html').style.fontSize).toBe('84.11147999999999px');
  });
});