import React from 'react';
import {Container} from 'semantic-ui-react';
import "semantic-ui-css/semantic.min.css";
import Header from './Header';
import Head from 'next/head'

const Layout = (props) => {
    return (
      <Container>                                                     {/* This is for left-right margin on our page */}

        <Head>                                                         {/* Whatever we place here will move to Head tag of our generated Html document. */}
          <link                                                                                                /* Note: This link in not working. The single error in console log is due to this. We are getting css styling due to semantic-ui-react.css which is imported here. */
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@${props.versions.sui}/dist/semantic.min.css"              /* Css style link required for styling of our semantic-ui-react component */
          />
        </Head>

        <Header />                                                    {/* This is the header which we want on our each page */}

        {props.children}                                              {/* "props is nothing but the JSX which a particular component is returning." */}

      </Container>
    );
};

export default Layout;

/*
IMP :-
1] We are going to use this "Layout.js" on our each page.
2] Our each page is like a child to this layout.
3] Our each page will sit inside this layout.
4] The JSX return through the render method of our component is recieved here as "props".
*/