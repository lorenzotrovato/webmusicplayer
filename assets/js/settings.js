var selectedEffectId = 0;
var fullscreen = false;
var effectsOpen = false;

//variables for canvas dimensions
var WIDTH1,HEIGHT1,WIDTH2,HEIGHT2;
//variables for effect recognition
var wave = false;
var bars = false;
var radial = false;
//variables for canvas recognition
var canvas1,canvasCtx1,canvas2,canvasCtx2;

//EVENTS
$('#navbarDropdownEffects a.dropdown-item').on('click',function(){
    selectedEffectId = parseInt($(this).attr('data-effectid'));
    toggleEffectsArea(true);
    initCanvas();
    startAnimation(selectedEffectId);
});

window.onresize = handleCanvasResize;

$('#navbarCloseEffectsBtn').on('click',function(){
    stopAll();
    toggleEffectsArea(false);
});

$('#navbarDropdownFullscreenCheck').on('click',function(){
    toggleControlsOnEffects(false);
});

$(document).keyup(function(e) {
    //show controls on fullscreen exit
    if (e.key === "Escape") {
        if(fullscreen)
            toggleControlsOnEffects(true);
    }

    //play/pause music
    if(e.key == " "){
        if(currentplay != null){
            if(audioObj.paused)
                audioObj.play();
            else
                audioObj.pause();
        }
    }
});

//load canvas objects and dimension
function initCanvas(){
    canvas1 = document.getElementById('cnvs1');
    canvasCtx1 = canvas1.getContext("2d");
    canvas2 = document.getElementById('cnvs2');
    canvasCtx2 = canvas2.getContext("2d");
    canvasCtx2.clearRect(0, 0, WIDTH2, HEIGHT2);
    canvasCtx1.clearRect(0, 0, WIDTH1, HEIGHT1);
    loadAudio();
}

//resize canvas according to space
function handleCanvasResize(){
    canvas1.width = WIDTH1 = window.innerWidth;
    canvas2.width = WIDTH2 = window.innerWidth;
    var availablespaceH;
    if(!fullscreen){
        availablespaceH = parseFloat(window.innerHeight - ($('nav.navbar').height() + $('footer#playerIface').height()) - 68);
        $('#displayEffects').css('margin-top',($('nav.navbar').height() + 20) + 'px');
    }else{
        availablespaceH = window.innerHeight - 20;
        $('#displayEffects').css('margin-top','0px');
    }
    if(wave && bars && !radial){
        canvas1.height = HEIGHT1 = (availablespaceH/2);
        canvas2.height = HEIGHT2 = (availablespaceH/2);
    }else if(wave || radial || bars){
        canvas1.height = HEIGHT1 = availablespaceH;
        canvas2.height = HEIGHT2 = availablespaceH;
    }
}

//show effects area and hide songs list section and vice-versa
function toggleEffectsArea(show){
    if(show){
        $('#songsList').css('display','none');
        $('#effectsSc').css('display','block');
        $('#navbarCloseEffectsBtn').css('display','block');
        $('#navbarOpenQueueBtn').css('display','none');
        $('#navbarRefreshBtn').css('display','none');
        effectsOpen = true;
    }else{
        $('#songsList').css('display','block');
        $('#effectsSc').css('display','none');
        $('#navbarCloseEffectsBtn').css('display','none');
        $('#navbarOpenQueueBtn').css('display','list-item');
        $('#navbarRefreshBtn').css('display','list-item');
        effectsOpen = false;
    }
}

//start effect based on selected id
function startAnimation(id){
    stopAll();
    switch (id) {
        case 0:
            startBars();
            break;
        case 1:
            startWave();
            break;
        case 2:
            startRadial();
            break;
        case 3:
            startWaveBars();
            break;
        default:
            break;
    }
    handleCanvasResize();
}

//toggle controls on effects view
function toggleControlsOnEffects(show){
    if(effectsOpen){
        if(!show){
            $('nav.navbar').css('display','none');
            $('footer#playerIface').css('display','none');
            $('#effectsSc').css('z-index',20);
            $('#effectsSc').css('height','100vh');
            $('#navbarDropdownFullscreenCheck').prop('checked',true);
            $('body').css('background','black');
            fullscreen = true;
        }else{
            $('nav.navbar').css('display','flex');
            $('footer#playerIface').css('display','block');
            $('#effectsSc').css('z-index',-10);
            $('#effectsSc').css('height','90vh');
            $('#navbarDropdownFullscreenCheck').prop('checked',false);
            $('body').css('background','#343a40');
            fullscreen = false;
        }
        handleCanvasResize();
    }
}


