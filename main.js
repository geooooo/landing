// Придерживаться максимально старой редакции EcmaScript

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

var skills = {
    "Языки": [
        new Skill("C", 3),
        new Skill("Go", 2),
        new Skill("Rust", 1),
        new Skill("Python", 3),
        new Skill("Dart", 3),
        new Skill("JavaScript", 3),
        new Skill("TypeScript", 3),
        new Skill("Node", 3),
        new Skill("HTML", 3),
        new Skill("CSS", 3),
        new Skill("PHP", 2),
        new Skill("C++", 1),
        new Skill("Assembler x86", 2),
    ],
    "Фреймворки, библиотеки и т.п.": {
        "Go": [
            new Skill("Gin", 1),
            new Skill("Gorilla", 1),
            new Skill("Gorm", 1),
            new Skill("Sqlx", 1),
        ],
        "Dart/Flutter": [
            new Skill("AngularDart", 3),
            new Skill("RxDart", 2),
            new Skill("Redux", 3),
            new Skill("Bloc", 2),
            new Skill("Cubit", 2),
            new Skill("Provider", 3),
            new Skill("GetX", 3),
            new Skill("Firebase", 1),
            new Skill("SQLite", 3),
        ],
        "JavaScript/TypeScript/Node": [
            new Skill("SCSS", 3),
            new Skill("Less", 3),
            new Skill("Webpack", 3),
            new Skill("React", 2),
            new Skill("Angular 2+", 2),
            new Skill("Vue", 2),
            new Skill("Electron", 3),
            new Skill("Microfrontends", 2),
            new Skill("Web Components", 3),
            new Skill("Rx", 2),
            new Skill("Express.js", 3),
            new Skill("Nest.js", 1),
        ],
        "Python": [
            new Skill("Flask", 3),
            new Skill("Bottle", 3),
        ],
    },
    "База разработки": [
        new Skill("Алгоритмы и структуры данных", 3),
        new Skill("ООП", 3),
        new Skill("SOLID", 3),
        new Skill("GRASP", 3),
        new Skill("Git", 3),
        new Skill("Gitlab", 2),
        new Skill("Github", 2),
        new Skill("CI/CD", 1),
        new Skill("Linux", 3),
        new Skill("Bash", 3),
        new Skill("SQL", 2),
    ],
    "Backend-инструменты": [
        new Skill("REST API", 3),
        new Skill("GraphQL", 2),
        new Skill("RPC", 2),
        new Skill("GRPC", 2),
        new Skill("MySQL", 2),
        new Skill("PostgreSQL", 1),
        new Skill("MongoDB", 1),
    ],
    "Soft-скилы": [
        new Skill("English A2"),
        new Skill("Agile"),
        new Skill("Kanban"),
        new Skill("Scrum"),
        new Skill("Управление проектами"),
        new Skill("Teamlead"),
    ],
    "Приложения": [
        new Skill("Postman"),
        new Skill("VSCode"),
        new Skill("Android Studio"),
        new Skill("AI tools for dev"),
        new Skill("Trello"),
        new Skill("Wrike"),
        new Skill("Asana"),
        new Skill("Jira"),
        new Skill("Photoshop"),
        new Skill("Figma"),
    ],
};

function Skill(name, level) {
    this.name = name;
    this.level = level;
}

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
    var skillsContentElement = window.document.querySelector(".section-skills .section-content");
    var achievementsLinkElement = window.document.querySelector("#achievementsLink");

    window.addEventListener("beforeprint", onBeforePrint);
    window.document.body.addEventListener("click", onClickOutside);
    coursesElement.addEventListener("click", onCoursesClick);
    achievementsLinkElement.addEventListener("click", onAchievementsLinkClick);

    renderSkills(skillsContentElement);
}

function renderSkills(containerElement) {
    Object.keys(skills).forEach(function(mainCategoryName) {
        var h3Element = window.document.createElement("h3");
        h3Element.className = "skills-type";
        h3Element.textContent = mainCategoryName;
        containerElement.appendChild(h3Element);

        var listElement = window.document.createElement("ul");
        listElement.className = "skills";
        containerElement.appendChild(listElement);
        
        var mainCategorySkills = skills[mainCategoryName];
        Object.keys(mainCategorySkills).forEach(function(subCategoryName, i) {
            var skill = mainCategorySkills[i];
            var listItemElement = window.document.createElement("li");

            if (skill instanceof Skill) {
                listItemElement.className = "skills-item";

                switch (mainCategoryName) {
                    case "Soft-скилы": 
                        listItemElement.className += " skill_soft"; 
                        break;
                    case "Приложения": 
                        listItemElement.className += " skill_apps"; 
                        break;
                    case "База разработки": 
                        listItemElement.className += " skill_tools"; 
                        break;
                     case "Backend-инструменты": 
                        listItemElement.className += " skill_backend"; 
                        break;
                    case "Языки": 
                        listItemElement.className += " skill_lang"; 
                        break;
                }

                var innerHTML = '<div class="skill-name">{0}</div>'.replace("{0}", skill.name);
                if (skill.level != null) {
                    innerHTML += '<div class="skill-level" data-level="{1}"><b></b><b></b><b></b></div>'.replace("{1}", skill.level);
                }
                listItemElement.innerHTML = innerHTML;
                listElement.appendChild(listItemElement);
            } else {
                listElement.classList.add("skills_col");
                listItemElement.innerHTML = '<h4 class="skills-type' +
                    (subCategoryName === "JavaScript/TypeScript/Node" || subCategoryName === "Python" ? " old" : "") +
                    '">' + 
                    subCategoryName + '</h4>';
                listElement.appendChild(listItemElement);
                
                var subListElement = window.document.createElement("ul");
                subListElement.className = "subskills";
                listItemElement.appendChild(subListElement);

                Object.keys(mainCategorySkills[subCategoryName]).forEach(function(_, i) {
                    var skill = mainCategorySkills[subCategoryName][i];
                    
                    var subListItemElement = window.document.createElement("li");
                    subListItemElement.className = "skills-item";

                    switch(subCategoryName) {
                        case "Go": 
                            subListItemElement.className += " skill_go"; 
                            break;
                        case "Dart/Flutter":
                            subListItemElement.className += " skill_dart"; 
                            break;
                        case "Python":
                        case "JavaScript/TypeScript/Node":
                            subListItemElement.className += " old"; 
                            break;
                    }

                    subListItemElement.innerHTML = 
                        '<div class="skill-name">{0}</div>'.replace("{0}", skill.name) + 
                        '<div class="skill-level" data-level="{1}"><b></b><b></b><b></b></div>'.replace("{1}", skill.level);
                    subListElement.appendChild(subListItemElement);
                })
            }
        });
    });
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

function onAchievementsLinkClick() {
    var coursesHeaderElements = window.document.querySelectorAll(".courses-header");
    coursesHeaderElements.forEach(onToggleCoursesList);
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