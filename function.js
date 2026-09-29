let elementCurrentlyPlaying = undefined;
let isPlaying = false;
let frames_per_second = 12;

let interval = Math.floor(1000 / frames_per_second);
let startTime = performance.now();
let previousTime = startTime;

let currentTime = 0;
let deltaTime = 0;



function createAllAnimBoxes() {
    let boxes = document.getElementsByClassName('animation-wrapper');
    console.log(`we got ${boxes.length} boxes :-)`);
    for (let i=0; i<boxes.length; i++) {
        let box = boxes[i];
        let isParallax = box.dataset.isParallax
        let animBoxData = {
            "thumbnailSrc" : box.dataset.thumbnailSrc,
            "ratio" : box.style.aspectRatio.split("/"),
        }
        if (isParallax == true || isParallax == "true") {
            console.log('parallaxfound!');
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
        addAnimSlider(animBoxData, newBox.children[0])
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
        let bgEl = document.createElement('img');
        bgEl.src = bgSrc;
        bgEl.classList.add("anim-bg");

        animLayers.appendChild(bgEl);
        //create sprites:
        let spritesEl = document.createElement('img');
        spritesEl.src = spriteSrc;
        spritesEl.classList.add("anim-sprites");
        spritesEl.style = `height:${Number(data.rows) * 100}%; width: ${Number(data.cols)*100}%;`

        animLayers.appendChild(spritesEl);
        //imageSetsToLoad.push([animBox, bgEl, spritesEl]);

        olImgData.alt = "Arrow to Play/Pause Animation Controls";
        olImgData.src = 'https://i.postimg.cc/wqpCFwLZ/parallax-OLmin.png';
    } else {
        //this is a parallax box!
        let planesimgsToLoad = [animBox]
        //todo: put da planes here lol
        for (let i=0; i<data.parallaxData.length; i++) {
            let planeEl = document.createElement('img');
            planeEl.src = data.planesSrc;
            planeEl.classList.add("anim-parallax");
            planeEl.dataset.parallax = `${data.parallaxData[i].startVal}/${data.parallaxData[i].endVal}`
            
            //planeEl.style = `height:${data.parallaxData.length * 100}%; top:${(100 / data.parallaxData.length) * i}%;`;
            planesimgsToLoad.push(planeEl)
            animLayers.appendChild(planeEl);
        }
        olImgData.alt = "Use the Slider below to pan the background!"
        olImgData.src = 'https://i.postimg.cc/wqpCFwLZ/parallax-OLmin.png';
        
        //imageSetsToLoad.push(planesimgsToLoad)
    }

    

    //add instructional overalay!!
    let olImg = document.createElement("img");
    olImg.width = '100%';
    olImg.alt = olImgData.alt;
    olImg.src = olImgData.src;
    olImg.classList.add('anim-olimg');
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
    console.log('done loading smth!')
    let loadingEl = box.querySelector('.loadingcover');
    if (loadingEl) {
        loadingEl.style.display = 'none;'
    } else {
        console.log(box, loadingEl);
    }
}

function addAnimSlider(data, layersbox) {
    //create controlsbox
    let sliderDiv = document.createElement('div');
    sliderDiv.classList.add('animcontrolsbox');
    //create slider
    var sliderInput = document.createElement("INPUT");
    sliderInput.type = "range";
    sliderInput.min = 0;
    sliderInput.value = 0;
    sliderInput.classList.add("animslider");

    if (!data.isParallax) {
        sliderInput.addEventListener('input', function(e) {
            setNewFrame(e.currentTarget.value, true, e.currentTarget.parentElement.parentElement)
        })
        let playbutton = createAnimPlayButton();
        sliderInput.max = data.frameData.length - 1;
        sliderDiv.appendChild(playbutton);
    } else {
        sliderInput.max = data.parallaxData.length - 1;
        let exemptWidthPercent = data.ratio[0] / layersbox.children[0].offsetWidth;
        sliderInput.addEventListener('input', function(e) {slidePlanes(e.currentTarget.value, layersbox, exemptWidthPercent)});
        slidePlanes(sliderInput.value, layersbox, exemptWidthPercent);
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
  let element = parallaxBoxes[parallaxBoxesLoaded]
  if (element.offsetHeight == 0) {
    requestAnimationFrame(waitForHeight)
  } else {
    addParallaxSlider(parallaxBoxesLoaded);
    parallaxBoxesLoaded += 1;
    console.log(parallaxBoxesLoaded, parallaxBoxes.length)
    if (parallaxBoxesLoaded < parallaxBoxes.length) {
      requestAnimationFrame(waitForHeight)
    } else {
      console.log("Done loading parallax sliders!")
    }
  }
}


function slidePlanes(value, box, exemptWidthPercent) {
  let planes = box.children;
  for (let i=0;i<planes.length; i++) {
    if (!planes[i].classList.contains("anim-olimg")) {
      let parallaxData = planes[i].dataset.parallax.split("/");
      let paraMin = Number(parallaxData[0]);
      let paraMax = Number(parallaxData[1]);
      let diff = paraMax - paraMin;
      
      let finalNum = ((Number(paraMin) + (Number(diff) * Number(value)/100))/100) * (100 * (1-Number(exemptWidthPercent)));
      planes[i].style.transform = "translateX(" + (0-(finalNum)).toString() + "%)";
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
  let newPosX = 0;
  let newPosY = 0;
  if (spriteTable.frameTiming[idx][0] != 0) {
    newPosX = (-100 / spriteTable.cols) * spriteTable.frameTiming[idx][0]
    //newPosX = -100 + (100 / (spriteTable.frameTiming[idx][1] + 1) );
  } else {
    newPosX = 0;
  }
  if (spriteTable.frameTiming[idx][1] != 0) {
    newPosY =  (-100 / spriteTable.rows) * spriteTable.frameTiming[idx][1]
  } else {
    newPosY = 0;
  }
  let animSlider = animbox.children[animbox.children.length-1][1]
  if (isFromSlider) {
    animSlider.parentElement[0].dataset.toggled = "false";
    playOrStopAnim(false, animbox)

  } else {
    animSlider.value = idx;
  }
  spritesEl.style.transform = "translate(" + newPosX + "%, " + newPosY + "%)";
  spriteTable.currentFrame += 1;
  if (spriteTable.currentFrame >= spriteTable.frameTiming.length) {
      spriteTable.currentFrame = 0;
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
getStarted()
