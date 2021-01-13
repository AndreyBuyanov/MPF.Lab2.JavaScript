const fs = require('fs');
const urls = require('../models/urls');

const sessionFile = '/tmp/admin.lock';

function adminController() {
    this.urlsModel = new urls();
    this.actionIndex = async function(request, response) {
        if (this.isAdminLogged()){
            const urlsList = await this.urlsModel.getUrlsList();
            response.render("admin.hbs", {
                urlsList: urlsList
            });
        } else {
            response.redirect('/admin/login');
        }
    };
    this.actionAddUrl = async function(request, response) {
        if (this.isAdminLogged()){
            const url = request.body.url;
            if (url) {
                await this.urlsModel.addUrl(url);
            }
            response.redirect('/admin');
        } else {
            response.redirect('/admin/login');
        }
    }
    this.actionRemoveUrl = async function(request, response) {
        if (this.isAdminLogged()){
            await this.urlsModel.removeUrlById(request.params.url_id);
            response.redirect('/admin');
        } else {
            response.redirect('/admin/login');
        }
    }
    this.actionLogin = async function(request, response) {
        if (this.isAdminLogged()){
            response.redirect('/admin');
        } else {
            if (request.body
                && request.body.login == 'admin'
                && request.body.password == 'admin')
            {
                let fileContent;
                try {
                    fileContent = fs.readFileSync(sessionFile, {flag : 'w+'});
                }
                catch {
                    response.sendStatus(500); // Internal server error
                }
                response.redirect('/admin');
            } else {
                response.render("login.hbs");
            }
        }
    }
    this.actionLogout = async function(request, response) {
        try {
            fs.unlinkSync(sessionFile);
        } catch {
            response.sendStatus(500); // Internal server error
        }
        response.redirect('/admin/login');
    }
    this.isAdminLogged = function () {
        try {
            if (fs.existsSync(sessionFile)) {
                return true;
            }
        } catch(e) {}
        return false;
    };
}

module.exports = adminController;