import React, { Component } from 'react';
import { Burger } from './Burger.js';

export default class Header extends Component {
  render = () => {
    return (
    	<header className={this.props.classes}>
    		<div>
    			<button 
            onClick={this.props.friends}
            className={this.props.unread.length > 0 || this.props.requests.length > 0 ? "contacts has-new" : "contacts"}>
          </button>
    			<div className="logo"></div>
    			<Burger
    				classes={this.props.burgerStuff} 
            burger={this.props.burger} />
    		</div>
    	</header>
    );
  }
}
