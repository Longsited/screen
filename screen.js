// MediaRecorder instance
let mediaRecorder;
// Recorded chunks
const recordedChunks = [];

// Button to start and stop recording
const btnStart = document.getElementById('startBtn');

const displayMediaOptions = {
    video: {
        cursor: "never"
    },
    audio: true
};

let captureStream = null;

btnStart.addEventListener('click', function() {
    navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
        .then(stream => {
            // Initiate MediaRecorder with the stream
            mediaRecorder = new MediaRecorder(stream);

            // Start recording
            mediaRecorder.start();

            // Event triggered when a video chunk is available
            mediaRecorder.ondataavailable = handleDataAvailable;
        })
        .catch(err => {
            console.error("Error: " + err);
        });
}, false);

function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
        download();
        playRecordedVideo();
    }
}

function download() {
    let blob = new Blob(recordedChunks, {
        type: 'video/webm'
    });

    function playRecordedVideo() {
        let blob = new Blob(recordedChunks, {
            type: 'video/webm'
        });

        let url = URL.createObjectURL(blob);
        let player = document.getElementById('player');
        player.src = url;
        player.play();
    }

    url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
}

function initializeVideoElement() {
    const videoElement = document.getElementById('player');
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    const videoWidth = Math.floor(screenWidth / 2);
    const videoHeight = Math.floor(screenHeight / 2);

    videoElement.style.width = videoWidth + 'px';
    videoElement.style.height = videoHeight + 'px';
}

initializeVideoElement();

function playRecordedVideo() {
    let blob = new Blob(recordedChunks, {
        type: 'video/webm'
    });

    let url = URL.createObjectURL(blob);
    let player = document.getElementById('player');
    player.src = url;
    player.play();
}

const videoElement = document.getElementById('player');
const cropContainer = document.getElementById('cropContainer');
const buttons = document.querySelectorAll('.corner-button');
const wrapper = document.getElementById('wrapper');

let activeButton = null;
const borderWidth = 6; // Assuming border is 2px on each side, total 4px

function handleDragStart(event) {
    activeButton = event.target;
    activeButton.initialX = event.clientX;
    activeButton.initialY = event.clientY;
    activeButton.initialCropWidth = cropContainer.offsetWidth;
    activeButton.initialCropHeight = cropContainer.offsetHeight;
    activeButton.initialCropLeft = cropContainer.offsetLeft;
    activeButton.initialCropTop = cropContainer.offsetTop;

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
}

function handleDrag(event) {
    if (activeButton) {
        event.preventDefault();

        const deltaX = event.clientX - activeButton.initialX;
        const deltaY = event.clientY - activeButton.initialY;
        let newWidth, newHeight, newLeft, newTop;

        if (activeButton.id === 'cropAdjust1' || activeButton.id === 'cropAdjust3') {
            newLeft = activeButton.initialCropLeft + deltaX;
            newWidth = activeButton.initialCropWidth - deltaX - borderWidth;
        } else {
            newLeft = activeButton.initialCropLeft;
            newWidth = activeButton.initialCropWidth + deltaX - borderWidth;
        }

        if (activeButton.id === 'cropAdjust1' || activeButton.id === 'cropAdjust2') {
            newTop = activeButton.initialCropTop + deltaY;
            newHeight = activeButton.initialCropHeight - deltaY - borderWidth;
        } else {
            newTop = activeButton.initialCropTop;
            newHeight = activeButton.initialCropHeight + deltaY - borderWidth;
        }

        if (newWidth > 0 && newWidth + newLeft <= wrapper.offsetWidth) {
            cropContainer.style.width = `${newWidth}px`;
            if (newLeft >= 0)
                cropContainer.style.left = `${newLeft}px`;
        }
        if (newHeight > 0 && newHeight + newTop <= wrapper.offsetHeight) {
            cropContainer.style.height = `${newHeight}px`;
            if (newTop >= 0)
                cropContainer.style.top = `${newTop}px`;
        }
    }
}

function handleDragEnd(event) {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
    activeButton = null;
}

function handleTouchStart(event) {
    activeButton = event.targetTouches[0].target;
    activeButton.initialX = event.targetTouches[0].clientX;
    activeButton.initialY = event.targetTouches[0].clientY;
    activeButton.initialCropWidth = cropContainer.offsetWidth;
    activeButton.initialCropHeight = cropContainer.offsetHeight;
    activeButton.initialCropLeft = cropContainer.offsetLeft;
    activeButton.initialCropTop = cropContainer.offsetTop;

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    event.preventDefault();
}

function handleTouchMove(event) {
    if (activeButton) {
        event.preventDefault();

        const deltaX = event.touches[0].clientX - activeButton.initialX;
        const deltaY = event.touches[0].clientY - activeButton.initialY;
        let newWidth, newHeight, newLeft, newTop;

        if (activeButton.id === 'cropAdjust1' || activeButton.id === 'cropAdjust3') {
            newLeft = activeButton.initialCropLeft + deltaX;
            newWidth = activeButton.initialCropWidth - deltaX - borderWidth;
        } else {
            newLeft = activeButton.initialCropLeft;
            newWidth = activeButton.initialCropWidth + deltaX - borderWidth;
        }

        if (activeButton.id === 'cropAdjust1' || activeButton.id === 'cropAdjust2') {
            newTop = activeButton.initialCropTop + deltaY;
            newHeight = activeButton.initialCropHeight - deltaY - borderWidth;
        } else {
            newTop = activeButton.initialCropTop;
            newHeight = activeButton.initialCropHeight + deltaY - borderWidth;
        }

        if (newWidth > 0 && newWidth + newLeft <= wrapper.offsetWidth) {
            cropContainer.style.width = `${newWidth}px`;
            if (newLeft >= 0)
                cropContainer.style.left = `${newLeft}px`;
        }
        if (newHeight > 0 && newHeight + newTop <= wrapper.offsetHeight) {
            cropContainer.style.height = `${newHeight}px`;
            if (newTop >= 0)
                cropContainer.style.top = `${newTop}px`;
        }
    }
}

