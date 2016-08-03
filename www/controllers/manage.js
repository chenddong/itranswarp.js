'use strict';

// manage.js

var
    _ = require('lodash'),
    fs = require('fs'),
    db = require('../db'),
    api = require('../api'),
    cache = require('../cache'),
    helper = require('../helper'),
    constants = require('../constants'),
    json_schema = require('../json_schema');

var
    User = db.user,
    Article = db.article,
    Category = db.category,
    warp = db.warp;

var
    userApi = require('./userApi'),
    wikiApi = require('./wikiApi'),
    discussApi = require('./discussApi'),
    articleApi = require('./articleApi'),
    webpageApi = require('./webpageApi'),
    settingApi = require('./settingApi'),
    categoryApi = require('./categoryApi'),
    attachmentApi = require('./attachmentApi'),
    navigationApi = require('./navigationApi');

var apisList = [categoryApi, articleApi, webpageApi, wikiApi, discussApi, attachmentApi, navigationApi, userApi, settingApi];

// do management console

var KEY_WEBSITE = constants.cache.WEBSITE;


function getId(request) {
    var id = request.query.id;
    if (id && id.length === 50) {
        return id;
    }
    throw api.notFound('id');
}

function* $getModel(model) {
    if (model === undefined) {
        model = {};
    }
    model.__website__ = yield settingApi.$getWebsiteSettings();
    return model;
}

