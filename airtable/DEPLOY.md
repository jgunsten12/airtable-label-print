# Deploy to Airtable Interface

## Two ways to print

| Approach | Needs localhost? | How it works |
|----------|------------------|--------------|
| **Script + button (recommended)** | No | Automation script builds a self-contained print page; you click the link it outputs |
| **Print URL formula fields (currently deployed)** | Yes | Formula links to `http://127.0.0.1:3456` — server must be running |

Use the **script + button** path for production. Keep localhost only if you want to tweak label layout in `print.html` before copying changes into the script.

## Recommended: script-only (no server)

Airtable automations cannot talk to your DYMO directly. The script generates a complete print page in the browser (Code 128 via JsBarcode CDN), then auto-opens the print dialog. No localhost, no hosting.

### Setup (one-time, ~5 min)

1. **Automations → Create**
2. Trigger: **When a button is clicked**
3. Action: **Run script** — paste all of `print-label-automation.js`
4. Map script inputs:

| Script input | Source |
|--------------|--------|
| `sku` | SKU (From Lightspeed) |
| `name` | Item Name |
| `variation` | Variation |
| `price` | Retail Price |
| `quantity` | Print Qty |
| `labelSize` | Static `225x125` or `1x1` |
| `printBaseUrl` | **Leave empty** |

5. Create a **second automation** (or duplicate) for the other label size with a different static `labelSize`.
6. Turn both automations **on**.
7. Edit the **Shawnee Lodge** interface → add **Button** elements on **Catalog Item Lookup** or **Catalog Print Labels** → **Run automation**.
8. Publish the interface.

### Usage

1. Select a catalog item.
2. Set **Print Qty** (e.g. 5).
3. Click **Print Label (Large)** or **Print Label (Small)**.
4. Click the **Open print preview** link in the automation output.
5. Choose your DYMO in the print dialog.

## Currently deployed (localhost-dependent)

These are already in the base but depend on localhost:

- **Print Qty**, **Print URL (2.25x1.25)**, **Print URL (1x1)** on Catalog
- **[Catalog Print Labels](https://airtable.com/appUnacbR7bsmSZfr/pagbnEKqD1uU8Ob0r)** interface page

You can hide or remove the Print URL formula fields once the button automations are working.

## Localhost (optional, dev only)

```bash
cd ~/Projects/shawnee-barcode-print && npm start
```

Only needed to preview layout changes at http://127.0.0.1:3456 before updating the script.
