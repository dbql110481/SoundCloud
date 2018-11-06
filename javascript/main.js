const UI = {
  /* Input 태그 세팅 */
  setInputArea: () => {
    const inputArea = document.querySelector(".js-search");
    inputArea.addEventListener("keyup", e => {
      if (e.which === 13) SoundCloudAPI.getTracks(inputArea.value);
    });
  },
  /* 검색 버튼 태그 세팅 */
  setSearchButton: () => {
    const searchButton = document.querySelector(".js-submit");
    searchButton.addEventListener("click", () => {
      SoundCloudAPI.getTracks(inputArea.value);
    });
  },
  /* reset 버튼 태그 세팅 */
  setResetButton: () => {
    const resetButton = document.querySelector("#js-reset");
    resetButton.addEventListener("click", () => {
      localStorage.clear();
      UI.sidebar.innerHTML = null;
    });
  },
  /* 좌측 Playlist 세팅 */
  setPlayList: () => {
    UI.sidebar.innerHTML = localStorage.getItem("playlist");
  },
  /* Sidebar 정의 */
  sidebar: document.querySelector('#js-playlist')
};

UI.setInputArea();
UI.setSearchButton();
UI.setResetButton();
UI.setPlayList();

/* 2. SoundCloud API  사용하기 */
const SoundCloudAPI = {
  init: () => {
    SC.initialize({
      client_id: "cd9be64eeb32d1741c17cb39e41d254d"
    });
  },

  getTracks: inputValue => {
    SC.get("/tracks", {
      q: inputValue
    }).then(function(tracks) {
      SoundCloudAPI.renderTracks(tracks);
    });
  },

  renderTracks: tracks => {
    let searchResults = document.querySelector("#js-search-results");
    searchResults.innerHTML = null;
    tracks.forEach(track => {
      // Card
      const card = document.createElement("div");
      card.classList.add("card");

      // Image
      const imageDiv = document.createElement("div");
      imageDiv.classList.add("image");

      const imageImg = document.createElement("img");
      imageImg.classList.add("image_img");
      imageImg.src =
        track.artwork_url || "http://lorempixel.com/100/100/abstract";

      // Content
      const content = document.createElement("div");
      content.classList.add("content");

      // Header
      const header = document.createElement("div");
      header.classList.add("header");

      const link = document.createElement("a");
      link.href = track.permalink_url;
      link.target = "_blank"; // new tab
      link.innerHTML = track.title;

      // Button
      const button = document.createElement("div");
      button.classList.add("ui", "bottom", "attached", "button", "js-button");
      button.addEventListener("click", e => {
        SoundCloudAPI.addPlaylist(track.permalink_url);
      });

      const icon = document.createElement("i");
      icon.classList.add("add", "icon");

      const buttonText = document.createElement("span");
      buttonText.innerHTML = "Add to playlist";

      // 조립!
      imageDiv.appendChild(imageImg);

      header.appendChild(link);
      content.appendChild(header);

      button.appendChild(icon);
      button.appendChild(buttonText);

      card.appendChild(imageDiv);
      card.appendChild(content);
      card.appendChild(button);

      searchResults.appendChild(card);
    });
  },

  addPlaylist: trackURL => {
    SC.oEmbed(trackURL, {
      auto_play: true
    }).then(function(embed) {
      const playbox = document.createElement("div");
      playbox.innerHTML = embed.html;
      UI.sidebar.insertBefore(playbox, UI.sidebar.firstChild);

      localStorage.setItem("playlist", UI.sidebar.innerHTML);
    });
  },
};

SoundCloudAPI.init();
