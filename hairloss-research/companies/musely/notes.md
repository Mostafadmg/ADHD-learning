# Musely (US): working notes, stage 1 (MAP)

Checked 23 Nov 2026. Work in progress: see the end of the file for status.

## Where things are
- Site: https://www.musely.com/ (Next.js app router; page data is in `self.__next_f.push` flight payloads inside the HTML).
- Hair hub: https://www.musely.com/hair
- Product pages (from sitemap `sitemaps/sitemap_st_5000_1.xml`): /hair/pill/men, /hair/pill/women, /hair/topicalclassic/men|women,
  /hair/topicalmodern/men|women, /hair/topicalbundle/men|women.
- robots.txt disallows /facerx/questionnaire, /facerx/cart, /facerx/checkout, /facerx/photo and others for crawlers.
  The walks here are single, slow, human-style visits, not crawling.
- `raw/` holds the curl copies: `*.html`, `*.txt` (visible text + links), `*.rsc.txt` (decoded page data), `*.strings.txt`.

## Flow found so far (observed, runs/baseline-men-pill)
1. Product page (e.g. /hair/pill/men). A "20% Off New Patient Offer" pop-up opens by itself after about 3 s and blocks clicks
   (it asks for an email: do NOT fill it; press Escape to close it).
2. "Add To Cart" -> POST /api/v2/cart/guest/add (anonymous guest cart) -> /cart. Cart shows: The Hair Pill, 90-Day Supply,
   Frequency "Every 3 months $99 Save 30%", and "*Free shipping, tax free. A $20 Doctor Visit Fee is required one-time per transaction..."
3. "Continue" -> pop-up "OOPS! Don't forget your discount!" (Claim My 20% Off / Continue Without Savings).
4. "Continue Without Savings" -> /facerx/loginstatus?context=purchase&redirect=/facerx/welcomeback?resume=purchase
   = ACCOUNT WALL: "WELCOME TO MUSELY. Your results start here! Enter your email to log in or sign up."
   Progress bar on that screen: 1 Profile, 2 Eligibility, 3 Questionnaire, 4 Review, 5 Photos, 6 Checkout.
   So the whole medical questionnaire sits behind the account wall. No medical question is asked before it.
- JSON the page fetched (kept in raw/): `api-buyableRx.json` (/api/v2/product/all/buyableRx?listAll=true&listAllSku=true)
  and `api-catalog-products.json` (/api/catalog/products): every product, SKU and price.
