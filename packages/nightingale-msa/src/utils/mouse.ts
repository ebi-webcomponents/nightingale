import { RawPosition } from "../types/types";

class Mouse {
  static relative = function (
    event: MouseEvent | TouchEvent | Touch,
  ): RawPosition {
    if ((event as TouchEvent).changedTouches !== undefined)
      return Mouse.relative((event as TouchEvent).changedTouches[0]);

    const e = event as MouseEvent;
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;
    if (mouseX === undefined) {
      const target = e.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      if (mouseX === undefined) {
        mouseX = e.pageX - target.offsetLeft;
        mouseY = e.pageY - target.offsetTop;
        if (mouseX === undefined) {
          console.log(e, "No mouse event defined.");
          return { xPos: -1, yPos: -1 };
        }
      }
    }
    return { xPos: mouseX, yPos: mouseY };
  };

  static absolute = function (
    event: MouseEvent | TouchEvent | Touch,
  ): RawPosition {
    if ((event as TouchEvent).changedTouches !== undefined)
      //return Mouse.abs(e.changedTouches[e.targetTouches.length - 1]);
      return Mouse.absolute((event as TouchEvent).changedTouches[0]);

    const e = event as MouseEvent;
    let mouseX = e.pageX;
    let mouseY = e.pageY;
    if (mouseX === undefined) {
      mouseX = e.offsetX;
      mouseY = e.offsetY;
    }
    if (mouseX === undefined) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
    if (mouseX === undefined) {
      mouseX = e.x;
      mouseY = e.y;
    }
    return { xPos: mouseX, yPos: mouseY };
  };

  static wheelDelta = function (e: WheelEvent) {
    let delta = [e.deltaX, e.deltaY];
    if (delta[0] === undefined) {
      // in case there is a more detailed scroll sensor - use it
      if (e.movementX) {
        delta = [e.movementX, e.movementY];
      }
    }
    // safety first
    if (isNaN(delta[0])) {
      delta[0] = 0;
    }
    if (isNaN(delta[1])) {
      delta[1] = 0;
    }
    return delta;
  };
}

export default Mouse;
