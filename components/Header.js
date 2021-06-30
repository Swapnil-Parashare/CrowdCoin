import React from 'react';
import {Menu} from "semantic-ui-react";
import {Link} from '../routes';                 // Link : It allows us to render "Anchor" tags into our react components and navigate around the application.                  
                                                // Anchor Tag( <a></a> ) is one which one which gives us actual right click functionality on a particular link.
const Header = (props) => {
    return (
      <Menu style={{ marginTop: "10px" }}>
        
        <Link route="/">
          <a className="item"> CrowdCoin </a>
        </Link>

        <Menu.Menu position="right">

          <Link route="/">
            <a className="item"> Campaigns </a>
          </Link>

          <Link route="/campaigns/new">
            <a className="item"> +  </a>
          </Link>

        </Menu.Menu>
      </Menu>
    );
};

export default Header;