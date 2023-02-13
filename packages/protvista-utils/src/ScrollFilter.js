export default class ScrollFilter {
  constructor(element, scrollDelay = 400) {
    this.element = element;
    this.timeStampWheelOutside = 0;
    this.resetScrollableTimeout = null;
    this.scrollDelay = scrollDelay;
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
    }, this.scrollDelay);
  }

  blockScroll(timeStamp) {
    this.timeStampWheelOutside = timeStamp;
    this.setElementScrollable(false);
    this.startResetScrollableTimer();
  }

  wheel({ target, timeStamp }) {
    if (this.element.contains(target)) {
      if (timeStamp < this.timeStampWheelOutside + this.scrollDelay) {
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
