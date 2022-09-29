import "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"

class MermaidCard extends HTMLElement {

  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  set hass(hass) {

    // Initialize the content if it's not there yet.
    if (!this.content) {
      this.innerHTML = `
        <ha-card header="${this.config.header || `` }">
          <div class="card-content"></div>
        </ha-card>
      `;
      this.content = this.querySelector('div');
    }

    mermaid.initialize({ startOnLoad: true });
    mermaid.render('graph', this.config.content, (code) => { 
      this.baseHtml = code
      this.content.innerHTML = this.baseHtml
    })
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config) {
    if (!config.content) {
      throw new Error(`Required key 'content' is missing.`);
    }
    this.config = config;
  }

  configChanged(newConfig) {
    const event = new Event("config-changed", {
      bubbles: true,
      composed: true
    });
    event.detail = {config: newConfig};
    this.dispatchEvent(event);
  }

  static getStubConfig() {
    return { 
      header: "Welcome Mermaid!",
      content: `graph LR
        A --> B
        B --> C
        C --> D
        D --> A`
    }
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
}
 
  
  customElements.define('mermaid-card', MermaidCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "mermaid-card",
    name: "Mermaid Card",
    preview: true, 
    description: "A custom card to show mermaid graphs!" 
  });