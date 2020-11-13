/*function allImagesLoadedCallback() {
  let imagesLoaded = 0;
  const images = document.querySelectorAll('img')
  const totalImages = images.length;

  images.forEach((img) => {
    const tempImg = document.createElement('img');
    tempImg.onload = () => {
      imageLoaded();
    }

    tempImg.src = img.src;
  });

  function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded == totalImages) {
      allImagesLoaded();
    }
  }

  function allImagesLoaded() {
    maxLineCheck();
    maxHeightCheck();        
  }        
}*/


var imgs = document.images,
    len = imgs.length,
    counter = 0;

[].forEach.call( imgs, function( img ) {
    if(img.complete)
      incrementCounter();
    else
      img.addEventListener( 'load', incrementCounter, false );
} );

function incrementCounter() {
    counter++;
    if ( counter === len ) {
      maxLineCheck();
    maxHeightCheck();  
        console.log( 'All images loaded!' );
    }
}