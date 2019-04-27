require('dotenv').config()
const Article = require('../model/article');
const Firestore = require('@google-cloud/firestore');
const PROJECTID = process.env.PROJECTID;
const COLLECTION_NAME = process.env.COLLECTION_NAME;
const firestore = new Firestore({
  projectId: PROJECTID
});

module.exports.getAll = async function() {
  console.log('getAll: retrieving all documents');
  let all = [];
  await firestore.collection(COLLECTION_NAME).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        article = new Article(data.title, data.author, data.body);
        article.id = doc.id;
        all.push(article);
      });
    });
  console.log(`getAll: retrieved ${all.length} document(s)`);
  return all;
};

module.exports.delete = async function(id) {
  console.log('delete: retrieving document');
  const document = await firestore.collection(COLLECTION_NAME).doc(id);
  if (! await documentExists(document)) {
    throw `delete: document not found: ${id}`
  }
  await document.delete();
  console.log(`delete: document deleted: ${id}`);
};

module.exports.get = async function(id) {
  console.log('get: retrieving document');
  let article = null;
  const document = await firestore.collection(COLLECTION_NAME).doc(id).get()
    .then(snapshot => {
      data = snapshot.data();
      if (! data) {
        throw `cannot find document: ${id}`;
      } else {
        article = new Article(data.title, data.author, data.body);
        article.id = id;
      }
    });
  console.log(`get: retrieved document: ${JSON.stringify(article)}`);
  return article;
};

module.exports.save = async function(article) {
  console.log('save: starting function');
  const data = article.toJSON();
  const document = await firestore.collection(COLLECTION_NAME).add(data);
  article.id = document.id;
  console.log('save: added document[' + article.id + ']: ' + JSON.stringify(article));
  return document;
}

async function documentExists(document) {
  let exists = true;
  await document.get().then(snapshot => {
    if (! snapshot.exists) {
      exists = false;
    }
  });
  return exists;
}