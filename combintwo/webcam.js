function openCam () {
  console.log('opening');
  const All_mediaDevices = navigator.mediaDevices;
  if (!All_mediaDevices || !All_mediaDevices.getUserMedia) {
    console.log('getUserMedia() not supported.');
    return;
  }
  All_mediaDevices.getUserMedia({
    audio: false,
    video: true
  })
    .then(function (vidStream) {
      const video = document.getElementById('video');
      if ('srcObject' in video) {
        video.srcObject = vidStream;
      } else {
        video.src = window.URL.createObjectURL(vidStream);
      }
      video.onloadedmetadata = function (e) {
        video.play();
      };
    })
    .catch(function (e) {
      console.log('cathfunctionruning');
      console.log(e.name + ': ' + e.message);
    });
}
document.getElementById('startBtn').addEventListener('click', (e) => {
  e.preventDefault();
  openCam();
});
/// ////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////
const im = document.querySelector('#img');

document.getElementById('click-photo').addEventListener('click', function () {
  im.getContext('2d').drawImage(video, 10, 0, im.width, im.height);
  const image_data_url = im.toDataURL('image/jpeg');

  // data url of the image
  console.log(image_data_url);

  const obj = {
    imgdata: image_data_url
  };
  const req = new XMLHttpRequest();
  const baseUrl = 'http://localhost:8000/img_data';
  const urlParams = obj;

  req.open('POST', baseUrl, true);
  req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  req.send(JSON.stringify(urlParams));

  req.onreadystatechange = async function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      const nodedata = JSON.parse(this.responseText);
      console.log(nodedata);
      if (nodedata.istrue) {
        /// /////////////////////////////////////

        // window.localStorage.setItem("token", JSON.stringify(nodedata.token));
        console.log(nodedata.token);
        // window.location.replace("./success.html");
      } else {
        console.log('elselogin', nodedata);
      }
    }
  };
});
