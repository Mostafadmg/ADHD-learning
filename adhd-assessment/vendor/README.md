# Vendored libraries

Loaded on demand by `js/components/diva-kit.js`, only when the clinician loads their own DIVA PDF or downloads
the filled form. Nothing else in the workspace uses them, and they are not part of the single-file bundle.

| Library | Version | Licence | Files | Used for |
|---|---|---|---|---|
| [PDF.js](https://github.com/mozilla/pdf.js) (pdfjs-dist) | 3.11.174 | Apache 2.0 (`pdfjs/LICENSE`) | `pdfjs/pdf.min.js`, `pdfjs/pdf.worker.min.js` | reading the text and form boxes of the clinician's own DIVA PDF; previewing the filled form |
| [pdf-lib](https://github.com/Hopding/pdf-lib) | 1.17.1 | MIT (`pdf-lib/LICENSE.md`) | `pdf-lib/pdf-lib.min.js` | drawing the ticks and text on that PDF |

Both were copied unchanged from the npm packages. To update, replace the files and bump the `?v=` that
`diva-kit.js` adds when it loads them.
