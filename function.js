let elementCurrentlyPlaying = undefined;
let isPlaying = false;
let frames_per_second = 12;

let interval = Math.floor(1000 / frames_per_second);
let startTime = performance.now();
let previousTime = startTime;

let currentTime = 0;
let deltaTime = 0;

let boxesNeedingSliders = []



function createAllAnimBoxes() {
    let boxes = document.getElementsByClassName('animation-wrapper');
    //console.log(`we got ${boxes.length} boxes :-)`);
    for (let i=0; i<boxes.length; i++) {
        let box = boxes[i];
        let isParallax = box.dataset.isParallax
        let animBoxData = {
            "thumbnailSrc" : box.dataset.thumbnailSrc,
            "ratio" : box.dataset.ratio.split("/"),
        }
        if (isParallax == true || isParallax == "true") {
            //console.log('parallaxfound!');
            animBoxData.isParallax = true;
            animBoxData.planesSrc = JSON.parse(box.dataset.planesSrc);
            animBoxData.parallaxData = JSON.parse(box.dataset.parallaxData);
        } else {
            animBoxData.isParallax = false;
            animBoxData.framerate = box.dataset.framerate;
            animBoxData.hasBg = box.dataset.hasBg;
            if (animBoxData.hasBg == "true") {
                animBoxData.hasBg = true;
            } else {
                animBoxData.hasBg = false;
            };
            animBoxData.spriteSrc = box.dataset.spriteSrc;
            animBoxData.rows = box.dataset.rows;
            animBoxData.cols = box.dataset.cols;
            animBoxData.frameData = JSON.parse(box.dataset.frameData)
        }
        let newBox = createAnimationBox(animBoxData);
        box.appendChild(newBox);
        boxesNeedingSliders.push([animBoxData, newBox]);
        requestAnimationFrame(waitForHeight)
        
        box.classList.add('waiting-for-imgs')
    }
    requestAnimationFrame(loadingBetter)
}



function createAnimationBox(data) {
    let animBox = document.createElement('div')
    animBox.classList.add('animbox');
    animBox.style.aspectRatio = `${data.ratio[0]}/${data.ratio[1]};`
    let animLayers = document.createElement('div');
    animBox.appendChild(animLayers);
    animLayers.style = `width:100%;height:100%;`;

    //add loading screen:
    //let loadingEl = document.createElement('img');
    //loadingEl.classList.add('loadingcover');
    //let loadingImg = document.createElement('img');
    //loadingImg.src = '/storage/items/March2022/icfZR0PTP8d9avSWiAjC.png';
    //loadingEl.appendChild(loadingImg);
    //animBox.appendChild(loadingEl);

      //add a loading cover :-)
    let loadCover = document.createElement("div");
    //loadCover.style = 'width:100%;height:100%;background-color:rgba(120,110,95,0.8);';
   // let loadText = document.createElement('p');
    //loadText.textContent = 'Loading Animation...';
    //let loadImg = document.createElement('img');
    //loadImg.src = '/storage/assets/rexrun_1.gif';
    //loadCover.appendChild(loadImg);
    //loadCover.appendChild(loadText);
    loadCover.classList.add('loadingcover')
    animBox.appendChild(loadCover)


    let olImgData = {
        "src" : "",
        "alt" : ""
    }

    if (data.isParallax == "false" || data.isParallax == false) {
        //this is spriteanimation!
        //create bg img;
        if (data.hasBg) {
          let bgEl = document.createElement('img');
          bgEl.src = data.bgSrc;
          bgEl.classList.add("anim-bg");
          animLayers.appendChild(bgEl);
        }
        
        //create sprites:
        let spritesEl = document.createElement('img');
        spritesEl.src = data.spriteSrc;
        spritesEl.classList.add("anim-sprites");
        console.log("cols: ", data.cols)
        spritesEl.style = `height:${Number(data.rows) * 100}%; width: ${Number(data.cols)*100}%;`

        animLayers.appendChild(spritesEl);
        animBox.dataset.currentFrame = 0;
        //imageSetsToLoad.push([animBox, bgEl, spritesEl]);

        olImgData.alt = "Arrow to Play/Pause Animation Controls";
        olImgData.src = 'https://i.postimg.cc/mTjB5h9j/sliderolpurple.png';
    } else {
        //this is a parallax box!
        //let planesimgsToLoad = [animBox]
        //todo: put da planes here lol
        for (let i=0; i<data.parallaxData.length; i++) {
            let planeEl = document.createElement('img');
            planeEl.src = data.planesSrc[i];
            planeEl.classList.add("anim-parallax");
            planeEl.dataset.parallax = `${data.parallaxData[i].startVal}/${data.parallaxData[i].endVal}`
            
            //planeEl.style = `height:${data.parallaxData.length * 100}%; top:${(100 / data.parallaxData.length) * i}%;`;
            //planesimgsToLoad.push(planeEl)
            animLayers.appendChild(planeEl);
        }
        olImgData.alt = "Use the Slider below to pan the background!"
        olImgData.src = 'https://i.postimg.cc/mTjB5h9j/sliderolpurple.png';
        
        //imageSetsToLoad.push(planesimgsToLoad)
    }

    

    //add instructional overalay!!
    let olImg = document.createElement("img");
    olImg.width = '100%';
    olImg.alt = olImgData.alt;
    olImg.src = olImgData.src;
    olImg.classList.add('anim-olimg');
    olImg.style.visibility = 'hidden';
    animLayers.appendChild(olImg);

  

    return animBox
    //addAnimSlider(data, animLayers)
}


