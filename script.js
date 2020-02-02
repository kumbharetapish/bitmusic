var musicList = document.getElementById("musicList");
var musicPlayer = document.getElementById("musicPlayer");
var XHttp = new XMLHttpRequest();
var response;
XHttp.open("get", "https://5dd1894f15bbc2001448d28e.mockapi.io/playlist", true);
XHttp.onreadystatechange = function() {
  if (this.readyState === 4) {
    response = JSON.parse(this.responseText);
    for (let i = 0; i < response.length; i++) {
      musicList.appendChild(getMusicList(response[i], i));
    }
    musicPlayer.appendChild(getMusicPlayer(response[0], 0));
  }
};

XHttp.send();
var create = tag => {
  return document.createElement(tag);
};

var getMusicList = (listData, i) => {
  var listWrapper = create("div");
  listWrapper.className = "listWrapper";
  listWrapper.addEventListener("click", function() {
    musicPlayer.innerHTML = "";
    musicPlayer.append(getMusicPlayer(response[i], i));
  });

  var listThumbnail = create("img");
  listThumbnail.className = "listThumbnail";
  listThumbnail.src = listData.albumCover;
  listWrapper.append(listThumbnail);

  var listTitle = create("div");
  listTitle.className = "listTitle";

  var trackName = create("h4");
  trackName.innerHTML = listData.track;

  var artistName = create("h6");
  artistName.innerHTML = listData.artist;
  listTitle.append(trackName);
  listTitle.append(artistName);

  listWrapper.append(listTitle);
  return listWrapper;
};

var getMusicPlayer = (listResponse, i) => {
  var musicPlayerWrapper = create("div");
  musicPlayerWrapper.className = "musicPlayerWrapper";

  var musicTrack = create("audio");

  musicTrack.src = listResponse.file;
  musicTrack.autoplay = true;
  musicTrack.ontimeupdate = function() {
    progressBarMain.style.width =
      (musicTrack.currentTime / musicTrack.duration) * 100 + "%";
  };
  musicPlayerWrapper.append(musicTrack);

  var musicPlayer = create("div");
  musicPlayer.className = "musicPlayer";

  var playerThumbnail = create("img");
  playerThumbnail.className = "playerThumbnail";
  playerThumbnail.src = listResponse.albumCover;
  playerThumbnail.alt = listResponse.track;
  musicPlayer.append(playerThumbnail);
  musicPlayerWrapper.append(musicPlayer);

  var progressBar = create("div");
  progressBar.className = "progressBar";

  var progressBarMain = create("div");
  progressBarMain.className = "progressBarMain";


  var progressBarChange = create("div");
  progressBarChange.className = "progressBarChange";
  progressBar.append(progressBarMain);
  progressBar.append(progressBarChange);
  progressBar.addEventListener(
    "mousedown",
    function(event) {
      var clickAt = event.clientX - event.target.offsetLeft;
      musicTrack.currentTime =
        (clickAt / event.target.offsetWidth) * musicTrack.duration - 60;
    },
    false
  );

  musicPlayerWrapper.append(progressBar);

  var btnContainer = create("div");
  btnContainer.className = "btnContainer";

  var btnWrapper = create("div");
  btnWrapper.className = "btnWrapper";

  var shuffleBtn = create("i");
  shuffleBtn.className = "fas fa-random";
  shuffleBtn.id = "true";
  shuffleBtn.onclick = function() {
    var shuffle = Math.floor(Math.random() * 10);
    if (shuffleBtn.id === "true") {
      shuffleBtn.id = "false";
      shuffleBtn.style.color = "#130e63d5";
      changeHandle(shuffle);
    } else {
      shuffleBtn.id = "true";
      shuffleBtn.style.color = "#15124b80";
      changeHandle(i);
    }
    musicTrack.play();
  };

  var BackwardBtn = create("i");
  BackwardBtn.className = "fas fa-step-backward";
  BackwardBtn.onclick = function() {
    i--;
    if (shuffleBtn.id === "false") {
      var shuffle = Math.floor(Math.random() * 10);
      changeHandle(shuffle);
    } else {
      changeHandle(i);
    }

    musicTrack.play();
    playBtn.style.display = "none";
    pauseBtn.style.display = "flex";
    pauseBtn.style.fontSize = "45px";
    musicTrack.currentTime = 0;
  };

  var playBtn = create("i");
  playBtn.className = "fas fa-play-circle playBtn";
  playBtn.style.fontSize = "45px";
  playBtn.onclick = function() {
    musicTrack.play();
    playBtn.style.display = "none";
    pauseBtn.style.display = "flex";
  };

  var pauseBtn = create("i");
  pauseBtn.style.display = "none";
  pauseBtn.style.fontSize = "45px";
  pauseBtn.className = "fas fa-pause-circle playBtn";
  pauseBtn.onclick = function() {
    musicTrack.pause();
    pauseBtn.style.display = "none";
    playBtn.style.display = "flex";
  };

  var forwardBtn = create("i");
  forwardBtn.className = "fas fa-step-forward";
  forwardBtn.onclick = function() {
    if (shuffleBtn.id === "false") {
      var shuffle = Math.floor(Math.random() * 10);
      changeHandle(shuffle);
    } else {
      i++;
      if (i === response.length) {
        i = 0;
        changeHandle(i);
      } else {
        changeHandle(i);
      }
    }
    musicTrack.play();
    playBtn.style.display = "none";
    pauseBtn.style.display = "flex";
    pauseBtn.style.fontSize = "45px";
    musicTrack.currentTime = 0;
  };

  var undoBtn = create("i");
  undoBtn.className = "fas fa-undo";
  undoBtn.onclick = function() {
    musicTrack.currentTime = 0;
    musicTrack.play();
  };

  btnWrapper.append(shuffleBtn);
  btnWrapper.append(BackwardBtn);
  btnWrapper.append(playBtn);
  btnWrapper.append(pauseBtn);
  btnWrapper.append(forwardBtn);
  btnWrapper.append(undoBtn);

  btnContainer.append(btnWrapper);
  musicPlayerWrapper.append(btnContainer);

  var songTitle = create("div");
  songTitle.className = "musicTitle";

  var albumName = create("h2");
  albumName.innerHTML = listResponse.track;

  var artistName = create("h6");
  artistName.innerHTML = listResponse.artist;

  songTitle.append(albumName);
  songTitle.append(artistName);
  musicPlayerWrapper.append(songTitle);

  var changeHandle = trackNo => {
    if (trackNo <= response.length) {
      playerThumbnail.src = response[trackNo].albumCover;
      console.log(response[trackNo].albumCover);
      musicTrack.src = response[trackNo].file;
      albumName.innerHTML = "";
      albumName.innerHTML = response[trackNo].track;
      artistName.innerHTML = response[trackNo].artist;
      musicTrack.play();
      playBtn.style.display = "none";
      pauseBtn.style.display = "flex";
    } else {
      playerThumbnail.src = response[0].albumCover;
      console.log(response[0].albumCover);
      musicTrack.src = response[0].file;
      albumName.innerHTML = "";
      albumName.innerHTML = response[0].track;
      artistName.innerHTML = response[0].artist;
      musicTrack.play();
      playBtn.style.display = "none";
      pauseBtn.style.display = "flex";
    }
  };

  return musicPlayerWrapper;
};
