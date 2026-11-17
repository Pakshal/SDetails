# Sadhviji directory — entirely on GitHub

A mobile-friendly static directory with name search, manually maintained names and addresses, and one shared **Suvichar**. Hosting, sign-in, editing, and automatic deployment all use GitHub. There is no external service, OAuth app, backend, password, token, database, or frontend secret.

The site starts with no location entries and a hidden, empty Suvichar. Add your real content through GitHub after setup.

## How admins update the site

Open the public website → **Admin updates** → choose **Edit names & addresses on GitHub** or **Edit Suvichar on GitHub** → sign in to GitHub → edit → **Commit changes**.

Location entries stay in root `data/sadhviji.json`, with only `name` and `address` fields. The shared message stays in `data/suvichar.txt`. Editing examples and instructions appear on the public Admin updates page and in [data/README.md](data/README.md).

Admins edit these data files through GitHub's editor, rather than a custom form. They do not edit application code. GitHub handles login and write access. The Admin updates page is public; it grants no extra permissions. Repository Write access also permits source edits, so invite trusted admins. Ordinary visitors cannot commit directly.

Each commit to `main` triggers validation, tests, and a GitHub Pages deployment. Invalid data stops publishing and leaves the last successful site online. Git history records every change. Pull requests are checked without deploying; a merge to main deploys automatically.

## One-time setup

1. Create a **public** repository in your GitHub account, for example `sadhviji-locations`, with default branch **main**. Public repositories qualify for GitHub Pages on GitHub Free.
2. Upload the contents of this SDetails folder at the repository root. Include `.github/workflows/pages.yml`, `public/`, `scripts/`, `tests/`, `data/`, and `package.json`. Do not upload a containing SDetails folder. The workflow's hidden `.github` directory must be included. There are no secrets to configure.
3. Open repository **Settings → Pages → Build and deployment → Source → GitHub Actions**. Enable Actions under repository settings if your account or organization has disabled them.
4. Open **Actions → Publish directory → Run workflow → main → Run workflow**. If prompted, enable workflows first.
5. Wait for the validate and deploy jobs to succeed. Open the URL from the deployment job or **Settings → Pages**, usually `https://YOUR-USERNAME.github.io/sadhviji-locations/`.
6. Open **Admin updates** and confirm its two edit links point to this repository. The workflow generates these links automatically using the repository name; no configuration edit is required.
7. Under **Settings → Collaborators**, invite each trusted admin's GitHub account with **Write** access. Each person must accept the invitation. They do not need a hosting account or development tools.
8. Test adding, updating, and removing a temporary entry, then publishing a Suvichar. Refresh the public page after each successful deployment.

The workflow assumes the `main` branch. If you intentionally use another publishing branch, change the push and pull_request branch filters and the build step's `GITHUB_REF_NAME` in `.github/workflows/pages.yml`.

## Admin quick guide

### Add or edit a location

1. Open **Admin updates → Edit names & addresses on GitHub**.
2. If the list is empty (`[]`), replace it with:

   ```json
   [
     {
       "name": "Enter the actual Sadhviji name",
       "address": "Enter the actual current address"
     }
   ]
   ```

3. To edit, replace text within the name or address's double quotes. To add another entry, insert another object separated by a comma. See [data/README.md](data/README.md) for a two-entry example.
4. To remove an entry, delete its whole object and adjust the surrounding comma. Keep `[]` when no entries remain.
5. Select **Commit changes…**, add a short description, choose **Commit directly to the main branch**, then confirm.

### Update the Suvichar

1. Open **Admin updates → Edit Suvichar on GitHub**.
2. Replace the file's contents with your shared message. Hindi, Gujarati, and English are supported. Line breaks appear on the page. No special syntax is needed.
3. Commit the change as above. To hide the Suvichar, empty the file and commit; do not delete it.

### Check publishing

The new content appears after GitHub Actions finishes, usually within a few minutes. Use **View deployment status on GitHub** on the Admin updates page. Refresh the directory after success. If another admin changes the file while you edit, copy your pending text, reload the latest file, and reapply your changes.

## Access, review, and recovery

- **Remove access:** repository **Settings → Collaborators**, remove the account. No site redeployment is required to revoke write access.
- **Review before publishing:** require pull requests for `main` using GitHub branch rules. Admins then propose edits; an owner reviews and merges. Only merged edits deploy. The public admin instructions explain this path.
- **Invalid JSON:** open the failed Actions run, expand the validate step, read its error, and correct the data. Keeping quotes, commas, braces, and square brackets intact is essential.
- **Site is unchanged:** ensure the latest workflow succeeded, Pages source is GitHub Actions, and the commit is on main. A data commit alone does not guarantee successful deployment.
- **Restore a prior version:** open the data file on GitHub, select **History**, open the prior version, copy its contents into the current file, and commit. This publishes the restored content without deleting history.
- **Public data:** names, addresses, Suvichar, and edit history are public. Use information intended for publication.

## Free hosting

Use a public GitHub Free repository and standard GitHub-hosted Actions runners. GitHub Pages and public-repository Actions usage are free within applicable service limits. This small static site needs no paid add-on or authentication helper. Pages has a 1 GB published-site limit and a 100 GB/month soft bandwidth limit. Standard Actions and API abuse limits still apply. GitHub may change plan terms.

References: [GitHub Pages eligibility and limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).

## Local checks and preview

Node.js 22+ and Python 3 are sufficient. No npm installation or build dependencies are needed.

```sh
npm test
npm run dev
```

Open `http://localhost:8080`. Preview builds copy and validate root data files into ignored `public/data/`. Editing links appear in deployed builds; to test them locally, build with public repository metadata:

```sh
GITHUB_REPOSITORY=YOUR-USERNAME/sadhviji-locations GITHUB_REF_NAME=main npm run build
python3 -m http.server 8080 --directory public
```

Only `public/` is uploaded to Pages. Always edit root `data/`, not the generated public copy. The workflow automatically generates `public/config.js` using public repository metadata. It contains no credentials.

## Project layout

- `data/sadhviji.json` — canonical location entries.
- `data/suvichar.txt` — shared plain-text Suvichar (empty hides it).
- `public/` — public directory, styles, and GitHub editing instructions.
- `scripts/build.mjs` — data validation and Pages preparation.
- `.github/workflows/pages.yml` — checks and automatic deployment.
- `tests/` — data validation and deployment-artifact tests.
