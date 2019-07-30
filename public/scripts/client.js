'use strict';

/* globals app, socket, ajaxify*/

$(document).ready(function() {

	$(window).on('action:ajaxify.end', function() {

		if (app.template === 'category' && app.user.uid) {
			var leaveHtml = '<button type="button" class="btn btn-default btn-warning leave"><i class="fa fa-pencil"></i> [[categoryjoingroup:leave]]</button>';
			var joinHtml = '<button type="button" class="btn btn-default btn-success join"><i class="fa fa-pencil"></i> [[categoryjoingroup:join]]</button>';

			var cid = ajaxify.data.cid;
			require(['translator'], function (translator) {
				socket.emit('plugins.categoryJoinGroup.isMember', {cid: cid}, function(err, isMember) {

					function handleClick(className, method) {
						$('.category').on('click', className, function() {
							socket.emit(method, {cid: cid}, function(err) {
								if (err) {
									return app.alertError(err.message);
								}
								var btn = className === '.join' ? leaveHtml : joinHtml;
								translator.translate(btn, function(translated) {
									$(className).replaceWith($(translated));
								});
							});
						});
					}

					if (err) {
						return app.alertError(err.message);
					}

					var btn = isMember ? leaveHtml : joinHtml;
					translator.translate(btn, function (translated) {
						$('[component="category/controls"]').prepend($(translated));
					});

					handleClick('.join', 'plugins.categoryJoinGroup.join');
					handleClick('.leave', 'plugins.categoryJoinGroup.leave');
				});
			});
		}
	});


});
