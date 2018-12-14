//song list
var slist = [];
//queue
var queue = [];
//current playing Song ID
var currentplay;
//complete song list (backup)
var bkslist = [];
//song repeated
var sng_repeated = false;


$(document).ready(function(){
    //update song list
    requestUpdateSongList();
});

$('#navbarRefreshBtn').on('click',function(){
    if(!$(this).hasClass('disabled')){
        $(this).addClass('disabled');
        $(this).children('span').text("Refreshing songs...");
        requestUpdateSongList();
    }
});

$('#audioObj').on('ended',function(){
    if(repeat_song === 0){
        nextSong();
    }else if(repeat_song === 2 && !sng_repeated){
        audioObj.currentTime = 0;
        audioObj.play();
        sng_repeated = true;
    }else if(repeat_song === 2 && sng_repeated){
        sng_repeated = false;
        nextSong();
    }else{
        audioObj.currentTime = 0;
        audioObj.play();
    }    
});

$('#playerBtn_playpause').on('click',function(){
    if($('#audioObj source').attr('src')==""){
        loadSongOnPlayer(slist[0].id);
        audioObj.play();
        queue = slist.slice();
        updateQueueN();
    }else{
        if(audioObj.paused){
            audioObj.play();
        }else{
            audioObj.pause();
        }
    }
    
});

$('#playerBtn_skipp').on('click',function(){
    var cindex = getIndexFromSlist(currentplay);
    if(cindex-1>=0){
        loadSongOnPlayer(slist[cindex-1].id);
        queue = slist.slice();
        for(var i=0;i<cindex-1;i++){
            queue.shift();
        }
    }else{
        loadSongOnPlayer(slist[slist.length-1].id);
        queue = [];
    }
    audioObj.play();
    updateQueueN();
    if($('#navbarOpenQueueBtn').attr('data-openqueue')=="true"){
        loadQueueList();
    }
});

$('#playerBtn_skipn').on('click',function(){
    if(repeat_song === 0){
        queue.shift();
        if(queue.length>0){
            loadSongOnPlayer(queue[0].id);
        }else{
            var cindex = getIndexFromSlist(currentplay);
            if(cindex<slist.length-1){
                loadSongOnPlayer(slist[cindex+1]);
            }else{
                loadSongOnPlayer(slist[0].id);
                queue = slist.slice();
            }
        }
    }else if(repeat_song === 2 && !sng_repeated){
        audioObj.currentTime = 0;
        sng_repeated = true;
    }else if(repeat_song === 2 && sng_repeated){
        sng_repeated = false;
        queue.shift();
        if(queue.length>0){
            loadSongOnPlayer(queue[0].id);
        }else{
            var cindex = getIndexFromSlist(currentplay);
            if(cindex<slist.length-1){
                loadSongOnPlayer(slist[cindex+1]);
            }else{
                loadSongOnPlayer(slist[0].id);
                queue = slist.slice();
            }
        }
    }else{
        audioObj.currentTime = 0;
    }   
    audioObj.play();
    updateQueueN();
    if($('#navbarOpenQueueBtn').attr('data-openqueue')=="true"){
        loadQueueList();
    }
});


$('#playerBtn_shuffle').on('click',function(){
    if(shuffle){
        shuffle = false;
        $(this).css('color','white');
        queue = slist.slice();
        var index = getIndexFromSlist(currentplay) || 0;
        for(var i=0;i<index;i++){
            queue.shift();
        }
    }else{
        shuffle = true;
        $(this).css('color','#85b7d8');
        queue = slist.slice();
        queue.splice(getIndexFromQueue(currentplay),1);
        randomQueue();
    }
    updateQueueN();
    if($('#navbarOpenQueueBtn').attr('data-openqueue')=="true"){
        loadQueueList();
    }
});

