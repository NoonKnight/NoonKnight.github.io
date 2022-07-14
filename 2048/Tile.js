export default class Tile {
  #tileElement;
  #y;
  #x;
  #value;
  constructor(tileContainer, value = Math.random() > 0.1 ? 2 : 4) {
    this.#tileElement = document.createElement("div");
    this.#tileElement.classList.add("tile");
    tileContainer.append(this.#tileElement);
    this.value = value;
  }
  get value() {
    return this.#value;
  }
  set value(val) {
    this.#value = val;
    this.#tileElement.textContent = val;
    const power = Math.log2(val);
    const backgroundLightness = 100 - power * 9;
    const textLightness = backgroundLightness > 50 ? 10 : 90;
    this.#tileElement.style.setProperty(
      "--background-lightness",
      `${backgroundLightness}%`
    );
    this.#tileElement.style.setProperty(
      "--text-lightness",
      `${textLightness}%`
    );
  }
  set y(value) {
    this.#y = value;
    this.#tileElement.style.setProperty("--y", value);
  }
  set x(value) {
    this.#x = value;
    this.#tileElement.style.setProperty("--x", value);
  }
  remove() {
    this.#tileElement.remove();
  }
  waitForTransition(animation = false) {
    return new Promise((resolve) => {
      this.#tileElement.addEventListener(
        animation ? "animationend" : "transitionend",
        resolve,
        {
          once: true,
        }
      );
    });
  }
}
