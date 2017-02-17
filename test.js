/*
 * Node dependancies: jquery, jsdom, connect, serve-static, fs, http
 *
 * Chrome things: always allow camera, always clear downloads extension.

 * Easy requirements: disable tab, alt
 */

/*
 * Window simulation, required for jQuery to run properly.
 */
var jsdom = require('jsdom').jsdom
var doc = jsdom()
var window = doc.defaultView
var $ = require('jquery')(window)

/*
 * Static webpage connections on localhost:8080
 */
var connect = require('connect')
var serveStatic = require('serve-static')
connect().use(serveStatic(__dirname)).listen(8080,function(){
    console.log('server on 8080')
})

var fileSys = require('fs')

function saveJSON (data) {
    /*
     * Takes a user as a js object and saves it asynchronously to a local file.
     */

    fileSys.writeFile("./users.json", JSON.stringify(data), function(error) {
        
        if (error) 
            return console.log(error)
        else 
            console.log("The file was saved")
        
    })

}

/*
 * Init: load the previously modified users list.
 */
var oldJSON = require('./users.json')
console.log(oldJSON)
var numUsers = oldJSON.numUsers

/*
 * Create the HTTP request server.
 *
 * For now, all it does is take POST requests to update the entries, since we 
 * probably won't have to send data.
 */
http = require('http')
server = http.createServer( function(req,res) {
    
    // Set CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method == 'GET') {
        /*
         * Return the current id.
         */
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('X-Powered-By', 'bacon')
        res.write(numUsers.toString())
        res.end()
    }

    if (req.method == 'POST') {
        /*
         * Grab all of the request data as a json string
         */
        var body = '';
        req.on('data', function(data) {
            body += data
        })

        req.on('end', function(data) {
            /*
             * Data loading complete, create the object
             */
            
            var newUser = JSON.parse(body)
            
            // Mark the user id, just in case.
            newUser.id = numUsers

            // Add the new user to the user list
            oldJSON.users.push(newUser) 
            numUsers++
            oldJSON.numUsers++

            // [DEBUG]
            console.log(oldJSON)

            // Save the user list to a file.
            saveJSON(oldJSON)

        })

    }

})

// Open the HTTP request connection.
server.listen(3000,'127.0.0.1')