$('#navbarOpenQueueBtn').on('click',function(){
    if($(this).attr('data-openqueue')=="false"){
        $(this).children('span').html("Back to Songs list");
        loadQueueList();
        $('#navbarTitleLbl').text('Web Music Player - Queue');
        $(this).attr('data-openqueue',"true");
    }else{
        $(this).children('span').html("Open Queue");
        loadSongsList(slist);
        $('#navbarTitleLbl').text('Web Music Player - Songs');
        $(this).attr('data-openqueue',"false");
    }
});

$('#navbarSearchBtn').on('click',function(){
    var scontent = $('#navbarSearchTxt').val();
    if(scontent.length>0){
        search(scontent);        
    }else{
        loadSongsList(bkslist);
        $('#navbarTitleLbl').text('Web Music Player - Songs');
    }
    return false;
});


function requestSongList(){
    $.ajax({
        type: "GET",
        cache: false,
        url: "./backend/list_songs.php",
        success: function(response) {
            console.log(response);
            bkslist = response.slice();
            loadSongsList(response);
        },
        error: function() {
            console.log('error');
        }
    });
}

function loadSongsList(jarr){
    //HTML GEN
    var htmltable = $('#tbody_songlist');
    const trbtns = '<td class="btn-col"><span class="tablePlayBtn"><i class="material-icons">play_circle_filled</i></span><span class="tableQueueBtn"><i class="material-icons">queue</i></span></td>';
    var totaldur = 0;
    slist = jarr;
    if(jarr.length>0){
        htmltable.html("");
        for(var i=0;i<jarr.length;i++){
            var htmltr = '<tr data-songid="'+jarr[i].id+'" data-songindex="'+i+'">'+trbtns+'<td class="tableSTitle">'+jarr[i].title+'</td><td class="tableSArtist">'+jarr[i].artist+'</td><td class="tableSAlbum">'+jarr[i].album+'</td><td>'+formatTime(jarr[i].duration,false)+'</td></tr>';
            htmltable.append(htmltr);
            totaldur += parseFloat(jarr[i].duration);
        }
    }else{
        htmltable.html('<tr data-songid="0"><td class="btn-col"></td><td>No songs</td><td></td><td></td><td></td></tr>');
    }
    updateQueueN();
    //STATS
    $('#navbarNSongsLbl').text("Songs: "+ jarr.length +" - total time: " + formatTime(totaldur,false,true));
    if(currentplay==""){
        currentplay = slist[0].id;
    }
    //EVENTS
    $('.tablePlayBtn').on('click',function(){
        var id = $(this).parent().parent().attr('data-songid');
        var index = $(this).parent().parent().attr('data-songindex');
        queue = slist.slice();
        for(var i=0;i<index;i++){
            queue.shift();
        }
        loadSongOnPlayer(id);
        audioObj.play();
        updateQueueN();
    });
    $('.tableQueueBtn').on('click',function(){
        var index = $(this).parent().parent().attr('data-songindex');
        queue.splice(1,0,slist[index]);
        updateQueueN();
    });
    //HIGHLIGHT PLAYING
    if(currentplay!=""){
        $('#tbody_songlist tr[data-songid="'+currentplay+'"').addClass('bg-primary');
    }
}

function nextSong(){
    if(queue[0].id == currentplay){
        queue.shift();
    }
    if(queue.length>0){
        loadSongOnPlayer(queue[0].id);
        audioObj.play();
    }else{
        resetPlayer();
    }
    updateQueueN();
    if($('#navbarOpenQueueBtn').attr('data-openqueue')=="true"){
        loadQueueList();
    }
}

function requestUpdateSongList(){
    $.ajax({
        type: "GET",
        cache: false,
        url: "./backend/mng_songs_list.php",
        success: function(response) {
            console.log('REMOTE RESPONSE: ' + response);
            if(response == "done"){
                requestSongList();
            }
            $('#navbarRefreshBtn').children('span').text('Refresh songs list');
            $('#navbarRefreshBtn').removeClass('disabled');
        },
        error: function() {
            console.log('error');
        }
    });
}

