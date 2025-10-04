var imgPreviewElement = null;

function main() {
    window.addEventListener("load", onWindowLoad);
}

function onWindowLoad() {
    var coursesElement = window.document.querySelector(".courses");

    window.document.body.addEventListener("click", onClickOutside);
    coursesElement.addEventListener("click", onCoursesClick);
}

function onClickOutside() {
    hideImgPreview();
}

function onCoursesClick(event) {
    var target = event.target;

    if (target instanceof HTMLImageElement) {
        onImageClickForPreview(event, target);

        return;
    }

    var headerElement = target.closest(".courses-header");
    if (headerElement != null) {
        onToggleList(headerElement);
    }
}

function onImageClickForPreview(event, imgElement) {
    event.stopPropagation();

    if (imgPreviewElement != null) {
        hideImgPreview();
    } else if (window.innerWidth <= 768) {
        imgPreviewElement = imgElement;
        imgPreviewElement.classList.toggle("img-preview");
    }
}

function hideImgPreview() {
    if (imgPreviewElement == null) {
        return;
    }
    
    imgPreviewElement.classList.toggle("img-preview");
    imgPreviewElement = null;
}

function onToggleList(headerElement) {
    var iconElement = headerElement.querySelector(".courses-header-icon");
    iconElement.classList.toggle("courses-header-icon_open");
    var listElement = headerElement.nextElementSibling;
    listElement.classList.toggle("courses-list_open");
}

main();