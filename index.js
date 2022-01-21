const video = document.querySelector("#video");
const selectCameraButton = document.getElementById("btn-select");
const cameraDevice = document.getElementById("available-cameras");

let currentStream;
let supports = navigator.mediaDevices.getSupportedConstraints();

let cameraDeviceIds = [];
let currenctCameraId;

// if (supports["facingMode"] === true) {
//   selectCameraButton.disabled = false;
// }

function pauseMediaTrack(stream) {
  stream.getTracks().forEach((currentMediaTrack) => {
    currentMediaTrack.stop();
  });
}

function fetchDevices(mediaDevices) {
  let count = 1;
  mediaDevices.forEach((mediaDevice, index) => {
    if (mediaDevice.kind === "videoinput") {
      cameraDeviceIds.push(mediaDevice.deviceId);
      if (index === 0) {
        currenctCameraId = 0;
      }
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
  // if (cameraDevice.value === "") {
  //   videoConstraints.facingMode = "environment";
  // } else {
  videoConstraints.deviceId = cameraDevice.value;
  // }
  console.log(videoConstraints);
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
    console.log(stream);
    video.srcObject = stream;
    video.play();
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  const t = await navigator.mediaDevices.enumerateDevices();
  alert(JSON.stringify(t));
  alert(JSON.stringify(supports));
})();
navigator.mediaDevices.enumerateDevices().then(fetchDevices);
