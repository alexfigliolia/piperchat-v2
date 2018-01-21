import React, { Component } from 'react';
import Friend from './Friend';
import User from './User';
import Request from './Request';

export default class List extends Component {
  render = () => {
    return (
    	<div className="list">
    		{
    			this.props.for === 'friends' &&
    			this.props.friends.map((dude, i) => {
  					return (
    					<Friend 
								key={i}
								name={dude.name}
								image={dude.image}
								id={dude._id}
								states={this.props.states}
								openChat={this.props.openChat}
								call={this.props.call}
                unread={this.props.unread}
                hasUnread={this.props.unread.indexOf(dude._id) !== -1}
                canMakeCalls={this.props.canMakeCalls}
                inCall={this.props.inCall} />
    				);
    			})
    		}

    		{
    			this.props.for === 'requests' &&
    			this.props.requests.map((request, i) => {
    				return (
    					<Request
								key={i}
								name={request.name}
								image={request.image}
								id={request._id}
								sent={false} />
    				);
    			})
    		}

    		{
    			this.props.for === 'requests' &&
    			this.props.sentRequests.map((request, i) => {
    				return (
    					<Request
								key={i}
								name={request.name}
								image={request.image}
								id={request._id}
								sent={true} />
    				);
    			})
    		}

    		{
    			this.props.for === 'users' && 
    			this.props.users.map((user, i) => {
  					return (
    					<User
								key={i}
								name={user.name}
								image={user.image}
								id={user._id}
								isRequest={false} />
    				);
    			})
    		}
    	</div>
    );
  }
}
