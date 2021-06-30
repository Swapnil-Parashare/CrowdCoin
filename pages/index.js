// To start next.js, command is :- npm run dev   This is set inside scripts of package.json.

import React, {Component} from "react";
import factory from '../ethereum/factory';                                                         // Here there is instance of our deployed contract. We need it fetch the list of deployed contract.
import "semantic-ui-css/semantic.min.css";
import {Card, Button} from 'semantic-ui-react';
import Layout from '../components/Layout';                                                         // 1]We are going to place our entire component inside this "Layout". Layout is the common thing which we want on our each page.
import {Link} from '../routes';                                                                    // 2]Our component will act as a child for this "Layout" and will sit inside it.
                                                                                                   // Link : It gives us actual navigational functionality 
                                                                                                   // Anchor Tag(<a></a>) : It gives us right click functionality were we can open a link in new tab. 

class  CampaignIndex extends Component {

  
  static async getInitialProps(){                                                                 // When we use 'static' keyword the function/method is not assignmed to the instances of the class, it is assinged to the class itself.
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return {campaigns : campaigns};
  }

  renderCampaigns(){                                                                              // Here we are creating "Card" for our each deployed contract.
                                                                             
    const items = this.props.campaigns.map( (address) => {                                        // We have access to "props.campaigns" due "getinitialProps()" method.
    
      return {                                                                                    // 1] "campaigns" is nothing but an array which holds addresses of deployed contracts.
        header : address,                                                                         // 2] We are taking out each address from it and returning object from it, which contains "header", "description", "fluid" properties.
        description :(                                                                            // 3] "header", "description", "fluid"these properties are expected by "Card" component from "semantic-ui-react"
                                                                                                  // Note : Inside <Link> we are setting the Dynamic Route which will be calculated on the fly for particular campaign on which user have clicked.
           <Link route = {`/campaigns/${address}`}>                                                                       
            <a>View Campaign</a> 
           </Link>
           ),
        fluid : true                                                                              
      };                                                                                          // 4] Now we have array "items" of object(Card) for each deployed contract address.
    });   

    return <Card.Group items = {items} />;
  }

  render() {
    return (              
      <Layout>                                        {/* All the JSX written inside "Layout" will be passed as "props" to the Layout.js */}
        <div>
          <h3>Open Campaigns</h3>
            
            <Link route = "/campaigns/new">        
              <a>
                <Button
                  floated="right"
                  content="Create Campaign"
                  icon="add circle"
                  primary={true}
                />
              </a>
            </Link>
          

          {this.renderCampaigns()}

        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;

/*Process :-
1]Next.js visits "pages" folder and picks up a single JS file.
2]It expects file should have a react component inside it.
3]React component always have a render() method through which some amount of JSX should be written.
4]It not enough only to have a react component.
5]Next.js expect that the component should be "exported" from the file.
*/

/* Gocha :-
1] "componentDidMount()" is the method which gets automatically called when our component renders.
2] Hence we are keeping our data fetching work from the ethereum network inside this method.
3] During server side rendering at our next.js server, the "componentDidMount()" method is not executed.
4] To do data loading at the time of server side rendering we need to put it inside "getinitialProps()" method.

Why "getinitialProps()"?
1] Rendering a component is very computationally expensive process.
2] During server side rendering  "Next.js" wants some initial data to show up to our user without rendering our actual component.
3] The object which is returned by this "getinitialProps()" is provided to our "React-Component" as "Props".

Semantic-UI-React
1] It is a library provided by "React".
2] It makes our styling work very easy.
3] Command :- npm install --save semantic-ui-react
              npm install --save semantic-ui-css
4] Next.js does not support  :- semantic-ui-css
5] Therefore we going to use "link" inside our Main react component as a temporary fix.

*/






