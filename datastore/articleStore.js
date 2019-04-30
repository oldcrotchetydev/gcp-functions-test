require('dotenv').config()
const Article = require('../model/article');
const Firestore = require('@google-cloud/firestore');
const PROJECTID = process.env.PROJECTID;
const COLLECTION_NAME = process.env.COLLECTION_NAME;
const firestore = new Firestore({
  projectId: PROJECTID
});

module.exports.create = async function(article) {
  console.log('create: creating new document');
  const data = article.toJSON();
  const document = await firestore.collection(COLLECTION_NAME).add(data);
  article.id = document.id;
  console.log('create: added document[' + article.id + ']: ' + JSON.stringify(article));
  return article;
}

module.exports.read = async function(id) {
  console.log('read: retrieving document');
  let article = null;
  const document = await firestore.collection(COLLECTION_NAME).doc(id).get()
    .then(snapshot => {
      data = snapshot.data();
      if (! data) {
        throw `cannot find document: ${snapshot.id}`;
      } else {
        article = new Article({ id: snapshot.id, title: data.title, author: data.author, body: data.body });
      }
    });
  console.log(`read: retrieved document: ${JSON.stringify(article)}`);
  return article;
};

module.exports.readAll = async function() {
  console.log('readAll: retrieving all documents');
  let all = [];
  await firestore.collection(COLLECTION_NAME).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        article = new Article({ id: doc.id, title: data.title, author: data.author, body: data.body });
        all.push(article);
      });
    });
  console.log(`readAll: retrieved ${all.length} document(s)`);
  return all;
};

module.exports.update = async function(article) {
  console.log('update: starting function');
  if (! article.id) {
    throw '"id" is required';
  }
  const data = article.toJSON();
  // the id shouldn't be included in the update
  if (data.id) {
    delete data.id;
  }
  const document = await firestore.collection(COLLECTION_NAME).doc(article.id).update(data);
  console.log('save: added document[' + document.id + ']: ' + JSON.stringify(document));
  return document;
}

module.exports.delete = async function(id) {
  console.log('delete: deleting document');
  const document = await firestore.collection(COLLECTION_NAME).doc(id);
  if (! await documentExists(document)) {
    throw `delete: document not found: ${id}`
  }
  await document.delete();
  console.log(`delete: document deleted: ${id}`);
};

async function documentExists(document) {
  let exists = true;
  await document.get().then(snapshot => {
    if (! snapshot.exists) {
      exists = false;
    }
  });
  return exists;
}