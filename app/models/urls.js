const mariadb = require('mariadb');

function urls() {
    this.pool = mariadb.createPool({
        host: 'mariadb',
        port: '3306',
        user:'root',
        password: 'root',
        database: 'lab2_js'
    });
    this.getUrlsList = async function(){
        let conn = await this.pool.getConnection();
        return await conn.query("SELECT id, url, clicks FROM urls ORDER BY ID DESC");
    }
    this.incrementUrl = async function(url){
        let conn = await this.pool.getConnection();
        await conn.query("UPDATE urls SET clicks = clicks + 1 WHERE url=?", [url]);
        await conn.end();
    }
    this.addUrl = async function(url){
        let conn = await this.pool.getConnection();
        return await conn.query("INSERT INTO urls(url) VALUES (?)", [url]);
        await conn.end();
    }
    this.removeUrlById = async function(id){
        let conn = await this.pool.getConnection();
        return await conn.query("DELETE FROM urls WHERE id=?", [id]);
        await conn.end();
    }
}

module.exports = urls;