function loadingBetter() {
    let waitingforImgDivs = document.querySelectorAll('.waiting-for-imgs')
    let unloadedCounter = waitingforImgDivs.length;
    console.log(`loading ${unloadedCounter} set of imgs!`)
    for (let i=0;i<waitingforImgDivs.length; i++) {
        let thisDiv = waitingforImgDivs[i];
        let imgs = thisDiv.querySelectorAll('img');
        let unloaded = []
        for (let j=0;j<imgs.length;j++) {
            if (!imgs[j].complete) {
                unloaded.push(imgs[j])
                j = imgs.length
            }
        }
        if (unloaded.length == 0) {
            thisDiv.classList.remove('waiting-for-imgs');
            unloadedCounter -= 1;
            doneLoadingAnim(thisDiv)
        }
    }
    if (Number(unloadedCounter) > 0) {
        requestAnimationFrame(loadingBetter)
    } else {
      console.log('Done loading all imgsets!')
    }
}


function doneLoadingAnim(box) {
    //console.log('done loading smth!')
    addAnimSlider(box)
    let olImg = box.querySelector('.anim-olimg');
    if (olImg) {
        olImg.style.visibility = "visible";
    }
    let loadingEl = box.querySelector('.loadingcover');
    if (loadingEl) {
        loadingEl.style.display = 'none';
    }
}

