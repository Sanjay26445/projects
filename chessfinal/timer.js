let time = 0;
let intervalId;
const timeSelect = document.getElementById("time-select");

function start() {
  if (!intervalId) {
    time = parseInt(timeSelect.value) * 60000;
    updateTime();
    intervalId = setInterval(function() {
      time -= 1000;
      updateTime();
      if (time <= 0) {
        stop();
        alert("Time's up!");
      }
    }, 1000);
  }
}

function stop() {
  clearInterval(intervalId);
  intervalId = null;
}

function reset() {
  stop();
  time = 0;
  updateTime();
}

function updateTime() {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = time % 1000;

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  const formattedMilliseconds = milliseconds.toString().padStart(3, "0");

  document.getElementById("time").innerText = formattedMinutes + ":" + formattedSeconds + ":" + formattedMilliseconds;
}

document.getElementById("start").addEventListener("click", start);
document.getElementById("stop").addEventListener("click", stop);
document.getElementById("reset").addEventListener("click", reset);
