var steemjs  = require("steemjs");
var global   = require("global");
var contents = require("contents");
var users    = require("users");
var api      = require("api");

function feed_home(keyword, location, length, sortkey, sortorder, handler) {
    var username = $data["subview.author"];
    var title_filter = [ 
        new RegExp($data["subview.title-pattern"]), parseInt($data["subview.title-pattern-group"]) 
    ];

    __get_discussions_by_blog(username, title_filter, null, null, length, [], function(discussions) {
        var data = [];

        discussions.forEach(function(discussion) {
            var content = contents.create(discussion);
            var datum = {
                "id":"S_HOME_" + content.data["author"] + "_" + content.data["permlink"],
                "author":content.data["author"],
                "permlink":content.data["permlink"],
                "title":content.data["title"], 
                "image-url":content.get_title_image_url("256x512") || "",
                "userpic-url":content.get_userpic_url("small"),
                "userpic-large-url":content.get_userpic_url(),
                "author-reputation":content.get_author_reputation().toFixed(0).toString(),
                "votes-count":content.data["net_votes"].toString(),
                "replies-count":content.data["children"].toString(),
                "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                "payout-done":content.is_payout_done() ? "yes" : "no",
                "payout-declined":content.is_payout_declined() ? "yes" : "no",
                "main-tag":content.data["category"],
                "created-at":content.data["created"]
            };

            data.push(datum);
        });

        storage.value("RECENT_PERMLINK", discussions[0]["permlink"]);
        
        handler(data);
    });
}

function open_discussion(data) {
    api.open_discussion({
        "author":data["author"],
        "permlink":data["permlink"]
    });
}

function show_user(data) {
    api.show_user({
        "username":data["username"]
    });
}

function show_votes(data) {
    api.show_votes({
        "author":data["author"],
        "permlink":data["permlink"]
    });
}

function show_replies(data) {
    api.show_replies({
        "author":data["author"],
        "permlink":data["permlink"]
    });
}

function show_tag(data) {
    api.show_tag({
        "tag":data["tag"]
    });
}

function __get_discussions_by_blog(username, title_filter, start_author, start_permlink, length, discussions, handler) {
    steemjs.get_discussions_by_blog(username, start_author, start_permlink, Math.max(length, 15) + (start_author ? 1 : 0)).then(function(response) {
        if (start_author && response.length > 0) {
            response = response.splice(1);
        }

        response.forEach(function(discussion) {
            if (discussion["author"] === username) {
                var matched = title_filter[0].exec(discussion["title"]);
                
                if (matched && discussions.length < length) {
                    discussions.push(Object.assign(discussion, {
                        "title":matched[title_filter[1]]
                    }));
                }
            }
        });

        if (discussions.length < length && response.length > 0) {
            start_author   = response[response.length - 1]["author"];
            start_permlink = response[response.length - 1]["permlink"];

            __get_discussions_by_blog(username, title_filter, start_author, start_permlink, length, discussions, handler);

            return;
        }

        handler(discussions);
    });
}
