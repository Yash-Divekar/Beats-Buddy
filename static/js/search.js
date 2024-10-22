let currentplaylist = user_data.recent;

let song = currentplaylist[0];

console.log('Current song:', song);
let content=[];
let duration='';


function handleFormSubmit(event) {
  event.preventDefault();
  global_search();
}

async function global_search() {
  let request = document.getElementById("search").value;

  try {
    let response = await fetch(
      `https://saavn.dev/api/search/songs?query=${request}&limit=11`
    );
    let json_data = await response.json();

    if (json_data["success"] == true) {
      content = json_data["data"]["results"];
      
      currentplaylist=[]

      for(i=0 ; i<content.length ; i++){
        x = {
          'song_id':content[i]['id'],
          'name' : content[i]['name'],
          'artist' : content[i]["artists"]["primary"][0]["name"],
          'img' : content[i]["image"][2]["url"],
          'link' :content[i]["downloadUrl"][4]["url"],
          'duration':null,
        }
        currentplaylist.push(x);
      }
      console.log("hi")
      Content_list(currentplaylist);
      console.log("Data fetched");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function player(data) {

  let song_name = document.getElementById("song_name");
  let song_artist = document.getElementById("song_artist");
  let song_time = document.getElementById("song_time");
  let song_audio = document.getElementById("audio");
  let song_img = document.getElementById("song_img");
  let play = document.getElementById("playPause");
  let progress = document.getElementById("progressBar")
  const likeButton = document.getElementById('likeButton')

  if (song in user_data['liked']){
    likeButton.classList.remove('bi-star');
    likeButton.classList.add('bi-star-fill');
  }
  else{
    likeButton.classList.remove('bi-star-fill');
    likeButton.classList.add('bi-star');
  }

  song_name.innerText=song['name'];
  song_artist.innerText=song['artist'];
  song_img.src = song['img'];

  song_audio.src = song['link'];
  
  play.classList='bi-play';
  progressBar.style.width = 0+"%";
  let final_duration;
  
  audio.onloadedmetadata = function() {
    const duration = audio.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    let final_duration = `${minutes}:${formattedSeconds}`;
    song_time.textContent = final_duration;
    console.log(final_duration);
    
    song['duration'] = `${final_duration}`
  };

  recent();
}

function Content_list(data) {
  let cardContainer = document.getElementById("card");
  cardContainer.innerHTML = "";
  
  counter = 0
  for (const item of data) {
    let card = document.createElement("div");
    
    let list_template = `
                <div onclick="update_player(${counter})" class="liked" style="height: 100px; background-color: #00ADB5;
                 border-radius: 12px; display: flex;padding: 20px; align-items: center; display: flex; justify-content: space-between">
                  <div>
                    <div id="name" style="font-size: 30px; max-width: 2000px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;">${item["name"]}</div>
                    <div id="disc" style="font-size: 20px;max-width: 2000px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;">${item["artist"]}</div>
                  </div>
                  <img src="${item['img']}" alt="" style="aspect-ratio: 1; height: 70px; border-radius: 15px;">
                </div>
                `;

    card.innerHTML = list_template;
    cardContainer.appendChild(card);
    counter++;
  }

}

function playPause() {
  const audio = document.getElementById("audio");
  const playPauseButton = document.getElementById("playPause");
  const progressBar = document.getElementById("progressBar");
  
  if (audio.paused) {
    audio.play();
    playPauseButton.classList.remove("bi-play");
    playPauseButton.classList.add("bi-pause");
    
    audio.addEventListener("timeupdate", function () {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      const progress = (currentTime / duration) * 100;
      progressBar.style.width = progress + "%";
    });
    audio.addEventListener("ended", function () {
      
      nextsong();
      playPause();
    });
  } else {
    audio.pause();
    playPauseButton.classList.remove("bi-pause");
    playPauseButton.classList.add("bi-play");
  }
}

function audio_forward() {
  const audio = document.getElementById("audio");
  audio.currentTime += 15;
}

function audio_backward() {
  const audio = document.getElementById("audio");
  audio.currentTime -= 15;
}

function toggleInfoCard() {
  var infoCard = document.getElementById("infoCard");
  infoCard.style.display =
    infoCard.style.display === "block" ? "none" : "block";
}

function update_player(counter) {
  if (counter >= 0 && counter < currentplaylist.length) {
      
      let choice = currentplaylist[counter];
      
      currentplaylist.splice(counter, 1);

      if (!(song in currentplaylist)){
        currentplaylist.push(song);
      }
      song = choice;

      player(song);
      Content_list(currentplaylist);
      
  } else {
      console.error("Invalid counter value. Counter should be within the bounds of the data array.");
  }
}

function like(){
  var Data = song;
  console.log(Data);
  
  const likeButton = document.getElementById('likeButton')

  // Send the song ID to the Django backend
  fetch('/like', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken()
      },
      body: JSON.stringify({ 'data' : Data })
  })
  .then(response => {
      if (response.ok) {
          likeButton.classList.remove('bi-star');
          likeButton.classList.add('bi-star-fill');
          console.log('Song liked successfully!');
      } else {
          
          console.error('Failed to like the song');
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

function getCsrfToken() {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const [key, value] = cookies[i].trim().split('=');
    if (key === 'csrftoken') {
      return value;
    }
  }
  return null;
}

function recent(){

  var Data = song
  console.log(Data);
  // Send the song ID to the Django backend
  fetch('/recent', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken()
      },
      body: JSON.stringify({ 'data' : Data })
  })
  .then(response => {
      if (response.ok) {
        console.log("success")
      } else {
          console.error('Failed to add the song to recent');
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

function openpopup(){
  let popup = document.getElementById("Popup");
  console.log("Playlist");
  popup.style.display = "grid";
}


function closepopup(){
  let popup = document.getElementById("Popup");
  popup.style.display = "none";
}

function addtoPlaylist(index , item) {
  Data = song;
  console.log(Data);
  // Send the song ID to the Django backend
  fetch(`/addtoPlaylist/${Number(index)}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken()
      },
      body: JSON.stringify({ 'data' : Data })
  })
  .then(response => {
      if (response.ok) {
        console.log("Added to playlist");
        closepopup();
      } else {
          console.error('Failed to add the song to recent');
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

function nextsong(){
  console.log("next");
  let firstElement = currentplaylist.shift();
    
  currentplaylist.push(firstElement);
  song = currentplaylist[0];
  
  player(song);
}

function prevsong(){
  const lastElement = currentplaylist.pop();
    
  currentplaylist.unshift(lastElement);
  song = currentplaylist[0];
  player(song);
}

function update_playlist(index , item){
  console.log(user_data);
  console.log(index);

  if (index == -2){
    currentplaylist = user_data.recent;
  }
  else if(index == -1){
    currentplaylist = user_data.liked;
  }
  else{
    currentplaylist = user_data.playlist[index].songs;
  }
  
  song = currentplaylist[0];
  player(song);
}


function addPlaylistform(){
  let popup = document.getElementById("form");
  let button = document.getElementById("addPlaylist");

  popup.innerHTML=`
<div>
  <div style="display: grid; grid-template-columns: 250px 450px; gap: 30px; padding:0px 20px">
    <div>
      <label for="name" style="font-size:25px ; padding:0px 5px">Name</label>
      <input type="text" name="name" id="name" class="form-control">
    </div>
    <div>
      <label for="Discription" style="font-size:25px; padding:0px 5px">Discription</label>
      <input type="text" name="disc" id="disc" class="form-control">
    </div>
  </div>
  `;
  
button.onclick = addPlaylist();

}


document.querySelector('.scroll-container').addEventListener('mouseenter', function() {
  this.classList.add('hovered');
});

document.querySelector('.scroll-container').addEventListener('mouseleave', function() {
  this.classList.remove('hovered');
});