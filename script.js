let rating = 0;

const stars = document.querySelectorAll(".stars span");
const emoji = document.getElementById("emoji");
const live = document.getElementById("liveRating");

const emojis = ["😡","😕","😐","😊","😍"];

// ⭐ STAR RATING
stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    rating = index + 1;

    stars.forEach(s => s.classList.remove("active"));
    for (let i = 0; i < rating; i++) {
      stars[i].classList.add("active");
    }

    emoji.textContent = emojis[rating - 1];
    live.innerText = `⭐ ${rating} / 5`;
  });
});


// 🔥 TELEGRAM CONFIG (⚠️ better to hide in backend later)
const BOT_TOKEN = "8658392704:AAGPui4abxdTL1HjNdmJxJhTVLT6Um3Og-Y";
const CHAT_ID = "5083324379";


// 📊 STORAGE
function getVotes() {
  return JSON.parse(localStorage.getItem("stallVotes")) || {};
}

function saveVotes(votes) {
  localStorage.setItem("stallVotes", JSON.stringify(votes));
}


// 🚀 MAIN FUNCTION
function submitFeedback() {

  const stall = document.getElementById("stall").value;

  // text field OPTIONAL (error fix)
  const textElement = document.getElementById("text");
  const text = textElement ? textElement.value : "";

  if (!rating || !stall) {
    alert("Please select rating and stall!");
    return;
  }

  // ❌ one device one vote
  if (localStorage.getItem("voted")) {
    alert("❌ Already voted from this device!");
    return;
  }

  let votes = getVotes();

  votes[stall] = (votes[stall] || 0) + 1;

  saveVotes(votes);
  localStorage.setItem("voted", true);

  // 🏆 FIND LEADER
  let winner = "";
  let max = 0;

  for (let s in votes) {
    if (votes[s] > max) {
      max = votes[s];
      winner = s;
    }
  }

  // 📲 TELEGRAM MESSAGE
  let msg = `🗳 Bazaar O Nomics Voting\n\n`;

  for (let s in votes) {
    msg += `🏪 ${s}: ${votes[s]} votes\n`;
  }

  msg += `\n⭐ Rating: ${rating}/5`;
  if (text) msg += `\n💬 Feedback: ${text}`;

  msg += `\n\n🏆 Leader: ${winner} (${max} votes)`;

  // 🚀 SEND TO TELEGRAM
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: msg
    })
  })
  .then(() => {
    alert("✅ Vote Submitted!");
    location.reload();
  })
  .catch(() => {
    alert("⚠️ Error sending to Telegram");
  });
}


// 🌍 GLOBAL ACCESS
window.submitFeedback = submitFeedback;
