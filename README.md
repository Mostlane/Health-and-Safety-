# Construction Phase H&S Plan Builder

A one-page tool for **Mostlane Construction Ltd** that turns the standard
Construction Phase Health & Safety Plan into a fill-in-the-blanks form.
Answer the questions, and a finished plan is produced on screen ready to
**Save / Print as PDF** — no software to install.

## How to use it

### Option A — open the file directly
1. Download `index.html` (or open it from this repo).
2. Double-click it — it opens in any web browser (PC, Mac, phone, tablet).
3. Fill in the fields on the left. The document on the right updates as you type.
4. Click **Save / Print PDF** and choose *Save as PDF*.

### Option B — host it as a live link (recommended)
Turn on **GitHub Pages** so you always have an up-to-date link you can
bookmark on your phone:

1. In this repo go to **Settings → Pages**.
2. Under *Build and deployment → Source*, choose **Deploy from a branch**.
3. Branch: pick the default branch, folder `/ (root)`, then **Save**.
4. After a minute the page is live at
   `https://mostlane.github.io/health-and-safety-/`.

## Buttons

| Button | What it does |
|--------|--------------|
| **Save / Print PDF** | Opens the print dialog — choose *Save as PDF* |
| **Preview PDF** | Opens a clean, full-page preview in a new tab (exactly as it prints) with its own Print button |
| **Start new job** | Clears the job fields (keeps your logo, brand colour and Maps key) |
| **Load example** | Re-loads the Lake Road Surgery example |
| **Backup answers** | Saves your answers to a small `.json` file |
| **Restore answers** | Loads answers back from a saved `.json` file |

Your answers are also remembered automatically in the browser you use, so
you can close the tab and come back later.

## The questions

The form covers every part of the plan that changes between jobs:

1. **Project & issue details** — name, address, project no./ref, scheme
   description, duration, working hours, asbestos likelihood, and the
   issue/revision history (add as many issues as you need).
2. **Mostlane project team** — Project Director, Contracts Manager, Site
   Manager and their phone numbers.
3. **Site-specific arrangements** — welfare, access & egress, structural
   stability, fall prevention, lifting, traffic routes, storage/compound.
4. **Project directory (Appendix A & D)** — client, architect, engineer and
   any other contacts (add/remove rows freely).
5. **Risk assessment summary (Appendix B)** — title, risk level, location,
   activity, equipment, persons affected, dates, etc.
6. **Compound location (Appendix C)**.
7. **Local hospital / A&E (Appendix E)**.

The constant legal/policy wording, control measures and company details stay
fixed — you only edit the per-job items.

## Company branding

The document is styled in the Mostlane brand out of the box: the **Mostlane
blue** (`#1b5a9b`), a branded cover page, running page headers, and the
**Mostlane logo** (a built-in vector recreation of the mark) on the cover and
in every page footer.

The first group on the form is **Company branding**:

- **Brand colour** — sets the colour of headings, table headers and accents
  (defaults to Mostlane blue).
- **Company logo** — the built-in Mostlane mark is used by default. Upload a
  PNG/JPG here to override it with your exact logo file; it's stored in your
  browser and saved inside your backup file.

> The default logo is a vector recreation so the hosted site is branded on any
> device without uploading. For a pixel-perfect original, either upload your
> file in the form, or drop the image into the repo and we can wire it in as
> the permanent default.

## Maps (optional) — compound plan & nearest A&E

These features use Google Maps and only switch on once you paste a
**Google Maps API key** into the *Company branding* group.

**One-time setup of a key:**
1. In [Google Cloud Console](https://console.cloud.google.com/) create a project
   and an **API key**.
2. Enable these APIs: **Maps JavaScript API**, **Places API**, **Geocoding API**,
   **Directions API**, **Maps Static API**.
3. Restrict the key to your site's web address (HTTP referrer) so it can't be
   misused. (The key lives only in your browser — it is *not* stored in this
   repo.)

**Compound location (Appendix C)** — set *Include a compound location section?*
to Yes, then on the map: click **Drop / move pin** to mark the site, and
**Draw compound box** to drag out the compound area. The resulting map image is
added to Appendix C. Set it to **No** to leave Appendix C out entirely.

**Nearest A&E (Appendix E)** — click **Suggest local A&E**. It finds A&E
departments near the site address, lets you pick one (auto-filling the name and
address), and adds a driving-route map plus distance/time to Appendix E.

> The map images in the PDF are loaded from Google, so you need to be online
> when you save/print the document.

## Changing the questions

All questions live in one place near the top of `index.html`, in the
`GROUPS` list. Each entry looks like:

```js
{ id:"projectName", label:"Project / site name", type:"text", def:"Lake Road Surgery" },
```

- `type` can be `text`, `textarea` (multi-line), `select` (drop-down — add an
  `options:[...]` list), `issues`, or `directory`.
- `def` is the example default value.

Add, remove or rename entries here and the form and document update
themselves. If you add a brand-new field, reference it in the document with
`${esc(v("yourFieldId"))}` inside the relevant `page…()` function further down.
