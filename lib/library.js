'use strict';

const routes = require('./routes');

const library = module.exports;
const categoryJoinGroup = require('./categoryJoinGroup');

const slugify = require.main.require('./src/slugify');

library.init = async function (params) {
	library.app = params.app;
	require('./websockets');
	await routes.init(params);
};


library.onUserDelete = async function (data) {
	await categoryJoinGroup.onUserDelete(data);
};

library.getWidgets = async function (data) {
	const category_widget = {
		name: 'Category join group',
		widget: 'category-join-group',
		description: 'Widget for joining a group related to a specific category, should be placed on category.tpl',
		content: '',
	};
	data.push(category_widget);
	return data;
};

library.renderCategoryJoinWidget = async function (widget) {
	let [categoryGroupExists, categoryGroupIsMember] = await Promise.all([
		categoryJoinGroup.exists(widget.templateData.config.uid, widget.templateData.cid, widget.templateData.name),
		categoryJoinGroup.isMember(widget.templateData.config.uid, widget.templateData.cid, widget.templateData.name),
	]);
	let categoryGroupisPending = false;
	if (categoryGroupIsMember === 'pending') {
		categoryGroupisPending = true;
		categoryGroupIsMember = false;
	}
	widget.html = await library.app.renderAsync('widgets/categoryjoingroup', {
		categoryGroupExists,
		categoryGroupIsMember,
		categoryGroupisPending,
		cid: widget.templateData.cid,
		groupSlug: slugify(widget.templateData.name),
	});
	return widget;
};
