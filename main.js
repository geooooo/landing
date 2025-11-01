var imgPreviewElement = null;
var shadowElement = null;
var imageBaseUrl = "assets/"
var imagesToPreload = [
    "iam/wrike-items.jpg",
    "iam/meetup.jpg",
    "iam/gdg.jpg",
    "iam/delphi-old-school-kringe.png",
    "certs/olymp0.jpg",
    "certs/olymp1.jpeg",
    "certs/stepik.png",
    "certs/coursera.png",
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

    if (imgElement.alt.includes("Stepik") || imgElement.alt.includes("Coursera")) {
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