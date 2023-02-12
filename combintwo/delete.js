let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let im = document.querySelector("#img");

camera_button.addEventListener("click", async function () {
  let stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  console.log(stream);
  video.srcObject = stream;
});

click_button.addEventListener("click", function () {
  im.getContext("2d").drawImage(video, 10, 0, im.width, im.height);
  let image_data_url = im.toDataURL("image/jpeg");

  // data url of the image
  console.log(image_data_url);
  let data = document.createElement("a");
  data.innerText = image_data_url;

  document.getElementById("in").appendChild(data);

  // JPEG file
  let file = null;
  let blob = im.toBlob(function (blob) {
    file = new File([blob], "test.jpg", { type: "image/jpeg" });
  }, "image/jpeg");
  console.log(blob);
  let b = document.createElement("b");
  b.innerHTML = blob;
  document.getElementById("in").appendChild(b);
});

////////////////////////////////////////////////////////
let camera_stream = [];
let media_recorder = null;
let blobs_recorded = [];
let start_button = document.querySelector("#start-record");
let stop_button = document.querySelector("#stop-record");
let download_link = document.querySelector("#download-video");
// async function s() {
//   camera_stream = await navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true,
//   });
//   video.srcObject = camera_stream;
// }
// s();
start_button.addEventListener("click", async function () {
  // set MIME type of recording as video/webm
  camera_stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  video.srcObject = camera_stream;
  media_recorder = new MediaRecorder(camera_stream, { mimeType: "video/webm" });

  // event : new recorded video blob available
  media_recorder.addEventListener("dataavailable", function (e) {
    blobs_recorded.push(e.data);
    console.log(e.data);
  });

  // event : recording stopped & all blobs sent
  media_recorder.addEventListener("stop", function () {
    // create local object URL from the recorded video blobs
    console.log(blobs_recorded);
    let video_local = URL.createObjectURL(
      new Blob(blobs_recorded, { type: "video/webm" })
    );
    console.log(video_local);
    download_link.href = video_local;
  });

  // start recording with each recorded blob having 1 second video
  media_recorder.start(100);
});

stop_button.addEventListener("click", function () {
  media_recorder.stop();
});
////////////////////////////////////////////////////
