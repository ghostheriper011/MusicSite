const players = document.querySelectorAll(".player");

players.forEach(player => {
    player.addEventListener("play", () => {
        players.forEach(other => {
            if (other !== player) {
                other.pause();
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
  const musicCards = document.querySelectorAll('.music-card');

  musicCards.forEach(card => {
    const likeBtn = card.querySelector('.like-btn');
    const likeCount = card.querySelector('.like-count');
    const player = card.querySelector('.player');

    const commentBtn = card.querySelector('.comment-btn');
    const commentInput = card.querySelector('.comment-input');
    const liveCommentsContainer = card.querySelector('.live-comments');

    let comments = []; // store comments for looping

    // LIKE BUTTON
    likeBtn.addEventListener('click', () => {
      likeCount.textContent = parseInt(likeCount.textContent) + 1;
    });

    // PLAY COUNT
    player.addEventListener('play', () => {
      let current = parseInt(card.querySelector('.play-count').textContent.replace(/\D/g, ''));
      current++;
      card.querySelector('.play-count').textContent = `▶ ${current} plays`;
    });

    // ADD COMMENT
    commentBtn.addEventListener('click', () => {
      const text = commentInput.value.trim();
      if (text !== '') {
        comments.push(text);
        commentInput.value = '';
      }
    });

    // LOOP COMMENTS
    setInterval(() => {
      if (comments.length === 0) return;

      const randomIndex = Math.floor(Math.random() * comments.length);
      const commentEl = document.createElement('div');
      commentEl.classList.add('floating-comment');
      commentEl.textContent = comments[randomIndex];

      // random horizontal position for variety
      commentEl.style.left = `${Math.random() * 80 + 10}%`;

      liveCommentsContainer.appendChild(commentEl);

      // remove after animation
      setTimeout(() => {
        commentEl.remove();
      }, 4000); // matches CSS animation duration
    }, 1500); // every 1.5s, a new comment appears
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const reels = document.querySelectorAll('.reel-card');

  // Autoplay visible video only
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video');
      if(entry.isIntersecting){
        reels.forEach(r => {
          const v = r.querySelector('video');
          if(v !== video) v.pause();
        });
        video.play().catch(()=>{});
      } else {
        video.pause();
      }
    });
  }, {threshold: 0.8});

  reels.forEach(r => observer.observe(r));

  // Tap video to play/pause & double-tap heart
  reels.forEach(r => {
    const video = r.querySelector('video');
    let lastTap = 0;

    video.addEventListener('click', () => {
      const now = Date.now();
      if(now - lastTap < 300){
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '❤️';
        r.appendChild(heart);
        setTimeout(() => heart.remove(), 700);
      }
      video.paused ? video.play() : video.pause();
      lastTap = now;
    });
  });

  // Like button
  reels.forEach(r => {
    const likeBtn = r.querySelector('.likeBtn');
    likeBtn.onclick = () => {
      likeBtn.classList.toggle('liked');
      likeBtn.textContent = likeBtn.classList.contains('liked') ? '❤️' : '🤍';
    };
  });

  // Comment panel functionality
  reels.forEach(r => {
    const reelId = r.dataset.id;
    const commentBtn = r.querySelector('.commentBtn');
    const panel = r.querySelector('.commentPanel');
    const list = r.querySelector('.commentList');
    const input = r.querySelector('.commentInput input');
    const postBtn = r.querySelector('.commentInput button');
    const closeBtn = r.querySelector('.closeCommentBtn');

    let saved = JSON.parse(localStorage.getItem('reel_comments_' + reelId) || '[]');

    function render() {
      list.innerHTML = '';
      saved.forEach((text, idx) => {
        const p = document.createElement('p');
        const span = document.createElement('span'); span.textContent = text;
        const edit = document.createElement('button'); edit.textContent = '✏️';
        edit.onclick = e => { 
          e.stopPropagation(); 
          const newText = prompt('Edit comment:', text); 
          if(newText !== null){ 
            saved[idx] = newText; 
            localStorage.setItem('reel_comments_' + reelId, JSON.stringify(saved)); 
            render(); 
          } 
        };
        const del = document.createElement('button'); del.textContent = '🗑️';
        del.onclick = e => { 
          e.stopPropagation(); 
          saved.splice(idx,1); 
          localStorage.setItem('reel_comments_' + reelId, JSON.stringify(saved)); 
          render(); 
        };
        p.appendChild(span); p.appendChild(edit); p.appendChild(del);
        list.appendChild(p);
      });
    }

    render();

    commentBtn.onclick = e => { e.stopPropagation(); closeAll(); panel.classList.add('show'); };
    closeBtn.onclick = e => { e.stopPropagation(); panel.classList.remove('show'); };
    postBtn.onclick = () => { 
      const text = input.value.trim(); 
      if(!text) return; 
      saved.push(text); 
      localStorage.setItem('reel_comments_' + reelId, JSON.stringify(saved)); 
      input.value = ''; 
      render(); 
    };
    panel.addEventListener('click', e => e.stopPropagation());
  });

  function closeAll(){
    document.querySelectorAll('.commentPanel').forEach(p => p.classList.remove('show'));
  }

  document.addEventListener('click', closeAll);

  // Live floating comments
  reels.forEach(r => {
    const liveCommentsContainer = r.querySelector('.live-comments');
    let comments = [];

    // loop floating comments
    setInterval(() => {
      if(comments.length === 0) return;
      const idx = Math.floor(Math.random() * comments.length);
      const c = document.createElement('div');
      c.className = 'floating-comment';
      c.textContent = comments[idx];
      c.style.left = `${Math.random() * 80 + 10}%`;
      liveCommentsContainer.appendChild(c);
      setTimeout(() => c.remove(), 4000);
    }, 1500);

    // push to live comments whenever posted
    const postBtn = r.querySelector('.commentInput button');
    const input = r.querySelector('.commentInput input');
    postBtn.addEventListener('click', () => {
      const text = input.value.trim();
      if(text) comments.push(text);
    });
  });
});
const videos = document.querySelectorAll(".reel-card video");

/* Auto play on scroll */
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.play();
    } else {
      entry.target.pause();
    }
  });
},{ threshold:0.75 });

