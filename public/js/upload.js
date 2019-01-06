// Preview Image For Image Upload

const upload = document.getElementsByClassName("image-upload");


if (upload.length) {
    // for (var i = 0; i < upload.length; i++) {
    //     var eachUpload = upload[i];
    //     var input = eachUpload.getElementsByClassName('form-control')[0];
    //     var progress = eachUpload.getElementsByClassName('custom-progress')[0];
    //     console.log('check');
       
    // }
     // getImageUpload(upload);
}

function getImageUpload() {
    const fileInput = upload;
    if (fileInput.length) {
        console.log(document.getElementsByClassName("file-input"));
        document.getElementsByClassName("file-input").onchange = () => {
            const files = document.getElementById('file-input').files;
            const file = files[0];
            if (file == null) {
                return alert('No file selected.');
                previewImage.style.display = "none";
            }

            getSignedRequest(file);
        };
    }
}

function getSignedRequest(file) {
    const fileName = file.name.replace(/[/\\?%*:|"<>^ ]/g, '-');
    const xhr = new XMLHttpRequest();

    xhr.open('GET', `/sign-s3?file-name=${fileName}&file-type=${file.type}`);

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                uploadFile(file, response.signedRequest, response.url);
            } else {
                alert('Could not get signed URL.');
            }
        }
    };
    xhr.send();
}

// Element.prototype.appendAfter = function (element) {
//   element.parentNode.insertBefore(this, element.nextSibling);
// },false;

// function addNewImageUpload() {
//     var addImageBtn = document.getElementsByClassName('add-image');
//     if (addImageBtn) {
//         for (var i = 0; i < addImageBtn.length; i++) {
//             addImageBtn[i].addEventListener('click', function(e){
//                 e.preventDefault();
//                 var parent = this.parentNode;
//                 var newImage = parent.cloneNode(true);
//                 newImage.appendAfter(parent);
//                 addNewImageUpload();
//             }, false);
//         }
//     }

// }

// addNewImageUpload();

function uploadFile(file, signedRequest, url) {

    // Container
    const el = document.getElementById("image-upload");
    const previewImageNew = document.createElement("IMG");
    previewImageNew.id = "preview-image";

    // Progress Bar
    const progressBar = document.getElementById("progress");

    // AJAX
    const xhr = new XMLHttpRequest();

    xhr.open('PUT', signedRequest);

    xhr.upload.onprogress = function(e) {
        progressBar.style.display = "block";
        if (e.lengthComputable) {
            progressBar.max = e.total;
            progressBar.value = e.loaded;
        }
    }
    xhr.upload.onloadstart = function(e) {
        progressBar.value = 0;
    }
    xhr.upload.onloadend = function(e) {
        progressBar.value = e.loaded;
    }
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                progressBar.style.display = "none";
                if (previewImage) {
                    console.log('check 1');
                    previewImage.src = url;
                }
                else {
                    console.log('check 2');
                    el.removeChild(el.lastChild);
                    previewImageNew.src = url;
                    el.appendChild(previewImageNew);
                }
            }
            else {
                console.log('Could not upload file.');
            }
        }
    };
    xhr.send(file);
}

(() => {
    getImageUpload();
})();