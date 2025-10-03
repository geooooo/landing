var imgPreviewElement = null;

function main() {
    window.addEventListener("load", onWindowLoad);
}

function onWindowLoad() {
    var coursesElement = window.document.querySelector(".courses");
    var olympiadsElement = window.document.querySelector(".olympiads");

    coursesElement.addEventListener("click", onImageClickForPreview);
    olympiadsElement.addEventListener("click", onImageClickForPreview);
}

function onImageClickForPreview(event) {
    if (window.innerWidth > 768) {
        return;
    }

    var target = event.target;

    if (!(target instanceof HTMLImageElement)) {
        return;
    }

    if (imgPreviewElement != null) {
        imgPreviewElement.classList.toggle("img-preview");
        imgPreviewElement = null;
    } else {
        imgPreviewElement = target;
        imgPreviewElement.classList.toggle("img-preview");
    }
}

main();