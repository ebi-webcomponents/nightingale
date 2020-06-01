/* eslint-disable class-methods-use-this */
const SCROLL_DELAY = 400;

export default class ScrollFilter {
  constructor(element) {
    this.element = element;
    this.timeStampWheelOutside = 0;
    this.resetScrollableTimeout = null;
  }

  setElementScrollable(scrollable) {
    this.element.setAttribute("scrollable", scrollable);
  }

  startResetScrollableTimer() {
    if (this.resetScrollableTimeout) {
      clearTimeout(this.resetScrollableTimeout);
    }
    // Reset scrollable to true after a small period of time
    this.resetScrollableTimeout = setTimeout(() => {
      this.setElementScrollable(true);
      this.resetScrollableTimeout = null;
    }, SCROLL_DELAY);
  }

  blockScroll(timeStamp) {
    this.timeStampWheelOutside = timeStamp;
    this.setElementScrollable(false);
    this.startResetScrollableTimer();
  }

  isWheelEventInsideElement(mouseX, mouseY) {
    const {
      height: elementHeight,
      width: elementWidth,
      x: elementX,
      y: elementY
    } = this.element.getBoundingClientRect();
    return (
      mouseX > elementX &&
      mouseY < elementX + elementWidth &&
      mouseY > elementY &&
      mouseY < elementY + elementHeight
    );
  }

  wheel({ x, y, timeStamp }) {
    if (this.isWheelEventInsideElement(x, y)) {
      if (timeStamp < this.timeStampWheelOutside + SCROLL_DELAY) {
        // Count this as an outside scroll as it's within the delay and it's
        // inferred the user is doing a continuous scroll past the component
        this.blockScroll(timeStamp);
      } else {
        this.setElementScrollable(true);
      }
    } else {
      // Block scrolling and remember the time when the last scroll outside occurred.
      this.blockScroll(timeStamp);
    }
  }
}
