function show_votes() {
    controller.action("script", {
        "script":"show_votes",
        "subview":"V_HOME",
        "routes-to-topmost":"no",
        "author":$data["author"],
        "permlink":$data["permlink"]
    });
}

function show_replies() {
    controller.action("script", {
        "script":"show_replies",
        "subview":"V_HOME",
        "routes-to-topmost":"no",
        "author":$data["author"],
        "permlink":$data["permlink"]
    });
}

function show_tag() {
    controller.action("script", {
        "script":"show_tag",
        "routes-to-topmost":"no",
        "subview":"V_HOME",
        "tag":$data["main-tag"]
    });
}
