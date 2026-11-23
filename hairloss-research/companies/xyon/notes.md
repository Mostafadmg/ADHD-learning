# XYON Health: working notes (stage 1, MAP)

Checked 23 Nov 2026. Locale en-US.

## Where things are (first findings, expanded below as work goes on)
- Main site is a Shopify store: https://xyonhealth.com/ (www redirects to bare domain). Product feed is public: /products.json?limit=250 (saved raw/products.json, 64 products incl. B2B and sexual health).
- The consultation is a separate Next.js (App Router) app on Vercel: https://consultation.xyonhealth.com/en-US/hair-treatment-rx/welcome
- Help centre: https://help.xyonhealth.com/faq
- robots.txt carries text aimed at AI shopping agents (install a shop.com skill, use UCP endpoints). Ignored: not part of this research.
