import * as configs from "./configs";

export class App {
    private imgPreviewElement: HTMLImageElement | null = null;
    private shadowElement: HTMLElement | null  = null;

    run(): void {
        this.preloadImages();

        window.addEventListener("load", this.onWindowLoad.bind(this));
        window.addEventListener("beforeprint", this.onBeforePrint.bind(this));
    }

    private preloadImages(): void {
        for (let i = 0; i < configs.imagesToPreload.length; i++) {
            const src = configs.imageBaseUrl + configs.imagesToPreload[i];
            const img = new Image();

            img.onload = () => console.log("Loaded:", src);
            img.src = src;
        }
    }

    private onWindowLoad(): void {
        window.document.body.addEventListener("click", this.onClickOutside.bind(this));

        this.shadowElement = window.document.querySelector(".shadow");

        const coursesElement = window.document.querySelector(".courses") as HTMLElement;
        coursesElement.addEventListener("click", this.onCoursesClick.bind(this));

        const achievementsLinkElement = window.document.querySelector("#achievementsLink") as HTMLElement;
        achievementsLinkElement.addEventListener("click", this.onAchievementsLinkClick.bind(this));

        const cvElement = window.document.querySelector("#cv") as HTMLLinkElement;
        cvElement.addEventListener("click", this.onCVClick.bind(this));

        this.openAchievementsIfNeed();
        
        this.renderSkills();
    }

    private openAchievementsIfNeed(): void {
        if (window.location.hash === "#achievements") {
            setTimeout(() => {
                this.onAchievementsLinkClick();
                
                setTimeout(() => {
                    const achievementsElement = window.document.querySelector("#achievements") as HTMLElement;
                    achievementsElement.scrollIntoView();
                });
            })
        }
    }

    private onBeforePrint(): void {
        this.hideImagePreview();
    }

    private onClickOutside(): void {
        this.hideImagePreview();
    }

    private hideImagePreview(): void {
        if (this.imgPreviewElement == null) {
            return;
        }

        const containerElement = this.imgPreviewElement.closest(".img-preview-container") as HTMLElement;
        containerElement.classList.toggle("img-preview-container_active");
        this.imgPreviewElement = null;

        this.toggleShadow();
    }

    private showImagePreview(imgElement: HTMLImageElement): void {
        if (this.imgPreviewElement != null) {
            return;
        }

        this.imgPreviewElement = imgElement;
        const containerElement = imgElement.closest(".img-preview-container") as HTMLElement;
        containerElement.classList.toggle("img-preview-container_active");
        
        this.toggleShadow();
    }

    private toggleShadow(): void {
        this.shadowElement!.classList.toggle("shadow_visible");
    }

    private onCoursesClick(event: Event): void {
        const target = event.target;

        if (target instanceof HTMLImageElement) {
            const containerElement = target.closest(".img-preview-container") as HTMLElement;
            if (containerElement != null) {
                event.stopPropagation();
                this.onImageClickForPreview(target);
            }
        } else {
            const headerElement = (target as HTMLElement).closest(".courses-header") as HTMLElement;
            if (headerElement != null) {
                this.onToggleCoursesList(headerElement);
            }
        }
    }

    private onImageClickForPreview(imgElement: HTMLImageElement): void {
        if (this.imgPreviewElement != null) {
            this.hideImagePreview();
        } else {
            this.showImagePreview(imgElement);
        }
    }

    private onToggleCoursesList(headerElement: HTMLElement): void {
        const iconElement = headerElement.querySelector(".courses-header-icon") as HTMLElement;
        iconElement.classList.toggle("courses-header-icon_open");

        const listElement = headerElement.nextElementSibling!;
        listElement.classList.toggle("courses-list_open");
    }

    private onAchievementsLinkClick(): void {
        const coursesHeaderElements = Array.from(window.document.querySelectorAll<HTMLElement>(".courses-header")!);
        coursesHeaderElements.forEach(this.onToggleCoursesList);
    }

    private onCVClick(event: Event): void {
        event.preventDefault();

        this.onBeforePrint();
        window.print();
    }

    private renderSkills(): void {
        const containerElement = window.document.querySelector(".section-skills") as HTMLElement;

        for (let category of configs.skillsByCategoryMap.keys()) {
            const h3Element = window.document.createElement("h3");
            h3Element.className = "skills-type";
            h3Element.textContent = category.name;
            containerElement.appendChild(h3Element);

            const listElement = window.document.createElement("ul");
            listElement.className = "skills";
            containerElement.appendChild(listElement);
            
            for (let skill of configs.skillsByCategoryMap.get(category)!) {
                const listItemElement = window.document.createElement("li");
                listItemElement.className = `skills-item ${category.className}`;
                listItemElement.innerHTML = `<div class="skill-name">${skill.name}</div>`;
                listElement.appendChild(listItemElement);
            }
        }
    }
}