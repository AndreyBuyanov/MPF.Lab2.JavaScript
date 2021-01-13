const urls = require('../models/urls');

function siteController() {
    this.urlsModel = new urls();
    this.actionIndex = async function(request, response) {
        const urlsList = await this.urlsModel.getUrlsList();
        response.render("index.hbs", {
            urlsList: urlsList
        });
    }
    this.actionGo = async function(request, response) {
        let buff = Buffer.from(request.params.url, 'base64');
        let url = buff.toString('utf8');
        await this.urlsModel.incrementUrl(url);
        response.redirect(url);
    }
}

module.exports = siteController;