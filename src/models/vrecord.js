


// // collect DOMs
// const State = ['Initial', 'Record', 'Download']
let stateIndex = 0
let mediaRecorder;
let chunks = [];
let audioURL = '';

// mediaRecorder setup for audio
function getMicrophoneReady(){
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({audio: true})
        .then(stream =>{
            mediaRecorder = new MediaRecorder(stream);
        })
        .catch(err =>{
          console.log(err)
          // Error msg
        })
    }else{
      // Error msg
    }
}
getMicrophoneReady()
// // const clearDisplay = () => {
// //   display.textContent = ''
// // }

// // const clearControls = () => {
// //   controllerWrapper.textContent = ''
// // }

const record = ()=>{
    mediaRecorder.ondataavailable = (e) => {
        chunks = [e.data];
    }
    mediaRecorder.start();
}

const stopRecording = ()=>{
    mediaRecorder.onstop = ()=>{
        let audioFile = new Blob(chunks, {'type': 'audio/mp3; codecs=opus'});
        chunks = []; 
        audioURL = URL.createObjectURL(audioFile);
        window.open(audioURL)
    }
    mediaRecorder.stop()
}



// // const downloadAudio = () => {
// //   const downloadLink = document.createElement('a')
// //   downloadLink.href = audioURL
// //   downloadLink.setAttribute('download', 'audio')
// //   downloadLink.click()
// // }

// // const addButton = (btn, funString, text) => {
// //   btn = document.querySelector('#recogBtn')
// //   btn.setAttribute('onclick', funString)
// //   btn.textContent = text
// //   controllerWrapper.append(btn)
// // }

// // const addMessage = (text) => {
// //   const msg = document.createElement('p')
// //   msg.textContent = text
// //   display.append(msg)
// // }

// // const addAudio = () => {
// //   const audio = document.createElement('audio')
// //   audio.controls = true
// //   audio.src = audioURL
// //   display.append(audio)
// // }

// // const application = (index) => {
// //     switch (State[index]) {
// //         case 'Initial':
// //             clearDisplay()
// //             clearControls()

// //             addButton('record', 'record()', 'Start Recording')
// //             break;

// //         case 'Record':
// //             clearDisplay()
// //             clearControls()

// //             addMessage('Recording...')
// //             addButton('stop', 'stopRecording()', 'Stop Recording')
// //             break

// //         case 'Download':
// //             clearControls()
// //             clearDisplay()

// //             addAudio()
// //             addButton('record', 'record()', 'Record Again')
// //             break

// //         default:
// //             clearControls()
// //             clearDisplay()

// //             addMessage('Your browser does not support mediaDevices')
// //             break;
// //     }
// // }

// // application(stateIndex)



// // const recordButton = document.querySelector('#recogBtnS');
// // const stopButton = document.querySelector('#recogBtnE');

// // let stream;

// // recordButton.addEventListener('click', function () {
// //   navigator.mediaDevices.getUserMedia({ audio: true })
// //     .then(function (audioStream) {
// //       stream = audioStream;
// //       mediaRecorder = new MediaRecorder(stream);

// //       mediaRecorder.addEventListener('dataavailable', function (event) {
// //         chunks.push(event.data);
// //       });

// //       mediaRecorder.start();
// //       console.log('Recording started');
// //     })
// //     .catch(function (err) {
// //       console.error('Error accessing microphone', err);
// //     });
// // });

// // stopButton.addEventListener('click', function () {
// //   mediaRecorder.stop();
// //   console.log('Recording stopped');

// //   const audioBlob = new Blob(chunks, { type: 'audio/webm' });
// //   const formData = new FormData();

// //   formData.append('audio', audioBlob, 'recording.webm');
// // });

// // export{
// //   getMicrophoneReady
// // }