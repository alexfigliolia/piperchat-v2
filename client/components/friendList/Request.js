import React, { Component } from 'react';

export default class Request extends Component {

	acceptRequest = (e) => {
  	e.target.classList.add('action-loading');
  	Meteor.call('user.acceptRequest', this.props.id, (error, result) => {
  		if(error) { console.log(error) }
  	});
  }

  denyRequest = (e) => {
  	e.target.classList.add('action-loading');
  	Meteor.call('user.denyRequest', this.props.id, (error, result) => {
  		if(error) { console.log(error) }
  	});
  }

  render = () => {
    return (
      <div 
    		className="user">
				<div>
					<img src={this.props.image === null ? 'userpl.svg' : this.props.image} alt="friend" />
					<h3>{this.props.name}</h3>
					{
						this.props.sent ?
							<div className="add-new">
								<div className="r-pending"></div>
							</div>
						:
							<div className="accept-deny">
								<button 
									className="deny"
									onClick={this.denyRequest}></button>
								<button 
									className="accept"
									onClick={this.acceptRequest}></button>
							</div>
					}
				</div>
			</div>
    );
  }
}