// Preview Image For Image Upload

function getImageUpload() {


    const fileInput = document.getElementsByClassName("file-input");



    for (var i = 0; i < fileInput.length; i++) {



        fileInput[i].addEventListener('input', function (evt) {
            const files = this.files;
            const file = files[0];

            var previewImage = this.nextElementSibling;
            var progressBar = this.nextSibling.nextSibling;


            console.log(previewImage);
            console.log(this.nextSibling);

            if (file == null) {
                return alert('No file selected.');
                previewImage.style.display = "none";
            }

            getSignedRequest(file);

        });
    }
}

function getSignedRequest(file, progressBar, previewImage) {
    
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


function uploadFile(file, signedRequest, url) {

    // Container
    const el = document.getElementById("image-upload");
    const previewImageNew = document.createElement("IMG");
    previewImageNew.id = "preview-image";

   

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