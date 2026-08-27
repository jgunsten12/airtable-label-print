/*
 * Shawnee Merchandise — Print Barcode Label
 *
 * Paste this into an Airtable Automation → Run script action.
 * Trigger: Interface button on Catalog Item Lookup (or Catalog record detail).
 *
 * In the script input variables, map:
 *   sku        → Catalog / SKU (From Lightspeed)
 *   name       → Catalog / Item Name
 *   variation  → Catalog / Variation
 *   price      → Catalog / Retail Price
 *   quantity   → static value, or a number field like "Print Qty" (default 1)
 *   labelSize  → static value "225x125" or "1x1" (create two buttons if you want both sizes)
 *
 * Optional:
 *   printBaseUrl → only for local layout testing, e.g. "http://127.0.0.1:3456"
 *                  Leave blank (recommended) — no server needed.
 */

const config = input.config();

const sku = config.sku != null ? String(config.sku).trim() : "";
const name = config.name != null ? String(config.name).trim() : "";
const variation = config.variation != null ? String(config.variation).trim() : "";
const price = config.price != null ? String(config.price).trim() : "";
const labelSize = config.labelSize === "1x1" ? "1x1" : "225x125";
const printBaseUrl = config.printBaseUrl ? String(config.printBaseUrl).replace(/\/$/, "") : "";

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

function buildHostedPrintUrl() {
  const query = new URLSearchParams({
    sku,
    name,
    variation,
    price,
    size: labelSize,
    qty: String(quantity),
    autoprint: "1",
  });
  return `${printBaseUrl}/print.html?${query.toString()}`;
}

function buildLabelHtml(index) {
  const safeName = escapeHtml(name);
  const safeVariation = escapeHtml(variation);
  const safePrice = escapeHtml(formatPrice(price));

  return `
  <div class="label">
    <div class="barcode-wrap"><svg id="barcode-${index}"></svg></div>
    <div class="item-name">${safeName}</div>
    <div class="meta">
      <span class="variation">${safeVariation}</span>
      <span class="price">${safePrice}</span>
    </div>
  </div>`;
}

function buildStandalonePrintPage() {
  const barcodeHeight = labelSize === "1x1" ? 28 : 44;
  const barcodeWidth = labelSize === "1x1" ? 1.1 : 1.4;
  const labelsHtml = Array.from({ length: quantity }, (_, index) => buildLabelHtml(index)).join("");
  const barcodeScripts = Array.from({ length: quantity }, (_, index) => `
    JsBarcode("#barcode-${index}", ${JSON.stringify(String(sku))}, {
      format: "CODE128",
      width: ${barcodeWidth},
      height: ${barcodeHeight},
      displayValue: false,
      margin: 0,
    });`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Print Label</title>
  <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; }
    .label {
      width: ${labelSize === "1x1" ? "1in" : "2.25in"};
      height: ${labelSize === "1x1" ? "1in" : "1.25in"};
      padding: ${labelSize === "1x1" ? "0.04in" : "0.06in 0.08in"};
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
    }
    .label:last-child {
      page-break-after: auto;
      break-after: auto;
    }
    .barcode-wrap { display: flex; justify-content: center; align-items: center; flex: 1 1 auto; min-height: 0; }
    .barcode-wrap svg { width: 100%; max-height: ${labelSize === "1x1" ? "0.42in" : "0.62in"}; }
    .item-name {
      font-weight: 700;
      line-height: 1.05;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: ${labelSize === "1x1" ? "5.5pt" : "9pt"};
    }
    .meta {
      display: flex;
      justify-content: space-between;
      gap: 4px;
      line-height: 1.05;
      font-size: ${labelSize === "1x1" ? "5pt" : "8pt"};
      white-space: nowrap;
      overflow: hidden;
    }
    .meta .variation { overflow: hidden; text-overflow: ellipsis; flex: 1 1 auto; }
    .meta .price { flex: 0 0 auto; font-weight: 700; }
    @media print {
      @page { margin: 0; size: ${labelSize === "1x1" ? "1in 1in" : "2.25in 1.25in"}; }
      body { margin: 0; }
    }
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
}

let printUrl;

if (printBaseUrl) {
  printUrl = buildHostedPrintUrl();
} else {
  const html = buildStandalonePrintPage();
  printUrl = "data:text/html;charset=utf-8," + encodeURIComponent(html);
}

const sizeLabel = labelSize === "1x1" ? '1" × 1"' : '2.25" × 1.25"';
const qtyLabel = quantity === 1 ? "1 label" : `${quantity} labels`;

output.markdown(
  `**${name || "Catalog item"}** (${sizeLabel}, ${qtyLabel})\n\n` +
    `[Open print preview](${printUrl})\n\n` +
    `The print dialog will include ${qtyLabel}. Choose your DYMO printer and turn off headers/footers if they appear.`
);
