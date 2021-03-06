import React, { Component } from 'react';

export default class Friend extends Component {

	checkOnline = (id) => {
		let online = false;
		for(let i = 0; i<this.props.states.length; i++) {
			if(id === this.props.states[i].userId) {
				online = true;
				break;
			}
		}
		return online;
	}

	openChat = () => {
		const image = this.props.image === undefined ? null : this.props.image;
		this.props.openChat(this.props.name, image, this.props.id);
		if(this.props.unread.indexOf(this.props.id) !== -1) {
      Meteor.call('user.removeNew', this.props.id, (err, res) => {
        if(err) console.log(err);
      });
    }
	}

	call = () => {
		if(this.props.canMakeCalls && this.props.inCall === false) {
			this.props.call(this.props.id, this.props.image);
		}
	}

  render = () => {
  	const online = this.checkOnline(this.props.id);
    return (
    	<div 
    		className="contact"
    		style={{
    			background: this.props.hasUnread ? '#fff' : 'transparent'
    		}}>
				<div>
					<img src={this.props.image === null ? 'userpl.svg' : this.props.image} alt="friend" />
					<h3>{this.props.name}</h3>
					<div
						className="online"
						style={{
							background: online ? "#51C68C" : "#A8AEB1"
						}}></div>
				</div>
				<div className="call-message">
					<div>
						<button onClick={this.openChat}></button>
						<button
							style={{
								opacity: online && this.props.canMakeCalls && this.props.inCall === false ? 1 : 0.25
							}} 
							onClick={this.call}></button>
					</div>
				</div>
			</div>
    );
  }
}
