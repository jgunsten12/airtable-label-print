# Button + Script Setup (5 minutes)

The Airtable API cannot create **When a button is clicked** automations or **Run script** steps.
Do this once in the Airtable UI. After that, no localhost or print server is needed.

## 1. Create the large-label automation

1. Open [Shawnee Merchandise → Automations](https://airtable.com/appUnacbR7bsmSZfr/automations)
2. **Create automation**
3. Trigger: **When a button is clicked**
4. Action: **Run script**
5. Paste the entire contents of `print-label-large.js`
6. Add these **input variables** (names must match exactly):

| Variable name | Map to |
|---------------|--------|
| `sku` | Catalog → SKU (From Lightspeed) |
| `name` | Catalog → Item Name |
| `variation` | Catalog → Variation |
| `price` | Catalog → Retail Price |
| `quantity` | Catalog → Print Qty |

7. Name the automation **Print Catalog Label (Large)**
8. Turn it **ON**

## 2. Create the small-label automation

Duplicate the automation above (or create a new one):

1. Same trigger: **When a button is clicked**
2. Replace script with `print-label-small.js`
3. Same input variable mapping
4. Name it **Print Catalog Label (Small)**
5. Turn it **ON**

## 3. Add buttons to the interface

1. Open [Catalog Print Labels → Edit](https://airtable.com/appUnacbR7bsmSZfr/pagbnEKqD1uU8Ob0r/edit)
2. Add a **Button** element
   - Label: **Print Label (Large)**
   - Action: **Run automation** → **Print Catalog Label (Large)**
   - Source: **Catalog** table (record from the page)
3. Add a second **Button** element
   - Label: **Print Label (Small)**
   - Action: **Run automation** → **Print Catalog Label (Small)**
4. **Publish** the interface

Repeat on **Catalog Item Lookup** if you want buttons there too.

## 4. Use it

1. Open **Catalog Print Labels**
2. Select an item
3. Set **Print Qty** (e.g. 5)
4. Click **Print Label (Large)** or **Print Label (Small)**
5. In the automation panel, click **Open print preview**
6. Print dialog opens → choose DYMO

## Cleanup (optional)

Hide or remove these localhost-dependent fields once buttons work:

- Print URL (2.25x1.25)
- Print URL (1x1)

Keep **Print Qty** — the script reads it.
