//okayyyyy!

let uploadbutton
let uploadedDiv

document.addEventListener("DOMContentLoaded", function() {
    console.log('loaded dom!');
    prep();
})


function prep() {
  uploadbutton = document.getElementById('uploadbutton')
  uploadedDiv = document.getElementById('uploadedimgs')

  uploadbutton.addEventListener("change", updateImageDisplay(uploadedDiv);
}



function updateImageDisplay(preview) {
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }
  const curFiles = input.files;
  if (curFiles.length === 0) {
    const para = document.createElement("p");
    para.textContent = "No files currently selected for upload";
    preview.appendChild(para);
  } else {
    const list = document.createElement("ol");
    preview.appendChild(list);

    for (const file of curFiles) {
      const listItem = document.createElement("li");

      const image = document.createElement("img");
      image.src = URL.createObjectURL(file);
      image.alt = image.title = file.name;

      listItem.appendChild(image);
      //listItem.appendChild(para);
    

      list.appendChild(listItem);
    }
  }
}



