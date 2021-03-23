// Temporary solution used cause conditional tags for text inputs 
// that include heading formatting are not working
function hideEmptyTitles() {
    const titles = document.querySelectorAll('.u-heading-patch');
    
    if ( titles === null ) return;
    
    titles.forEach( title => {
      const isEmpty = title.innerText.trim().length == 0;
      const childNodes = title.querySelectorAll('*');
      
      // If all the elements inside the container are empty 'u-hide' is applied to the container
      isEmpty ? title.classList.add('u-hide') : title.classList.remove('u-hide');       
  
      // Looping through all the child elements and hiding empty ones
      // in case there are more elements and not all of them are empty
      childNodes.forEach(childNode => {
        const lineBreakCheck = childNode.tagName !== 'BR';
        const tokenCheck = childNode.tagName !== 'TOKEN-VALUE';
        const emptyCheck = childNode.innerText.trim().length === 0;
        
        if ( emptyCheck && lineBreakCheck && tokenCheck ) {
          childNode.classList.add('u-hide');
        } else {
          childNode.classList.remove('u-hide');
        }
      })
    });
  }
