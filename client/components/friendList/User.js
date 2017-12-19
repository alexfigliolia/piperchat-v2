import React, { Component } from 'react';

export default class User extends Component {

	sendRequest = (e) => {
  	Meteor.call('user.sendRequest', this.props.id, (error, result) => {
  		if(error) console.log(error);
  	});
  }

  render = () => {
    return (
      <div 
    		className="user">
				<div>
					<img src={this.props.image === null ? 'userpl.svg' : this.props.image} alt="friend" />
					<h3>{this.props.name}</h3>
					<div className="add-new">
						<button onClick={this.sendRequest}></button>
					</div>
				</div>
			</div>
    );
  }
}
