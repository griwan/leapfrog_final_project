class Slider {
  constructor(parent, value, mul, name) {
    this.parent = parent;
    this.child = document.createElement("div");
    this.parent.appendChild(this.child);
    this.element = document.createElement("input");
    this.element.min = "0";
    this.element.max = "10";
    this.element.name = name;
    this.element.value = `${(value * 1) / mul}`;
    this.element.type = "range";

    this.label = document.createElement("label");
    this.label.for = name;
    this.label.innerHTML = name;

    this.child.appendChild(this.element);
    this.child.appendChild(this.label);
    console.log(this.element);
  }
  createEvent(f) {
    this.element.addEventListener("input", (e) => {
      f(e.target.value);
    });
  }
}
export default Slider;
