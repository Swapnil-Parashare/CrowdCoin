/* Note : 1]This file is needed to set up routes of particular pages.
          2]This pages have 'custom token' in their url.
          3]Custom token means ---> Address of a particular 'deployed campaign' is present in the "url".
          4]It is also called as Dynamic Routing.
*/

const routes = require('next-routes')();

routes
       .add('/campaigns/new', '/campaigns/new')                               // This is default Next.js routing, but our 2nd route was over writting this. Hence we need to specify it seprately.
       .add('/campaigns/:address', '/campaigns/show' )                        //":" is used for "Route Parametre", revise ExpressJs : final > 05 topic.
       .add('/campaigns/:address/requests','/campaigns/requests/index')
       .add('/campaigns/:address/requests/new','/campaigns/requests/new');     


module.exports = routes;

/*
Note : 1] The "routes" objects which we are exporting contains different helpers.
       2] This 'helpers' allows us to automatically navigate users around our application.
       3] It also helps us to generate "link tags" to display inside "React Component"
*/