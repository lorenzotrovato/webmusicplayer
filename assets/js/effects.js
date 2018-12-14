var audioCtx,analyser,stream,source,bufferLength,dataArray, userMediaStream;

function loadAudio(){
    if(audioCtx == null && source == null){
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        userMediaStream = document.getElementById('audioObj');
        source = audioCtx.createMediaElementSource(userMediaStream);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 2048;  //2048
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    }
}

function unloadAudio(){
    stopAll();
    //userMediaStream.getTracks()[0].stop();
    audioCtx = null;
    analyser = null;
    source = null;
    bufferLength = 0;
}

function drawWave(){
    if(wave)
        var drawVisual = requestAnimationFrame(drawWave);
    analyser.getByteTimeDomainData(dataArray);
    canvasCtx1.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx1.fillRect(0, 0, WIDTH1, HEIGHT1);
    canvasCtx1.lineWidth = 2;
    canvasCtx1.strokeStyle = 'rgb(255, 0, 0)';
    canvasCtx1.beginPath();

    var sliceWidth = WIDTH1 * 1.0 / bufferLength;
    var x = 0;
    for(var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT1/2;
        if(i === 0) {
            canvasCtx1.moveTo(x, y);
        } else {
            canvasCtx1.lineTo(x, y);
        }
        x += sliceWidth;
    }
    canvasCtx1.lineTo(canvas1.width, canvas1.height/2);
    canvasCtx1.stroke();
}

function drawBars(){
    if(bars)
        var drawVisual = requestAnimationFrame(drawBars);
    analyser.getByteFrequencyData(dataArray);
    canvasCtx2.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx2.fillRect(0, 0, WIDTH2, HEIGHT2);

    var barWidth = (WIDTH2 / bufferLength) * 2.5;
    var barHeight;
    var x = 0;
    for(var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i]*2.5 +1;
        canvasCtx2.fillStyle = "rgb(" + (255-(dataArray[i]/2)*3) + "," + dataArray[i] + "," + (255-dataArray[i]) + ")";
        canvasCtx2.fillRect(x,HEIGHT2-barHeight/2,barWidth,barHeight);
        x += barWidth + 1;
    }
}

function drawRadial(){
    if(radial)
        var drawVisual = requestAnimationFrame(drawRadial);
    analyser.getByteFrequencyData(dataArray);
    canvasCtx1.clearRect(0, 0, WIDTH1, HEIGHT1);
    angle = 2*Math.PI/bufferLength;
    canvasCtx1.save();
    canvasCtx1.translate(WIDTH1/2,HEIGHT1/2);
    for(var i = 0; i < bufferLength; i++){
        canvasCtx1.rotate(angle);
        val = dataArray[i] * 1.75;
        canvasCtx1.fillStyle = "rgb(" + dataArray[i] + "," + (255-(dataArray[i]/2)*3) + "," + (255-dataArray[i]) + ")";
        canvasCtx1.fillRect(0, 30, 1, val + 1);
    }
    canvasCtx1.restore();
}

// start wave
function startWave(){
    wave = true;
    canvas1.style.display = "";
    canvas1.style.width = "100%";
    canvas1.style.height = "auto";
    /*canvas1.width = window.innerWidth - 30;
    canvas1.height = (maxheight-50) - 30;
    WIDTH1 = canvas1.width;
    HEIGHT1 = canvas1.height;*/
    drawWave();
}
//start bars
function startBars(){
    bars = true;
    drawBars();
    canvas2.style.display = "";
    canvas2.style.width = "100%";
    canvas2.style.height = "auto";
    /*canvas2.width = window.innerWidth - 30;
    canvas2.height = (maxheight-50) - 30;
    WIDTH2 = canvas2.width;
    HEIGHT2 = canvas2.height;*/
}
// start radial
function startRadial(){
    radial = true;
    canvas1.style.display = "";
    canvas1.style.width = "100%";
    canvas1.style.height = "auto";
    /*canvas1.width = window.innerWidth - 30;
    canvas1.height = maxheight; 
    WIDTH1 = canvas1.width;
    HEIGHT1 = canvas1.height;*/
    drawRadial();
}
// start wave/bars
function startWaveBars(){
    wave = true;
    bars = true;
    canvas1.style.display = "";
    canvas1.style.width = "100%";
    canvas1.style.height = "auto";
    /*canvas1.width = window.innerWidth - 30;
    canvas1.height = (maxheight-50)/2 - 30; 
    WIDTH1 = canvas1.width;
    HEIGHT1 = canvas1.height;*/
    canvas2.style.display = "";
    canvas2.style.width = "100%";
    canvas2.style.height = "auto";
    /*canvas2.width = window.innerWidth - 30;
    canvas2.height = (maxheight-50)/2 - 30;
    WIDTH2 = canvas2.width;
    HEIGHT2 = canvas2.height;*/
    drawWave();
    drawBars();
}
//stop all
function stopAll(){
    wave = false;
    bars = false;
    radial = false;
    canvas1.style.display = "none";
    canvas2.style.display = "none";
}