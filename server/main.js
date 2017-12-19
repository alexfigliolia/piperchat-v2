import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import './publishData';
import { BuddyLists, Conversations, Messages, Reports, Presences } from '../api/collections.js';

Meteor.methods({

  'user.checkForBuddyList'(){
    return BuddyLists.find({owner: Meteor.userId()}).fetch();
  },

  'user.createBuddyList'(){
    return BuddyLists.insert({
      owner: Meteor.userId(),
      friends: [],
      requests: [],
      sentRequests: []
    });
  },

  'user.changeName'(name){
    check(name, String);
    return Meteor.users.update({ _id: Meteor.userId() }, {
      $set: { name: name }
    });
  },

  'user.addImage'(url) {
    check(url, String);
    return Meteor.users.update({ _id: Meteor.userId() }, {
      $set: { image: url }
    });
  },

  'users.getObjects'(arr){
    check(arr, Array);
    if(arr.length > 0) {
      const objs = Meteor.users.find(
        { _id: { $in: arr } }, 
        {fields: {name: 1, _id: 1, image: 1}})
      .fetch();
      return objs;
    } else {
      return [];
    }
  },

  'user.sendRequest'(id) {
    check(id, String);
    BuddyLists.update({owner: Meteor.userId()}, {
      $push: { sentRequests: id }
    });
    const bl = BuddyLists.find({owner: id}).fetch()[0];
    const reqs = bl.requests;
    let exists = false;
    for(let i = 0; i < reqs.length; i++) {
      if(Meteor.userId() === reqs[i]) {
        exists = true;
        break;
      }
    }
    if(!exists) {
      return BuddyLists.update({owner: id}, {
        $push: { requests: Meteor.userId() }
      });
    }
  },

  'user.acceptRequest'(id){
    check(id, String);
    BuddyLists.update({owner: Meteor.userId()}, {
      $pull: { requests: id },
      $push: { friends: id }
    });
    BuddyLists.update({owner: id}, {
      $push: { friends: Meteor.userId() },
      $pull: { sentRequests: Meteor.userId() }
    });
  },

  'user.denyRequest'(id) {
    check(id, String);
    BuddyLists.update({owner: id}, {
      $pull: { sentRequests: Meteor.userId() }
    });
    const bl = BuddyLists.find({owner: Meteor.userId()}).fetch()[0];
    const reqs = bl.requests;
    for(let i = 0; i<reqs.length; i++) {
      if(reqs[i] === id) {
        BuddyLists.update({owner: Meteor.userId()}, {
          $pull: { requests: id }
        });
        break;
      }
    }
  },

  'user.updatePeerID'(id){
    check(id, String);
    return Meteor.users.update({_id: Meteor.userId()}, {
      $set: { profile: { peerId: id} }
    });
  },

  'user.getPeerId'(id){
    check(id, String);
    const user = Meteor.users.findOne({_id: id});
    return user.profile.peerId;
  },

  'user.updatePresence'(){
    const connectionId = this.isSimulation ? Meteor.connection._lastSessionId : this.connection.id;
    return Presences.update({_id: connectionId}, {
      $set: {userId: Meteor.userId(), state: 'online'}
    });
  },

  'user.addNew'(id){
    check(id, String);
    Meteor.users.update({_id: id}, {
      $push: { newMessages: Meteor.userId() }
    });
  },

  'user.removeNew'(id){
    check(id, String);
    Meteor.users.update({_id: Meteor.userId()}, {
      $pull: { newMessages: id }
    });
  },

  'user.removeFriend'(id){
    check(id, String);
    BuddyLists.update({owner: id}, {
      $pull: { friends: Meteor.userId() }
    });
    BuddyLists.update({owner: Meteor.userId()}, {
      $pull: { friends: id }
    });
    return 'Removed a friend';
  },

  'user.reportAbuse'(message) {
    check(message, String);
    return Reports.insert({
      message: message,
      reportedBy: Meteor.userId()
    });
  },

  'convo.create'(id) {
    check(id, String);
    const exists = Conversations.find({ owners: {$all: [id, Meteor.userId()]} }).fetch();
    if(exists.length === 0) {
      return Conversations.insert({
        owners: [id, Meteor.userId()]
      });
    }
  },

  'message.send'(id, text){
    check(id, String);
    check(text, String);
    const convo = Conversations.find({ owners: {$all: [id, Meteor.userId()]} }, {_id: 1}).fetch();
    if(convo.length !== 0) {
      return Messages.insert({
        conversation: convo[0]._id,
        from: Meteor.userId(), 
        to: id,
        date: new Date(),
        text: text
      });
    }
  }

});