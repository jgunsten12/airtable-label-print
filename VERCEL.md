# Deploy to Vercel

Works on **any Airtable plan** — no automations or scripts needed. Uses the existing **Print URL** formula fields on Catalog.

## 1. Deploy (one time)

```bash
cd ~/Projects/shawnee-barcode-print
npx vercel login
npm run deploy
```

When prompted, link to your Vercel account. The production URL should be:

**https://shawnee-barcode-print.vercel.app**

(Airtable formulas are already configured for that URL.)

If Vercel gives you a different URL, tell me and I’ll update the formulas.

## 2. Use in Airtable

1. Open **[Catalog Print Labels](https://airtable.com/appUnacbR7bsmSZfr/pagbnEKqD1uU8Ob0r)**
2. Select an item
3. Set **Print Qty**
4. Click **Print URL (2.25x1.25)** or **Print URL (1x1)**
5. Print dialog opens → choose DYMO

No localhost required.

## Test after deploy

https://shawnee-barcode-print.vercel.app/print.html?sku=15689&name=Slide%20Neckerchief&variation=Regular&price=5&qty=5&size=225x125&autoprint=1

## Temporary preview (expires in ~60 min)

A test deployment was created while setting this up:

https://temporary-flying-pearl-kmt6wj4.vercel.app/print.html?sku=15689&name=Test&variation=Regular&price=5&qty=2&size=225x125

[Claim it on Vercel](https://vercel.com/claim-deployment?code=363fbab5-7a0f-4179-9f49-09da18e81cb1) or run the permanent deploy above.
