var steemjs = require("steemjs");

var __recent_permlink = storage.value("RECENT_PERMLINK");

function on_loaded() {
    var username = $data["author"];
    var title_filter = [ 
        new RegExp($data["title-pattern"]), parseInt($data["title-pattern-group"]) 
    ];

    __get_discussions_by_blog(username, title_filter, null, null, 1, [], function(discussions) {
        if (__recent_permlink !== discussions[0]["permlink"]) {
            __recent_permlink = discussions[0]["permlink"];

            __show_new_label();
        }
    });
}

function on_resume() {
    var username = $data["author"];
    var title_filter = [ 
        new RegExp($data["title-pattern"]), parseInt($data["title-pattern-group"]) 
    ];

    if (__recent_permlink === storage.value("RECENT_PERMLINK")) {
        __hide_new_label();
    }

    __get_discussions_by_blog(username, title_filter, null, null, 1, [], function(discussions) {
        if (__recent_permlink !== discussions[0]["permlink"]) {
            __recent_permlink = discussions[0]["permlink"];

            __show_new_label();
        }
    });
}

function __show_new_label() {
    var label = view.object("label.new");

    label.action("show");
}

function __hide_new_label() {
    var label = view.object("label.new");

    label.action("hide");
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