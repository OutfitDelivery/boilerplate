import { charLimit, dynamicAssign, maxHeightCheck, maxLineCheck, getWidth, getHeight, countLines } from '../limiters'

describe('getHeight', () => {
  test('check getHeight() runs', () => {
    document.body.innerHTML = `
      <style>
        .container {
          height: 100%;
          width: 100%;
        }
        .testBox {
          height: 100px;
        }
      </style>
      <div class="container">
        <div class="testBox">
          some text here
        </div>
      </div>
    ` 
    let testBox = document.querySelector('.testBox');
    let height = getHeight(testBox)
    expect(height).toBe(100);
  });
  test('check getHeight() runs', () => {
    document.body.innerHTML = `
      <style>
        .container {
          height: 100%
          width: 100%;
          line-height: 1;
          display: block;
        }
        .testBox {
          width: 100%;
          height: 100px;
          padding-bottom: 10px;
          margin-bottom: 10px;
          display: block;
        }
      </style>
      <div class="container">
        <p class="testBox">
          <span>
            some text here
          </span>
        </p>
      </div>
    ` 
    let testBox = document.querySelector('.testBox');
    let height = getHeight(testBox)
    let lines = countLines(testBox)
    expect(height).toBe(100);
    expect(testBox.dataset.calculatedHeight).toBe("100");
    expect(lines).toBe(0);
    expect(testBox.dataset.calculatedLinesCount).toBe("0");

  });
  // TODO test line counting and line counting with textfix 
  // inner elements such as strong/p/em/span tags effect line counting as they don't always have the same height as the parent 
});