// GI = Gallery Image

const newGIBtn = document.getElementById('addGIBtn');
const cloneItem = document.getElementById('GI-clone');
const GIcont = document.getElementById('GI-cont');
const changeMIbtn = document.getElementById('changeMIBtn');

const fileInput = document.getElementsByClassName("file-input");

// Preview Image For Image Upload

function getImageUpload() {

    for (var i = 0; i < fileInput.length; i++) {

        fileInput[i].addEventListener('input', function (evt) {
            const files = this.files;
            const file = files[0];

            var thisFileInput = this;
            var previewImage = this.nextElementSibling;
            var progressBar = previewImage.nextElementSibling;
            var input = this.previousElementSibling;

            if (file == null) {
                return alert('No file selected.');
                previewImage.style.display = "none";
            }
            getSignedRequest(file, progressBar, previewImage, input, thisFileInput);
        });
    }
}

function getSignedRequest(file, progressBar, previewImage, input, thisFileInput) {
    
    const fileName = file.name.replace(/[/\\?%*:|"<>^ ]/g, '-');
    const xhr = new XMLHttpRequest();

    xhr.open('GET', `/sign-s3?file-name=${fileName}&file-type=${file.type}`);

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                uploadFile(file, response.signedRequest, response.url, progressBar, previewImage, input, thisFileInput);
            } else {
                alert('Could not get signed URL.');
            }
        }
    };
    xhr.send();
}


function uploadFile(file, signedRequest, url, progressBar, previewImage, input, thisFileInput) {

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
                
                thisFileInput.style.display = "none";
                
                if (previewImage) {
                    previewImage.src = url;
                }

                input.value = url;

                console.log(input);
            }
            else {
                // TODO: Prompt user to try again.
                console.log('Could not upload file.');
            }
        }
    };
    xhr.send(file);
}

function addGI() {

    newGIBtn.addEventListener("click", clone);

    function stringReplace(str) {
        var itemNum = toBeSorted.length;
        return res = str.replace(rKey, itemNum)
    }

    function clone(e) {
        e.preventDefault();

        var clone = cloneItem.cloneNode(true);
        clone.removeAttribute('id');

        // Ensuring that we properly save this input to the database.
        var input = clone.querySelector('[data-name]');
        var inputValue = input.getAttribute('data-name');
        
        console.log(inputValue);

        input.setAttribute('name', inputValue);
        
        GIcont.appendChild(clone);
        removeGI();
        getImageUpload();
    }

}

function removeGI() {

    var dltBtn = document.getElementsByClassName("dlt-gi");

    for (var i = 0; i < dltBtn.length; i++) {
        dltBtn[i].addEventListener("click", function(e) {
            e.preventDefault();
            var thisSection = this.parentNode;
            thisSection.remove();
        }, false);
    }
}

function goBack() {
    var cancel = document.getElementById('goBack');
    if(cancel) {
        cancel.onclick = function(e) {
            var back = window.location.pathname.replace(window.location.pathname.split("/").pop(), "");
            window.location.pathname = back;
            e.preventDefault();
        }
    }
    else {
        console.log('No cancel button');
    }
   
}

function init() {
    addGI();
    removeGI();
    getImageUpload();
    goBack();
}

init();