import { Selection } from "d3";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySelection = Selection<any, unknown, any, unknown>;


/** Helper class to deal with customizing zoom behavior (e.g. only zooming when Ctrl is pressed, using horizontal scroll to pan) */
export class WheelHelper {
    /** Function to be performed when user pans horizontally (by horizontal scroll, or Shift + vertical scroll ) */
    handlePan?: (shift: number) => void;
    scrollRequiresCtrl: boolean = false;
    constructor(public readonly target: AnySelection) {
        this.target.on('wheel.WheelHelper', e => this.handleWheel(e)); // Avoid naming the event 'wheel.zoom', that would conflict with zoom behavior
    }

    dispose() {
        this.target.on('wheel.WheelHelper', null);
    }

    /** Used to merge multiple wheel events into one gesture (needed for correct functioning on Mac touchpad) */
    private readonly currentWheelGesture = { lastTimestamp: 0, lastAbsDelta: 0, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false };

    /** Categorize wheel event to one of action kinds */
    public wheelAction(e: WheelEvent): { kind: 'ignore' } | { kind: 'zoom', delta: number } | { kind: 'pan', deltaX: number, deltaY: number } {
        const isPinch = e.ctrlKey && e.deltaMode === 0 && e.deltaX === 0 && e.deltaY !== Math.floor(e.deltaY); // Trying to recognize pinch gesture on Mac touchpad
        const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        const isVertical = Math.abs(e.deltaX) < Math.abs(e.deltaY);

        const modeSpeed = (e.deltaMode === 1) ? 25 : e.deltaMode ? 500 : 1; // scroll in lines vs pages vs pixels
        const speedup = isPinch || !this.scrollRequiresCtrl && (this.currentWheelGesture.ctrlKey || this.currentWheelGesture.metaKey) ? 10 : 1;

        if (isPinch) {
            return { kind: 'zoom', delta: -e.deltaY * 0.002 * modeSpeed * speedup };
        }
        if (isHorizontal) {
            return { kind: 'pan', deltaX: -e.deltaX * modeSpeed * speedup, deltaY: 0 };
        }
        if (isVertical) {
            if (this.currentWheelGesture.shiftKey) {
                return { kind: 'pan', deltaX: -e.deltaY * modeSpeed * speedup, deltaY: 0 };
            }
            if (this.scrollRequiresCtrl && !this.currentWheelGesture.ctrlKey && !this.currentWheelGesture.metaKey) {
                return { kind: 'ignore' };
            }
            return { kind: 'zoom', delta: -e.deltaY * 0.002 * modeSpeed * speedup };
            // Default function for zoom behavior is: -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002) * (e.ctrlKey ? 10 : 1)
        }
        // Ignore diagonal scrolling, avoid it being recognized as "Previous Page" touchpad gesture
        return { kind: 'pan', deltaX: 0, deltaY: 0 };
    }

    /** Handle event coming directly from the mouse wheel (customizes basic D3 zoom behavior) */
    private handleWheel(e: WheelEvent): void {
        // Magic to handle touchpad scrolling on Mac
        this.updateCurrentWheelGesture(e);

        const action = this.wheelAction(e);
        if (action.kind !== 'ignore') {
            e.preventDefault();
        }
        if (action.kind === 'pan') {
            this.handlePan?.(action.deltaX);
        }
        // action kind "zoom" is handled by the zoom behavior
    }

    /** Magic to handle touchpad scrolling on Mac (when user lifts fingers from touchpad, but the browser is still getting wheel events) */
    private updateCurrentWheelGesture(e: WheelEvent): void {
        const now = Date.now();
        const absDelta = Math.max(Math.abs(e.deltaX), Math.abs(e.deltaY));
        if (e.deltaMode !== 0 || now > this.currentWheelGesture.lastTimestamp + 150 || absDelta >= 120 || absDelta > this.currentWheelGesture.lastAbsDelta + 5) {
            // Starting a new gesture
            this.currentWheelGesture.ctrlKey = e.ctrlKey;
            this.currentWheelGesture.shiftKey = e.shiftKey;
            this.currentWheelGesture.altKey = e.altKey;
            this.currentWheelGesture.metaKey = e.metaKey;
        }
        this.currentWheelGesture.lastTimestamp = now;
        this.currentWheelGesture.lastAbsDelta = absDelta;
    }
}
