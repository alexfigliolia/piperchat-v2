import update from 'immutability-helper';

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateName(name) {
	const bool = /^[A-Z'a-z'\s]+$/.test(name);
	return bool ? name.trim() : false;
}

const checkSelfFriend = async (path) =>{
  if(path.users.length > 0) {
    const users = path.users;
    const friends = path.buddyList[0].friends;
    const requests = path.buddyList[0].requests;
    const sent = path.buddyList[0].sentRequests;
    const arr = [...friends, ...requests, ...sent];
    const unique = [];
    for(let i = 0; i<users.length; i++) {
      let isUnique = true;
      if(users[i]._id === Meteor.userId()) isUnique = false;
      for(let j = 0; j<arr.length; j++) {
        if(users[i]._id === arr[j]._id || users[i]._id === Meteor.userId()) {
          isUnique = false;
          break;
        }
      }
      if(isUnique) unique.push(users[i]);
    }
    return unique;
  }
}

const sortFriendsUnread = async (unread, friends) => {
  for(let i = 0; i<friends.length; i++) {
    for(let j = 0; j<unread.length; j++) {
      if(friends[i]._id === unread[j]) {
        const r = update(friends, {$splice: [[i, 1]]});
        const ns = update(r, {$unshift: [friends[i]]});
        return ns;
      }
    }
  }
}

const getMessages = async (messages, id) => {
  const m = [];
  for(let i = 0; i<messages.length; i++) {
    const mes = messages[i];
    if(mes.from._id === id || mes.to._id === id) m.push(mes);
  }
  return m.length >= 65 ? m.slice(m.length - 65).reverse() : m.reverse();
}

function alphabetize(arr=[]){
	return arr.sort((a, b) => {
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
  });
}

function checkIndexOf(arr, obj){
	let exists = false;
	let index = null;
	for(let i = 0; i<arr.length; i++) {
    if(arr[i]._id === obj._id) {
    	exists = true;
    	index = i;
    	break;
    }
  }
  return {bool: exists, pos: index };
}

export { 
  checkSelfFriend,
  sortFriendsUnread, 
  getMessages, 
  alphabetize, 
  checkIndexOf,
  validateEmail, 
  validateName
}