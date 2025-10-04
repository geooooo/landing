var imgPreviewElement = null;

function main() {
    window.addEventListener("load", onWindowLoad);
}

function onWindowLoad() {
    var coursesElement = window.document.querySelector(".courses");

    coursesElement.addEventListener("click", onCoursesClick);
}

function onCoursesClick(event) {
    var target = event.target;

    if (target instanceof HTMLImageElement) {
        onImageClickForPreview(target);

        return;
    }

    var headerElement = target.closest(".courses-header");
    if (headerElement != null) {
        onToggleList(headerElement);
    }
}

function onImageClickForPreview(imgElement) {
    if (imgPreviewElement != null) {
        imgPreviewElement.classList.toggle("img-preview");
        imgPreviewElement = null;
    } else if (window.innerWidth <= 768) {
        imgPreviewElement = imgElement;
        imgPreviewElement.classList.toggle("img-preview");
    }
}

function onToggleList(headerElement) {
    var iconElement = headerElement.querySelector(".courses-header-icon");
    iconElement.classList.toggle("courses-header-icon_open");
    var listElement = headerElement.nextElementSibling;
    listElement.classList.toggle("courses-list_open");
}

main();