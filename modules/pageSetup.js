const imageCompression = () => {
  var imageCompressEl = document.querySelectorAll("[data-custom-compression]");
  var editorString = "?qual=editor";

  function checkURL(editorString, url) {
    if (url.includes(editorString) || url.includes(".svg")) return false;
    return true;
  }

  imageCompressEl.forEach((el) => {
    //Non Repo Images with data-custom-compression on img element itself
    var imgSrc = el.getAttribute("src");
    console.log(imgSrc);
    if (imgSrc != null) {
      //src attribute exists assume that this is an <img> element
      if (!checkURL(editorString, imgSrc)) return;
      el.setAttribute("src", imgSrc + editorString);
    } else {
      var imgEl = el.querySelector("img");
      if (imgEl == null) return;
      var imgURL = imgEl.getAttribute("src");
      if (!checkURL(editorString, imgURL)) return;
      imgEl.setAttribute("src", imgURL + editorString);

      var bkgImgEl = el.querySelector(".outfit-resizable-background");
      if (bkgImgEl == null) return;
      var bkgUrl = bkgImgEl.style.backgroundImage
        .slice(4, -1)
        .replace(/"/g, "");
      if (!checkURL(editorString, bkgUrl)) return;
      bkgImgEl.style.backgroundImage = `url("${bkgUrl}${editorString}")`;
    }
  });
}

// https://blog.crimx.com/2017/03/09/get-all-images-in-dom-including-background-en/
// time out is set to 60 seconds as that is as long as the platform timeout
const ensureAllImagesLoaded = (doc, timeout = 6e4) => {
  return new Promise((resolve, reject) => {
    loadAllImages(Array.from(searchDOM(doc)), timeout)
      .then(resolve, reject)
  })
}

const searchDOM = (doc) => {
  const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i
  return Array.from(doc.querySelectorAll('*'))
    .reduce((collection, node) => {
      // bg src
      let prop = window.getComputedStyle(node, null)
        .getPropertyValue('background-image')
      // match `url(...)`
      let match = srcChecker.exec(prop)
      if (match) {
        collection.add(match[1])
      }
      if (/^img$/i.test(node.tagName)) {
        // src from img tag
        collection.add(node.src)
      } else if (/^frame$/i.test(node.tagName)) {
        // iframe
        try {
          searchDOM(node.contentDocument || node.contentWindow.document)
            .forEach(img => {
              if (img) { collection.add(img) }
            })
        } catch (e) {}
      }
      return collection
    }, new Set())
}

const loadImage = (src, timeout = 5000) => {
  var imgPromise = new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = () => {
      resolve({
        src: src,
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    img.onerror = reject
    img.src = src
  })
  var timer = new Promise((resolve, reject) => {
    setTimeout(reject, timeout)
  })
  return Promise.race([imgPromise, timer])
}

const loadAllImages = (imgList, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    Promise.all(
      imgList
        .map(src => loadImage(src, timeout))
        .map(p => p.catch(e => false))
    ).then(results => resolve(results.filter(r => r)))
  })
}

export { imageCompression, ensureAllImagesLoaded };
