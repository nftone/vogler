console.log("UWES");

import { BaseBlockbook } from "./node_modules/blockbook-client/dist/index.es.js";
console.log("🚀 ~ BaseBlockbook:", BaseBlockbook);

// Attach BaseBlockbook to the window object
window.BaseBlockbook = BaseBlockbook;
