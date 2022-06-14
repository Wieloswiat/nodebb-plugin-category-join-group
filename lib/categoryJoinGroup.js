'use strict';

// const winston = require('winston');

const db = require.main.require('./src/database');
const categories = require.main.require('./src/categories');
const groups = require.main.require('./src/groups');
const categoryJoinGroup = {};

categoryJoinGroup.isMember = async function (uid, cid, name = null) {
	if (!name) {
		const category = await categories.getCategoryById({ cid: cid, uid: uid });
		name = category.name;
	}
	const isPending = await groups.isPending(uid, name);

	if (!isPending) {
		return await groups.isMember(uid, name);
	}
	return 'pending';
};

categoryJoinGroup.join = async function (uid, cid) {
	const category = await categories.getCategoryById({ cid: cid, uid: uid });
	const isPrivate = await groups.isPrivate(category.name);
	if (isPrivate) {
		await groups.requestMembership(category.name, uid);
		return 'pending';
	}
	await groups.join(category.name, uid);
	return 'joined';
};

categoryJoinGroup.leave = async function (uid, cid) {
	const category = await categories.getCategoryById({ cid: cid, uid: uid });
	const isPending = await groups.isPending(uid, category.name);
	if (!isPending) {
		return await groups.leave(category.name, uid);
	}
	return await groups.rejectMembership(category.name, uid);
};

categoryJoinGroup.onUserDelete = async function (data) {
	const cids = await db.getSortedSetRange('categories:category-name', 0, -1);
	await Promise.all(cids.map(cid => categoryJoinGroup.leave(data.uid, cid)));
};

categoryJoinGroup.exists = async function (uid, cid, name = null) {
	if (!name) {
		const category = categories.getCategoryById({ cid: cid, uid: uid });
		name = category.name;
	}
	return await groups.exists(name);
};
module.exports = categoryJoinGroup;
