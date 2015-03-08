<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
    
    <link rel="stylesheet" href="http://openlayers.org/en/v3.0.0/css/ol.css" type="text/css">
    <script src="./js/ol.js" type="text/javascript"></script>
    <script src="https://code.jquery.com/jquery-2.1.3.min.js" type="text/javascript"></script>
    
    <script type="text/javascript" src="./qwebchannel.js"></script>
    <script type="text/javascript" src="js/grazwiki.js"></script>
        
    
    <title>GrazWiki</title>
    <style>
      
      html, body, #map {
                margin: 0;
                width: 100%;
                height: 100%;
      }
    
      .map {
        background: white;
      }
      
      #socketer {
        position: absolute;
        right: 10px;
        bottom: 10px;
        width: 250px;
        height: 140px;
        background-color: white;
        border: 1px solid gray;
      }
      
    </style>
  </head>
  <body>
    <div id="map" class="map"></div>
    
<div id="socketer">    
    <!-- Status: <span id="status"></span><br />
  URL: <input id="url" /><br />
  <input id="open" type="button" value="Connect" />&nbsp;
  <input id="close" type="button" value="Disconnect" /><br />
  <input id="send" type="button" value="Send" />&nbsp;       -->
  <input id="input" /> <input type="submit" id="send" value="Send" onclick="javascript:click();" />
  <span id="message"></span>
  <input id="message_2" value="message_2">
</div>

    <script src="./js/wmts.js?t=<?php echo time() ?>" type="text/javascript"></script>
    

  </body>
</html>
