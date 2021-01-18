function dynamicColumnTextSetup() {
  var dynamicColumns = document.querySelectorAll("[data-dynamic-columns]");
  var htmlTags = ":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p, :scope > ul, :scope > ol";

  dynamicColumns.forEach((dynamicColumn) =>{
    var maxColumns = parseInt(dynamicColumn.getAttribute("data-max-columns"));
    var originalContent = dynamicColumn.querySelector("[data-original-content]");
    var tokenValue = originalContent.querySelector("token-value");
    if(tokenValue != null) originalContent = tokenValue;
    var htmlTagElements = originalContent.querySelectorAll(htmlTags);
    var breakPointIndexes = [];          

    htmlTagElements.forEach((el, index) =>{
      if ( (el.innerHTML).includes('[column-break]') ){
        breakPointIndexes.push(index);
      }
    });

    breakPointIndexes.push(htmlTagElements.length-1);

    var columnOutput = dynamicColumn.querySelector("[data-dynamic-content]");
    var columns = [];
    var currentBreakPoint = 0;
    var columnCount = breakPointIndexes.length;
    var htmlElementsArray = Array.prototype.slice.call(htmlTagElements);          

    breakPointIndexes.forEach((breakPoint, j) => {
      columns.push(htmlElementsArray.slice(currentBreakPoint, breakPoint));

      if(j == breakPointIndexes.length-1){
        columns[columns.length-1].push(htmlElementsArray[htmlElementsArray.length-1]);
      } else{
        currentBreakPoint = breakPoint+1;
      }
    });

    columnOutput.innerHTML = "";

    var columnStructure = document.createElement("div");
    columnStructure.setAttribute("class", "column-structure");

    columns.forEach(column => {
      var reformedHTML = "";
      column.forEach(htmlElement => {
        reformedHTML += htmlElement.outerHTML;
      });


      let columnDiv = document.createElement("div");
      columnDiv.setAttribute("class", "column");
      columnDiv.innerHTML = reformedHTML;
      columnStructure.appendChild(columnDiv);
    });

    columnOutput.appendChild(columnStructure);
  });
}
