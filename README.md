# Wedding Website

A lightweight, mobile-first wedding webpage with RSVP form that saves responses to Google Sheets.

## Quick Start

1. Open `index.html` in a browser — everything works out of the box (RSVP runs in demo mode until you connect Google Sheets).
2. Customize the placeholder content (see below).
3. Set up Google Sheets for RSVP collection (see below).
4. Deploy to any static hosting.

---

## Customizing Content

Search and replace these placeholders across `index.html`:

| Placeholder | Replace with |
|---|---|
| `[Your Name]` | First person's name |
| `[Partner Name]` | Second person's name |
| `[Month] [Day], [Year]` | Wedding date (e.g., `June 15, 2026`) |
| `[Venue Name]` | Ceremony venue name |
| `[123 Street Address]` | Ceremony street address |
| `[City, State ZIP]` | Ceremony city/state/zip |
| `[Reception Venue Name]` | Reception venue name |
| `[456 Reception Address]` | Reception street address |
| `[RSVP Deadline Date]` | RSVP cutoff date |
| `[your@email.com]` | Contact email address |

### Wedding Date (Countdown Timer)

In `script.js`, update the `WEDDING_DATE` constant on line 10:

```js
const WEDDING_DATE = new Date('2026-06-15T15:00:00');
```

Use the format `YYYY-MM-DDTHH:MM:SS` in local time.

### Google Maps Embed

In `index.html`, replace the `<iframe>` src URL in the map section:

1. Go to [Google Maps](https://maps.google.com)
2. Search for your venue
3. Click **Share** > **Embed a map**
4. Copy the `src="..."` URL from the iframe code
5. Paste it into the existing iframe's `src` attribute

---

## Google Sheets RSVP Setup

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it something like "Wedding RSVPs".
3. In **Row 1**, add these column headers (exact names):

   | A | B | C | D | E | F | G |
   |---|---|---|---|---|---|---|
   | timestamp | name | email | guests | attendance | dietary | message |

### Step 2: Open Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**.
2. Delete any existing code and paste the following:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp,
    data.name,
    data.email,
    data.guests,
    data.attendance,
    data.dietary,
    data.message
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Save the project (Ctrl+S). Name it "Wedding RSVP Handler".

### Step 3: Deploy as a Web App

1. Click **Deploy > New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Description**: Wedding RSVP
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**.
5. Authorize the app when prompted (review permissions and allow).
6. Copy the **Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfyc.../exec
   ```

### Step 4: Connect to Your Website

In `script.js`, replace the placeholder URL on line 13:

```js
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfyc.../exec';
```

### Testing

1. Open `index.html` in a browser.
2. Fill out the RSVP form and submit.
3. Check your Google Sheet — a new row should appear with the submission data.

---

## Deployment

This is a static site (HTML + CSS + JS) — deploy anywhere:

### GitHub Pages
1. Push files to a GitHub repository.
2. Go to **Settings > Pages**.
3. Set source to your branch (e.g., `main`) and folder (`/ root`).
4. Your site will be live at `https://username.github.io/repo-name/`.

### Netlify
1. Go to [netlify.com](https://netlify.com) and sign up.
2. Drag and drop the project folder onto the Netlify dashboard.
3. Done — you'll get a live URL immediately.

### Any Web Host
Upload `index.html`, `style.css`, and `script.js` to any web server or hosting provider.

---

## Project Structure

```
wedding-site/
├── index.html    — Main webpage (all sections)
├── style.css     — Mobile-first responsive styles
├── script.js     — Countdown, form handling, animations
└── README.md     — This file
```

## Adding a Hero Image

To add a background photo to the hero section, place your image in the project folder and add this to `style.css` inside the `.hero` rule:

```css
.hero {
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
              url('your-photo.jpg') center/cover no-repeat;
}
```

You may also want to change `.hero-title .name` and other hero text colors to `#ffffff` for contrast.
