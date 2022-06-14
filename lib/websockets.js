'use strict';


const sockets = require.main.require('./src/socket.io/plugins');
const categoryJoinGroup = require('./categoryJoinGroup');

sockets.categoryJoinGroup = {};

sockets.categoryJoinGroup.join = async function (socket, data) {
	if (!socket.uid || !data || !data.cid) {
		throw (new Error('[[error:invalid-data]]'));
	}
	return await categoryJoinGroup.join(socket.uid, data.cid);
};

sockets.categoryJoinGroup.leave = async function (socket, data) {
	if (!socket.uid || !data || !data.cid) {
		throw (new Error('[[error:invalid-data]]'));
	}

	return await categoryJoinGroup.leave(socket.uid, data.cid);
};

sockets.categoryJoinGroup.isMember = async function (socket, data) {
	if (!socket.uid || !data) {
		throw new Error('[[error:invalid-data]]');
	}
	if (!data.cid) {
		return false;
	}
	return categoryJoinGroup.isMember(socket.uid, data.cid);
};
sockets.categoryJoinGroup.exists = async function (socket, data) {
	if (!socket.uid || !data) {
		throw new Error('[[error:invalid-data]]');
	}
	if (!data.cid) {
		return false;
	}
	return await categoryJoinGroup.exists(socket.uid, data.cid);
};
