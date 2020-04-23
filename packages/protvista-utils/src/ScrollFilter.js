const SCROLL_DELAY = 500;

export default class ScrollFilter {
  constructor(element) {
    this.element = element;
    this.timeStampWheelOutside = 0;
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
        console.log("no scroll");
      } else {
        console.log("scroll");
      }
    } else {
      this.timeStampWheelOutside = timeStamp;
    }
  }
}
