const video = document.querySelector("#video");
const selectCameraButton = document.getElementById("btn-select");
const cameraDevice = document.getElementById("available-cameras");

let currentStream;
let supports = navigator.mediaDevices.getSupportedConstraints();

if (supports["facingMode"] === true) {
  selectCameraButton.disabled = false;
}

function pauseMediaTrack(stream) {
  stream.getTracks().forEach((currentMediaTrack) => {
    currentMediaTrack.stop();
  });
}

function fetchDevices(mediaDevices) {
  let count = 1;
  mediaDevices.forEach((mediaDevice) => {
    if (mediaDevice.kind === "videoinput") {
      const div = document.createElement("div");
      const node = document.createTextNode(
        mediaDevice.label || `Camera ${count++}`
      );
      div.appendChild(node);
      cameraDevice.appendChild(div);
    }
  });
}

selectCameraButton.addEventListener("click", () => {
  if (typeof currentStream !== "undefined") {
    pauseMediaTrack(currentStream);
  }

  const videoConstraints = {};
  if (cameraDevice.value === "") {
    videoConstraints.facingMode = "environment";
  } else {
    videoConstraints.deviceId = cameraDevice.value;
  }

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const constraints = {
      audio: false,
      video: videoConstraints,
    };
    startVideoStreaming(constraints);
  }
});

const startVideoStreaming = async (constraints) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    video.play();
  } catch (error) {
    console.log(error);
  }
};

navigator.mediaDevices.enumerateDevices().then(fetchDevices);
