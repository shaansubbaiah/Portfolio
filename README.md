# portfolio

Live demo at [shaansubbaiah.github.io](https://shaansubbaiah.github.io/)

![artwork](/artwork/portfolio-transparent.png)

## Getting Started

### Install

Fork or Clone the repository

```bash
# Install Node.JS from https://nodejs.org/en/download/
# then in the clones directory run
npm install
```

Edit settings in _config.js_, see [Configuration](#configuration)

Replace _token_ with you Github token

```bash
touch .env && echo GITHUB_TOKEN="token" > .env
```

> See how to create a Github token [HERE](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)

### Build the site

```bash
node build.js
```

**Done!** Copy contents in the _dist_ folder to your github pages repository.
Eg. your-username.github.io

## Configuration

**username**: String - Your Github username

**repos**: Integer - Number of repositories to display, max 100

**linkedinURL**: String - your LinkedIn profile link. Set to _null_ to disable it

**twitterId**: String - your Twitter profile id. Set to _null_ to disable it

**gitlabId**: String - your GitLab profile id. Set to _null_ to disable it

**navLinks**: Object Array - adds navigation links at the top. **don't exceed 3**
    
    where,
    name: String - Text to display
    link: String - URL the text links to

**infoLinks**: Object Array - adds additional links in the information section
    
    where,
    name: String - Text to display
    link: String - URL the text links to

## Related

[Gitfolio](https://github.com/imfunniee/gitfolio)

[Dev Portfolio](https://github.com/RyanFitzgerald/devportfolio)
