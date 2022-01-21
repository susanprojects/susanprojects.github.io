let video = document.querySelector("#video");

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      if (error.name === "NotAllowedError") {
        console.log("Permission has not been granted to use your camera");
      }
    });
}
