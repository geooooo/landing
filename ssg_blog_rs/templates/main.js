var imgPreviewElement = null;
var shadowElement = null;

function main() {
    window.addEventListener("load", onWindowLoad);
}

function onWindowLoad() {
    shadowElement = window.document.querySelector(".shadow");

    window.document.body.addEventListener("click", onDocumentBodyClick);
}

function onClickOutside() {
    hideImgPreview();
}

function onDocumentBodyClick(event) {
    var target = event.target;

    onImageClickForPreview(target.closest(".preview-container") ? target : null);
}

function onImageClickForPreview(imgElement) {
    if (imgPreviewElement != null) {
        hideImagePreview();
    } else {
        showImagePreview(imgElement);
    }
}

function hideImagePreview() {
    if (imgPreviewElement == null) {
        return;
    }

    var containerElement = imgPreviewElement.closest(".preview-container");
    containerElement.classList.toggle("preview-container_active");
    imgPreviewElement = null;

    toggleShadow();
}

function showImagePreview(imgElement) {
    if (imgPreviewElement != null) {
        return;
    }

    imgPreviewElement = imgElement;
    var containerElement = imgElement.closest(".preview-container");
    containerElement.classList.toggle("preview-container_active");
    
    toggleShadow();
}

function toggleShadow() {
    shadowElement.classList.toggle("shadow_visible");
}

main();