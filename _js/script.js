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


var currentPanel = 0;

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
      var charCount = 25; //characters per line

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
          "class": "speech",
          "step-id": ui.draggable.attr("id")
        }
      });      

      var words = ui.draggable.text().split(" ");

      var wordCount = 0;
      var line = "";

      $.each(words, function() {
        if ((wordCount + this.length - 1) > charCount) {
          $("#"+textId).append(createTspan(ui.draggable.position().left-$("#canvasBackground").position().left+ui.draggable.width()/2+empiricalLeft, line.slice(0, -1)));
          wordCount = this.length + 1;
          line = this + " ";
          if (this == $(words).last()[0]) {
            $("#"+textId).append(createTspan(ui.draggable.position().left-$("#canvasBackground").position().left+ui.draggable.width()/2+empiricalLeft, line.slice(0, -1)));
          }
        }else {
          line = line + this + " ";
          wordCount = wordCount + this.length + 1;  //1 is to add for white space after word
        }
      });

      // console.log($("#"+textId).attr("x"));
      // console.log($("#"+textId).attr("y"));

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

      createSpeechBubble($("#"+textId)[0].getBBox());

      $('#output').trigger('refresh');

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

        //remove nbsp chars
        $(this).text($(this).text().replace(new RegExp(String.fromCharCode(160), "g"), " "));
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
  
  //=======================================================================================
  //
  // Create infinite carousel of panel images 
  // (http://jqueryfordesigners.com/jquery-infinite-carousel/)
  //
  //=======================================================================================
  $("#tabs").tabs();
  
  $('.infiniteCarousel .wrapper').width($('#workspace').width() - 13);

  $(window).resize(function() {
    $('.infiniteCarousel .wrapper').width($('#workspace').width() - 13);
  });

  $.getJSON('_img/stock_panels.json',function(data) {
    $.each(data, function(idx,val) {
        $("#tabs-1 ul").append('<li><img height="175" src="_img/' + val + '"></li>');
    });
    $('.infiniteCarousel img').each(function() {
      $(this).click(function() {
        var t = new Image();
        t.src = $(this).attr("src")
        $('#canvas_width').val(t.width);
        $('#canvas_height').val(t.height);
        $("#tool_docprops_save").click();
        $('#fit_to_canvas').mouseup()

        if ($('svg#svgcontent g').find('#background').length > 0 ) {
          $('svg#svgcontent g').find('#background').attr('xlink:href', $(this).attr('src'));
        }
        else {
          $("#svgroot")[0].ownerDocument.createElementNS

          var img = $("#svgroot")[0].ownerDocument.createElementNS('http://www.w3.org/2000/svg','image');
          img.setAttributeNS(null,'height', t.height);
          img.setAttributeNS(null,'width', t.width);
          img.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href', $(this).attr('src'));
          img.setAttributeNS(null,'x','0');
          img.setAttributeNS(null,'y','0');
          img.setAttributeNS(null, 'visibility', 'visible');
          img.setAttributeNS(null, 'id', 'background');

          $('svg#svgcontent g title').after(img);
        } 
      });
    });
  });
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

    //speech deleted, update our output
    $('#output').trigger('refresh');
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

  // when you press enter on the character name field, it will update our dictionary, 
  // the autocomplete ad add the char's name to their svg
  $('#speakingCharacterInput').keydown(function(e) {
    if (e.which != 13) {
      return;
    }
    
    var newCharVal = $('#speakingCharacterInput').val();
    if(newCharVal.length > 0) {
      $("#"+$("#elem_id").val()).attr("spokenby", newCharVal);
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

      $('#speakingCharacterInput').blur();

      $('#output').trigger('refresh');
    }
  });

  //generate output
  $('#output').bind('refresh', function(event, args){
    var pres = [];
    var validChars = [];
    for (var i = 0; i < availableCharacters.length; i++) {
      if (ignoreChars.indexOf(availableCharacters[i]) < 0) {
        //character not ignored so put them in the characters list
        validChars.push(availableCharacters[i]);
      }
    }

    var characters = [];
    for (var i=0; i < validChars.length; i++) {
      characters.push('      <character name="' + validChars[i] + '" id="' + validChars[i].toLowerCase() + '"/>');
    }

    var prefix = [
      "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
      "<?xml-stylesheet type=\"text/xsl\" href=\"example.xslt\"?>",
      "<comic version=\"0.2\">",
      "  <title>Why you should change your password</title>",
      "  <people>",
      "    <person>",
      "      <firstname>Michael</firstname>",
      "      <surname>Stewart</surname>",
      "      <email>tgm@vt.edu</email>",
      "      <url>http://www.vt.edu</url>",
      "      <role>Researcher</role>",
      "    </person>",
      "  </people>",
      "  <last-built>2012-06-22</last-built>",
      "  <description>A brief description of why we're requiring the password change.</description>",
      "  <url>http://answers.vt.edu</url>",
      "  <strip id=\"password-concept-1\" conceptref=\"c01PWDchangerequirements.xml#c01PWDchangerequirements\">",
      "    <characters>"];
      prefix.push.apply(prefix, characters);
      prefix.push.apply(prefix, 
      [
        "    </characters>",
        "    <panels>"
      ]);

    $("#allPanels .panel").each(function(){
      prefix.push.apply(prefix, [
        "      <panel>",
        "        <panel-desc>"]
      );

      var speeches = [];
      $(this).children().find("text.speech").sort(function (a,b) {
        return $(a).attr("speechorder") - $(b).attr("speechorder");
      }).each(function(){
        var speechXmlElem = "          <speech characterid=\"";
        speechXmlElem += $(this).attr("spokenby") + "\"";
        speechXmlElem += " x=\"" + $(this).attr("x") + "\" y=\"" + $(this).attr("y") +"\">";
        speechXmlElem += $(this).text() + "</speech>";
        speeches.push(speechXmlElem);
      });

      prefix.push.apply(prefix,speeches);

      var closePanels = ["        </panel-desc>", "      </panel>"];

      prefix.push.apply(prefix, closePanels);
    });

    var suffix = 
    [
      "    </panels>",
      "  </strip>",
      "</comic>"
    ];

    prefix.push.apply(prefix,suffix);

    //replace angle brackets with displayable characters 
    $.each(prefix, function(idx,val){
      prefix[idx] = val.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    });

    pres.push(prefix.join("</pre>\n<pre>"));
    $("#outputXML").children().remove();
    $("#outputXML").append("<pre>"+pres.join("\n") + "</pre>");
  });

  $("#speechOrderInput").change(function(){
    $('#output').trigger('refresh');
  });

  $("#saveAndNext").click(function(){
    $("#tool_select").click();
    if ($("#allPanels").children().length == currentPanel) {
      $("#allPanels").append($('<div class="panel"></div>').append(svgCanvas.getSvgString()));
    }
    else {
      $("#allPanels div:nth-child("+(currentPanel)+") svg").replaceWith(svgCanvas.getSvgString());
    }
    currentPanel = $("#allPanels").children().length;
    var objId = svgCanvas.getCurrentDrawing().obj_num;
    svgCanvas.setSvgString('<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg"> <!-- Created with SVG-edit - http://svg-edit.googlecode.com/ --> <g> <title>Layer 1</title> </g> </svg>');    
    svgCanvas.getCurrentDrawing().obj_num = objId;

    $("#saveLoadPrev").removeClass("hidden");
    $('#output').trigger('refresh');
  });

  $("#saveLoadPrev").click(function(){
    $("#tool_select").click();
    if (currentPanel == 1) {
      $("#saveLoadPrev").toggleClass("hidden");
    }

    if ($("#allPanels").children().length == currentPanel) {
      $("#allPanels").append($('<div class="panel"></div>').append(svgCanvas.getSvgString()));
    }
    else {
      $("#allPanels div:nth-child("+(currentPanel+1)+") svg").replaceWith(svgCanvas.getSvgString());
    }
    
    var objId = svgCanvas.getCurrentDrawing().obj_num;
    svgCanvas.setSvgString($("#allPanels div:nth-child("+(currentPanel--)+")").html());
    svgCanvas.getCurrentDrawing().obj_num = objId;
    $("#saveLoadNext").removeClass("hidden");
    $('#output').trigger('refresh');
  });

  $("#saveLoadNext").click(function(){
    $("#tool_select").click();
    $("#saveLoadPrev").removeClass("hidden");
    if (currentPanel == $("#allPanels").children().length-2) {
      $("#saveLoadNext").addClass("hidden");
    }

    $("#allPanels div:nth-child("+(++currentPanel)+") svg").replaceWith(svgCanvas.getSvgString());
   
    var objId = svgCanvas.getCurrentDrawing().obj_num;
    svgCanvas.setSvgString($("#allPanels div:nth-child("+(currentPanel+1)+")").html());
    svgCanvas.getCurrentDrawing().obj_num = objId;
    $('#output').trigger('refresh');
  });

});