function handleTouchEnd(event) {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    activeButton = null;
}

buttons.forEach((button) => {
    button.addEventListener('mousedown', handleDragStart);
    button.addEventListener('touchstart', handleTouchStart);
});


function initializeCropContainer() {
    const cropAdjust1 = document.getElementById('cropAdjust1');
    const cropAdjust2 = document.getElementById('cropAdjust2');
    const cropAdjust3 = document.getElementById('cropAdjust3');
    const cropAdjust4 = document.getElementById('cropAdjust4');

    cropContainer.appendChild(cropAdjust1);
    cropContainer.appendChild(cropAdjust2);
    cropContainer.appendChild(cropAdjust3);
    cropContainer.appendChild(cropAdjust4);

    cropAdjust1.style.display = 'block';
    cropAdjust2.style.display = 'block';
    cropAdjust3.style.display = 'block';
    cropAdjust4.style.display = 'block';

    const screenWidth = screen.width;
    const screenHeight = screen.height;
    const videoWidth = Math.floor(screenWidth / 2);
    const videoHeight = Math.floor(screenHeight / 2);

    videoElement.style.width = videoWidth + 'px';
    videoElement.style.height = videoHeight + 'px';

    const cropWidthLoad = Math.floor(screenWidth / 2 - 5);
    const cropHeightLoad = Math.floor(screenHeight / 2 - 5);

    cropContainer.style.width = cropWidthLoad + 'px';
    cropContainer.style.height = cropHeightLoad + 'px';

    // Add margin to the cropContainer
    cropContainer.style.margin.right = '1px';
}

const cropButton = document.getElementById('cropButton');

cropButton.addEventListener('click', () => {
    initializeCropContainer();
});

Array.from(buttons).forEach(button => {
    button.addEventListener('mousedown', handleDragStart);
    button.addEventListener('mousemove', handleDrag);
    button.addEventListener('mouseup', handleDragEnd);

    button.addEventListener('touchstart', handleTouchStart);
    button.addEventListener('touchmove', handleTouchMove);
    button.addEventListener('touchend', handleTouchEnd);
});


const uploader = document.getElementById('upload');
const player = document.getElementById('player');
const trimSlider = document.getElementById('trimSlider');
const trimSlider2 = document.getElementById('trimSlider2');
const applyButton = document.getElementById('applyButton');

let trimStart = 0;
let trimEnd = 0;

player.addEventListener('loadedmetadata', function() {
    const videoDuration = player.duration;
    trimSlider.max = videoDuration;
    trimSlider2.max = videoDuration;
});

trimSlider.addEventListener('input', function() {
    trimStart = parseInt(this.value);
});

trimSlider2.addEventListener('input', function() {
    trimEnd = parseInt(this.value);
});

applyButton.addEventListener('click', function() {
    // Apply the trimming logic here using trimStart and trimEnd values
});


function applyChanges() {
    const applyButton = document.getElementById('applyButton');
    const trimSlider = document.getElementById('trimSlider');
    const trimSlider2 = document.getElementById('trimSlider2');

    let cropDimensions = '0,0,640,480';
    let trimStart = 0;
    let trimEnd = 0;

    applyButton.addEventListener('click', function() {
        const containerRect = cropContainer.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        const cropTop = containerRect.top - playerRect.top;
        const cropLeft = containerRect.left - playerRect.left;
        cropDimensions = `${cropTop},${cropLeft},${containerRect.width},${containerRect.height}`;

        trimStart = parseInt(trimSlider.value);
        trimEnd = parseInt(trimSlider2.value);

        const modifiedVideoUrl = `${player.src}?crop=${cropDimensions}&start=${trimStart}&end=${trimEnd}`;
        player.src = modifiedVideoUrl;
        player.load();
    });
}

applyChanges();

const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

const convertVideo = async () => {
  const inputFile = document.getElementById('upload').files[0];
  const outputType = document.getElementById('outputType').value;
  
  if (inputFile) {
    await ffmpeg.load();
    ffmpeg.FS('writeFile', inputFile.name, await fetchFile(inputFile));
    
    if (outputType === 'gif') {
      await ffmpeg.run('-i', inputFile.name, 'output.gif');
      const data = ffmpeg.FS('readFile', 'output.gif');
      const video = document.getElementById('player');
      video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    } else if (outputType === 'mp4') {
      await ffmpeg.run('-i', inputFile.name, 'output.mp4');
      const data = ffmpeg.FS('readFile', 'output.mp4');
      const video = document.getElementById('player');
      video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    }
  }
};

document.getElementById('convertBtn').addEventListener('click', convertVideo);
