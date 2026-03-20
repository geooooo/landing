var imgPreviewElement = null;
var shadowElement = null;
var loaderElement = null;
var lazyLoadObserver = null;

var postsPerLoadCount = 0;
var postCount = 0;

function main() {
    window.addEventListener("load", onWindowLoad);
}

function onWindowLoad() {
    postsPerLoadCount = window.ssg_blog_rs_postsPerLoadCount;
    postCount = window.ssg_blog_rs_postCount - postsPerLoadCount < 1 
        ? 0 
        : window.ssg_blog_rs_postCount - postsPerLoadCount;
    delete window.ssg_blog_rs_postsPerLoadCount;
    delete window.ssg_blog_rs_postCount;

    shadowElement = window.document.querySelector(".shadow");
    loaderElement = window.document.querySelector(".loader");
    
    window.document.body.addEventListener("click", onDocumentBodyClick);

    startPostsLazyLoad();
}

function showLoader() {
    loaderElement.classList.remove("loader_hidden");
}

function hideLoader() {
    loaderElement.classList.add("loader_hidden");
}

function startPostsLazyLoad() {
    var lazyLoadMarkerElement = window.document.querySelector("#lazy-load-marker");

    var lazyLoadObserver = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
            loadPosts();
        }
    });
    lazyLoadObserver.observe(lazyLoadMarkerElement);
}

function stopPostsLazyLoad() {
    if (lazyLoadObserver == null) {
        return;
    }

    lazyLoadObserver.disconnect();
    lazyLoadObserver = null;
}

function loadPosts() {
    if (postCount === 0) {
        return;
    }

    showLoader();

    console.log("Lazy load start (posts to load = " + postsPerLoadCount + ", posts remain = " + postCount + ")");
    var contentElement = window.document.querySelector(".content");
    
    var promises = [];
    for (
        var postNumber = postCount, postLoadCount = postsPerLoadCount; 
        postLoadCount > 0 && postNumber > 0; 
        postNumber--, postLoadCount--
    ) {
        console.log("Lazy load post with number = " + postNumber);
        var promise = window.fetch("/posts/" + postNumber + ".html").then(function(response) {
            return response.text();
        });

        promises.push(promise);
    }

    Promise.all(promises).then(function(posts) {
        var content = "";
        for (var i = 0; i < posts.length; i++) {
            content += posts[i] === posts.length - 1 
                ? posts[i]
                : "<div class='join-line'></div>" + posts[i];
        }
        contentElement.insertAdjacentHTML("beforeend", content);

        postCount -= postsPerLoadCount;
        if (postCount < 1) {
            postCount = 0;
        }

        if (postCount === 0) {
            stopPostsLazyLoad();
        }

        hideLoader();

        console.log("Lazy load end (posts remain = " + postCount + ")");
    });
}

function onClickOutside() {
    hideImgPreview();
}

function onDocumentBodyClick(event) {
    var target = event.target;

    if (target.closest == null) {
        return;
    }

    onImageClickForPreview(target.closest(".preview-container") == null ? null : target);
}

function onImageClickForPreview(imgElement) {
    if (imgPreviewElement != null) {
        hideImagePreview();
    } else if (imgElement != null) {
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