function createSpeechBubble(bbox) {
  var adjBBox = bbox;

  adjBBox.x += $("#canvasBackground").position().left;
  adjBBox.y += $("#canvasBackground").position().top;
  
  // console.log(adjBBox);

  var selectBubbleTool = jQuery.Event("mouseup");
  selectBubbleTool.target = $("#shapelib_dialog_balloon_1>svg");
  $('#shape_buttons').trigger(selectBubbleTool);

  var downBubblePen = jQuery.Event("mousedown");
  downBubblePen.pageX = adjBBox.x - 5;
  downBubblePen.pageY = adjBBox.y;
  // var moves = []
  var moveBubblePen = jQuery.Event("mousemove");
  var finishX = adjBBox.x+adjBBox.width;
  var finishY = adjBBox.y+adjBBox.height + 30;
  moveBubblePen.pageX = finishX;
  moveBubblePen.pageY = finishY;

  var upBubblePen = jQuery.Event("mouseup");
  upBubblePen.pageX = finishX;
  upBubblePen.pageY = finishY;

  $("#svgcanvas").trigger(downBubblePen);
  $("#svgcanvas").trigger(moveBubblePen);
  $("#svgcanvas").trigger(upBubblePen); //race condition here

  svgCanvas.moveUpDownSelected("Down");
  // console.log(svgCanvas);

  $("#tool_select").click()
}

function createTspan(xVal,text) {
  var tspan_element = document.createElementNS("http://www.w3.org/2000/svg", "tspan");       // Create new tspan element
  tspan_element.setAttributeNS(null, "x", xVal);
  tspan_element.setAttributeNS(null, "dy", "1.2em");
  tspan_element.textContent=text;

  return tspan_element;
}

