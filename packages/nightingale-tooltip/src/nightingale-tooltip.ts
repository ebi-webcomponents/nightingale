import { html, css, LitElement } from "lit";
import { property, customElement } from "lit/decorators.js";

@customElement("nightingale-tooltip")
class NightingaleTooltip extends LitElement {
    @property({ type: String, reflect: true })
    title: string = "";

    @property({ type: Boolean, reflect: true })
    visible: boolean = false;

    @property({ type: Object })
    tooltipContent: { description: string; evidence: string } = { description: "", evidence: "" };

    @property({ type: String, reflect: true })
    container: string = "html";

    static styles = css`
        :host {
            --z-index: 50000;
            --title-color: black;
            --text-color: white;
            --body-color: #616161;
            --triangle-width: 16px;
            --triangle-height: 10px;
            --triangle-margin: 10px;
            --vertical-distance: 5px;
        }

        .tooltip {
            font-family: Roboto, Arial, sans-serif;
            font-size: 0.9rem;
            display: none; /* Hide initially */
            position: absolute;
            min-width: 220px;
            max-width: 50vw;
            z-index: var(--z-index);
            color: var(--text-color);
            background: var(--body-color);
            padding: 10px;
            border-radius: 5px;
            pointer-events: none;
            transition: opacity 0.3s;
            white-space: normal; /* Ensure text wraps */
            word-wrap: break-word; /* Ensure long words break */
            line-height: 1.5; /* Add line height for better readability */
        }

        .tooltip.visible {
            display: block; /* Show when visible */
            opacity: 0.9;
            pointer-events: auto;
        }

        h1 {
            margin: 0;
            background-color: var(--title-color);
            line-height: 2em;
            padding: 0 1ch;
        }

        .tooltip-body {
            padding: 1em;
            background: var(--body-color);
            font-weight: normal;
            overflow-y: auto;
            max-height: 40vh;
        }

        p {
            margin: 0; /* Remove default margin to avoid extra space */
            padding: 0; /* Remove default padding to avoid extra space */
        }
    `;

    render() {
        return html`
            <section class="tooltip ${this.visible ? "visible" : ""}">
                <h1>${this.title}</h1>
                <div class="tooltip-body">
                    <p>Description: ${this.tooltipContent.description}</p>
                    <p>Evidence: ${this.tooltipContent.evidence}</p>
                </div>
            </section>
        `;
    }

    showTooltip(x: number, y: number, content: { description: string; evidence: string }, accession: string) {
        // Hide tooltip before displaying new one
        this.hideTooltip();

        const tooltip = this.shadowRoot?.querySelector(".tooltip") as HTMLElement;
        if (tooltip) {
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
            this.tooltipContent = content;
            this.title = accession;
            this.visible = true;
        }
    }

    hideTooltip() {
        this.visible = false;
    }
}

export default NightingaleTooltip;
