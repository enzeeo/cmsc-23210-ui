# cmsc-ui

Simple two-page static website for terms collection and link redirection.

## Files
- `index.html`: Terms and conditions page.
- `link.html`: Shared destination page for both Accept and Reject actions.
- `styles.css`: Shared styling for both pages.
- `script.js`: Scroll gate, user input handling, action tracking, and endpoint request.

## Tracking placeholder
Update `TRACKING_ENDPOINT_URL` in `script.js` with your Google Apps Script Web App URL.

## Run locally
Open `index.html` directly in a browser, or run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`.
