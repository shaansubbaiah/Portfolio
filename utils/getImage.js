const axios = require('axios');
const fs = require("fs-extra");
const path = require('path');

/**
 * Try to get a buffer for the avatar.
 * @param {String} pathOrUrl
 * @return {Promise<Buffer>}
 */
exports.getImage = function (pathOrUrl) {
  if (pathOrUrl.startsWith('http')) {
    return axios({
      method: 'get',
      url: pathOrUrl,
      responseType: 'arraybuffer',
    }).then((response) => {
      return response.data;
    });
  } else {
    const fullPath = path.resolve(__dirname, pathOrUrl);
    return fs.readFile(fullPath);
  }
}
