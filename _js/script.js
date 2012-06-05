/* Author:

*/
$(document).ready(function(){
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }

  //=======================================================================================
  //
  // Modified file handler example (http://www.html5rocks.com/en/tutorials/file/dndfiles/) 
  // for file reading and selection. Extracting steps from dita using 
  // (http://johannburkard.de/software/xsltjs/).
  //
  //=======================================================================================

  function handleFileSelect(evt) {
  	if (evt.target.id == 'fileButton') {
  		var files = evt.target.files; // FileList object
  	}
  	else {   
  		evt.stopPropagation();
    	evt.preventDefault();

    	var files = evt.dataTransfer.files; // FileList object.

      // Checks for only one file was dropped
      if (files.length > 1) {
        alert('Please choose only one file.');
        return;
      }
  	}

    // Checks extension of file 
    var extension = files[0].name.substr( (files[0].name.lastIndexOf('.') +1) );
    if (extension != 'xml') {
      alert('Please select a valid dita filetype (.xml)');
      return;
    }

    var thisfile  = files[0];
    // oFReader = new FileReader();

    // console.log(oFReader);
    
    // oFReader.onload = (function(thisfile) {
    //   return function(e) {
    //       console.log(e);
    //       console.log('callback');
    //       alert('im here');
    //   }
    // })(thisfile);

    console.log(thisfile);

    // oFReader.readAsDataURL(thisfile);
    //$('#transformResult').xslt(theFile, "_files/getSteps.xsl");

    var reader = new FileReader();  
    reader.onload = function (evt) {  
          console.log(evt.target.result);  
    }  
    reader.readAsText(thisfile);
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  // Prevent drop outside dnd
  $(document).bind('drop dragover', function(event) { 
    event.preventDefault(); 
    event.dataTransfer.dropEffect = 'none';
  });

  // Originally solved by Tim Branyen in his drop file plugin
  // http://dev.aboutnerd.com/jQuery.dropFile/jquery.dropFile.js
  // found by way of https://gist.github.com/748534
  jQuery.event.props.push('dataTransfer');

  //Setup listeners
  $('#dropZone').bind('dragover', handleDragOver);
  $('#dropZone').bind('drop', handleFileSelect);
  $('#fileButton').change(handleFileSelect);
});

  //=======================================================================================
  //
  // This handles the .xml to .xsl conversion (http://johannburkard.de/software/xsltjs/) and
  // formatting.
  //
  //=======================================================================================

  