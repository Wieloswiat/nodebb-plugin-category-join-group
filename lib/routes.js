
'use strict';

const routes = module.exports;

routes.init = async function (params) {
	await params.router.get('/admin/plugins/category-join-group', params.middleware.admin.buildHeader, renderAdmin);
	await params.router.get('/api/admin/plugins/category-join-group', renderAdmin);
};

async function renderAdmin(req, res) {
	return await res.render('admin/plugins/category-join-group', {});
}

