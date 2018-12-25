$(document).ready(function() {
    window.subList = {};
    window.shopList = {};
	window.shopItem = {};

	window.ids = {};
	window.error_bar = $("#err-msg-bar");
	window.type_list = $("#type-list");

	makeColumnNames(getShows);
	makeColumnGenres(getShows);
	makeColumnChannels(getShows);

	$("#wrapper").on("click", "div.filled", function() { prepInfo(this); });

	$(".shop-li").click(function() { setName($(this).text()); });

	$("#s-add").click(function() { addShow(); });
    $("#s-update").click(function() { updateShow(); });
    $("#s-delete").click(function() { delShow(); });
    $("#s-genre").click(function() { getShowGenre(); });

    //$("#search").click(function() { bounceInput($("#search").val()); });

});

var prepInfo = function(that) {
    id = ids[$(that).attr('id')];
    shopItem = shopList.find(function(el) {
        return el.id === id;
    });

    $("#name").val(shopItem.name);
    $("#genre").val(shopItem.genre);
    $("#channel").val(shopItem.channel);
}

var bounceInput = function(name) {
    console.log(name);
    var error = $("#err-search-p");
    var message = 'You sure "'+name+'" is an show?'
    if(error.length)
        error.text(message);
    else
        confirm(message)
}

var getShowGenre = function() {
    // variable to send to the URL
    genre = $("#genre").text();

    if (genre.startsWith(""))
        genre = "*";
    $.ajax({
        "method": "GET", //Fill in your method type here (GET, POST, PUT, DELETE)
        "crossDomain": true,
        "url": "http://localhost:8080/api/shows/" + genre, //Choose your URL path
        "success": getGenre,
        "error": function(err) {
            error_bar.text(err);
        }
    });
    shopItem = {};
}

var addShow = function() {
    var name = $("#name").val();
    var genre = $("#genre").val();
    var channel = $("#channel").val();

    //console.log("name: " + name + " price: " + price + " type: " + type + "? " + type.startsWith("Choose a type: "));

    if (name === '' || genre === '' || channel === '') {
        error_bar.text("Name, genre, and channel must be specified");
    } else {
        error_bar.text("");
        //console.log($("#item9").text() === "");
        if ($("#item19").text() === "") {
            $.ajax({
                "method": "POST", //Fill in your method type here (GET, POST, PUT, DELETE)
                "crossDomain": true,
                "url": "http://localhost:8080/api/shows/", //Choose your URL path
                "data": {
					"name": name,
					"genre": genre,
					"channel": channel
                },
                "success": postNew,
                "error": function(err) {
                    error_bar.text(err);
                }
            });
        } else {
            error_bar.text("You can only store up to 20 shows");
        }
    }
    shopItem = {};
}

var updateShow = function() {
	//console.log(shopItem);
    if (!shopItem.id) {
        console.log("Please click on an item to update");
		//console.log("id: " + shopItem.id);
        return;
    }
    var id = shopItem.id;
	//console.log("id: " + shopItem.id);
    var name = $("#name").val();
    var genre = $("#genre").val();
    var channel = $("#channel").val();

    if (name == shopItem.name && genre == shopItem.genre && channel == shopItem.channel) {
        error_bar.text("Please alter the item in some way");
        return;
    } else {
        error_bar.text("");
        //console.log($("#item9").text() === "");
        $.ajax({
            "method": "PUT", //Fill in your method type here (GET, POST, PUT, DELETE)
            "crossDomain": true,
            "url": "http://localhost:8080/api/shows", //Choose your URL path
            "data": {
				"id": id,
				"name": name,
				"genre": genre,
				"channel": channel
			},
            "success": updateOld,
            "error": function(err) {
                error_bar.text(err);
            }
        });
    }
}

