const Article = require('./model/article');
const articleStore = require('./datastore/articleStore');

module.exports.delete = async function(req) {
  const data = (req.query) || {};

  if (! data.id) {
    throw '"id" is required';
  } else {
    await articleStore.delete(data.id);
    return { success: true };
  }
}

module.exports.get = async function(req) {
  const data = (req.query) || {};

  if (! data.id) {
    // get all articles
    const all = await articleStore.readAll();
    return { success: true, articles: all };
  } else {
    // get a specific article
    const article = await articleStore.read(data.id);
    return { success: true, article: article.toJSON() };
  }
}

module.exports.post = async function(req) {
  // store a new article
  const data = (req.body) || {};

  if (! data.title) {
    return generateError('"title" is required');
  }
  if (! data.body) {
    return generateError('"body" is required');
  }

  const article = new Article({ title: data.title, author: data.author, body: data.body });
  await articleStore.create(article);
  return { success: true, id: article.id };
}

module.exports.put = async function(req) {
  const data = (req.body) || {};

  if (! data.id) {
    return generateError('"id" is required');
  }

  const article = new Article({ id: data.id, title: data.title, author: data.author, body: data.body });
  await articleStore.update(article);
  return { success: true, article: article.toJSON() };
}

function generateError(message) {
  return { success: false, error: message };
}
