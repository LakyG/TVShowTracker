var sqlite = require("sqlite3");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var db = require("./database.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) { // request, response, next
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, cache-control");
    return next();
});

var port = process.env.PORT || 8080; // set our port
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests ------------------------------------------
router.use(function(req, res, next) {
    // do logging
    // console.log("Server in use");ne
    next(); // make sure we go to the xt routes and don't stop here
});

// Session 4 -------------------------------------------------------------------
app.use('/api/portal/source', express.static(__dirname));

// route for the second
router.route("/portal/")
    .get(function(req, res) {
        res.sendFile(__dirname + "/portal.html");
    });

router.route("/shows")
    .get(function(req, res) { // GET requests respond with Hello World
	query = "SELECT * FROM shows;"
	db.all(query, function(err, users) {
		if (err)
			console.log(err.message);
			res.send(users);
			return;
		});
});

router.route("/put/")
   .get(function(req, res) { // GET requests respond with Hello World
	db.run("INSERT INTO shows(name, genre, channel) VALUES (?,?,?);", ["Gotham", "Action", "Fox"], function(err) {
   if (err) {
       //res.json(err.code);
	   res.send("shows already exists");
   } else {
       console.log("adding show...");
       console.log({ message: "Success" });
	   res.json("Show Added");
   }
   return;
	});
});

router.route("/shows/:name?")

    .get(function(req, res) {
        var name = req.params.name; //"params" lets us use the URL to specify the type


        // Make a SQL query asking for only types that equal ?
        // ? is db.run() and db.all()'s way of making a placeholder
        // Passing in an array after the query gives a list of values to replace the '?' symbols with
        var query = "SELECT * FROM shows WHERE name = ?;"; // get every grocery item where the type is... ?

        var values = [ name ]; // What would we want to replace the '?' symbol above with? (It's not a trick question)

        db.all(query, values, function(err, shows) {
            if (err) {
                console.log(err);
                res.send("Couldn't find the query, name wrong?");
            } else {
                console.log("Got the show list of name '" + name + "'");
                //console.log(groceries);
                res.json(shows);
            }
        });
    })

    .post(function(req, res) {
        var name = req.body.name; //"body" is so that the variable isn't in the URL
        // now get variables 'price' and 'type'
		var genre = req.body.genre;
		var channel = req.body.channel;

        //console.log("name: " + name + " price: " + price + " type: " + type + " id: " + id);

        // This is how you specify a new entry's values -- best to specify the order you're inserting them in, like (name, id, type, price)
        var query = "INSERT INTO shows(name, genre, channel) VALUES (?,?,?);" // Insert a new groceries row item (including its name, price, and type) with the values specified. The '?'s will be replaced by the values

        var values = [ name, genre, channel ]; // List variables to replace the '?' symbols in queryas a comma, separated, list, here, in order

        db.run(query, values, function(err) {
            if (err) {
                console.log(err);
                res.send("Invalid POST");
            } else {
                console.log("Adding show...");
                res.json({ message: "Show Added" });
            }
        });
    })

    .put(function(req, res) {
        var name = req.body.name;
        // now get variables 'price' 'type', and 'id'
		var genre = req.body.genre;
		var channel = req.body.channel;
		var id = req.body.id;

        //console.log("name: " + name + " price: " + price + " type: " + type + " id: " + id);

        var query = "UPDATE shows SET name = ?, genre = ?, channel = ? WHERE id = ?;"; // This is how you update a new entry's values, selecting by its id

        var values = [ name, genre, channel, id ]; // List variables to replace the '?' symbols in query as a comma, separated, list, here, in order

        db.run(query, values, function(err) {
            if (err) {
                console.log(err);
                res.send("Invalid PUT");
            } else {
                console.log("Updating Show...");
                res.json({ "message": "Show updated" });
            }
        });
    })

    .delete(function(req, res) {
        name = req.body.name;

        //console.log("id: " + id);

        var query = "DELETE FROM shows WHERE name = ?"; // Delete the element whose id matches the one we just pulled in from req.body

        var values = [ name ] // List variables to replace the '?' symbols in query as a comma, separated, list, here, in order
		//console.log(values);
        db.run(query, values, function(err) {
            if (err) {
                console.log(err.message);
                res.send("Invalid DELETE");
            } else {
                res.send({ message: "Show deleted" });
                return;
            }
        });
    });

// -----------------------------------------------------------------------------
//add-on to the IP address and port #, for minor security and/or personal flair
app.use("/api", router);

//Tell the application to listen on the port # you specified above
server = app.listen(port);
console.log("Express server listening on port %d in %s mode. ", port, app.settings.env);