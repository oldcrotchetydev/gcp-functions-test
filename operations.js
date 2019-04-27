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
    const all = await articleStore.getAll();
    return { success: true, document: all };
  } else {
    // get a specific article
    const document = await articleStore.get(data.id);
    return { success: true, document: document };
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

  const article = new Article(data.title, data.author, data.body);
  const document = await articleStore.save(article);
  return { success: true, id: document.id };
}

function generateError(message) {
  return { success: false, error: message };
}
