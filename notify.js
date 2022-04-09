const DEFAULT_NOTIFY_OPTIONS = {
    text: 'Demo Text',
    position: "bottom-right",
    autoClose: 3000,
    onClose: () => { },
    canClose: true,
    showProgress: true
}

export default class Notify {
    #notifyELE
    #autoCloseTimeOut
    #removeBinded
    #autoClose
    #visibleSince
    constructor(options) {
        this.#notifyELE = document.createElement("div");
        this.#visibleSince = new Date();
        this.#notifyELE.classList.add(
            "notify", "box-border", "p-3", "bg-white", "border-[1px]", "cursor-pointer", "border-solid", "rounded-lg", "border-[#333]", "relative", "after:absolute", "after:right-3", `${options.position == undefined || options.position?.endsWith("-right") ? "translate-x-[200%]" : options.position?.endsWith("-left") ? "translate-x-[-200%]" : options.position?.endsWith("top-center") ? "translate-y-[-110vh]" : "translate-y-[110vh]"}`, "transition-transform", "delay-[250ms]", "ease-in-out","overflow-hidden"
        );
        requestAnimationFrame(() => {
            this.#notifyELE.classList.add("translate-y-[0]", "translate-x-[0]");
        }, 1000);
        this.#removeBinded = this.remove.bind(this);
        this.update({ ...DEFAULT_NOTIFY_OPTIONS, ...options })
    }

    set showProgress(value){
        this.#notifyELE.classList.toggle("progress" , value);
        this.#notifyELE.style.setProperty("--progress" , 1);
        if(value){
            setInterval(()=>{
                const timeVisible = new Date() - this.#visibleSince;
                this.#notifyELE.style.setProperty(
                    "--progress" ,
                    timeVisible / this.#autoClose
                );
            },10)
        }
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
        this.#autoClose = value;
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