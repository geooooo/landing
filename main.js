var imgPreviewElement = null;
var shadowElement = null;

function main() {
    window.addEventListener("load", onWindowLoad);
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
    } else if (window.innerWidth <= 768) {
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