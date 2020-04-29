/* eslint-disable class-methods-use-this */
const SCROLL_DELAY = 400;

export default class ScrollFilter {
  constructor(element) {
    this.element = element;
    this.timeStampWheelOutside = 0;
    this.resetScrollableTimeout = null;
  }

  setElementScrollable(scrollable) {
    // console.log(`${scrollable ? "" : "no "}scroll`);
    // const style = getComputedStyle(this.element);
    // style.setProperty("--overflow-y", scrollable ? "auto" : "hidden");
    // console.log(style.getPropertyValue("--overflow-y"));
    this.element.setAttribute("scrollable", scrollable);
  }

  startResetScrollableTimer() {
    if (this.resetScrollableTimeout) {
      // console.log("clearTimeout");
      clearTimeout(this.resetScrollableTimeout);
    }
    // We want to reset scrollable to true after a small period of time
    this.resetScrollableTimeout = setTimeout(() => {
      // console.log("timeout complete, now scroll");
      this.setElementScrollable(true);
      this.resetScrollableTimeout = null;
    }, SCROLL_DELAY);
  }

  wheel({ x: mouseX, y: mouseY, timeStamp }) {
    // console.log("here");
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
        console.log("no scroll");
        this.setElementScrollable(false);
        this.startResetScrollableTimer();
      } else {
        console.log("scroll");
        this.setElementScrollable(true);
      }
    } else {
      this.timeStampWheelOutside = timeStamp;
    }
  }
}
