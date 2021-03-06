// Preview Image For Image Upload

const upload = document.getElementsByClassName("image-upload");

if (upload.length) {
    for (var i = 0; i < upload.length; i++) {
        var eachUpload = upload[i];
        var input = eachUpload.getElementsByClassName('form-control')[0];
        var progress = eachUpload.getElementsByClassName('custom-progress')[0];
        getImageUpload(eachUpload, input, progress);
    }
}

function getImageUpload(eachUpload, input, progress) {
    if (input) {
        input.onchange = () => {
            var files = input.files;
            var file = files[0];
            if (file == null) {
                return alert('No file selected.');
                previewImage.style.display = "none";
            }
            getSignedRequest(eachUpload, file, progress);
        };
    }
}

function getSignedRequest(eachUpload, file, progress) {
    var fileName = file.name.replace(/[/\\?%*:|"<>^ ]/g, '-');
    var dir = location.pathname.split('/')[1];
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/' + dir + '/sign-s3?file-name=' + fileName + '&file-type=' + file.type );
    // xhr.open('GET', dir + `sign-s3?file-name=${fileName}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                uploadFile(eachUpload, file, response.signedRequest, response.url, progress);
            } else {
                alert('Could not get signed URL.');
            }
        }
    };
    xhr.send();
}

Element.prototype.appendAfter = function (element) {
  element.parentNode.insertBefore(this, element.nextSibling);
},false;

function addNewImageUpload() {
    var addImageBtn = document.getElementsByClassName('add-image');
    if (addImageBtn) {
        for (var i = 0; i < addImageBtn.length; i++) {
            addImageBtn[i].addEventListener('click', function(e){
                e.preventDefault();
                var parent = this.parentNode;
                var newImage = parent.cloneNode(true);
                newImage.appendAfter(parent);
                addNewImageUpload();
            }, false);
        }
    }

}

addNewImageUpload();

function uploadFile(eachUpload, file, signedRequest, url, progress) {

    // AJAX
    var xhr = new XMLHttpRequest();

    xhr.open('PUT', signedRequest);

    xhr.upload.onprogress = function(e) {
        progress.style.display = "block";
        if (e.lengthComputable) {
            progress.max = e.total;
            progress.value = e.loaded;
        }
    }
    xhr.upload.onloadstart = function(e) {
        progress.value = 0;
    }
    xhr.upload.onloadend = function(e) {
        progress.value = e.loaded;
    }
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var previewImage = eachUpload.querySelector("preview-image");
                var addImageBtn = eachUpload.getElementsByClassName('add-image');
                var newPreviewImage = document.createElement("img");
                newPreviewImage.className = "preview-image";
                var uploadedCheck = document.createElement('i');
                uploadedCheck.className = "fas fa-check-circle";
                var previewImageHover = document.createElement('i');
                previewImageHover.className = "fas fa-eye";

                progress.style.display = "none";

                if (previewImage) {
                	previewImage.src = url;
                }

                else {

                    progress.style.display = "none";
                	newPreviewImage.src = url;
                    console.log(uploadedCheck);
                    eachUpload.appendChild(uploadedCheck);
                	eachUpload.appendChild(newPreviewImage);
                    eachUpload.appendChild(previewImageHover);
                }
            }
            else {
                console.log('Could not upload file.');
            }
        }
    };
    xhr.send(file);
}

function Froala() {
    const $froala = $(".froala");
    const froala = document.getElementsByClassName("froala");

     for (i = 0; i < $froala.length; i++) {

        var placeHolderText = $froala[i].getAttribute("placeholder");

    }

    // Need a new key for Fly Sun Villas

    $.each( $froala, function( key, value ) {
        $(this).froalaEditor({
            toolbarButtons: ['bold', 'italic', 'underline', '|', 'color', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'insertTable', '|', 'insertHR', 'selectAll', 'clearFormatting', ],
            quickInsertTags: [''],
            key: '7E4C3B3E3cA5A4B3F2E4C2B2E3C1A2vxC-11hh1lucapA-13abA1tvtC-21ss==',
            placeholderText: $(this).attr('placeholder')
        });
    });
}

// Initiate Froala Editor
$(function() {
    Froala();
});