const DEFAULT_NOTIFY_OPTIONS = {
  text: "Demo Text",
  position: "bottom-right",
  autoClose: 2000,
  onClose: () => {},
  canClose: true,
  showProgress: true,
  backGroundColor: "white",
  progressBarColor: "#616a6b",
  type: "default",
};

export default class Notify {
  #notifyELE;
  #autoCloseTimeOut;
  #removeBinded;
  #autoClose;
  #visibleSince;
  #progressInterval;
  #backGroundColor;
  #progressBarColor;
  #showProgress;
  #text;
  #type;
  constructor(options) {
    /**
         * const DEFAULT_NOTIFY_OPTIONS = {
            text: 'Demo Text',
            position: "bottom-right",
            autoClose: 2000,
            onClose: () => { },
            canClose: true,
            showProgress: true,
            backGroundColor: 'white',
            progressBarColor: '#616a6b',
            type : "default",
            }
         * 
         */
    this.#notifyELE = document.createElement("div");
    this.#visibleSince = new Date();
    this.#notifyELE.classList.add(
      "notify",
      "box-border",
      "p-2",
      "font-serif",
      "border-[2px]",
      "cursor-pointer",
      "border-solid",
      "rounded-lg",
      "border-[#333]",
      "relative",
      "after:absolute",
      "after:right-3",
      `${
        options.position == undefined || options.position?.endsWith("-right")
          ? "translate-x-[200%]"
          : options.position?.endsWith("-left")
          ? "translate-x-[-200%]"
          : options.position?.endsWith("top-center")
          ? "translate-y-[-110vh]"
          : "translate-y-[110vh]"
      }`,
      "transition-transform",
      "delay-[250ms]",
      "ease-in-out",
      "overflow-hidden"
    );
    requestAnimationFrame(() => {
      this.#notifyELE.classList.add("translate-y-[0]", "translate-x-[0]");
    }, 1000);
    this.#removeBinded = this.remove.bind(this);
    this.update({ ...DEFAULT_NOTIFY_OPTIONS, ...options });
  }

  update(options) {
    Object.entries(options).forEach(([key, value]) => {
      this[key] = value;
    });
    this.#notifyELE.style.backgroundColor = this.#backGroundColor;
    this.#ManageProgressBar();
    this.#notifyELE.textContent = this.#text;
  }

  set type(value) {
    const types = ["info", "warning", "error", "success", "default"];
    if (types.includes(value)) {
      this.#type = value;
    } else {
      this.#type = "default";
    }
  }

  set progressBarColor(value) {
    this.#progressBarColor = value;
  }

  set backGroundColor(value) {
    this.#backGroundColor = value;
  }

  set showProgress(value) {
    this.#showProgress = value;
  }

  set position(value) {
    const currentContainer = this.#notifyELE.parentElement;
    const selector = `.maincontainernotify[data-position='${value}']`;
    const container =
      document.querySelector(selector) || createContainer(value);
    container.append(this.#notifyELE);
    if (currentContainer === null || currentContainer?.hasChildNodes()) return;
    currentContainer.remove();
  }

  set text(value) {
    this.#text = value;
  }

  set autoClose(value) {
    this.#visibleSince = new Date();
    this.#autoClose = value;
    if (value === false) return;
    if (this.#autoCloseTimeOut !== null) clearTimeout(this.#autoCloseTimeOut);
    this.#autoCloseTimeOut = setTimeout(() => {
      this.remove();
    }, value);
  }

  set canClose(value) {
    if (value) {
      this.#notifyELE.classList.toggle('crosssymbolNotify', value);
      this.#notifyELE.addEventListener("click", this.#removeBinded);

      const container = this.#notifyELE.parentElement;
      this.#notifyELE.addEventListener("click", () => {
        this.#notifyELE.remove();
        if (container?.hasChildNodes()) return;
        container.remove();
      });
    } else {
      this.#notifyELE.removeEventListener("click", this.#removeBinded);
    }
  }

  remove() {
    if (this.#autoClose === false) return;
    clearInterval(this.#progressInterval);
    const container = this.#notifyELE.parentElement;
    this.#notifyELE.classList.remove("translate-x-[0]", "translate-y-[0]");
    this.#notifyELE.addEventListener("transitionend", () => {
      this.#notifyELE.remove();
      if (container?.hasChildNodes()) return;
      container.remove();
    });
    this.onClose();
  }

  #ManageProgressBar() {
    if (this.#showProgress === true) {
      this.#notifyELE.classList.add(
        "progress",
        "before:content-['']",
        "before:absolute",
        "before:h-[2px]",
        "before:w-[10%]",
        "before:bg-zinc-700",
        "before:bottom-0",
        "before:left-0",
        "before:right-0",
        "before:mr-0"
      );
      this.#notifyELE.style.setProperty(
        "--before-bg-color",
        this.#progressBarColor
      );
      this.#notifyELE.style.setProperty("--progress", 1);
      if (this.#showProgress) {
        this.#progressInterval = setInterval(() => {
          const timeVisible = new Date() - this.#visibleSince;
          this.#notifyELE.style.setProperty(
            "--progress",
            1 - timeVisible / this.#autoClose
          );
          if (this.#autoClose === false) {
            clearInterval(this.#progressInterval);
            this.#notifyELE.classList.remove(
              "progress",
              "before:content-['']",
              "before:absolute",
              "before:h-[2px]",
              "before:w-[10%]",
              "before:bg-zinc-700",
              "before:bottom-0",
              "before:left-0",
              "before:right-0",
              "before:mr-0"
            );
          }
        });
      }
    }
  }
}

const createContainer = (value) => {
  const container = document.createElement("div");
  container.classList.add(
    "maincontainernotify",
    "fixed",
    "m-10",
    "w-[300px]",
    "flex",
    "flex-col",
    "gap-2"
  );
  container.dataset.position = value;
  document.body.append(container);
  return container;
};
