//okayyyyy!

let elementCurrentlyPlaying = undefined;
let isPlaying = false;
let frames_per_second = 24;

let interval = Math.floor(1000 / frames_per_second);
let startTime = performance.now();
let previousTime = startTime;

let currentTime = 0;
let deltaTime = 0;

let uploadbutton
let uploadedDiv

document.addEventListener("DOMContentLoaded", function() {
    console.log('loaded dom!');
    prep();
    //squares();
})


function prep() {
    uploadbutton = document.getElementById('uploadbutton')
    uploadedDiv = document.getElementById('uploadedimgs')
    let frameholder = document.querySelector('.frameholder')
    frameholder.style.display = 'flex'
    document.querySelector('.animslider').before(createAnimPlayButton())
    
    uploadbutton.addEventListener("change", function(e) {
      updateImageDisplay(frameholder);
      //console.log('oh!')      
    })
    let playbutton = document.querySelector('.playbutton')
    let animslider = document.querySelector('.animslider')
    //add the listeners so we can play and pause yay
}

function squares() {
    
    let holder = document.getElementById('timelinesquares');
    let frames = document.querySelector('.frameholder').children;
    while (holder.firstChild) {
        holder.removeChild(holder.firstChild);
    }
    holder.style.display = "flex";
    for (i=0; i<frames.length-1;i++) {
        let another = document.createElement('div')
        another.classList.add('timelineframe')
        let hold = frames[i].dataset.holdTime;
        another.style.width = `${15*hold}px`;
        another.addEventListener('click', function(e) {
            setNewFrame(i, true, frames.closest('.animbox'))
        })
        holder.appendChild(another)
    }
}

function openFrame(frame) {
    console.log('wow! got a frame,,,')
    //setNewFrame(frame
}

function updateImageDisplay(preview) {
  //while (preview.firstChild) {
  //  preview.removeChild(preview.firstChild);
  //}
  const curFiles = uploadbutton.files;
    /*if (curFiles.length === 0) {
    const para = document.createElement("p");
    para.textContent = "No files currently selected for upload";
    preview.appendChild(para);
    } else {*/
    //const list = document.createElement("ol");
    //preview.appendChild(list);
    
    for (const file of curFiles) {
      //const listItem = document.createElement("li");
    
        const image = document.createElement("img");
        image.src = URL.createObjectURL(file);
        image.alt = image.title = file.name;
        image.classList.add('animframe');
        //listItem.appendChild(image);
        //listItem.appendChild(para);
        preview.appendChild(image);
        image.dataset.holdTime = 2
        //let frameData = preview.dataset.frameData
        //frameData.append({})
    }
    updateFrameCounts()
  //}
}

function updateFrameCounts() {
    squares()
}

function createAnimPlayButton() {
    let playbutton = document.createElement('input');
    playbutton.type = "button";
    playbutton.value = ' > ';
    playbutton.alt = "Play/Pause"
    playbutton.classList.add('playbutton')
    playbutton.dataset.toggled = "false";
    playbutton.addEventListener('click', function(e) {
      if (playbutton.dataset.toggled == "false") {
        playbutton.dataset.toggled = "true";
        playOrStopAnim(true, e.currentTarget.parentElement.parentElement);
      } else {
        playbutton.dataset.toggled = "false";
        playOrStopAnim(false, e.currentTarget.parentElement.parentElement);
      }
    })
    return playbutton;
}

function animationLoop(timestamp) {
    if (isPlaying) {
        if (elementCurrentlyPlaying != undefined) {
            currentTime = timestamp;
            deltaTime = currentTime - previousTime;
            if (deltaTime > interval) {
                previousTime = currentTime - (deltaTime % interval);
                setNewFrame(Number(elementCurrentlyPlaying.dataset.currentFrame), false, elementCurrentlyPlaying)
            }
            requestAnimationFrame(animationLoop);
        }
    }
}

function setNewFrame(idx, fromSlider, animbox) {
    let frameholder = animbox.querySelector('.frameholder');
    let framecount = frameholder.children.length;
    frameholder.style.transform = `translatex(-${idx/framecount*100}%)`
    animbox.dataset.currentFrame = idx;
}

function playOrStopAnim(signal, boxEl) {
  isPlaying = signal;

  if (signal) {
    elementCurrentlyPlaying = boxEl;
    requestAnimationFrame(animationLoop);
  } else {
    elementCurrentlyPlaying = undefined;
  }
}
