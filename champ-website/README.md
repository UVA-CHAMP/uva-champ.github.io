# CHAMP website

A responsive, static website for the University of Virginia Center for Human Motion and Performance (CHAMP). It runs on GitHub Pages with no package installation, build system, database, or API keys.

## Preview

Open `index.html` in your browser after extracting the complete folder. Keep the `assets` folder next to it. The separate `CHAMP-preview.html` is a self-contained preview with the same design, content, and images; it can be opened on its own. Use the source files here for deployment and future editing.

## Publish from the CHAMP GitHub repository

1. Copy the **contents** of this folder to the root of the CHAMP repository. `index.html`, `assets/`, and `.github/workflows/pages.yml` should be at the repository root. Include `.nojekyll` and the workflow folder; some file managers hide files that start with a dot.
2. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Commit the files to `main`. The included **Deploy CHAMP to GitHub Pages** workflow will publish the site. Find the resulting website URL under Settings → Pages or in the workflow's deployment summary.

If the default branch is named `master` or something else, change `branches: [main]` in `.github/workflows/pages.yml` to that branch. If you enable Pages after the commit, run the workflow from **Actions → Deploy CHAMP to GitHub Pages → Run workflow**.

The site uses relative asset paths, so it supports `https://OWNER.github.io/REPOSITORY/`, a user/organization Pages site, and custom domains without changing the CSS or JavaScript. The workflow publishes only the website files, leaving documents and research code out of the public website artifact.

An alternative with no Actions workflow is **Deploy from a branch → main → / (root)** in Settings → Pages. The included `.nojekyll` file supports that route. Choose one publishing method.

GitHub's current instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Update members

Edit `assets/js/content.js`. Each member has a name, title, school/unit, local photo path, and university profile link. The first two members are the co-chairs: Stephen Baek and Jay Hertel. The 12-person roster is based on the supplied CHAMP proposal and the requested membership edits.

```js
{
  name: "Member Name",
  title: "Academic or professional title",
  school: "School of Data Science",
  unit: "Data Science",
  image: "assets/images/member-name.jpg",
  profile: "https://your-school.virginia.edu/verified-profile"
},
```

Put new photos in `assets/images/`. Use filenames with lowercase letters and hyphens. The directory supports search by name/title/school and filtering by unit. If a photo fails to load, the card shows the person's initials.

`index.html` includes an initial static copy of the directory so profiles are visible when JavaScript is disabled. JavaScript uses the current roster in `content.js` when enabled. If changing the roster, also update the matching static cards inside `#member-grid` in `index.html` if you want the no-JavaScript directory to stay current.

## Add upcoming events

The `events` array in `assets/js/content.js` is empty until there are confirmed events. The live site shows a dates-forthcoming message. Add an entry using this structure; the date and details below are illustrative and are **not** a scheduled CHAMP event:

```js
events: [
  {
    title: "Your confirmed event title",
    start: "2027-03-18T15:00:00-04:00",
    end: "2027-03-18T16:00:00-04:00",
    location: "Confirmed location or online",
    description: "A short description of the event.",
    url: "https://your-confirmed-event-link",
    linkLabel: "Event details"
  }
]
```

Use ISO date-times with an explicit timezone offset (`-04:00` during Eastern daylight time; `-05:00` during Eastern standard time). The site displays event dates and times in `America/New_York`, orders events by start time, and hides them once their end time has passed. If you omit `end`, the event remains visible for two hours after `start`. `location`, `description`, `url`, and `linkLabel` are optional. Invalid dates are excluded. An event without a URL has no event-details button. Update the static `#events-list` in `index.html` as well if event content needs to be available without JavaScript.

## Update the description, contact details, or design

- Mission, research themes, co-chair contact links, and footer: `index.html`.
- Colors, spacing, typography, mobile layout: `assets/css/styles.css`.
- Member/event rendering, filters, and mobile navigation: `assets/js/main.js`.
- Original conceptual motion illustration and custom CHAMP mark: `assets/images/motion-study.svg` and `favicon.svg`.

The design uses a navy, cream, and orange palette, system fonts, local photos, semantic headings, labelled form controls, visible keyboard focus, a skip link, and reduced-motion support. No external font requests or analytics are included. The hero illustration is conceptual, not a measured motion dataset. The CHAMP mark is a custom design, not an official UVA institutional logo.

## Source and validation notes

See `CONTENT-SOURCES.md` for the roster basis and headshot/profile sources. The public UVA Hub directory confirms CHAMP's Research Hub status. The co-chair roles follow Natalie's current instruction (Stephen Baek and Jay Hertel), which supersedes the older co-chair listing on the central UVA page.

The source was checked for JavaScript syntax, internal anchors, image integrity, required local assets, and Pages workflow structure. Browser/device rendering and a live GitHub deployment were not verified in this development environment. Review the included preview in your browser before publishing.
