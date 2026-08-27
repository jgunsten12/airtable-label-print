/*
 * Shawnee Merchandise — Print Label (1" × 1")
 * Automation: When a button is clicked → Run script
 *
 * Script inputs:
 *   sku        → Catalog / SKU (From Lightspeed)
 *   name       → Catalog / Item Name
 *   variation  → Catalog / Variation
 *   price      → Catalog / Retail Price
 *   quantity   → Catalog / Print Qty
 */

const config = input.config();
const labelSize = "1x1";
const printBaseUrl = "";

const sku = config.sku != null ? String(config.sku).trim() : "";
const name = config.name != null ? String(config.name).trim() : "";
const variation = config.variation != null ? String(config.variation).trim() : "";
const price = config.price != null ? String(config.price).trim() : "";

let quantity = 1;
if (config.quantity != null && config.quantity !== "") {
  const parsed = parseInt(String(config.quantity), 10);
  if (!Number.isNaN(parsed) && parsed >= 1) {
    quantity = Math.min(parsed, 100);
  }
}

if (!sku) {
  throw new Error("This item has no SKU. Add a Lightspeed SKU before printing.");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatPrice(value) {
  if (value === "" || value == null) return "";
  const num = Number(String(value).replace(/[^0-9.-]/g, ""));
  if (Number.isNaN(num)) return String(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

function itemNameFontSize(itemName) {
  const len = String(itemName).length;
  if (len > 42) return "3.5pt";
  if (len > 30) return "4pt";
  if (len > 20) return "4.5pt";
  return "5pt";
}

function buildLabelHtml(index) {
  const safeName = escapeHtml(name);
  const safeVariation = escapeHtml(variation);
  const safePrice = escapeHtml(formatPrice(price));
  const nameSize = itemNameFontSize(name);

  return `
  <div class="label">
    <div class="barcode-wrap"><svg id="barcode-${index}"></svg></div>
    <div class="text-block">
      <div class="item-name" style="font-size:${nameSize}">${safeName}</div>
      <div class="meta">
        <span class="variation">${safeVariation}</span>
        <span class="price">${safePrice}</span>
      </div>
    </div>
  </div>`;
}

const barcodeHeight = 28;
const barcodeWidth = 1.1;
const labelsHtml = Array.from({ length: quantity }, (_, index) => buildLabelHtml(index)).join("");
const barcodeScripts = Array.from({ length: quantity }, (_, index) => `
    JsBarcode("#barcode-${index}", ${JSON.stringify(String(sku))}, {
      format: "CODE128",
      width: ${barcodeWidth},
      height: ${barcodeHeight},
      displayValue: false,
      margin: 0,
    });`).join("");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Print Label</title>
  <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; }
    .label {
      width: 1in;
      height: 1in;
      padding: 0.04in;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
    }
    .label:last-child { page-break-after: auto; break-after: auto; }
    .barcode-wrap { display: flex; justify-content: center; align-items: center; flex: 1 1 auto; min-height: 0; }
    .barcode-wrap svg { width: 100%; max-height: 0.36in; }
    .text-block { min-width: 0; width: 100%; flex: 0 0 auto; }
    .item-name { font-weight: 700; line-height: 1.08; min-width: 0; width: 100%; max-width: 100%; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; white-space: normal; overflow-wrap: anywhere; word-break: break-word; max-height: 0.17in; }
    .meta { display: flex; justify-content: space-between; gap: 4px; line-height: 1.05; font-size: 5pt; min-width: 0; width: 100%; overflow: hidden; }
    .meta .variation { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1 1 auto; min-width: 0; }
    .meta .price { flex: 0 0 auto; font-weight: 700; white-space: nowrap; font-size: 6.5pt; }
    @media print { @page { margin: 0; size: 1in 1in; } body { margin: 0; } }
  </style>
</head>
<body>
  ${labelsHtml}
  <script>
    ${barcodeScripts}
    window.addEventListener("load", function () {
      setTimeout(function () { window.print(); }, 300);
    });
  <\/script>
</body>
</html>`;

const printUrl = "data:text/html;charset=utf-8," + encodeURIComponent(html);
const qtyLabel = quantity === 1 ? "1 label" : `${quantity} labels`;

output.markdown(
  `**${name || "Catalog item"}** (1" × 1", ${qtyLabel})\n\n` +
    `[Open print preview](${printUrl})\n\n` +
    `The print dialog will include ${qtyLabel}. Choose your DYMO printer and turn off headers/footers if they appear.`
);
