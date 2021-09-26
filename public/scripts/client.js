'use strict';

/* globals app, socket, ajaxify*/

$(document).ready(function() {

	$(window).on('action:ajaxify.end', function() {

		if (ajaxify.data.template.category && app.user.uid) {
			
			var leaveHtml = '<button type="button" class="btn btn-default btn-danger leave"><i class="fa fa-times"></i><span class="hidden-sm hidden-xs"> [[categoryjoingroup:leave]]</span></button>';
			var joinHtml = '<button type="button" class="btn btn-default btn-success join"><i class="fa fa-plus"></i><span class="hidden-sm hidden-xs"> [[categoryjoingroup:join]]</span></button>';
			var pendingHtml = '<button type="button" class="btn btn-default btn-warning pending" disabled><i class="fa fa-clock-o"></i><span class="hidden-sm hidden-xs"> [[categoryjoingroup:pending]]</span></button>';
			var translatedConfirm;
			var cid = ajaxify.data.cid;
			socket.emit('plugins.categoryJoinGroup.exists', {cid: cid}, function(err, exists) {
				if (exists && !err) {
					require(['translator'], function (translator) {
						socket.emit('plugins.categoryJoinGroup.isMember', {cid: cid}, function(err, isMember) {

							function handleClick(className, method) {
								$('.category').on('click', className, function() {
									var confirmed;
									if (className === '.leave'){
										confirmed = confirm(translatedConfirm);
									}
									else {
										confirmed = true;
									}
									if (confirmed) {
										socket.emit(method, {cid: cid}, function(err) {
											if (err) {
												return app.alertError(err.message);
											}
											var btn = className === '.join' ? leaveHtml : joinHtml;
											translator.translate(btn, function(translated) {
												$(className).replaceWith($(translated));
											});
										});
									}
								});
							}

							if (err) {
								return app.alertError(err.message);
							}
							if (isMember!='pending') {
								var btn = isMember ? leaveHtml : joinHtml;
							}
							else {
								var btn = pendingHtml;
							}
							translator.translate(btn, function (translated) {
								$('[component="category/controls"]').prepend($(translated));
							});
							translator.translate('[[categoryjoingroup:confirm]]', function (translated) {
								translatedConfirm = translated;
							});
							handleClick('.join', 'plugins.categoryJoinGroup.join');
							handleClick('.leave', 'plugins.categoryJoinGroup.leave');
						});
					});
				}
		});
	};


	});
});
