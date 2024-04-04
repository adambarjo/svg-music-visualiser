const
  audioPlayer = document.getElementById("audio-player"),
  audioFile = document.getElementById("audio-file"),
  chooseFile = document.getElementById("choose-file"),
  playPause = document.getElementById("play-pause"),
  context = new AudioContext(),
  analyser = context.createAnalyser(),
  source = context.createMediaElementSource(audioPlayer),
  vsBars = document.getElementsByClassName("vs-bar"),
  vsSun = document.getElementById("vs-sun"),
  frequency = new Uint8Array(analyser.frequencyBinCount)

let
  playing = false

source.connect(analyser)
analyser.connect(context.destination)
vsLoop()

audioFile.onchange = () => {
  if (audioFile.files[0]) {
    audioPlayer.src = URL.createObjectURL(audioFile.files[0])
    playPause.classList.remove("hide")
    audioPlayer.pause()
    playing = false
    playPause.innerHTML = "Play"
  }
}

chooseFile.onclick = () => audioFile.click()

playPause.onclick = () => {
  if (playing) {
    audioPlayer.pause()
    playing = false
    playPause.innerHTML = "Play"
  } else {
    audioPlayer.play()
    playing = true
    playPause.innerHTML = "Pause"
  }
}

function vsLoop() {
  analyser.getByteFrequencyData(frequency)
  if (Array.from(frequency).reduce((a, b) => a + b)) {
    for (let i = 0; i < vsBars.length; i++)
      vsBars[i].y1.baseVal.value = -frequency[i] + 760

    vsSun.r.baseVal.value = frequency[(1024 / 2)] + 200
  }
  setTimeout(vsLoop, 16)
}