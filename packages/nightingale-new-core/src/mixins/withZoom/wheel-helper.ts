import { Selection } from "d3";


/** TODO docs */
export class WheelHelper {
    handlePan?: (shift: number) => void;
    handleShowHelp?: (shift: number) => void;
    scrollRequiresCtrl: boolean = false;

    constructor(public readonly target: Selection<any, unknown, any, unknown>) {
        this.target.on('wheel.customzoom', e => this.handleWheel(e)); // Avoid naming the event 'wheel.zoom', that would conflict with zoom behavior
    }

    dispose() {
        this.target.on('wheel.customzoom', null);
    }

    /** Used to merge multiple wheel events into one gesture (needed for correct functioning on Mac touchpad) */
    private readonly currentWheelGesture = { lastTimestamp: 0, lastAbsDelta: 0, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false };

    /** Categorize wheel event to one of action kinds */
    public wheelAction(e: WheelEvent): { kind: 'ignore', showHelp: boolean } | { kind: 'zoom', delta: number } | { kind: 'pan', deltaX: number, deltaY: number } {
        console.log('wheelActionH', e)
        const isHorizontal = Math.abs(e.deltaX) >= Math.abs(e.deltaY); // It is important that deltaX=deltaY is treated as horizontal as it could trigger previous-page

        const modeSpeed = (e.deltaMode === 1) ? 25 : e.deltaMode ? 500 : 1; // scroll in lines vs pages vs pixels
        const speedup = this.scrollRequiresCtrl ? 1 : (this.currentWheelGesture.ctrlKey || this.currentWheelGesture.metaKey ? 10 : 1);

        if (isHorizontal) {
            return { kind: 'pan', deltaX: -e.deltaX * modeSpeed * speedup, deltaY: 0 };
        } else {
            if (this.currentWheelGesture.shiftKey) {
                return { kind: 'pan', deltaX: -e.deltaY * modeSpeed * speedup, deltaY: 0 };
            }
            if (this.scrollRequiresCtrl && !this.currentWheelGesture.ctrlKey && !this.currentWheelGesture.metaKey) {
                return { kind: 'ignore', showHelp: Math.abs(e.deltaY) * modeSpeed >= 5 };
            }
            return { kind: 'zoom', delta: -e.deltaY * 0.002 * modeSpeed * speedup };
            // Default function for zoom behavior is: -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002) * (e.ctrlKey ? 10 : 1)
        }
        // TODO merge showHelp and ignore
    }

    /** Handle event coming directly from the mouse wheel (customizes basic D3 zoom behavior) */
    private handleWheel(e: WheelEvent): void {
        // console.log('handleWheelH')
        // e.preventDefault(); // avoid scrolling or previous-page gestures

        // Magic to handle touchpad scrolling on Mac
        this.updateCurrentWheelGesture(e);

        const action = this.wheelAction(e);
        console.log('theActionH', e.deltaX, e.deltaY, action)
        if (action.kind !== 'ignore') {
            e.preventDefault();
        }
        if (action.kind === 'pan') {
            this.handlePan?.(action.deltaX);
        }
        if (action.kind === 'ignore' && action.showHelp) {
            this.handleShowHelp?.(0);
        }
        // action "zoom" is handled by the zoom behavior
    }

    /** Magic to handle touchpad scrolling on Mac (when user lifts fingers from touchpad, but the browser is still getting wheel events) */
    private updateCurrentWheelGesture(e: WheelEvent): void {
        const now = Date.now();
        const absDelta = Math.max(Math.abs(e.deltaX), Math.abs(e.deltaY));
        console.log('time', now - this.currentWheelGesture.lastTimestamp)
        if (now > this.currentWheelGesture.lastTimestamp + 100 || absDelta > this.currentWheelGesture.lastAbsDelta + 1) {
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