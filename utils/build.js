import fs from "fs-extra";
import path from "path";
import jsdom from "jsdom";
import pretty from "pretty";
import { getData } from "./getData.js";
import { fileURLToPath } from "url";
import markdownit from "markdown-it";

const md = markdownit({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function build() {
  console.log("\nStarting Build");
  let dt, repos, cfg;

  try {
    cfg = await fs.readJson(path.join(__dirname, "..", "config.json"), {
      throws: false,
    });
  } catch (err) {
    console.error(err);
  }

  try {
    [dt, repos] = await getData();
  } catch (err) {
    console.error("Error: " + err.message);
    process.exit(1);
  }
  console.log("✔️ Fetched data from Github");

  await fs
    .copy("./resource", "./dist")
    .then(() => {
      console.log("✔️ Copied files");
    })
    .catch((err) => {
      console.log("⚠️ Failed!");
      console.error("Error: " + err.message);
      process.exit(1);
    });

  jsdom.JSDOM.fromFile(path.join(__dirname, "..", "resource", "index.html"), {
    resources: "usable",
  })
    .then((dom) => {
      let window = dom.window,
        document = window.document;

      document.title = dt.user.name ? dt.user.name : cfg.username;

      const avatarPath = `assets/images/avatar.webp`;
      document.head.innerHTML += `
        <link rel="icon" href="${avatarPath}">
        <meta name="description" content="${dt.user.name}\'s portfolio website showcasing GitHub projects.">
      `;

      let e;

      e = document.getElementById("nav-block");
      console.log(`❗ Adding [${cfg.navLinks.length}] Nav Links`);
      for (let i = 0; i < cfg.navLinks.length; i++) {
        var link = cfg.navLinks[i].link;
        if (!/^https?:\/\//i.test(link)) {
          link = "https://" + link;
        }
        e.innerHTML += `
          <span id="${cfg.navLinks[i].name}">
            <a href="${link}">
              ${cfg.navLinks[i].name}
            </a>
          </span>
        `;
      }

      e = document.getElementById("name-block");
      e.innerHTML = dt.user.name ? dt.user.name : dt.user.login;
      e = document.getElementById("pf-img-container");
      e.innerHTML = `
        <img
            id="pf-img-source"
            src="${avatarPath}"
            alt="Profile Avatar"
          />
        <img
            id="pf-img-shadow"
            src="${avatarPath}"
            alt=""
          />
      `;

      if (dt.user.bioHTML) {
        e = document.getElementById("pf-info-bio");
        e.innerHTML = `${dt.user.bioHTML}`;
      }

      e = document.getElementById("pf-info-links");
      e.innerHTML = `
        <div id="pf-info-github">
          <svg class="pf-info-icon icon-f">
            <use xlink:href="assets/svg/svg-defs.svg#github" />
          </svg>
          <a target="_blank" href=${dt.user.url}>
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
            <a target="_blank" href="${cfg.linkedinURL}">
              <span>${dt.user.name}</span>
            </a>
          </div>
        `;
      } else {
        console.log("❗ Skipping LinkedIn details");
      }

      if (cfg.twitterId) {
        e.innerHTML += `
          <div id="pf-info-twitter">
            <svg class="pf-info-icon icon-f">
              <use xlink:href="assets/svg/svg-defs.svg#twitter" />
            </svg>
            <a target="_blank" href="https://twitter.com/${cfg.twitterId}">
              <span>${cfg.twitterId}</span>
            </a>
          </div>
        `;
      } else if (dt.user.twitterUsername) {
        e.innerHTML += `
        <div id="pf-info-twitter">
          <svg class="pf-info-icon icon-f">
            <use xlink:href="assets/svg/svg-defs.svg#twitter" />
          </svg>
          <a target="_blank" href="https://twitter.com/${dt.user.twitterUsername}">
            <span>${dt.user.twitterUsername}</span>
          </a>
        </div>
      `;
      } else {
        console.log("❗ Skipping Twitter details");
      }

      if (cfg.gitlabId) {
        e.innerHTML += `
          <div id="pf-info-gitlab">
            <svg class="pf-info-icon icon-f">
              <use xlink:href="assets/svg/svg-defs.svg#gitlab" />
            </svg>
            <a target="_blank" href="https://gitlab.com/${cfg.gitlabId}">
              <span>${cfg.gitlabId}</span>
            </a>
          </div>
        `;
      } else {
        console.log("❗ Skipping GitLab details");
      }

      console.log(`❗ Adding [${cfg.infoLinks.length}] Info Links`);
      if (dt.user.websiteUrl) {
        cfg.infoLinks.unshift({
          name: dt.user.websiteUrl.replace(/^https?:\/\//, ""),
          link: dt.user.websiteUrl,
        });
      }
      for (let i = 0; i < cfg.infoLinks.length; i++) {
        var link = cfg.infoLinks[i].link;
        if (!/^https?:\/\//i.test(link)) {
          link = "https://" + link;
        }
        e.innerHTML += `
          <div>
            <svg class="pf-info-icon icon-f">
              <use xlink:href="assets/svg/svg-defs.svg#link" />
            </svg>
            <a href="${link}">
              <span>${cfg.infoLinks[i].name}</span>
            </a>
          </div>
        `;
      }

      if (cfg.profileREADME == "enabled" && dt.user.repository != null) {
        e = document.getElementById("repo-block");

        readmeDiv = document.createElement("div");
        readmeDiv.setAttribute("id", "readme");

        let mdProfileREADME = md.render(dt.user.repository.object.text);
        // Append '?raw=true' to images hosted on GitHub
        mdProfileREADME = mdProfileREADME.replace(
          /\b(https:\/\/github\.com\/\S+(?:png|jpe?g|gif))\b/gim,
          "$&" + "?raw=true"
        );

        readmeDiv.innerHTML = `
          ${mdProfileREADME}
        `;

        e.prepend(readmeDiv);
      }

      e = document.getElementById("repo-grid");

      for (let i = 0; i < repos.length; i++) {
        e.innerHTML += `
          <div class="grid-item">
            ${
              repos[i].primaryLanguage
                ? `<div class="repo-lang"><span>${repos[i].primaryLanguage.name}</span></div>`
                : ""
            }
            <div class="repo-about">
              <a href="${repos[i].url}">
                <span class="repo-title">
                  ${
                    repos[i].isFork
                      ? `<svg class="icon-fork"><use xlink:href="assets/svg/svg-defs.svg#fork"></use></svg>`
                      : ""
                  }
                  ${repos[i].name}
                </span>
                <span class="repo-desc">
                ${
                  cfg.socialPreviewImage == "enabled" &&
                  repos[i].usesCustomOpenGraphImage == true
                    ? `<img class="repo-socialprev-img"
                        src="assets/images/${repos[i].name}.webp"
                        alt="${repos[i].name} social preview image"
                        width="320" height="160">`
                    : ""
                }
                ${repos[i].description ? repos[i].description : ""}
                </span>
              </a>
            </div>
            <div class="repo-stats">
              <svg class="icon-star">
                <use xlink:href="assets/svg/svg-defs.svg#star" />
              </svg>
              <span>${repos[i].stargazers.totalCount}</span>
              <svg class="icon-fork">
                <use xlink:href="assets/svg/svg-defs.svg#fork" />
              </svg>
              <span>${repos[i].forkCount}</span>
            </div>
          </div>
        `;
      }
      console.log("✔️ Built website");

      let prettyHTML = pretty(
        "<!DOCTYPE html>" + document.documentElement.outerHTML,
        { ocd: true }
      );

      fs.outputFile("./dist/index.html", prettyHTML)
        .then(() => {
          console.log("✔️ Saved to ./dist");
          console.log("🎉 Success!");
        })
        .catch((err) => {
          console.log("⚠️ Failed!");
          console.error("Error: " + err.message);
        });
    })
    .catch((err) => {
      console.log("⚠️ Failed!");
      console.error("Error: " + err.message);
    });

  return;
}
