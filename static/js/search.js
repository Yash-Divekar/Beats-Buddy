let song = user_data.recent[0]

// Now you can use the song object in your JavaScript code
console.log('Current song:', song);
let content=[];
let duration='';


function handleFormSubmit(event) {
  event.preventDefault(); // Prevent the form from actually submitting
  global_search(); // Call the search function
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
      song = content[0];
      console.log("hi")
      Content_list(content);
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

  song_name.innerText=data['name'];
  song_artist.innerText=data['artists']['primary'][0]['name'];
  song_img.src = data['image'][2]['url'];

  song_audio.src = data["downloadUrl"][4]["url"];
  
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
  song = {
    'song_id':data['id'],
    'name' : data['name'],
    'artist' : data["artists"]["primary"][0]["name"],
    'img' : data["image"][2]["url"],
    'link' :data["downloadUrl"][4]["url"],
    'duration' : final_duration,
  }
  ;
  recent();
}

function Content_list(data) {
  let cardContainer = document.getElementById("card");
  cardContainer.innerHTML = "";
  
  counter = 0
  for (const item of data) {
    let card = document.createElement("div");
    
    let list_template = `
                <div onclick="update_player(${counter})" class="liked" style="height: 100px; background-color: #76ABAE; border-radius: 20px; display: flex;padding: 20px; align-items: center; display: flex; justify-content: space-between">
                  <div>
                    <div id="name" style="font-size: 30px; max-width: 200px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;">${item["name"]}</div>
                    <div id="disc" style="font-size: 20px;max-width: 200px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;">${item["artists"]["primary"][0]["name"]}</div>
                  </div>
                  <img src="${item["image"][2]["url"]}" alt="" style="aspect-ratio: 1; height: 70px; border-radius: 15px;">
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
  const likeButton = document.getElementById('likeButton')

  if (song in user_data['liked']){
    likeButton.classList.remove('bi-star');
    likeButton.classList.add('bi-star-fill');
  }
  else{
    likeButton.classList.remove('bi-star-fill');
    likeButton.classList.add('bi-star');
  }
  if (audio.paused) {
    audio.play();
    playPauseButton.classList.remove("bi-play");
    playPauseButton.classList.add("bi-pause");
    // Update progress bar while playing
    audio.addEventListener("timeupdate", function () {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      const progress = (currentTime / duration) * 100;
      progressBar.style.width = progress + "%";
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
  if (counter >= 0 && counter < content.length) {
      
      let choice = content[counter];
      
      content.splice(counter, 1);

      if (!(song in content)){
        content.push(song);
      }
      song = choice
      player(choice);
      Content_list(content);
      
  } else {
      console.error("Invalid counter value. Counter should be within the bounds of the data array.");
  }
}

function like(){
  var Data = {
    'song_id':song['id'],
    'name' : song['name'],
    'artist' : song["artists"]["primary"][0]["name"],
    'img' : song["image"][2]["url"],
    'link' :song["downloadUrl"][4]["url"],
    'duration' : song['duration']

  };
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
      } else {
          console.error('Failed to add the song to recent');
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}
