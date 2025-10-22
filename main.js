var imgPreviewElement = null;
var shadowElement = null;
var imageBaseUrl = "assets/certs/"
var imagesToPreload = [
    "cert-arch-os.png",
    "cert-c.png",
    "cert-c0.png",
    "cert-db.png",
    "cert-go.png",
    "cert-go0.png",
    "cert-go1.png",
    "cert-go2.png",
    "cert-linux.png",
    "cert-python.png",
    "cert-python0.png",
    "cert-python1.jpeg",
    "olymp0.jpg",
    "olymp1.jpeg",
];

function main() {
    preloadImages();

    window.addEventListener("load", onWindowLoad);
}

function preloadImages() {
    for (var i = 0; i < imagesToPreload.length; i++) {
        src = imageBaseUrl + imagesToPreload[i];

        var img = new Image();
        img.onload = function(e) {
            console.log("Loaded:", e.target.src);
        };
        img.src = src;
    }
}

function onWindowLoad() {
    shadowElement = window.document.querySelector(".shadow");
    var coursesElement = window.document.querySelector(".courses");
    
    window.addEventListener("beforeprint", onBeforePrint);
    window.document.body.addEventListener("click", onClickOutside);
    coursesElement.addEventListener("click", onCoursesClick);
}

function onBeforePrint() {
    hideImgPreview();
}

function onClickOutside() {
    hideImgPreview();
}

function onCoursesClick(event) {
    var target = event.target;

    if (target instanceof HTMLImageElement) {
        event.stopPropagation();

        onImageClickForPreview(target);
    } else {
        var headerElement = target.closest(".courses-header");
        if (headerElement != null) {
            onToggleCoursesList(headerElement);
        }
    }
}

function onImageClickForPreview(imgElement) {
    if (imgPreviewElement != null) {
        hideImgPreview();
    } else if (window.innerWidth <= 1024) {
        showImagePreview(imgElement)
    }
}

function hideImgPreview() {
    if (imgPreviewElement == null) {
        return;
    }
    
    imgPreviewElement.classList.toggle("img-preview");
    imgPreviewElement = null;
    toggleShadow();
}

function showImagePreview(imgElement) {
    if (imgPreviewElement != null) {
        return;
    }

    imgPreviewElement = imgElement;
    imgPreviewElement.classList.toggle("img-preview");
    toggleShadow();
}

function toggleShadow() {
    shadowElement.classList.toggle("shadow_visible");
}

function onToggleCoursesList(headerElement) {
    var iconElement = headerElement.querySelector(".courses-header-icon");
    iconElement.classList.toggle("courses-header-icon_open");

    var listElement = headerElement.nextElementSibling;
    listElement.classList.toggle("courses-list_open");
}

main();