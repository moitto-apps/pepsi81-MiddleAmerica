function show_author() {
    owner.action("script", {
        "script":"show_user",
        "username":$data["author"]
    });
}
