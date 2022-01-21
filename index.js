const video = document.getElementById("video");
const selectCameraButton = document.getElementById("btn-select");
const cameraDevice = document.getElementById("available-cameras");

let currentStream;
let cameraDeviceIds = [];
let currenctCameraId = 0;

function pauseMediaTrack(stream) {
  stream.getTracks().forEach((currentMediaTrack) => {
    currentMediaTrack.stop();
  });
}

const fetchCameraDevices = async () => {
  const mediaDevices = await navigator.mediaDevices.enumerateDevices();
  let count = 1;
  const videoDevices = mediaDevices.filter(
    (device) => device.kind === "videoinput"
  );

  videoDevices.map((videoDevice) => {
    cameraDeviceIds.push(videoDevice.deviceId);

    const div = document.createElement("div");
    const node = document.createTextNode(
      videoDevice.label || `Camera ${count++}`
    );
    div.appendChild(node);
    cameraDevice.appendChild(div);
  });

  if (cameraDeviceIds.length === 0) {
    alert("No devices found");
  }
};

selectCameraButton.addEventListener("click", () => {
  if (typeof currentStream !== "undefined") {
    pauseMediaTrack(currentStream);
  }

  const videoConstraints = {};

  let nextCameraId = (currenctCameraId + 1) % cameraDeviceIds.length;
  if (!cameraDeviceIds[nextCameraId]) {
    nextCameraId = 0;
  }
  videoConstraints.deviceId = cameraDeviceIds[nextCameraId].deviceId;

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
    video.pause();
    video.srcObject = null;
  }
};

fetchCameraDevices();
