<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <script type="text/javascript" src="./qwebchannel.js"></script>
        <script type="text/javascript">
            //BEGIN SETUP


            function output(message)
            {
                var output = document.getElementById("output");
                output.innerHTML = output.innerHTML + message + "\n";
            }

            window.onload = function() {
                //var baseUrl = (/[?&]webChannelBaseUrl=([A-Za-z0-9\-:/\.]+)/.exec(location.search)[1]);
              try {
                var baseUrl = "ws://127.0.0.1:12345";
                output("Connecting to WebSocket server at " + baseUrl + ".");
                var socket = new WebSocket(baseUrl);

                socket.onclose = function()
                {
                    //console.error("web channel closed");
                    output("close");
                };

                socket.onerror = function(error)
                {
                    output("error");
                    //console.error("web channel error: " + error);
                };

                socket.onopen = function()
                {
                    output("WebSocket connected, setting up QWebChannel.");

                    new QWebChannel(socket, function(channel) {
                        // make dialog object accessible globally
                        window.dialog = channel.objects.dialog;

                        document.getElementById("send").onclick = function() {
                            var input = document.getElementById("input");
                            var text = input.value;
                            if (!text) {
                                return;
                            }

                            output("Sent message: " + text);
                            input.value = "";
                            dialog.receiveText(text);
                        }

                        dialog.sendText.connect(function(message) {
                            output("Received message: " + message);
                        });

                        dialog.receiveText("Client connected, ready to send/receive messages!");
                        output("Connected to WebChannel, ready to send/receive messages!");
                    });
                }

              } catch (e) {
                output('Sorry, the web socket is un-available');
                output(e);
              }
            }
            //END SETUP
        </script>
        <style type="text/css">
            html {
                height: 100%;
                width: 100%;
            }
            #input {
                width: 400px;
                margin: 0 10px 0 0;
            }
            #send {
                width: 90px;
                margin: 0;
            }
            #output {
                width: 500px;
                height: 150px;
            }
        </style>
    </head>
    <body>
        <textarea id="output"></textarea><br />
        <input id="input" /><input type="submit" id="send" value="Send" onclick="javascript:click();" />
    </body>
</html>