var delShow = function() {
    if (!shopItem.name) {
        console.log("Please click on a show's name to delete");
    } else {
        var name = shopItem.name;
        error_bar.text("");
		//console.log(shop);
        //console.log($("#item9").text() === "");
        $.ajax({
            "method": "DELETE", //Fill in your method type here (GET, POST, PUT, DELETE)
            "crossDomain": true,
            "url": "http://localhost:8080/api/shows", //Choose your URL path
            "data": {
				"name": name
			},
            "success": deleteOld,
            "error": function(err) {
                error_bar.text(err);
            }
        });
    }
}

var getShows = function() {
    $(".shop-li").text("");
    $(".filled").removeClass("filled");
    $.ajax({
        "method": "GET",
        "crossDomain": true,
        "url": "http://localhost:8080/api/shows/",
        "success": getAllRes,
        "error": function(err) {
            error_bar.text(err);
        }
    });
    shopItem = {};
}

var getGenre = function(shows) {
    if (typeof shows === "string") { //Here, we're sending a string as our error message
        error_bar.text(shows);
    } else {
        subList = shows;
        //type_list.text(JSON.stringify(subList, undefined, 2));
        error_bar.text("");
    }
}

var postNew = function(message) {
    if (message == "Invalid POST") {
        error_bar.text("Your post was insuccessful, are all the necessary fields filled out?");
    } else {
        getShows();
    }
}

var updateOld = function(message) {
    if (message == "Invalid PUT") {
        error_bar.text("Your put was insuccessful, are all the fields filled out?");
    } else {
        shopItem = {};
        getShows();
    }
}

var deleteOld = function(message) {
    if (message == "Invalid DELETE") {
        error_bar.text("Your delete was insuccessful, did you select an input?");
    } else {
        shopItem = {};
        getShows();
    }
}

var getAllRes = function(shows) {
    if (typeof shows === "string") { //Here, we're sending a string as our error message
        error_bar.text(shows);
    } else {
        shopList = shows;
        //type_list.text(JSON.stringify(shopList, undefined, 2));
        $.each(shows, function(i, el) {
            item = $("#item-name" + i);
            item.text(el.name);
            item.addClass("filled");
            ids["item-name" + i] = el.id;

            item = $("#item-genre" + i);
            item.text(el.genre);
            item.addClass("filled");
            ids["item-genre" + i] = el.id;

            item = $("#item-channel" + i);
            item.text(el.channel);
            item.addClass("filled");
            ids["item-channel" + i] = el.id;
        });
        error_bar.text("");
    }
}

var setName = function(txt) {
    $("#name").val(txt).append("<span class=\"caret\"></span>");
	//console.log(shopItem.name);
    if (txt == "")
        shopItem.name = "";
    else
        shopItem.name = txt;
}

var makeColumnNames = function(callback) {
    list = $("#list-name"); //This grabs the element in the DOM (look in the html file) w/ id='list'
    list.empty();
    for (var i = 0; i < 20; i++) {
        list.append("<div class=\"shop-el\"><div class=\"shop-li\" id=\"item-name" + i + "\"></div></div><div class=\"line\"></div>");
    }

    if (callback) {
        callback();
    }
}

var makeColumnGenres = function(callback) {
    list = $("#list-genre"); //This grabs the element in the DOM (look in the html file) w/ id='list'
    list.empty();
    for (var i = 0; i < 20; i++) {
        list.append("<div class=\"shop-el\"><div class=\"shop-li\" id=\"item-genre" + i + "\"></div></div><div class=\"line\"></div>");
    }

    if (callback) {
        callback();
    }
}

var makeColumnChannels = function(callback) {
    list = $("#list-channel"); //This grabs the element in the DOM (look in the html file) w/ id='list'
    list.empty();
    for (var i = 0; i < 20; i++) {
        list.append("<div class=\"shop-el\"><div class=\"shop-li\" id=\"item-channel" + i + "\"></div></div><div class=\"line\"></div>");
    }

    if (callback) {
        callback();
    }
}