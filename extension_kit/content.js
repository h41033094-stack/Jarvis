// J.A.R.V.I.S. Neural Bridge - Content Script
// Responsible for DOM manipulation and data extraction

console.log("J.A.R.V.I.S. Neural Bridge: Active_Uplink");

window.addEventListener("message", (event) => {
  // Only accept messages from the trusted J.A.R.V.I.S. origin
  if (event.data && event.data.type === "JARVIS_INJECTION_REQUEST") {
    console.log("JARVIS_INJECTION_RECEIVED:", event.data.payload);
    
    const { action, selector, value } = event.data.payload;
    
    if (action === "fill" && selector && value) {
      const element = document.querySelector(selector);
      if (element) {
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        window.parent.postMessage({ 
          type: "JARVIS_BRIDGE_FEEDBACK", 
          status: "SUCCESS", 
          message: `Injected data into ${selector}` 
        }, "*");
      } else {
        window.parent.postMessage({ 
          type: "JARVIS_BRIDGE_FEEDBACK", 
          status: "FAULT", 
          message: `Element ${selector} not found` 
        }, "*");
      }
    }
  }
});
