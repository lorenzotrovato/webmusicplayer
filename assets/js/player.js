var pgbar_audio = document.getElementById('pgbar-audio');
var audioObj = document.getElementById('audioObj');
var pgbar_audio_dragging = false;
var shuffle = false;
var repeat_song = 0;

audioObj.onloadedmetadata = function(){
    if(pgbar_audio.classList.value.includes('noUi-target')){
        pgbar_audio.noUiSlider.destroy();
    }
    noUiSlider.create(pgbar_audio, {
        start: [0],
        connect: [true, false],
        range: {
            'min': [0],
            'max': [parseFloat(audioObj.duration)]
        }
    });
    $('#playerLabel_duration').text(formatTime(audioObj.duration));
    pgbar_audio.noUiSlider.on('start',function(){
        pgbar_audio_dragging = true;
    });
    pgbar_audio.noUiSlider.on('change',function(){
        audioObj.currentTime = parseFloat(pgbar_audio.noUiSlider.get());
        pgbar_audio_dragging = false;
        $('#playerLabel_currentTime').css('color','white');
    });
    audioObj.ontimeupdate = function(){
        if(!pgbar_audio_dragging){
            pgbar_audio.noUiSlider.set(this.currentTime);
            $('#playerLabel_currentTime').text(formatTime(this.currentTime));
        }
    };
    pgbar_audio.noUiSlider.on('slide',function(){
        $('#playerLabel_currentTime').text(formatTime(parseFloat(pgbar_audio.noUiSlider.get())));
        $('#playerLabel_currentTime').css('color','#FF9E0C');
    });
};

audioObj.onplay = function(){
    $('#playerBtn_playpause').children('i').html('pause');
};

audioObj.onpause = function(){
    $('#playerBtn_playpause').children('i').html('play_arrow');
};


$('#playerBtn_repeat').on('click',function(){
    if(repeat_song===0){
        repeat_song = 1;
        $(this).css('color','#85b7d8');
        $(this).html('repeat');
    }else if(repeat_song===1){
        repeat_song = 2;
        $(this).css('color','#85b7d8');
        $(this).html('repeat_one');
    }else{
        repeat_song = 0;
        $(this).css('color','white');
        $(this).html('repeat');
    }
});

$('#playerBtn_replay10').on('click',function(){
    if(audioObj.currentTime>10){
        audioObj.currentTime -= 10;
    }else{
        audioObj.currentTime = 0;
    }
});
$('#playerBtn_forward10').on('click',function(){
    if(audioObj.currentTime<(audioObj.duration-10)){
        audioObj.currentTime += 10;
    }else{
        audioObj.currentTime = audioObj.duration;
        audioObj.pause();
    }
});

function formatTime(duration,msecs=false,pretty=false){
    duration = (parseFloat(duration).toFixed(3))*1000;
    var milliseconds = (msecs) ? "." + parseInt((duration%1000)) : "";
    var seconds = (pretty) ? parseInt((duration/1000)%60) + " seconds" : parseInt((duration/1000)%60);
    var minutes = (pretty) ? parseInt((duration/(1000*60))%60) + " minutes, " : parseInt((duration/(1000*60))%60) + ":";
    var hours = (pretty) ? parseInt((duration/(1000*60*60))%24) + " hours, " : parseInt((duration/(1000*60*60))%24) + ":";
    hours = (parseInt((duration/(1000*60*60))%24) < 10) ? "0" + hours : hours;
    minutes = (parseInt((duration/(1000*60))%60) < 10) ? "0" + minutes : minutes;
    seconds = (parseInt((duration/1000)%60) < 10) ? "0" + seconds : seconds;
    return hours + minutes + seconds +  milliseconds;
}

function resetPlayer(){
    audioObj.pause();
    $('#audioObj').children('source').attr('src','');
    $('#tbody_songlist tr').removeClass('bg-primary');
    $('#playerBtn_playpause').children('i').html('play_arrow');
    $('.text-title-player').text("");
    $('.text-sec-content').html("");
    $('#coverContainer img').attr('src','assets/images/sample.jpeg');
}