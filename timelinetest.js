//okayyyyy!

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
        another.style.width = `${15*hold}px`
        another.addEventListener('click', function(e) {
            openFrame(frames[i])
        })
        holder.appendChild(another)
    }
}

function openFrame(frame) {
    console.log('wow! got a frame,,,')
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