function addAnimSlider(box) {
    let layersbox = box.children[0]
    //create controlsbox
    let sliderDiv = document.createElement('div');
    sliderDiv.classList.add('animcontrolsbox');
    //create slider
    var sliderInput = document.createElement("INPUT");
    sliderInput.type = "range";
    sliderInput.min = 0;
    sliderInput.value = 0;
    sliderInput.classList.add("animslider");
    let isParallax = box.dataset.isParallax;
    //console.log(layersbox.parentElement, `isparallax? ${isParallax}`);
    if (isParallax == true || isParallax == "true") {
        sliderInput.max = 1000;
        let ratio = box.dataset.ratio.split('/');
        let aspectH = layersbox.children[0].children[0].offsetHeight / Number(ratio[1]);
        let aspectW = Number(aspectH) * Number(ratio[0]);						   
        
        let exemptWidthPercent = aspectW / layersbox.children[0].children[0].offsetWidth;
        console.log(`slider aspect w/h is ${aspectW}/${aspectH} - exempt is ${exemptWidthPercent}`);
        //let exemptWidthPercent = data.ratio[0] / layersbox.children[0].children[0].offsetWidth;
        if (exemptWidthPercent == Infinity || exemptWidthPercent == NaN){
            exemptWidthPercent = 0
        }
        sliderInput.addEventListener('input', function(e) {slidePlanes((e.currentTarget.value*.1), layersbox.children[0], exemptWidthPercent)});
        slidePlanes(sliderInput.value*.1, layersbox.children[0], exemptWidthPercent);
    } else {
        sliderInput.addEventListener('input', function(e) {
            setNewFrame(e.currentTarget.value, true, box)
        })
        let playbutton = createAnimPlayButton();
        sliderInput.max = JSON.parse(box.dataset.frameData).length - 1;
        sliderDiv.appendChild(playbutton);
    }
    sliderDiv.appendChild(sliderInput);
    layersbox.after(sliderDiv);

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


function waitForHeight() {
    if (boxesNeedingSliders.length > 0) {
        let args = boxesNeedingSliders[0]
        let element = args[1];
      if (element.children[0].children[0].offsetHeight == 0) {
        requestAnimationFrame(waitForHeight)
      } else {
        //addAnimSlider(args[1])
        //addParallaxSlider(parallaxBoxesLoaded);
        boxesNeedingSliders.splice(0,1)
        console.log(`got height for el! ${element.children[0].children[0].offsetWidth}/${element.children[0].children[0].offsetHeight}`)
          
        if (boxesNeedingSliders.length > 0) {
          requestAnimationFrame(waitForHeight)
        } else {
          console.log("Done waiting for all height!")
        }
      }
    }
}


function slidePlanes(value, box, exemptWidthPercent) {
  //console.log('sliding?', value, box);
  let planes = box.children;
  for (let i=0;i<planes.length; i++) {
    if (!planes[i].classList.contains("anim-olimg")) {
      let parallaxData = planes[i].dataset.parallax.split("/");
      let paraMin = Number(parallaxData[0]);
      let paraMax = Number(parallaxData[1]);
      let diff = paraMax - paraMin;
      //console.log(paraMin, paraMax, diff, value, exemptWidthPercent);
      let finalNum = ((Number(paraMin) + (Number(diff) * Number(value)/100))/100) * (100 * (1-Number(exemptWidthPercent)));
      planes[i].style.transform = "translateX(" + (0-(finalNum)).toString() + "%)";
        
    //console.log(planes[i], "translateX(" + (0-(finalNum)).toString() + "%)");
    } else {
      if (value != 0) {
        planes[i].style.display = "none"
      }
    }
  }
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


function setNewFrame(idx, isFromSlider, animbox) {
  //console.log(idx)
  if (isNaN(idx)) {
    //console.log('a! nan!');
    idx = 0;
  }
  let newPosX = 0;
  let newPosY = 0;
  let frameData = JSON.parse(animbox.dataset.frameData)
  let currentFrame = Number(idx)
  let animSlider = animbox.querySelector('.animslider')
  
  
  
  if (!animbox.dataset.currentFrame) {
    animbox.dataset.currentFrame = idx;
    currentFrame = idx;
    //console.log('aaa',currentFrame)
  }
  //console.log(frameData, currentFrame, idx)
  
  

  console.log(currentFrame)
  if (frameData[currentFrame][0] != 0) {
    newPosX = (-100 / animbox.dataset.cols) * frameData[currentFrame][0]
    //newPosX = -100 + (100 / (spriteTable.frameTiming[idx][1] + 1) );
  } else {
    newPosX = 0;
  }
  if (frameData[currentFrame][1] != 0) {
    newPosY =  (-100 / animbox.dataset.rows) * frameData[currentFrame][1]
  } else {
    newPosY = 0;
  }
  if (isFromSlider) {
    animSlider.parentElement.children[0].dataset.toggled = "false";
    playOrStopAnim(false, animbox)
  } else {
    animSlider.value = currentFrame;
  }
  let spritesEl = animbox.querySelector(".anim-sprites")
  spritesEl.style.transform = "translate(" + newPosX + "%, " + newPosY + "%)";

  if (isFromSlider) {
    currentFrame = animSlider.value
  } else {
    currentFrame = idx + 1;
  }
  
  if (currentFrame >= frameData.length) {
      animbox.dataset.currentFrame = 0;
  }
  else {
    animbox.dataset.currentFrame = currentFrame;
  }
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

let somethingwrong = 0

function getStarted() {
    let boxes = document.getElementsByClassName('animation-wrapper');
    if (boxes.length > 0) {
        createAllAnimBoxes();
    } else if (somethingwrong < 500) {
        somethingwrong += 1
        setTimeout(getStarted, 100);
    } else {
        console.log('so no boxes?');
    }
}





///videos!

function checkForVideos() {
    if (document.querySelector('video')) {
        let vid = document.querySelector('video');
        vid.dataset.loadingvid = true;
        vid.dataset.framesloaded=0;
        vid.dataset.vidbuffer = 2;
        prepFrameforLoad(0);
        return true;
    } else {
        return false;
    }
}



/*function prep() {
  let framecount = document.querySelector('#vid').duration*24;
  let counter = document.getElementById('counter');
  counter.textContent = "0"
  let slider = document.getElementById('slidey')
  slider.min = 0;
  slider.max = framecount;
  slider.value = 0;
  slider.addEventListener('input', function(e) {
    counter.textContent = slider.value + 1
    setCounter()
  })
}*/

function prepFrameforLoad(frame) {
  let vid = document.querySelector('video')
  //let slider = document.getElementById('slidey')
  let frame24 = 41.666666666666664
  let value = (frame*frame24)/1000
  //let counter = document.getElementById('counter');
  //counter.textContent = value
  //slider.value = frame;
  vid.currentTime = value
  //vidbuffer = 0
  requestAnimationFrame(loadAnimationLoop)
}
//console.log()
function loadFrameToCtx(frame) {
  let canvas = document.createElement('canvas')
  document.getElementById('nabbedframes').appendChild(canvas)
  let ctx = canvas.getContext('2d')
  let vid = document.querySelector('video')
  //let slider = document.getElementById('slidey')
  
  let framecount = Math.floor(vid.duration*24);
  let frame24 = 41.666666666666664
  let value = (frame*frame24)/1000
  //let counter = document.getElementById('counter');
  //counter.textContent = value
  //slider.value = frame;
  
  //vid.currentTime = value

  //setting width and height properties for canvas
  let frameWidth = 0;
  let frameHeight = 0;
  
  frameWidth = vid.videoWidth;
  frameHeight = vid.videoHeight;
  
 //console.log(`got em as ${frameWidth}/${frameHeight} `)
  
  if (frameHeight - vid.clientHeight > 500 || frameWidth - vid.clientWidth > 500 ) {
    //console.log(`client is ${vid.clientHeight}/${vid.clientHeight}`)
    //console.log(`got em down from ${frameWidth}/${frameHeight} to ${frameWidth/2}/${frameHeight/2} `)
    frameWidth = frameWidth/2
    frameHeight = frameHeight/2
    //console.log('bigg gap!',frameWidth - vid.clientWidth, frameHeight - vid.clientHeight)
  }
  if (frameWidth > 1500 || frameHeight > 1500) {
    frameWidth = frameWidth/2
    frameHeight = frameHeight/2
  }
  document.getElementById('nabbedframes').parentElement.style.height = frameHeight + 'px'
  document.getElementById('nabbedframes').parentElement.style.width = frameWidth + 'px'
  canvas.height = frameHeight
  canvas.width = frameWidth
  
  
  ctx.drawImage(vid, 0,0,frameWidth,frameHeight)
  
  
  if (framesloaded < 96 && Math.floor(vid.duration*24) > Math.floor(framesloaded)) {
    
    framesloaded = frame + 1
    prepFrameforLoad(framesloaded)
  } else {
    loadingvid = false;
    getStarted()
    //console.log('weh??', frame, Math.floor(vid.currentTime*24), Math.floor(slider.value))
  }
}

function loadAnimationLoop(timestamp) {
  //let counter = document.getElementById('counter');
  //let slider = document.getElementById('slidey');
  let vid = document.querySelector('video');
  if (loadingvid == true) {
    currentTime = timestamp;
    deltaTime = currentTime - previousTime;
    if (deltaTime > interval) {
      previousTime = currentTime - (deltaTime % interval);
      //
      if (Number(vid.dataset.vidbuffer) < 1) {
        loadFrameToCtx(framesloaded);
        vid.dataset.vidbuffer = 1;
      } else {
        Number(vid.dataset.vidbuffer) -= 1;
        requestAnimationFrame(loadAnimationLoop);
      }
      
      //slider.value = vid.currentTime*24;
      //counter.textContent = slider.value;
      //console.log(vid.currentTime);
    } else {
       requestAnimationFrame(loadAnimationLoop);
    }
   
  } 
}



if (!checkForVideos()) {
    getStarted()
}



