/* eslint-disable class-methods-use-this */
const SCROLL_DELAY = 500;

export default class ScrollFilter {
  constructor(element) {
    this.element = element;
    this.timeStampWheelOutside = 0;
  }

  setElementScrollable(scrollable) {
    console.log(`${scrollable ? "" : "no "}scroll`);
    // const style = getComputedStyle(this.element);
    // style.setProperty("--overflow-y", scrollable ? "auto" : "hidden");
    // console.log(style.getPropertyValue("--overflow-y"));
    // protvista-datatable-container
    if (scrollable) {
      this.element.focus();
    }
    this.element.setAttribute("scrollable", scrollable);
  }

  wheel({ x: mouseX, y: mouseY, timeStamp }) {
    const {
      height: elementHeight,
      width: elementWidth,
      x: elementX,
      y: elementY
    } = this.element.getBoundingClientRect();
    if (
      mouseX > elementX &&
      mouseY < elementX + elementWidth &&
      mouseY > elementY &&
      mouseY < elementY + elementHeight
    ) {
      if (timeStamp < this.timeStampWheelOutside + SCROLL_DELAY) {
        // Count this as an outside scroll as it's within the delay and it's
        // inferred the user is doing a continuous scroll past the component
        this.timeStampWheelOutside = timeStamp;
        this.setElementScrollable(false);
      } else {
        this.setElementScrollable(true);
      }
    } else {
      this.timeStampWheelOutside = timeStamp;
    }
  }
}
