const axios = require("axios");

async function getExternalData(endpoint, params = {}) {
  const baseURL = "https://jsonplaceholder.typicode.com";

  try {
    const response = await axios.get(`${baseURL}/${endpoint}`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching from ${endpoint}: ${error.message}`);
  }
}

async function getUsers(options = {}) {
  const params = {};

  if (options.limit) params._limit = options.limit;
  if (options.page) params._page = options.page;

  return getExternalData("users", params);
}

async function getPosts(options = {}) {
  const params = {};

  if (options.userId) params.userId = options.userId;
  if (options.limit) params._limit = options.limit;
  if (options.page) params._page = options.page;
  if (options.sort) params._sort = options.sort;
  if (options.order) params._order = options.order;

  return getExternalData("posts", params);
}

async function getComments(options = {}) {
  const params = {};

  if (options.postId) params.postId = options.postId;
  if (options.limit) params._limit = options.limit;
  if (options.page) params._page = options.page;

  return getExternalData("comments", params);
}

module.exports = {
  getExternalData,
  getUsers,
  getPosts,
  getComments,
};
