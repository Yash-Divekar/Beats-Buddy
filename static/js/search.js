console.log("hi");
let data=[];
let song={};

document.addEventListener("DOMContentLoaded", function () {
  // Your code here
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevents the default form submission behavior
      global_search(); // Calls the global_search() function
    });
});

async function global_search() {
  let request = document.getElementsByName("name")[0].value;

  try {
    let response = await fetch(
      `https://saavn.dev/api/search/songs?query=${request}&limit=11`
    );
    let json_data = await response.json();

    if (json_data["success"] == true) {
      data = json_data["data"]["results"];
      song = data[0];

      Content_list(data);

      console.log("Data fetched");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}



async function player(data) {
  let player_container = document.getElementById("player_container");
  player_container.innerHTML = ``;
  song = data;

  let player = document.createElement("div");
  let player_template = ``;
  if (data.type == "song") {
    player_template = `
      <div class='card-body' style='display: grid; place-items: center; margin: 40px'>
        <i class="bi bi-info-circle-fill position-absolute top-0 end-0 mt-2 me-2" id="infoButton" onclick="toggleInfoCard()"></i>
        <div id="infoCard" style="font-size:small ;width:200px">
            ID : ${data["id"]}<br>
            Album : ${data["album"]["name"]}<br>
            Copyright : ${data["copyright"]}<br>
        </div>

        <img id='player-img' src='${data["image"][2]["url"]}' style='height: 300px; width: auto; border-radius: 30px;'>
        <h4 id="player-song">${data["name"]}</h4>
        <h6 id="player-artist">${data["artists"]["primary"][0]["name"]}</h6>
        <audio id="audio" src="${data["downloadUrl"][4]["url"]}"></audio>
        <div class="progress">
            <div class="progress-bar" id="progressBar" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="music-controls"
            style="margin: 15px; display: flex; justify-content:space-around; width:100%;font-size: xx-large;">
            <div>
                <i class="bi bi-download" name="download"></i>
            </div>
            <div style="display:flex; justify-content:space-between; width:20%">
                <i class="bi bi-skip-backward" onclick="audio_backward()"></i>
                <i class="bi bi-play" id="playPause" onclick="playPause()"></i>
                <i class="bi bi-skip-forward" onclick="audio_forward()"></i>
            </div>
            <div>
                <i class="bi bi-star" id="likeButton" onclick='like()'></i>
                <input type="hidden" name="csrfmiddlewaretoken" value="{% csrf_token %}">
            </div>
        </div>
      </div>
  `;
  }

  player.innerHTML = player_template;
  player_container.appendChild(player);
}

async function Content_list(data) {
  console.log(data);
  let cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  
  counter = 0
  for (const item of data) {
    let card = document.createElement("div");
    card.classList.add(`card`);
    
    let list_template = `
                <div class='card-body' id="list" onclick="update_player(${counter})">
                <div class="row" name='card'>
                  <div class="col-md-8">
                    <h1 id="dataName">${item["name"]}</h1>  
                    <h3 id="artistName">${item["artists"]["primary"][0]["name"]}</h3>
                    <div id="song-id" hidden>${item['id']}</div>
                  </div>
                  <div class="col-md-4">
                    <img id="img" src='${item["image"][2]["url"]}' alt="" style='border-radius: 10px'>
                  </div>
                </div>
              </div>`;

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

async function update_player(counter) {
  if (counter >= 0 && counter < data.length) {
    
      let choice = data[counter];
      
      console.log(data);

      data.splice(counter, 1);

      if (!(song in data)){
        data.push(song);
      }

      await player(choice);
      await Content_list(data);
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
    'link' :song["downloadUrl"][4]["url"]
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
