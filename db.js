const Sequelize = require('sequelize')

const db = new Sequelize('mainDB', null, null, {
  dialect: 'sqlite',

  storage: 'sqlite3db.db' 
});

const Url = db.define('url', {
	url: Sequelize.STRING,
	shortUrl: Sequelize.STRING,
})

db.sync();


module.exports = {
	db,
	Url,
}