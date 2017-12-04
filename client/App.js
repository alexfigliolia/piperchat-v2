import React, { Component } from 'react';
import update from 'immutability-helper';
import Login from './components/login/Login';
import Header from './components/header/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import FriendList from './components/friendList/FriendList';
import Menu from './components/menu/Menu';
import Chatbox from './components/chatbox/Chatbox';
import RemoveFriend from './components/removeFriend/RemoveFriend';
import ReportAbuse from './components/reportAbuse/ReportAbuse';
import Peer from './peer';
import { alphabetize, checkSelfFriend, sortFriendsUnread } from './helpers/helpers';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			user: null,
			users: [],
			headerClasses: "header",
			burgerClasses: "hamburglar is-open",
      burgerToggle: true,
      friendListClasses: "friend-list",
      friendToggle: true,
      menuClasses: "menu",
      loginClasses: "login",
      callingClasses: "calling",
      removeFriendClasses: "remove-friend",
      reportAbuseClasses: "report-abuse",
      contacts: [],
      requests: [],
      sentRequests: [],
      height: window.innerHeight,
      width: window.innerWidth,
      currentChats: [],
      currentSearch: '',
      unread: []
		}
		this.loader = document.getElementById('appLoader');
		this.stream = null;
		this.ring = new Audio("sony_ericsson_tone.mp3");
	}

	componentDidMount = () => {
		window.addEventListener('resize', () => {
			this.setState({ height: window.innerHeight, width: window.innerWidth });
		});
	}

	componentWillReceiveProps = (nextProps) => {
		if(this.props !== nextProps) {
			console.log(nextProps);
			if(nextProps.user === null || nextProps.user === undefined) {
				this.needsAuth();
			} else {
				const buddyListExists = nextProps.buddyList.length > 0;
      	const friends = alphabetize(buddyListExists ? nextProps.buddyList[0].friends : []);
				this.letEmIn(nextProps, friends);
				const unread = nextProps.user.newMessages;
				if(unread !== undefined && unread.length !== 0 && buddyListExists) {
		      sortFriendsUnread(unread, alphabetize(nextProps.buddyList[0].friends))
		        .then(ns => this.setState({friends: ns}))
		        .catch(err => console.log(err));
		    }
			}
		}
	}

	//SHOW LOGIN IF APP CANNOT IDENTIFY USER
	needsAuth = () => {
		if(this.loader !== null) {
			this.loader.classList.add('app-loader-hidden-op');
			this.setState({ loggedIn: false, user: null, headerClasses: "header", burgerClasses: "hamburglar is-open", burgerToggle: true, friendListClasses: "friend-list", friendToggle: true, menuClasses: "menu" });
			setTimeout(() => { 
				this.loader.remove();
				this.setState({ loginClasses: "login login-show "})
			 }, 600);
		} else {
			this.setState({ loggedIn: false, loginClasses: "login login-show "});
		}
		this.stream = null;
	}

	//ALLOW ACCESS TO APP IF THE USER IS RECOGNIZED
	letEmIn = (path, friends) => {
		this.entrance();
		const buds = path.buddyList;
    const fands = buds.length > 0 ? friends : [];
    const newM = path.user.newMessages;
		this.setState({ 
			user: path.user,
			contacts: fands,
			search: fands,
			requests: buds.length > 0 ? buds[0].requests : [],
			sentRequests: buds.length > 0 ? buds[0].sentRequests : [],
			loginClasses: "login login-show",
			unread: newM !== undefined ? newM : []
		});
		if(buds.length > 0) {
      checkSelfFriend(path)
        .then( users => this.setState({users}) )
        .catch( err => console.log(err) );
    }
	}

	entrance = async () => {
		setTimeout(() => { 
			this.setState({ loginClasses: "login login-show login-hide" }) 
			if(this.loader !== null) {
				this.loader.classList.add('app-loader-hidden')
				setTimeout(() => { 
					this.loader.remove();
					this.setState({ headerClasses: "header header-show" });
				}, 800);
			}
		}, 600);
		setTimeout(() => { this.setState({ loggedIn: true }) }, 1100);
	}

	//OPEN MENU
	toggleBurger = () => {
		if(this.state.removeFriendClasses === "remove-friend remove-friend-show") {
			this.toggleRemoveFriend();
		} else if(this.state.reportAbuseClasses === "report-abuse report-abuse-show") {
			this.toggleReportAbuse();
		} else {
			if(!this.state.friendToggle) this.toggleFriends();
	    this.setState((prevState, prevProps) => {
	      return {
	        burgerToggle : !prevState.burgerToggle,
	        burgerClasses : (prevState.burgerClasses === "hamburglar is-closed") ? 
	                          "hamburglar is-open" : 
	                          "hamburglar is-closed",
	       	menuClasses: (prevState.menuClasses === "menu") ?
	       								"menu menu-show" :
	       								"menu"
	      }
	    });
		}
  }

  //OPEN BUDDY LIST
  toggleFriends = () => {
  	if(!this.state.burgerToggle) this.toggleBurger();
    this.setState((prevState, prevProps) => {
      return {
      	friendToggle : !prevState.friendToggle,
        friendListClasses: prevState.friendListClasses === "friend-list" ?
        										"friend-list friend-list-show" :
        										"friend-list"
      }
    });
  }

  toggleRemoveFriend = () => {
  	this.setState((prevState) => {
  		return {
  			removeFriendClasses: prevState.removeFriendClasses === "remove-friend" ?
  													"remove-friend remove-friend-show" :
  													"remove-friend",
  			burgerClasses: prevState.burgerClasses === "hamburglar is-closed" ?
  											"hamburglar is-closed is-arrow" :
  											"hamburglar is-closed",
  			menuClasses: prevState.menuClasses === "menu menu-show" ?
  										"menu menu-show menu-move" :
  										"menu menu-show"
  		}									
  	});
  }

	toggleReportAbuse = () => {
  	this.setState((prevState) => {
  		return {
  			reportAbuseClasses: prevState.reportAbuseClasses === "report-abuse" ?
  													"report-abuse report-abuse-show" :
  													"report-abuse",
  			burgerClasses: prevState.burgerClasses === "hamburglar is-closed" ?
  											"hamburglar is-closed is-arrow" :
  											"hamburglar is-closed",
  			menuClasses: prevState.menuClasses === "menu menu-show" ?
  										"menu menu-show menu-move" :
  										"menu menu-show"
  		}									
  	});
  }  

  //CLOSE A CHAT
  closeChat = (e) => {
  	const i = e.target.dataset.index;
  	const cc = this.state.currentChats;
  	const ns = update(cc, {$splice: [[[i], 1]]});
  	this.setState({currentChats: ns});
  }

  //OPEN A CHAT
  openChat = (name, image, id) => {
  	const cc = this.state.currentChats;
  	let exists = false;
  	for(let i = 0; i<cc.length; i++) {
  		if(name === cc[i].name) {
  			exists = true;
  			break;
  		}
  	}
  	if(!exists) {
  		Meteor.call('convo.create', id, (error, result) => {
  			if(error) {
  				console.log(error);
  			} else {
  				const ns = update(cc, {$push: [{name: name, image: image, _id: id}]});
  				this.setState({currentChats: ns});
  			}
  		});
  	}
  	this.toggleFriends();
  }

  //UPLOAD NEW PROFILE IMAGE
  handleNewImage = (img) => {
  	const user = this.state.user;
  	const newTempImage = update(user, {image: {$set: img}});
  	this.setState({user: newTempImage});
  }

  getLocalStream = () => {
		if (navigator.mediaDevices === undefined) navigator.mediaDevices = {};
		if (navigator.mediaDevices.getUserMedia === undefined) {
		  navigator.mediaDevices.getUserMedia = function(constraints) {
		    let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		    if (!getUserMedia) {
		      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
		    }
		    return new Promise(function(resolve, reject) {
		      getUserMedia.call(navigator, constraints, resolve, reject);
		    });
		  }
		}
		const c  = { audio: true, video: true };
		navigator.mediaDevices.getUserMedia(c)
		.then((stream) => {
		  this.onInitConnect(stream);
		})
		.catch((err) => {
			console.log(err);
			this.onFailConnect();
		});
	}

	onInitConnect = (stream) => {
		const me = document.querySelector('#me');
		const you = document.querySelector('#you');
		const url = window.URL || window.webkitURL;
		if ("srcObject" in me) {
			me.srcObject = stream;
			you.srcObject = stream;
		} else {
			me.src = window.URL.createObjectURL(stream);
			you.src = window.URL.createObjectURL(stream);
		}
		this.stream = stream;
		Peer.setLocalStream(stream);
	}

	onFailConnect = () => console.log('fail');

  initPeer = () => {
  	Peer.init(Meteor.userId());
  	this.socket = Peer.socket;
  	this.socket.on('offer', (offer) => {
  		console.log('on offer');
			if(Peer.accepted === null || Peer.accepted === false) {
				this.setState({ callingClasses: "calling calling-show receiving-call" });
				this.ring.play();
			}
			this.offer = offer;
  	});
  	this.socket.on('accepted', (id) => {
  		console.log('accepted');
  		Peer.accepted = true;
  		Meteor.call('user.getPeerId', id, (err, res) => {
	  		if(err) {
	  			console.log(err);
	  		} else {
	  			Peer.startCall(res);
	  		}
	  	});
  	});
  	this.socket.on('candidate', () => {
  		console.log('on candidate');
  		if(Peer.accepted) this.setState({ callingClasses: "calling calling-show received" });
  	});
	}

  call = (id) => {
  	let isOnline = false;
  	const onlineUsers = this.props.states;
		for(let i = 0; i < onlineUsers.length; i++) {
			if(id === onlineUsers[i].userId) {
				isOnline = true;
				break;
			}
		}
  	if(isOnline) {
  		Meteor.call('user.getPeerId', id, (err, res) => {
	  		if(err) {
	  			console.log(err);
	  		} else {
	  			this.setUpCall(res);
	  		}
	  	});
  	}
  }

  setUpCall = (res) => {
  	this.toggleFriends();
	  this.setState({ callingClasses: "calling calling-show" });
		Peer.startCall(res);
  }

  acceptCall = () => {
  	console.log('accept call');
		this.ring.pause();
		Peer.accepted = true;
		this.socket.emit('accepted', { to: Peer.sendAnswerTo, from: Meteor.userId()});
		this.setState({ callingClasses: "calling calling-show received" });
  }

  endCall = (e) => {
  	this.ring.pause();
  	this.setState({ callingClasses: "calling" });
  	this.onInitConnect(this.stream);
		Peer.receivingUser = null;
		Peer.sendAnswerTo = null;
		Peer.accepted = null;
  	document.getElementById('you').muted = true;
  }

	render = () => {
		return(
			<section
				className="App" 
				style={{height: window.innerHeight}}>

				{
					!this.state.loggedIn &&
					<Login
						classes={this.state.loginClasses} />
				}

				<Header
					classes={this.state.headerClasses}
					burgerStuff={this.state.burgerClasses}
					burger={this.toggleBurger}
					friends={this.toggleFriends}
					messages={this.props.messages}
					user={this.state.user}
					unread={this.state.unread}
					requests={this.state.requests} />

				<Dashboard
					user={this.state.user}
					userId={this.props.id}
					height={this.state.height}
					width={this.state.width}
					loggedIn={this.state.loggedIn}
					classes={this.state.callingClasses}
					endCall={this.endCall}
					initPeer={this.initPeer}
					getLocalStream={this.getLocalStream}
					stream={this.stream}
					acceptCall={this.acceptCall}
					setCallingScreen={this.setCallingScreen} />

				{
					this.state.loggedIn &&
					<FriendList
						user={this.props.user}
						classes={this.state.friendListClasses}
						contacts={this.state.contacts}
						requests={this.state.requests}
						sentRequests={this.state.sentRequests}
						openChat={this.openChat}
						messages={this.props.messages}
						call={this.call}
						states={this.props.states}
						users={this.state.users}
						unread={this.state.unread} />
				}

				{
					this.state.loggedIn &&
					<Menu
						classes={this.state.menuClasses}
						user={this.state.user}
						handleNewImage={this.handleNewImage}
						toggleRemoveFriend={this.toggleRemoveFriend}
						toggleReportAbuse={this.toggleReportAbuse} />
				}

				{
					this.state.loggedIn &&
					this.state.width < 957 ?
					this.state.currentChats.length > 0 &&
					 <Chatbox
							index={this.state.currentChats.length - 1}
							with={this.state.currentChats[this.state.currentChats.length - 1]}
							left={0}
							width={this.state.width}
							closeChat={this.closeChat}
							messages={this.props.messages}
							user={this.state.user}
							unread={this.state.unread} />	
					: this.state.loggedIn &&
						this.state.currentChats.map((chat, i) => {
						return <Chatbox
											index={i}
											key={i}
											with={chat}
											left={i}
											width={this.state.currentChats.length}
											wwidth={this.state.width}
											closeChat={this.closeChat}
											messages={this.props.messages}
											user={this.state.user}
											unread={this.state.unread} />	
					})
				}

				{
					this.state.loggedIn &&
					<RemoveFriend
						classes={this.state.removeFriendClasses} 
						friends={this.state.contacts} />
				}

				{
					this.state.loggedIn &&
					<ReportAbuse
						classes={this.state.reportAbuseClasses}
						toggleReportAbuse={this.toggleReportAbuse} />
				}

			</section>
		);
	}
}