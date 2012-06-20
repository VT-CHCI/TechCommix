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

var stepsInUse = {};
var availableCharacters = [];
var charsToBubbles = {};
var ignoreChars = [];

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
      
      // weird constants to help position text
      var empiricalLeft = 0;
      var empiricalTop = 123;

      //add a new text object to the canvas
      var textId = svgCanvas.getNextId();

      svgCanvas.addSvgElementFromJson({
        "element": "text",
        "curStyles": true,
        "attr": {
          "x": ui.draggable.position().left-$("#canvasBackground").position().left+ui.draggable.width()/2+empiricalLeft, 
          "y": ui.draggable.position().top-$("#canvasBackground").position().top+ui.draggable.height()/2+empiricalTop,
          "id": textId,
          "fill": "#000000",
          "stroke-width": 0,
          "font-size": 24,
          "font-family": "serif",
          "text-anchor": "middle",
          "xml:space": "preserve",
          "opacity": 1,
          "step-id": ui.draggable.attr("id")
        }
      });      

      //set the text of the new text object
      $("#"+textId).text(ui.draggable.text());
      $("#"+textId).text(ui.draggable.text());

      // Put command back and highlight completed
      ui.draggable.addClass("dita-steps-used");
      ui.draggable.removeClass("dita-steps-unused");


      // Create corresponding dictionary of steps currently in the svg
      if(stepsInUse[ui.draggable.attr("id")])
      {
        stepsInUse[ui.draggable.attr("id")].push(textId);
      } else {
        stepsInUse[ui.draggable.attr("id")] = [textId];
      }

      $("#"+textId).hover(function() {
        $("#"+ui.draggable.attr("id")).addClass("highlight");
      },
      function() {
        $("#"+ui.draggable.attr("id")).removeClass("highlight");
      });

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

  function highlightCorrespondingElems(stepId) {
    if (stepsInUse && stepsInUse[stepId]) {
      for (var i = 0; i < stepsInUse[stepId].length; i++) {
        var svgElem = $("#"+stepsInUse[stepId][i]);
        svgElem.attr("orig-fill", svgElem.attr("fill"));
        var newColor = oppositeClr(svgElem.attr("orig-fill"));        
        svgElem.attr("fill", "rgb("+newColor[0]+","+newColor[1]+","+newColor[2]+")");
      }
    }
  }
  

  function oppositeClr(hexStr) {
    return [255,0,0]; //turn out it looks terrible to use the opposite color.
    // var hex = "";
    // if (hexStr.length == 7) {
    //   hex = parseInt(hexStr.substring(1), 16);
    // }
    // else {
    //   var tmp = "" +hexStr[1]+hexStr[1]+hexStr[2]+hexStr[2]+hexStr[3]+hexStr[3]
    //   hex = parseInt(tmp.substring(1), 16);
    // }
    // var r = (hex & 0xff0000) >> 16;
    // var g = (hex & 0x00ff00) >> 8;
    // var b = hex & 0x0000ff;
    // var rgbCurrent = [r, g, b];
    // var oppositeColor = [];
    // if (rgbCurrent[0] != 0 || rgbCurrent[0] != 0 || rgbCurrent[0] != 0) {
    //   oppositeColor = [255-rgbCurrent[0], 255-rgbCurrent[1], 255-rgbCurrent[2]];
    // }
    // else {
    //   oppositeColor = [255,0,0];
    // }
    // return oppositeColor;
  }



  function unhighlightCorrespondingElems(stepId) {
    if (stepsInUse && stepsInUse[stepId]) {
      for (var i = 0; i < stepsInUse[stepId].length; i++) {
        var svgElem = $("#"+stepsInUse[stepId][i]);
        svgElem.attr("fill", svgElem.attr("orig-fill"));
        svgElem.removeAttr("orig-fill");
      }
    }
  }

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
    if (extension != 'xml' && extension != 'dita') {
      alert('Please select a valid dita filetype (.xml, .dita)');
      return;
    }

    var reader = new FileReader();  

    reader.onload = function (evt) {  
      $('#transformResult').getTransform('_files/getSteps.xsl', evt.target.result);
      var steps = $('#transformResult').children();
      $("#transformResult").text("");
      $("#transformResult").append(steps);

      steps.each(function() {
        $(this).draggable({
          revert: true,
          stop: function(event, ui) {
            $(this).removeClass("dita-step-dragged");
          }
        });
        $(this).addClass("dita-steps-unused");
      });

      $(".dita-step.ui-draggable").hover(
        function() {
          $(this).addClass("dita-step-hover");
          if ($(this).hasClass("dita-steps-used")) {
            highlightCorrespondingElems($(this).attr("id"));
          }
        },
        function() {
          $(this).removeClass("dita-step-hover");
          if ($(this).hasClass("dita-steps-used")) {
            unhighlightCorrespondingElems($(this).attr("id"));
          }
        }
      ).mousedown(function() {
        $(this).addClass("dita-step-dragged");
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

  // for some reason it was showing rulers sometimes on different computers, now it will always show them (or not)
  $('#rulers').show();

  //scrolls the workarea such that the 
  var rulerOffset = $('#rulers').is(":visible") ? $("#ruler_x").height() : 0;
  $('#workarea').scrollTop($('#workarea').scrollTop()-($('#svgcontent').attr("height")/2+rulerOffset));

  $('#workarea').bind('textDeleted', function(event, args){
    //maintain the dict of steps in the canvas
    for (var i = 0; i < args["ids"].length; i++) {
      for (var stepId in args["ids"][i]) {
        if (stepsInUse[stepId]) {
          var j = stepsInUse[stepId].indexOf(args["ids"][i][stepId]);
          stepsInUse[stepId].splice(j, j+1);
          if (stepsInUse[stepId].length == 0) {
            delete stepsInUse[stepId];
            $("#"+stepId).removeClass("dita-steps-used").addClass("dita-steps-unused");
          }
        }
      }
    }

    //maintain the dict of characters speaking
    for (var i = 0; i < args["charIdPairs"].length; i++) {
      for (var spokenBy in args["charIdPairs"][i]) {
        if (charsToBubbles[spokenBy])
        {
          var j = charsToBubbles[spokenBy].indexOf(args["charIdPairs"][i][spokenBy]);
          charsToBubbles[spokenBy].splice(j, j+1);

          if (charsToBubbles[spokenBy].length == 0) {
            delete charsToBubbles[spokenBy];
            if (ignoreChars.indexOf(spokenBy) < 0) {
              ignoreChars.push(spokenBy);
            }
          }
        }
      }
    }
  });

  //sets up autocomplete for choosing the character that is speaking

  $( "#speakingCharacterInput" ).autocomplete({
    source: function (req, resp) {
      var validChars = [];
      for (var i = 0; i < availableCharacters.length; i++) {
        if (ignoreChars.indexOf(availableCharacters[i]) < 0 && availableCharacters[i].substring(0, req["term"].length) == req["term"]) {
          validChars.push(availableCharacters[i]);
        }
      }
      resp(validChars);
    }
  });

  //when you press enter on the character name field, it will update our dictionary, 
  //the autocomplete ad add the char's name to their svg element
  $('#speakingCharacterInput').keydown(function(e) {
    if (e.which != 13) {
      return;
    }
    
    var newCharVal = $('#speakingCharacterInput').val();
    if(newCharVal.length > 0) {
      $("#"+$("#elem_id").val()).attr("spokenBy", newCharVal);
      var indexInIgnoreList = ignoreChars.indexOf(newCharVal);
      if (indexInIgnoreList >= 0) {
        ignoreChars.splice(indexInIgnoreList, indexInIgnoreList+1);
      }
      if (charsToBubbles[newCharVal]) {
        if (charsToBubbles[newCharVal].indexOf($("#elem_id").val())<0) {
          charsToBubbles[newCharVal].push($("#elem_id").val());
        }
      }
      else {
        charsToBubbles[newCharVal]=[$("#elem_id").val()];
        if (availableCharacters.indexOf(newCharVal) < 0) {
          availableCharacters.push(newCharVal);
        }
        
      }
    }
  });

});

  