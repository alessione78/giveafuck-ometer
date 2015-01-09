var audioContext = null;
var highestValue = 0;

window.onload = function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    audioContext = new AudioContext();

    try {
        navigator.getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        navigator.getUserMedia(
            {
                "audio": {
                    "mandatory": {
                        "googEchoCancellation": "false",
                        "googAutoGainControl": "false",
                        "googNoiseSuppression": "false",
                        "googHighpassFilter": "false"
                    },
                    "optional": []
                }
            }, streamSuccess, streamError);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
}

function streamError() {
    alert('Stream generation failed.');
}

function streamSuccess(stream) {
    var mediaStreamSource = audioContext.createMediaStreamSource(stream);

    meter = initAudioProcessor(audioContext);
    mediaStreamSource.connect(meter);
}

function volumeAudioProcess( event ) {
    var buf = event.inputBuffer.getChannelData(0);
    var bufLength = buf.length;
    var sum = 0;
    var x;

    for (var i=0; i<bufLength; i++) {
        x = buf[i];
        sum += x * x;
    }

    var rms =  Math.sqrt(sum / bufLength);

    this.volume = Math.max(rms, this.volume * this.averaging);

    if (highestValue < this.volume) {
        highestValue = this.volume;
        console.log(highestValue);
    }
}

function initAudioProcessor(audioContext,clipLevel,averaging,clipLag) {
    var processor = audioContext.createScriptProcessor(1024);
    processor.onaudioprocess = volumeAudioProcess;
    processor.clipping = true;
    processor.lastClip = 0;
    processor.volume = 0;
    processor.clipLevel = clipLevel || 0.98;
    processor.averaging = averaging || 0.95;
    processor.clipLag = clipLag || 750;

    processor.connect(audioContext.destination);

    processor.checkClipping =
        function() {
            if (!this.clipping) {
                return false;
            }

            if ((this.lastClip + this.clipLag) < window.performance.now()) {
                this.clipping = false;
            }

            return this.clipping;
        };

    processor.shutdown =
        function(){
            this.disconnect();
            this.onaudioprocess = null;
        };

    return processor;
}