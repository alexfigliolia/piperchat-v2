import React, { Component } from 'react';
import update from 'immutability-helper';
import List from './List';
import { fillData } from '../../helpers/helpers';

export default class FriendList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasNew: [],
			currentList: '33.33333333%',
			text: '',
			search: [],
			requests: [],
			sentRequests: [],
			contacts: [],
		}
		this.text = new Audio("iphone_notification.mp3");
	}

	componentWillReceiveProps = (nextProps) => {
		if(nextProps.messages.length !== this.props.messages.length && 
			 nextProps.messages[nextProps.messages.length - 1].from._id !== Meteor.userId() && nextProps.unread.length > 0) this.text.play();
	}

	handleSearch = (e) => {
		this.setState({text: e.target.value});
		let arr;
		const search = [];
		if(this.state.currentList === '33.33333333%') arr = this.props.contacts;
		if(this.state.currentList === '0%') arr = [...this.props.requests, ...this.props.sentRequests];
		if(this.state.currentList === '-33.33333333%') arr = this.props.users;
		for(let i = 0; i<arr.length; i++) {
			if(arr[i].name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1 ) search.push(arr[i]);
		}
		this.setState({search});
	}

	openChat = (name, image, id) => {
  	const s = this.state.hasNew;
  	const i = s.indexOf(name);
  	const ns = update(s, {$splice: [[i, 1]]});
  	this.setState({hasNew: ns});
		this.props.openChat(name, image, id);
	}

	tabs = (e) => {
		const tab = e.target.dataset.tab;
		if(tab === 'friends') this.setState({currentList: '33.33333333%', text: ''});
		if(tab === 'requests') this.setState({currentList: '0%', text: ''});
		if(tab === 'users') this.setState({currentList: '-33.33333333%', text: ''});
	}

	render = () => {
		const width = window.innerWidth >= 670 ? 400 : window.innerWidth * 0.7;
		return (
			<section className={this.props.classes}>
				<div>
					<div className="list-header" style={{width}}>
						<div className="header-buttons" style={{width}}>
							<button
								onClick={this.tabs} 
								data-tab="friends" 
								style={{width: width * 0.3333333}}>Friends
									{
                   	this.props.unread.length > 0 &&
                   	<div 
                   		className="noty"
                   		onClick={this.tabs} 
											data-tab="friends" >{this.props.unread.length}</div>
                  }
							</button>
							<button
								onClick={this.tabs} 
								data-tab="requests" 
								style={{width: width * 0.3333333}}>
									Requests
									{
										this.props.requests.length > 0 &&
										<div 
											className="noty"
											onClick={this.tabs} 
											data-tab="requests" >{this.props.requests.length}</div>
									}
							</button>
							<button
								onClick={this.tabs} 
								data-tab="users" 
								style={{width: width * 0.3333333}}>
									Users
							</button>
						</div>
						<div className="add-friend" style={{width: width * 0.9}}>
							<input 
								type="search" 
								placeholder="Find Someone"
								value={this.state.text}
								onChange={this.handleSearch} />
						</div>
					</div>
					<div 
						className="list-container"
						style={{transform: `translateX(${this.state.currentList})`}}>
						<List 
							for="friends"
							friends={this.state.currentList === '33.33333333%' && 
											 this.state.text !== '' ? this.state.search : 
											 this.props.contacts}
							states={this.props.states}
							openChat={this.openChat}
							call={this.props.call}
							unread={this.props.unread}
							canMakeCalls={this.props.canMakeCalls}
							inCall={this.props.inCall} />
						<List
							for='requests'
							requests={this.props.requests}
							sentRequests={this.props.sentRequests}
							text={this.state.text}
							currentList={this.state.currentList} />
						<List
							for='users'
							users={this.state.currentList === '-33.33333333%' &&
										 this.state.text !== '' ? this.state.search : 
										 this.props.users}
							sentRequests={this.props.sentRequests} />
					</div>
				</div>
			</section>
		);
	}
}