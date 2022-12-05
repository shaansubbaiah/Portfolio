<div align="center">
    <img src="./artwork/logo.png">
    <br>
    <strong> Automatically generate a beautiful, responsive site to display your GitHub projects. </strong>
    <br>
    Live demo at <a href="https://shaansubbaiah.github.io">shaansubbaiah.github.io</a>
    <br>
    If you find <strong>Portfolio</strong> useful, make sure to 🌟 the repository!
    <br>
    <img src="./artwork/mobile-screenshot.png" width="693" height="789">
    <br>
    <img src="./artwork/desktop-screenshot.png">
</div>

## Features

- Website features
  - Responsive
  - Dark Mode
  - SEO score of 100 on Lighthouse
  - Customizable colors, no. of repos, social, links, etc
  - Supports displaying repository social preview images
  - Display GitHub profile README.md
  - To-do: GitHub Gists support _using iframe embeds_
  - To-do: Blurry/Frosted glass styled repo cards
- Deploy to GitHub pages directly from Portfolio
- Uses ViteJS under the hood fu=or building, live preview on development

## Getting Started

### Install

1. Clone the repo or download the [latest release](https://github.com/shaansubbaiah/Portfolio/releases)

```
git clone git@github.com:shaansubbaiah/Portfolio.git
```

2. Install dependencies

```bash
cd Portfolio

npm install
```

3. Run Portfolio

```bash
node portfolio.js
```

4. Set the Github token, edit the config and then build!

> See [Configuration](#configuration)

> A token can be created at https://github.com/settings/tokens/new

> Make sure you have selected atleast **public_repo**, **read:user** permissions while creating the token!

5. You can deploy the website to your github pages site (generally https://<your_username>.github.io) from Portfolio. OR Manually copy contents in `dist/` to your github pages repository.

6. Done

## Development

Portfolio now uses ViteJS which significantly improves over the previosuly existing development workflow.

The website files are in `src/`

To view the site with hot-reload on changes, run:

```bash
npm run dev
```

If there's data missing, you might have to build the site once so it writes the GitHub data to `./github-data.json`

## Building

Run Portfolio and select the build option.

Under the hood, Portfolio runs `vite build` which reads the config from `vite.config.js` and the build files are at `dist/`

## Configuration

**username**: String - your Github username

**repos**: Integer - number of repositories to display, **MAX 100**

**avatar**: String - path(local/remote) to an image for the avatar and favicon. If not specified, uses your GitHub avatar.

**linkedinURL**: String - your LinkedIn profile link. Set to _null_ in config.json to disable it / press <kbd>enter</kbd> while setting it up.

**twitterId**: String - your Twitter profile id. Set to _null_ in config.json to disable it / press <kbd>enter</kbd> while setting it up. (Portfolio will automatically get your Twitter ID if you have added it to your GitHub profile)

**gitlabId**: String - your GitLab profile id. Set to _null_ in config.json to disable it / press <kbd>enter</kbd> while setting it up.

**navLinks**: Object Array - adds navigation links at the top. **DON'T EXCEED 3**

    where,
    name: String - Text to display
    link: String - URL the text links to

**infoLinks**: Object Array - adds additional links in the information section.

    where,
    name: String - Text to display
    link: String - URL the text links to

**socialPreviewImage**: String - displays repo's social preview image in the card. To enable, set value = "enabled".

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
[![](https://sourcerer.io/fame/shaansubbaiah/shaansubbaiah/Portfolio/images/0)](https://sourcerer.io/fame/shaansubbaiah/shaansubbaiah/Portfolio/links/0)[![](https://sourcerer.io/fame/shaansubbaiah/shaansubbaiah/Portfolio/images/1)](https://sourcerer.io/fame/shaansubbaiah/shaansubbaiah/Portfolio/links/1)[![](https://sourcerer.io/fame/shaansubbaiah/shaansubbaiah/Portfolio/images/2)](https://sourcerer.io/fame/shaansubbaiah/shaansubbaiah/Portfolio/links/2)[![](https://sourcerer.io/fame/shaansubbaiah/shaansubbaiah/Portfolio/images/3)](https://sourcerer.io/fame/shaansubbaiah/shaansubbaiah/Portfolio/links/3)[![](https://sourcerer.io/fame/shaansubbaiah/shaansubbaiah/Portfolio/images/4)](https://sourcerer.io/fame/shaansubbaiah/shaansubbaiah/Portfolio/links/4)[![](https://sourcerer.io/fame/shaansubbaiah/shaansubbaiah/Portfolio/images/5)](https://sourcerer.io/fame/shaansubbaiah/shaansubbaiah/Portfolio/links/5)[![](https://sourcerer.io/fame/shaansubbaiah/shaansubbaiah/Portfolio/images/6)](https://sourcerer.io/fame/shaansubbaiah/shaansubbaiah/Portfolio/links/6)[![](https://sourcerer.io/fame/shaansubbaiah/shaansubbaiah/Portfolio/images/7)](https://sourcerer.io/fame/shaansubbaiah/shaansubbaiah/Portfolio/links/7)

## Related

[Gitfolio](https://github.com/imfunniee/gitfolio)

[Dev Portfolio](https://github.com/RyanFitzgerald/devportfolio)

## License

[MIT](LICENSE) Copyright (c) 2022 Shaan Subbaiah
