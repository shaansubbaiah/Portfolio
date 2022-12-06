import axios from "axios";
import dotenv from "dotenv";
import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import markdownit from "markdown-it";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GITHUB_DATA_EXPORT_PATH = path.join(__dirname, "..", "github-data.json");
const CONFIG_PATH = path.join(__dirname, "..", "config.json");
const IMAGE_EXPORT_PATH = path.join(__dirname, "..", "public", "images");

/**
 * Try to get a buffer for the avatar.
 * @param {String} pathOrUrl
 * @return {Promise<Buffer>}
 */
async function getImage(pathOrUrl) {
  if (pathOrUrl.startsWith("http")) {
    return axios({
      method: "get",
      url: pathOrUrl,
      responseType: "arraybuffer",
    }).then((response) => {
      return response.data;
    });
  } else {
    const fullPath = path.resolve(__dirname, pathOrUrl);
    return fs.readFile(fullPath);
  }
}

function renderREADME(readmeData) {
  const md = markdownit({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  });

  let mdProfileREADME = md.render(readmeData);
  // Append '?raw=true' to images hosted on GitHub
  mdProfileREADME = mdProfileREADME.replace(
    /\b(https:\/\/github\.com\/\S+(?:png|jpe?g|gif))\b/gim,
    "$&" + "?raw=true"
  );

  return mdProfileREADME;
}

function getRepos(x, y) {
  const repos = x.concat(y);
  let uniqueRepos = [repos[0]];
  for (let i = 0; i < repos.length; i++) {
    let repoExists = false;
    for (let j = 0; j < uniqueRepos.length; j++) {
      if (uniqueRepos[j].id == repos[i].id) {
        repoExists = true;
      }
    }
    if (!repoExists) uniqueRepos.push(repos[i]);
  }
  return uniqueRepos;
}

async function downloadImages(data) {
  let cfg;
  try {
    cfg = await fs.readJson(CONFIG_PATH, { throws: false });
  } catch (err) {
    console.error(err);
  }

  await fs.mkdir(IMAGE_EXPORT_PATH, {
    recursive: true,
  });

  try {
    let avatarBuffer = await getImage(cfg.avatar || data.user.avatarUrl);
    await sharp(avatarBuffer).toFile(
      path.join(IMAGE_EXPORT_PATH, "avatar.webp"),
      (err) => {
        if (err) console.log("Error: " + err);
      }
    );
    console.log("---- Downloaded avatar");
  } catch (err) {
    console.log("Failed!");
    console.error("Error: " + err.message);
    process.exit(1);
  }

  // Get social preview image and store it locally
  const repos = data.user.uniqueRepositories;
  for (let i = 0; i < repos.length; i++) {
    if (
      cfg.socialPreviewImage == true &&
      repos[i].usesCustomOpenGraphImage == true
    ) {
      try {
        let imageBuffer = await getImage(repos[i].openGraphImageUrl);
        await sharp(imageBuffer).toFile(
          path.join(IMAGE_EXPORT_PATH, `${repos[i].name}.webp`),
          (err, info) => {
            if (err) console.log("Error: " + err);
          }
        );
      } catch (err) {
        console.error(
          `Error fetching repository ${repos[i].name} social preview image!`
        );
      }
    }
  }
  console.log("---- Downloaded repo social preview images");
}

async function getGithubData() {
  // Don't eager load because the key might not be set yet.
  dotenv.config();

  let cfg;
  try {
    cfg = await fs.readJson(CONFIG_PATH, { throws: false });
  } catch (err) {
    console.error(err);
  }

  const dataQuery = `
  {
    user(login: "${cfg.username}") {
      avatarUrl(size: 500)
      bio
      company
      createdAt
      name
      login
      location
      pinnedItems(
        first: 6, 
        types: REPOSITORY
        ) {
        nodes {
          ... on Repository {
            id
            name
            description
            forkCount
            url
            stargazers {
              totalCount
            }
            primaryLanguage {
              name
            }
            usesCustomOpenGraphImage
            openGraphImageUrl
          }
        }
      }
      repositories(
        privacy: PUBLIC, 
        orderBy: {field: STARGAZERS, direction: DESC}, 
        first: ${parseInt(cfg.repos)}, 
        ownerAffiliations: OWNER
        ) {
        nodes {
          id
          name
          description
          forkCount
          url
          stargazers {
            totalCount
          }
          primaryLanguage {
            name
          }
          isFork
          usesCustomOpenGraphImage
          openGraphImageUrl
        }
        pageInfo {
          hasNextPage
          endCursor
          startCursor
        }
      }
      # Get GitHub profile readme content
      repository(name: "${cfg.username}") {
        object(expression: "master:README.md") {
          ... on Blob {
            text
          }
        }
      }
      websiteUrl
      url
      twitterUsername
      status {
        emojiHTML
        message
      }
    }
  }
  `;

  let graphdata = await axios({
    url: "https://api.github.com/graphql",
    method: "POST",
    data: {
      query: dataQuery,
    },
    headers: {
      Authorization: "Bearer " + process.env.GITHUB_TOKEN,
    },
  }).catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw error.response.data;
      // console.log(error.response.status);
      // console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    // console.log(error.config);
  });

  // Axios returns an object with 'data' parameter
  // Github API returns an object with 'data', 'error'
  const data = graphdata.data.data;

  const repos = getRepos(
    data.user.pinnedItems.nodes,
    data.user.repositories.nodes
  );

  data.user.uniqueRepositories = repos;

  if (cfg.profileREADME && data.user.repository.object.text)
    data.renderedReadme = renderREADME(data.user.repository.object.text);

  return data;
}

export async function getData() {
  console.log("Fetching data from GitHub");
  const data = await getGithubData();

  console.log("Writing data to " + GITHUB_DATA_EXPORT_PATH);
  await fs.writeJson(GITHUB_DATA_EXPORT_PATH, data, {
    spaces: "\t",
  });

  console.log("Downloading images from GitHub");
  await downloadImages(data);

  return data;
}