module.exports = {

    'GET /manage/signin': function* () {
        /**
         * Display authentication.
         */
        this.render('manage/signin.html', yield $getModel());
    },

    'GET /manage/': function* () {
        this.response.redirect('/manage/article/');
    },

    // overview ///////////////////////////////////////////////////////////////

    'GET /manage/overview/(index)?': function* () {
        var page = helper.getPage(this.request);
        this.body = '';
    },

    // article ////////////////////////////////////////////////////////////////

    'GET /manage/article/(article_list)?': function* () {
        this.render('manage/article/article_list.html', yield $getModel({
            pageIndex: helper.getPageNumber(this.request)
        }));
    },

    'GET /manage/article/category_list': function* () {
        this.render('manage/article/category_list.html', yield $getModel({
            pageIndex: helper.getPageNumber(this.request)
        }));
    },

    'GET /manage/article/create_article': function* () {
        this.render('manage/article/article_form.html', yield $getModel({
            form: {
                name: 'Create Article',
                action: '/api/articles',
                redirect: 'article_list'
            }
        }));
    },

    'GET /manage/article/edit_article': function* () {
        var id = getId(this.request);
        this.render('manage/article/article_form.html', yield $getModel({
            id: id,
            form: {
                name: 'Edit Article',
                action: '/api/articles/' + id,
                redirect: 'article_list'
            }
        }));
    },

    'GET /manage/article/create_category': function* () {
        this.render('manage/article/category_form.html', yield $getModel({
            form: {
                name: 'Create Category',
                action: '/api/categories',
                redirect: 'category_list'
            }
        }));
    },

    'GET /manage/article/edit_category': function* () {
        var id = getId(this.request);
        this.render('manage/article/category_form.html', yield $getModel({
            id: id,
            form: {
                name: 'Edit Category',
                action: '/api/categories/' + id,
                redirect: 'category_list'
            }
        }));
    },
    // ask ////////////////////////////////////////////////////////////////

    'GET /manage/ask/(ask_list)?': function* () {
        this.render('manage/ask/ask_list.html', yield $getModel({
            pageIndex: helper.getPageNumber(this.request)
        }));
    },

    'GET /manage/ask/category_list': function* () {
        this.render('manage/ask/category_list.html', yield $getModel({
            pageIndex: helper.getPageNumber(this.request)
        }));
    },

    'GET /manage/ask/create_ask': function* () {
        this.render('manage/ask/ask_form.html', yield $getModel({
            form: {
                name: 'Create ask',
                action: '/api/asks',
                redirect: 'ask_list'
            }
        }));
    },

    'GET /manage/ask/edit_ask': function* () {
        var id = getId(this.request);
        this.render('manage/ask/ask_form.html', yield $getModel({
            id: id,
            form: {
                name: 'Edit ask',
                action: '/api/asks/' + id,
                redirect: 'ask_list'
            }
        }));
    },

    'GET /manage/ask/create_category': function* () {
        this.render('manage/ask/category_form.html', yield $getModel({
            form: {
                name: 'Create Category',
                action: '/api/categories',
                redirect: 'category_list'
            }
        }));
    },

    'GET /manage/ask/edit_category': function* () {
        var id = getId(this.request);
        this.render('manage/ask/category_form.html', yield $getModel({
            id: id,
            form: {
                name: 'Edit Category',
                action: '/api/categories/' + id,
                redirect: 'category_list'
            }
        }));
    },

    // webpage ////////////////////////////////////////////////////////////////

    'GET /manage/webpage/(webpage_list)?': function* () {
        this.render('manage/webpage/webpage_list.html', yield $getModel({}));
    },

    'GET /manage/webpage/create_webpage': function* () {
        this.render('manage/webpage/webpage_form.html', yield $getModel({
            form: {
                name: 'Create Web Page',
                action: '/api/webpages',
                redirect: 'webpage_list'
            },
        }));
    },

    'GET /manage/webpage/edit_webpage': function* () {
        var id = getId(this.request);
        this.render('manage/webpage/webpage_form.html', yield $getModel({
            id: id,
            form: {
                name: 'Edit Web Page',
                action: '/api/webpages/' + id,
                redirect: 'webpage_list'
            },
        }));
    },

    // wiki ///////////////////////////////////////////////////////////////////

    'GET /manage/wiki/(wiki_list)?': function* () {
        this.render('manage/wiki/wiki_list.html', yield $getModel({}));
    },

    'GET /manage/wiki/create_wiki': function* () {
        this.render('manage/wiki/wiki_form.html', yield $getModel({
            form: {
                name: 'Create Wiki',
                action: '/api/wikis',
                redirect: 'wiki_list'
            }
        }));
    },

    'GET /manage/wiki/edit_wiki': function* () {
        var id = getId(this.request);
        this.render('manage/wiki/wiki_form.html', yield $getModel({
            id: id,
            form: {
                name: 'Edit Wiki',
                action: '/api/wikis/' + id,
                redirect: 'wiki_tree?id=' + id
            }
        }));
    },

    'GET /manage/wiki/wiki_tree': function* () {
        var id = getId(this.request);
        this.render('manage/wiki/wiki_tree.html', yield $getModel({
            id: id
        }));
    },

    'GET /manage/wiki/edit_wikipage': function* () {
        var
            id = getId(this.request),
            wp = yield wikiApi.$getWikiPage(id);
        this.render('manage/wiki/wikipage_form.html', yield $getModel({
            id: id,
            form: {
                name: 'Edit Wiki Page',
                action: '/api/wikis/wikipages/' + id,
                redirect: 'wiki_tree?id=' + wp.wiki_id
            }
        }));
    },

    // board //////////////////////////////////////////////////////////////////

    'GET /manage/discuss/(board_list)?': function* () {
        this.render('manage/discuss/board_list.html', yield $getModel({}));
    },

    'GET /manage/discuss/create_board': function* () {
        this.render('manage/discuss/board_form.html', yield $getModel({
            form: {
                name: 'Create Board',
                action: '/api/boards',
                redirect: 'board_list'
            }
        }));
    },

    'GET /manage/discuss/edit_board': function* () {
        var id = getId(this.request);
        this.render('manage/discuss/board_form.html', yield $getModel({
            id: id,
            form: {
                name: 'Edit Board',
                action: '/api/boards/' + id,
                redirect: 'board_list'
            }
        }));
    },

    'GET /manage/discuss/reply_list': function* () {
        this.render('manage/discuss/reply_list.html', yield $getModel({
            pageIndex: helper.getPageNumber(this.request)
        }));
    },

    'GET /manage/discuss/topic_list': function* () {
        this.render('manage/discuss/topic_list.html', yield $getModel({
            pageIndex: helper.getPageNumber(this.request)
        }));
    },

    // attachment /////////////////////////////////////////////////////////////

    'GET /manage/attachment/(attachment_list)?': function* () {
        this.render('manage/attachment/attachment_list.html', yield $getModel({
            pageIndex: helper.getPageNumber(this.request)
        }));
    },

    // user ///////////////////////////////////////////////////////////////////

    'GET /manage/user/(user_list)?': function* () {
        this.render('manage/user/user_list.html', yield $getModel({
            currentTime: Date.now(),
            pageIndex: helper.getPageNumber(this.request)
        }));
    },
    'GET /manage/user/user_create': function* () {
        this.render('manage/user/user_create.html', yield $getModel({
            form: {
                name: 'Create User',
                action: '/api/users',
                redirect: 'user_list'
            }
        }));
    },

    // navigation /////////////////////////////////////////////////////////////

    'GET /manage/navigation/(navigation_list)?': function* () {
        this.render('manage/navigation/navigation_list.html', yield $getModel({}));
    },

    'GET /manage/navigation/create_navigation': function* () {
        this.render('manage/navigation/navigation_form.html', yield $getModel({
            form: {
                name: 'Create Navigation',
                action: '/api/navigations',
                redirect: 'navigation_list'
            }
        }));
    },

    // setting ////////////////////////////////////////////////////////////////

    'GET /manage/setting/': function* () {
        this.response.redirect('/manage/setting/website');
    },

    'GET /manage/setting/:g': function* (g) {
        this.render('manage/setting/setting_form.html', yield $getModel({
            tabs: [
                {
                    key: 'website',
                    name: 'Website'
                },
                {
                    key: 'snippets',
                    name: 'Snippets'
                }
            ],
            group: g,
            form: {
                name: 'Edit Settings',
                action: '/api/settings/' + g,
                redirect: g
            }
        }));
    },
    // cache /////////////////////////////////////////////////////////////////////
    'GET /manage/cache/': function* () {
        this.response.redirect('/manage/cache/clear');
    },
    'GET /manage/cache/:g': function* (g){
        this.render('manage/cache/cache_form.html', yield $getModel({
            tabs: [
                {
                    key: 'clear',
                    name: '清除缓存'
                },
                {
                    key: 'display',
                    name: '查看缓存'
                },
                {
                    key: 'cache',
                    name: '缓存设置'
                }
            ],
            group: g,
            form: {
                name: 'Cache Settings',
                action: '/api/cache/' + g,
                redirect: g
            }
        }));
    }
};
