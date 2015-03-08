function output(message) {
  var output = document.getElementById("message");
  //output.innerHTML = output.innerHTML + message + "\n";
  output.innerHTML = message + "\n";
}


window.onload = function() {

              try {
                var baseUrl = "ws://127.0.0.1:12345";
                //var baseUrl = "ws://grazwiki.zobl.at:8080";
                //output("Connecting to WebSocket server at " + baseUrl + ".");
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
                    //output("WebSocket connected, setting up QWebChannel.");
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
                            CenterMap(47.3, 13.3);
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