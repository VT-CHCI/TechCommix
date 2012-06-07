/* Author:

*/

//=======================================================================================
//
// Function to make all columns heights equal used from
// (http://nopeople.com/CSS%20tips/jQuery_equal_columns/index.html)
//
//=======================================================================================

function equalHeight(group) {
  tallest = 0;
  group.each(function() {
    thisHeight = $(this).height();
    if(thisHeight > tallest) {
      tallest = thisHeight;
    }
  });
  group.height(tallest);
}

$(document).ready(function(){
  
  // Set columns to equal heights
  equalHeight($('.column'));

  $('.left-column').each(function() {
    $(this).height($('#dita-file').height()-$(this).css("padding-top").replace("px", "")-$(this).css("padding-bottom").replace("px", ""));
  });


  $('#workarea').droppable({
    drop: function( event, ui ) {
      $( this )
        .addClass( "ui-state-highlight" )
        .find( "p" )
        .html( "Dropped!" );
      // Put command back and highlight completed
      ui.draggable
      // Create text object and corresponding dictionary of steps currently in the svg
    }
  });

  



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

    var reader = new FileReader();  

    reader.onload = function (evt) {  
      $('#transformResult').getTransform(
      '_files/getSteps.xsl',
      evt.target.result
      );
      var steps = $($('#transformResult').children()[0]).children();
      $("#transformResult").text("");
      $("#transformResult").append(steps);

      steps.each(function() {
        $(this).draggable();
        $(this).addClass("steps-unused");
      });

      $(".step.ui-draggable").hover(
        function() {
          $(this).addClass("step-hover");
        },
        function() {
          $(this).removeClass("step-hover");
        }
      ).mousedown(function() {
        $(this).addClass("step-dragged");
      });


      hideOriginalDita();
    }  
    reader.readAsText(files[0]);
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  // Prevent drop outside dnd
  $(document).bind('drop dragover', function(event) { 
    if (!$(event.target).hasClass("ui-droppable")) {
      event.preventDefault(); 
      event.dataTransfer.dropEffect = 'none';
    } 
  });

  // Originally solved by Tim Branyen in his drop file plugin
  // http://dev.aboutnerd.com/jQuery.dropFile/jquery.dropFile.js
  // found by way of https://gist.github.com/748534
  jQuery.event.props.push('dataTransfer');

  //Setup listeners
  $('#dropZone').bind('dragover', handleDragOver);
  $('#dropZone').bind('drop', handleFileSelect);
  $('#fileButton').change(handleFileSelect);
  
  //make some tabs
  $("#tabs").tabs();

  function hideOriginalDita() {
    $('#original-dita').animate({
      marginLeft: '-=150'
    }, 1000, function() {
      // Animation complete.
    });
    $('#extracted-dita').animate({
      width: '+=150'
    }, 1000, function() {
      // Animation complete.
    });
  };

});

  