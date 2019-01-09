// GI = Gallery Image

const newGIBtn = document.getElementById('addGIBtn');
const cloneItem = document.getElementById('GI-clone');
const GIcont = document.getElementById('GI-cont');

function addGI() {

    newGIBtn.addEventListener("click", clone);

    var rKey = 'REPLACE';

    // function prepClone() {

    //     var clone = document.getElementById('newClone');

    //     // Replace the needed strings to make them unique
    //     // Toggle which requires two different data attributes
    //     toggleR.setAttribute('data-target', stringReplace(toggleRTarget));
    //     toggleR.setAttribute('data-sect', stringReplace(toggleRSect));
        
    //     // Replace the section title so we can target that specifically.
    //     sectionTitleR.setAttribute('id', stringReplace(sectionTitleString));
    //     sectionTitleInput.setAttribute('data-title', stringReplace(sectionTitleInputR))

    //     // The section itself needs to be unique
    //     sectionR.setAttribute('id', stringReplace(sectionRString));
        
    //     // And then each CodeMirror element
    //     htmlCMR.setAttribute('id', stringReplace(htmlCMRString));
    //     cssCMR.setAttribute('id', stringReplace(cssCMRString));

    // }

    function stringReplace(str) {
        var itemNum = toBeSorted.length;
        return res = str.replace(rKey, itemNum)
    }

    function clone(e) {
        e.preventDefault();
        var clone = cloneItem.cloneNode(true);
        clone.removeAttribute('id');
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

function init() {
    addGI();
    removeGI();
}

init();