function loadSongOnPlayer(sid){
    resetPlayer();
    currentplay = sid;
    $('#audioObj').children('source').attr('src','backend/play_song.php?sid=' + sid);
    $('#audioObj')[0].load();
    var sinfo = $('#tbody_songlist tr[data-songid="'+sid+'"');
    if($('#navbarOpenQueueBtn').attr('data-openqueue')=="false"){
        sinfo.addClass('bg-primary');
    }				
    $('.text-title-player').text(sinfo.children('.tableSTitle').text());
    $('.text-sec-content').html(sinfo.children('.tableSArtist').text() + '<br>' + sinfo.children('.tableSAlbum').text());
    $('title').text(sinfo.children('.tableSTitle').text() + (sinfo.children('.tableSArtist').text() != "" ? " - " + sinfo.children('.tableSArtist').text() : "") + " | Web Music Player");
    updateQueueN();
    //load cover
    $.ajax({
        type: "GET",
        cache: false,
        url: "./backend/get_cover.php?sid=" + sid,
        success: function(response) {
            if(response.length>0){
                $('#coverContainer img').attr('src','data:image/jpg;base64, ' + response);
            }else{
                $('#coverContainer img').attr('src','assets/images/sample.jpeg');
            }
        },
        error: function() {
            console.log('error');
        }
    });
}

function getIndexFromSlist(sid){
    var i=0;
    while(i<slist.length && slist[i].id != sid){
        i++;
    }
    return i;
}

function getIndexFromQueue(sid){
    var i=0;
    while(i<queue.length && queue[i].id != sid){
        i++;
    }
    return i;
}

function updateQueueN(){
    if(queue.length>1){
        $('#navbarQueueNLbl').text('Queue: ' + (queue.length-1) + ' songs');
    }else{
        $('#navbarQueueNLbl').text('Queue: 0 songs');
    }
    
}

function loadQueueList(){
    //HTML GEN
    var htmltable = $('#tbody_songlist');
    const trbtns = '<td class="btn-col"><span class="tablePlayBtn"><i class="material-icons">play_circle_filled</i></span></td>';
    if(queue.length>0){
        htmltable.html("");
        for(var i=1;i<queue.length;i++){
            var htmltr = '<tr data-songid="'+queue[i].id+'" data-songindex="'+getIndexFromSlist(queue[i].id)+'" data-queueindex="'+(i-1)+'">'+trbtns+'<td class="tableSTitle">'+queue[i].title+'</td><td class="tableSArtist">'+queue[i].artist+'</td><td class="tableSAlbum">'+queue[i].album+'</td><td>'+formatTime(queue[i].duration,false)+'</td></tr>';
            htmltable.append(htmltr);
        }
    }else{
        htmltable.html('<tr data-songid="0"><td class="btn-col"></td><td>No queued songs</td><td></td><td></td><td></td></tr>');
    }
    //EVENTS
    $('.tablePlayBtn').on('click',function(){
        var id = $(this).parent().parent().attr('data-songid');
        var index = $(this).parent().parent().attr('data-songindex');
        queue = slist.slice();
        for(var i=0;i<index;i++){
            queue.shift();
        }
        loadSongOnPlayer(id);
        audioObj.play();
        updateQueueN();
        loadQueueList();
    });
}

function search(keyword){
    var temparr = [];
    var condition;
    for(var i=0;i<bkslist.length;i++){
        condition = bkslist[i].title.toLowerCase().includes(keyword.toLowerCase()) || bkslist[i].artist.toLowerCase().includes(keyword.toLowerCase()) || bkslist[i].album.toLowerCase().includes(keyword.toLowerCase());
        if(condition){
            temparr.push(bkslist[i]);
        }
    }
    loadSongsList(temparr);
    $('#navbarTitleLbl').text('Web Music Player - Search results');
}

function randomQueue(){
    var j, x, i;
    for (i = queue.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = queue[i];
        queue[i] = queue[j];
        queue[j] = x;
    }
}