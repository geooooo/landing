export class SkillCategory {
    static readonly soft = new SkillCategory("Soft-скилы", "skill_soft");
    static readonly apps = new SkillCategory("Приложения", "skill_apps");
    static readonly base = new SkillCategory("База разработки", "skill_tools");
    static readonly tools = new SkillCategory("Инструменты разработки", "skill_backend");
    static readonly libs = new SkillCategory("Фреймворки & SDK", "skill_libs");
    static readonly langs = new SkillCategory("Языки", "skill_lang");

    private constructor(
        readonly name: string,
        readonly className: string,
    ) {}
}