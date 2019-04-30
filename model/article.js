module.exports = class Article {
  constructor({ id, title, author, body }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.body = body;
    this.createtime = new Date().getTime();
  }

  toJSON() {
    // don't include the id at all if it hasn't been set
    const document = { title: this.title, author: this.author, body: this.body, createtime: this.createtime };
    if (this.id) {
      document.id = this.id;
    }
    return document;
  }
}