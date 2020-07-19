const fs = require("fs-extra");
const cfg = require("./config");
const ora = require("ora");
const jsdom = require("jsdom").JSDOM;
const { getData } = require("./getData");
const options = {
  resources: "usable",
};

async function build() {
  let spinner = ora("Starting").start();
  let dt;

  spinner.text = "Fetching data from Github";
  await getData()
    .then((data) => {
      dt = data;
      spinner.succeed("Fetched data from Github");
    })
    .catch((err) => {
      spinner.warn("Error: " + err.message);
      spinner.warn("Failed!");
      process.exit(1);
    });

  spinner.text = "Copying files";
  await fs
    .copy("./resource", "./dist")
    .then(() => {
      spinner.succeed("Copied files");
    })
    .catch((err) => {
      spinner.warn("Error: " + err.message);
      spinner.warn("Failed!");
      process.exit(1);
    });

  spinner.text = "Building Website";
  jsdom
    .fromFile(`${__dirname}/resource/index.html`, options)
    .then((dom) => {
      let window = dom.window,
        document = window.document;

      document.title = dt.user.name;

      let e;

      e = document.getElementById("nav-block");
      for (let i = 0; i < cfg.navLinks.length; i++) {
        e.innerHTML += `
          <span id="${cfg.navLinks[i].name}">
            <a href="${cfg.navLinks[i].link}">
              ${cfg.navLinks[i].name}
            </a>
          </span>
        `;
      }

      e = document.getElementById("name-block");
      e.innerHTML = dt.user.name;

      e = document.getElementById("pf-img-container");
      e.innerHTML = `
        <img
            id="pf-img-source"
            src="${dt.user.avatarUrl}"
          />
        <img
            id="pf-img-shadow"
            src="${dt.user.avatarUrl}"
          />
      `;

      e = document.getElementById("pf-info-container");
      e.innerHTML = `
        <div id="pf-info-github">
          <svg class="pf-info-icon icon-f">
            <use xlink:href="assets/svg/svg-defs.svg#github" />
          </svg>
          <a href=${dt.user.url}>
            <span>${dt.user.login}</span>
          </a>
        </div>
      `;

      if (dt.user.location) {
        e.innerHTML += `
          <div id="pf-info-location">
            <svg class="pf-info-icon icon-f">
              <use xlink:href="assets/svg/svg-defs.svg#map-pin" />
            </svg>
            <span>${dt.user.location}</span>
          </div>
        `;
      }

      if (dt.user.company) {
        e.innerHTML += `
          <div id="pf-info-company">
            <svg class="pf-info-icon icon-f">
              <use xlink:href="assets/svg/svg-defs.svg#users" />
            </svg>
            <span>${dt.user.company}</span>
          </div>
        `;
      }

      if (cfg.linkedinURL) {
        e.innerHTML += `
          <div id="pf-info-linkedin">
            <svg class="pf-info-icon icon-f">
              <use xlink:href="assets/svg/svg-defs.svg#linkedin" />
            </svg>
            <a href="${cfg.linkedinURL}">
              <span>${dt.user.name}</span>
            </a>
          </div>
        `;
      } else {
        spinner.info("Skipping LinkedIn details");
      }

      if (cfg.twitterId) {
        e.innerHTML += `
          <div id="pf-info-twitter">
            <svg class="pf-info-icon icon-f">
              <use xlink:href="assets/svg/svg-defs.svg#twitter" />
            </svg>
            <a href="https://twitter.com/${cfg.twitterId}">
              <span>${cfg.twitterId}</span>
            </a>
          </div>
        `;
      } else {
        spinner.info("Skipping Twitter details");
      }

      for (let i = 0; i < cfg.infoLinks.length; i++) {
        e.innerHTML += `
          <div>
            <svg class="pf-info-icon icon-f">
              <use xlink:href="assets/svg/svg-defs.svg#link" />
            </svg>
            <a href="${cfg.infoLinks[i].link}">
              <span>${cfg.infoLinks[i].name}</span>
            </a>
          </div>
        `;
      }

      e = document.getElementById("repo-grid");
      let langdiv;
      for (i = 0; i < dt.user.repositories.nodes.length; i++) {
        if (dt.user.repositories.nodes[i].primaryLanguage) {
          langdiv = `
            <div class="repo-lang">
              <span>${dt.user.repositories.nodes[i].primaryLanguage.name}</span>
            </div>
          `;
        } else {
          langdiv = `
            <div class="repo-lang" style="display: none">
              <span>?</span>
            </div>
          `;
        }

        e.innerHTML += `
          <div class="grid-item">
            ${langdiv}
            <div class="repo-about">
              <span class="repo-title">${
                dt.user.repositories.nodes[i].name
              }</span>
              <br />
              <span class="repo-desc">${
                dt.user.repositories.nodes[i].description
                  ? dt.user.repositories.nodes[i].description
                  : ""
              }</span>
            </div>
            <div class="repo-stats">
              <svg class="icon-star">
                <use xlink:href="assets/svg/svg-defs.svg#star" />
              </svg>
              <span>${
                dt.user.repositories.nodes[i].stargazers.totalCount
              }</span>
              <svg class="icon-fork">
                <use xlink:href="assets/svg/svg-defs.svg#fork" />
              </svg>
              <span>${dt.user.repositories.nodes[i].forkCount}</span>
            </div>
          </div>

          `;
      }
      spinner.succeed("Built website");

      spinner.text = "Saving to ./dist";
      fs.writeFile(
        "./dist/index.html",
        "<!DOCTYPE html>" + document.documentElement.outerHTML,
        function (err) {
          if (err) throw err;
        }
      );
      spinner.succeed("Saved to ./dist");
      spinner.stopAndPersist({ symbol: "🎉", text: "Success!" });
    })
    .catch((err) => {
      spinner.warn("Failed!");
      console.log(err);
    });
}

build();
