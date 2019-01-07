const primaryNav = document.getElementById("navbar");
const fakeNav = document.getElementById("fake-nav");
const footer = document.getElementById("footer");
const navHeight = 56;

function navScroll() {

    var stickyNav = primaryNav.offsetTop + navHeight + 30;

    if (window.pageYOffset >= stickyNav) {
        primaryNav.classList.add("sticky", "animated", "fadeInDown");
        primaryNav.classList.remove("fadeOut");
        fakeNav.style = "display: block;"
    } else {
        primaryNav.classList.remove("sticky", "animated", "fadeInDown");
        primaryNav.classList.add("fadeOut");
        fakeNav.style = "display: none;"
    }
}

function fadeOutFAlert() {
    if ($('.alert')) {
        setTimeout(function() {
            $('.alert').fadeOut('fast');
        }, 3000); // <-- time in milliseconds
                $('.close-alert').click(function() {
            $(this).parents(':eq(1)').remove();
        });
    }

}

function toggleMenu() {
    var hamburgerMenu = document.getElementById("fsv--menu__button");
    if (hamburgerMenu) {
        hamburgerMenu.onclick = function(e) {

            if (primaryNav.classList.contains('active')) {
                // contentEl.classList.toggle('active');
                primaryNav.classList.toggle('active');

            } else {
                // contentEl.classList.toggle('active');
                setTimeout(function() {
                    primaryNav.classList.toggle('active');
                }, 400);

            }

            hamburgerMenu.classList.toggle("open");

        }
    }

}


// When the user scrolls the page, execute myFunction
window.onscroll = function() {
    navScroll();
};


function init() {
    fadeOutFAlert();
    navScroll();
    toggleMenu();
}

init();