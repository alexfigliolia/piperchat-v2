import io from 'socket.io-client';
import 'webrtc-adapter/out/adapter';

// const RTCSessionDescription = window.RTCSessionDescription ||
//   window.mozRTCSessionDescription;
// const RTCPeerConnection = window.RTCPeerConnection ||
//   window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
// const RTCIceCandidate = window.RTCIceCandidate ||
//   window.mozRTCIceCandidate;

const Peer = {
	socket: null,
	you: null,
	uniqueID: null,
	sendAnswerTo: null,
	receivingUser: null,
	accepted: null,

	init: (user) => {
		// Peer.socket = io('https://piper-signaler.herokuapp.com/', {transports: ['websocket']});
    Peer.socket = io(window.location.protocol + '//piper-signaler.herokuapp.com',
      {reconnect: true, transports : ['websocket'], path: '/socket.io'}
    );
		Peer.socket.emit('connected', user);
		Peer.socket.on('offer', Peer.onOffer);
		Peer.socket.on('uniqueID', (uniqueID) => {
			Meteor.call('user.updatePeerID', uniqueID, (error, result) => {
		  	if(error) {
		  		console.log(error);
		  	} else {
		  		Peer.uniqueID = uniqueID;
		  	}
		  });
		});
		Peer.you = document.getElementById('you');
    Meteor.call('user.updatePresence', (err, res) => {
      if(err) console.log(err);
    });
	},

	setLocalStream: (stream) => {
		Peer.localStream = stream;
	},

	startCall: (id) => {
		Peer.receivingUser = id;
		Peer.initConn(Peer.createOffer);
	},

	initConn: (callback) => {
    Peer.peerConnection = new RTCPeerConnection({
      'iceServers': [
        { url: 'stun:stun.l.google.com:19302' },
        { url: 'stun:stun1.l.google.com:19302' },
      ]
    });
    Peer.peerConnection.addStream(Peer.localStream);
    Peer.peerConnection.onicecandidate = Peer.onIceCandidate;
    Peer.peerConnection.onaddstream = Peer.onAddStream;
    Peer.peerConnection.oniceconnectionstatechange = Peer.onIceStateChange;
    Peer.socket.on('candidate', Peer.onCandidate);
    Peer.socket.on('answer', Peer.onAnswer);
    callback();
  },

  onIceCandidate: (event) => {
    if(event.candidate){
      if(Peer.sendAnswerTo === null) {
      	Peer.socket.emit('candidate', {
      		candidate: JSON.stringify(event.candidate), 
      		to: Peer.receivingUser
      	});
    	} else {
    		Peer.socket.emit('candidate', {
      		candidate: JSON.stringify(event.candidate), 
      		to: Peer.sendAnswerTo
      	});
    	}
    }
  },

  onIceStateChange: (e) => {
  	if(Peer.peerConnection.iceConnectionState === 'disconnected' || Peer.peerConnection.iceConnectionState === 'failed') {
  		Peer.sendAnswerTo = null,
  		Peer.receivingUser = null;
  		Peer.accepted = null;
  		Peer.onAddStream({stream: Peer.localStream}, true);
    }
  },

  onCandidate: (candidate) => {
  	console.log('receiving candidate from socket');
    rtcCandidate = new RTCIceCandidate(JSON.parse(candidate));
    Peer.peerConnection.addIceCandidate(rtcCandidate);
  },

  createOffer: () => {
    Peer.peerConnection.createOffer(
    	//On success
      (offer) => {
        Peer.peerConnection.setLocalDescription(offer);
        Peer.socket.emit('offer', {
        	to: Peer.receivingUser, 
        	from: Meteor.user().profile.peerId,
        	offer: JSON.stringify(offer)
        });
        console.log('making the call');
      },
      //Handle Error
      (err) => {
        console.log(err);
      }
    );
  },

  createAnswer: (offer) => {
    console.log('creating the answer');
    return () => {
      rtcOffer = new RTCSessionDescription(JSON.parse(offer.offer));
      Peer.peerConnection.setRemoteDescription(rtcOffer);
      Peer.peerConnection.createAnswer(
      	(answer) => {
		      Peer.peerConnection.setLocalDescription(answer);
		      Peer.sendAnswerTo = offer.from;
		      Peer.socket.emit('answer', {
	        	to: offer.from, 
	        	answer: JSON.stringify(answer)
        	});
        }, (err) => { console.log(err); }
      );
    }
  },

  onOffer: (offer) => {
    console.log('received offer');
    Peer.sendAnswerTo = offer.from;
    if(Peer.accepted) Peer.initConn(Peer.createAnswer(offer));
  },

  onAnswer: (answer) => {
    console.log('received answer');
    const rtcAnswer = new RTCSessionDescription(JSON.parse(answer));
    Peer.peerConnection.setRemoteDescription(rtcAnswer);
  },

  onAddStream: (e, bool=false) => {
  	console.log('setting remote stream');
  	if ("srcObject" in Peer.you) {
			Peer.you.srcObject = e.stream;
		} else {
			Peer.you.src = window.URL.createObjectURL(e.stream);
		}
    Peer.you.muted = bool;
  }

}

export default Peer;
