# Shawnee Barcode Print

Print preview for DYMO labels from the Shawnee Merchandise Airtable catalog.

Supports two label sizes:

- **2.25" × 1.25"** (`225x125`)
- **1" × 1"** (`1x1`)

Each label includes Code 128 barcode (from Lightspeed SKU), item name, variation, and price.

## Local testing

```bash
npm start
```

Then open:

http://127.0.0.1:3456/print.html?sku=15689&name=Slide%20Neckerchief&variation=Regular&price=5&size=225x125&qty=5

Or run:

```bash
npm run test-url
```

Click **Print** and choose your DYMO printer. In the print dialog:

- Paper size: match your label (`2.25 x 1.25` or `1 x 1`)
- Margins: none / minimum
- Headers and footers: off

## Airtable setup (button + script)

### 1. Create the automation

1. Open **Shawnee Merchandise** → **Automations**
2. Create automation: **When a button is clicked** (Interface button)
3. Add action: **Run script**
4. Paste the contents of `airtable/print-label-automation.js`

### 2. Configure script inputs

| Input name     | Map to                              | Notes                          |
|----------------|-------------------------------------|--------------------------------|
| `sku`          | Catalog → SKU (From Lightspeed)     | Required                       |
| `name`         | Catalog → Item Name                   |                                |
| `variation`    | Catalog → Variation                   |                                |
| `price`        | Catalog → Retail Price                |                                |
| `quantity`     | Static value or number field          | e.g. `5`; defaults to `1`      |
| `labelSize`    | Static value                        | `225x125` or `1x1`             |
| `printBaseUrl` | Static value (optional)             | `http://localhost:3456` for local testing; leave blank in production |

**Tip:** Create **two interface buttons** on Catalog Item Lookup — one for each label size — each wired to the same script with a different static `labelSize`.

### 3. Add buttons to Catalog Item Lookup

1. Edit the **Shawnee Lodge** interface
2. Open **Catalog Item Lookup**
3. Add **Button** elements (record action):
   - **Print Label (Large)** → runs automation, `labelSize = 225x125`
   - **Print Label (Small)** → runs automation, `labelSize = 1x1`

When clicked, the automation output shows a link. Click it to open the print preview and send the job to your DYMO.

### Production options

- **No hosting:** Leave `printBaseUrl` blank. The script opens a self-contained print page (recommended).
- **Hosted page:** Deploy `print.html` anywhere static files are served, set `printBaseUrl` to that origin, and use the hosted preview while testing layout changes.
