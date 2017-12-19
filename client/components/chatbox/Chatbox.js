import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import update from 'immutability-helper';

export default class Chatbox extends Component {
	constructor(props) {
		super(props);
		this.state = {
      classes: "chatbox",
			me: 'Alex Figliolia',
			currentChat: 'Steve Figliolia',
      width: 300
		}
	}

  componentDidMount = () => {
    this.setState({width: this.refs.mc.clientWidth});
    this.handleScroll();
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.width !== this.props.width) {
      this.setState({width: this.refs.mc.clientWidth});
    }
    if(nextProps.messages.length !== this.props.messages.length) this.handleScroll();
    if(nextProps.callingClasses === "calling calling-show receiving-call") this.hideChat();
  }

  getWidth = () => {
    if(this.refs.mc) return this.refs.mc.clientWidth;
  }

  handleEnter = (e) => {
    if(e.which === 13) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage = () => {
    if(this.refs.m.value !== "") {
      this.fly();
      Meteor.call('message.send', this.props.with._id, this.refs.m.value, (error, result) => {
        if(error) {
          console.log(error);
        } else {
          this.refs.m.value = '';
          this.addNew();
          this.removeNew();
        }
      });
    }
  }

  fly = async () => {
    this.refs.send.classList.add('fly');
    setTimeout(() => { this.refs.send.classList.add('return')}, 300);
    setTimeout(() => { this.refs.send.classList.add('came-back')}, 350);
    setTimeout(() => { this.refs.send.classList.remove('fly', 'return', 'came-back')}, 600);
  }

  hideChat = async () => {
    this.setState((prevState, prevProps) => {
      return { classes: prevState.classes === "chatbox" ? "chatbox chatbox-hide" : "chatbox" }
    });
  }


  handleScroll = async () => {
    setTimeout(() => { this.refs.mc.scrollTop = this.refs.mc.scrollHeight }, 50);
  }

  addNew = async () => {
    Meteor.call('user.addNew', this.props.with._id, (err, res) => {
      if(err) console.log(err);
    });
  }

  removeNew = async () => {
    if(this.props.unread.indexOf(this.props.with._id) !== -1) {
      Meteor.call('user.removeNew', this.props.with._id, (err, res) => {
        if(err) console.log(err);
      });
    }
  }

	render = () => {
    const l = this.getWidth() + 1;
    return (
      <div 
        className={this.state.classes}
        style={{
          left: this.props.width < 100 ? l * this.props.left  + 'px' : this.props.left * this.state.width + 'px',
          width: this.props.wwidth / this.props.width + 'px'
        }}>
      	<div>
      		<div className="with">
            {this.props.with.name}
            <button
              data-index={this.props.index} 
              onClick={this.props.closeChat}
              className="closer"></button>
            <button
              style={{
                transform: this.state.classes === "chatbox chatbox-hide" ? 
                "rotate(180deg)" : "rotate(0deg)"
              }} 
              onClick={this.hideChat}
              className="hide"></button>
          </div>
      		<div 
            className="messages" 
            ref="mc" 
            id="mc"
            onMouseEnter={this.removeNew}>
      			<div>
              {
                this.props.messages.map((message, i) => {
                  if(message.to === Meteor.userId() && message.from === this.props.with._id ||
                    message.from === Meteor.userId() && message.to === this.props.with._id)
                  return (
                    <div 
                      className={message.from === Meteor.userId() ? 
                      "message message-mine" : "message message-yours"}
                      key={i}>{message.text}</div>
                  );
                })
              }   
            </div>
      		</div>
      		<div className="send-messages">
      			<textarea
              onKeyDown={this.handleEnter}
              ref="m" 
              placeholder="Message"></textarea>
      			<button 
              className="send"
              ref="send"
              onClick={this.sendMessage}>
              <img src="send.svg" alt="send message" />
            </button>
      		</div>
      	</div>
      </div>
    );
	}
}
