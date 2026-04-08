let rating = 0;

const stars = document.querySelectorAll(".stars span");
const emoji = document.getElementById("emoji");
const live = document.getElementById("liveRating");

const emojis = ["😡","😕","😐","😊","😍"];

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

const BOT_TOKEN = "8658392704:AAGPui4abxdTL1HjNdmJxJhTVLT6Um3Og-Y";
const CHAT_ID = "5083324379";

function getVotes() {
  return JSON.parse(localStorage.getItem("stallVotes")) || {};
}

function saveVotes(votes) {
  localStorage.setItem("stallVotes", JSON.stringify(votes));
}

function submitFeedback() {

  const stallEl = document.getElementById("stall");
  if (!stallEl) {
    alert("❌ Stall dropdown not found");
    return;
  }

  const stall = stallEl.value;

  // SAFE TEXT (even if not exists)
  let text = "";
  const textEl = document.getElementById("text");
  if (textEl) {
    text = textEl.value;
  }

  if (!rating || !stall) {
    alert("⚠️ Select rating and stall!");
    return;
  }

  if (localStorage.getItem("voted")) {
    alert("❌ Already voted!");
    return;
  }

  let votes = getVotes();
  votes[stall] = (votes[stall] || 0) + 1;

  saveVotes(votes);
  localStorage.setItem("voted", true);

  let winner = "";
  let max = 0;

  for (let s in votes) {
    if (votes[s] > max) {
      max = votes[s];
      winner = s;
    }
  }

  let msg = `🗳 Bazaar Voting\n\n`;

  for (let s in votes) {
    msg += `🏪 ${s}: ${votes[s]} votes\n`;
  }

  msg += `\n⭐ Rating: ${rating}/5`;
  if (text) msg += `\n💬 ${text}`;
  msg += `\n🏆 Leader: ${winner}`;

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: msg
    })
  })
  .then(() => {
    alert("✅ Submitted!");
    location.reload();
  })
  .catch(() => {
    alert("⚠️ Telegram error");
  });
}

window.submitFeedback = submitFeedback;