videos.forEach(video=>{
  observer.observe(video);
});

/* Tap to pause/play */
videos.forEach(video=>{
  video.addEventListener("click", ()=>{
    if(video.paused){
      video.play();
    } else {
      video.pause();
    }
  });
});

/* Like button + counter */
document.querySelectorAll(".likeBtn").forEach(btn=>{
  const count = btn.parentElement.querySelector(".likeCount");
  let likes = 0;

  btn.addEventListener("click", ()=>{
    if(btn.textContent==="🤍"){
      btn.textContent="❤️";
      likes++;
    } else {
      btn.textContent="🤍";
      likes--;
    }
    count.textContent = likes;
  });
});

/* Double tap heart animation */
document.querySelectorAll(".reel-card").forEach(card=>{
  const heart = card.querySelector(".heart");
  const likeBtn = card.querySelector(".likeBtn");
  let tapTimeout;

  card.addEventListener("click", ()=>{
    if(tapTimeout){
      clearTimeout(tapTimeout);

      heart.classList.add("show");
      likeBtn.textContent="❤️";

      setTimeout(()=>{
        heart.classList.remove("show");
      },300);

    } else {
      tapTimeout = setTimeout(()=>{
        tapTimeout=null;
      },250);
    }
  });
});

/* Comment panel */
document.querySelectorAll(".commentBtn").forEach((btn,i)=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".commentPanel")[i]
      .classList.add("active");
  });
});

document.querySelectorAll(".closeCommentBtn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    btn.parentElement.classList.remove("active");
  });
});

/* Mute toggle */
document.querySelectorAll(".muteBtn").forEach((btn,index)=>{
  btn.addEventListener("click", ()=>{
    const video = videos[index];
    video.muted = !video.muted;
    btn.textContent = video.muted ? "🔇" : "🔊";
  });
});



const audios = document.querySelectorAll("audio");

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

let currentSource = null;

function connectAudio(audioElement) {
    if (currentSource) {
        currentSource.disconnect();
    }

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    currentSource = source;
}

function animateBackground() {
    requestAnimationFrame(animateBackground);

    analyser.getByteFrequencyData(dataArray);

    let bass = 0;
    for (let i = 0; i < 10; i++) {
        bass += dataArray[i];
    }

    bass = bass / 10;

    let intensity = bass / 255;
    let purpleStrength = 60 + intensity * 195;

    document.body.style.background = `
        linear-gradient(
            135deg,
            #1C1C1C,
            rgb(${purpleStrength}, 0, ${purpleStrength})
        )
    `;
}

audios.forEach(audio => {
    audio.addEventListener("play", () => {
        audioContext.resume();
        connectAudio(audio);
        animateBackground();
    });
});
