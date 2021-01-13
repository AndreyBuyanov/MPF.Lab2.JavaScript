const express = require('express');
const hbs = require("hbs");
const bodyParser = require("body-parser");
const siteController = require('./controllers/site');
const adminController = require('./controllers/admin');

const app = express();
const port = 80;

const urlencodedParser = bodyParser.urlencoded({extended: false});

let siteCtl = new siteController();
let adminCtl = new adminController();

hbs.registerHelper('base64Encode', function (data){
    let buff = new Buffer(data);
    return buff.toString('base64');
});

const adminRouter = express.Router();

adminRouter.post('/url/add', urlencodedParser, async(req, res) => {
    await adminCtl.actionAddUrl(req, res);
});
adminRouter.get('/url/remove/:url_id', async(req, res) => {
    await adminCtl.actionRemoveUrl(req, res);
});
adminRouter.get('/login', async(req, res) => {
    await adminCtl.actionLogin(req, res);
});
adminRouter.post('/login', urlencodedParser, async(req, res) => {
    await adminCtl.actionLogin(req, res);
});
adminRouter.get('/logout', async(req, res) => {
    await adminCtl.actionLogout(req, res);
});
adminRouter.get('/index', async(req, res) => {
    await adminCtl.actionIndex(req, res);
});
adminRouter.get('/', async(req, res) => {
    await adminCtl.actionIndex(req, res);
});

app.use('/admin', adminRouter);
app.get('/go/:url', async(req, res) => {
    await siteCtl.actionGo(req, res);
});
app.get('/index', async(req, res) => {
    await siteCtl.actionIndex(req, res);
});
app.get('/', async(req, res) => {
    await siteCtl.actionIndex(req, res);
});

app.set("view engine", "hbs");

(async () => {
    try {
        app.listen(port, () => {});
    }
    catch (e) {
        console.log(e);
        app.close();
    }
})();