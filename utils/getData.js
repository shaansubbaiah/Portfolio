const axios = require("axios");
const dotenv = require("dotenv");
const fs = require("fs-extra");
const path = require("path");

exports.getData = async () => {
  // Don't eager load because the key might not be set yet.
  dotenv.config();

  let cfg;

  try {
    cfg = await fs.readJson(path.join(__dirname, "config.json"), {
      throws: false,
    });
  } catch (err) {
    console.error(err);
  }

  const dataQuery = `
  {
    user(login: "${cfg.username}") {
      avatarUrl(size: 500)
      bioHTML
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
        }
        pageInfo {
          hasNextPage
          endCursor
          startCursor
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
  return graphdata.data.data;
};
