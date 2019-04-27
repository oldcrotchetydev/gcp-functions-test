module.exports = class Article {
  constructor(title, author, body) {
    this.title = title;
    this.author = author;
    this.body = body;
    this.createtime = new Date().getTime();
  }

  toJSON() {
    const data = { title: this.title, author: this.author, body: this.body, createtime: this.createtime };
    if (this.id) {
      data.id = this.id;
    }
    return data;
  }
}