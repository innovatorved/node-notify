const DEFAULT_NOTIFY_OPTIONS = {
    position: "bottom-right",
    autoClose: false,
    onClose: () => { },
    canClose: true,
    showProgress: true
}

export default class Notify {
    #notifyELE
    #autoCloseTimeOut
    #removeBinded
    constructor(options) {
        this.#notifyELE = document.createElement("div");
        this.#notifyELE.classList.add(
            "main", "box-border", "p-3", "bg-white", "border-[1px]", "cursor-pointer", "border-solid", "rounded-lg", "border-[#333]", "relative", "after:absolute", "after:right-3", `${options.position == undefined || options.position?.endsWith("-right") ? "translate-x-[200%]" : options.position?.endsWith("-left") ? "translate-x-[-200%]" : options.position?.endsWith("top-center") ? "translate-y-[-110vh]" : "translate-y-[110vh]"}`, "transition-transform", "delay-[250ms]", "ease-in-out"
        );
        requestAnimationFrame(() => {
            this.#notifyELE.classList.add("translate-y-[0]", "translate-x-[0]");
        }, 1000);
        this.#removeBinded = this.remove.bind(this);
        this.update({ ...DEFAULT_NOTIFY_OPTIONS, ...options })
    }

    set position(value) {
        const currentContainer = this.#notifyELE.parentElement;
        const selector = `.maincontainer[data-position='${value}']`;
        const container = document.querySelector(selector) || createContainer(value);
        container.append(this.#notifyELE);
        if (currentContainer === null || currentContainer?.hasChildNodes()) return;
        currentContainer.remove();
    }

    set text(value) {
        this.#notifyELE.textContent = value;
    }

    set autoClose(value) {
        if (value === false) return;
        if (this.#autoCloseTimeOut !== null) clearTimeout(this.#autoCloseTimeOut);
        this.#autoCloseTimeOut = setTimeout(() => { this.remove() }, value);
    }

    set canClose(value) {
        if (value) {
            this.#notifyELE.classList.toggle(`after:content-['${'\\00D7'}']`, value)
            this.#notifyELE.addEventListener("click", this.#removeBinded);
        }
        else {
            this.#notifyELE.removeEventListener("click", this.#removeBinded);
        }

    }

    show() {

    }

    update(options) {
        Object.entries(options).forEach(([key, value]) => {
            this[key] = value;
        });
    }

    remove() {
        const container = this.#notifyELE.parentElement;
        this.#notifyELE.classList.remove("translate-x-[0]", "translate-y-[0]");
        this.#notifyELE.addEventListener('transitionend', () => {
            this.#notifyELE.remove();
            if (container?.hasChildNodes()) return;
            container.remove();
        })
        this.onClose();
    }
}

const createContainer = (value) => {
    const container = document.createElement("div");
    container.classList.add("maincontainer", "fixed", "m-10", "w-[300px]", "flex", "flex-col", "gap-2");
    container.dataset.position = value;
    document.body.append(container);
    return container;
}