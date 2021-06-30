/* IMP :-
1] Here we are manually setting next.js server.
2] Aim : To tell "Next.js" to use our routing setup from "routes.js". 
*/

const {createServer} = require('http');
const next = require('next');

const app = next({                                     // Creating "app"  
    dev : process.env.NODE_ENV !== 'production'        // If our application is running in 'production mode' then it changes the way "next.js" behaves.
});

const routes = require('./routes');                     // Importing our 'routes.js' file.
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler).listen(3000,(err) => {
        if(err) throw err;
        console.log("Ready on localhost:3000....")
    })
})

/* Process :-

Creating "app" :-

1] Declare and initialize "app" using imported "next".
2] "app.prepare()" returns a promise, handle it using ".then()". It will take a callback() function.
3] In the callback() we have to use "createServer()" which takes "handler" as an argument.
4] "createServer()" is imported from "http" and "handler" is created using ".getRequestHandler()" method on "routes" which we have imported.
5] After creating a server we will use .listen(), here we will specify the "port" and will also handle the error if it occurs.

*/