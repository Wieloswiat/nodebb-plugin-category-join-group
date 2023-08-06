{{{ if categoryGroupExists }}}

<div class="join-group-widget btn-group">
        <button type="button" id="categoryjoinaction" class="btn  categoryjoin {{{ if !(categoryGroupIsMember || categoryGroupisPending) }}}btn-success{{{ end }}} {{{ if categoryGroupIsMember }}}btn-danger{{{ end }}} {{{ if categoryGroupisPending  }}}btn-warning" disabled="true{{{ end }}}">
            <span id="categoryJoinText" class="{{{ if (categoryGroupIsMember || categoryGroupisPending) }}}hidden{{{ end }}}"><i class="fa fa-plus"></i><span class="hidden-sm hidden-xs"> [[categoryjoingroup:join]]</span></span>
            <span id="categoryLeaveText" class="{{{ if !categoryGroupIsMember }}}hidden{{{ end }}}"><i class="fa fa-times"></i><span class="hidden-sm hidden-xs"> [[categoryjoingroup:leave]]</span></span>
            <span id="categoryPendingText class="{{{ if !categoryGroupisPending }}}hidden{{{ end }}}"><i class="fa fa-clock-o"></i><span class="hidden-sm hidden-xs"> [[categoryjoingroup:pending]]</span></span>
        </button>
        <a type="button" id="goToGroup" class="btn btn-default" href="{relative_path}/groups/{groupSlug}"></i><i class="fa fa-users"></i></a>
</div>

<script>
    (
        function() {
            async function registerCategoryGroupEvents() {
                const [bootbox, translator] = await app.require(['bootbox', 'translator']);
                const actionbutton = document.getElementById("categoryjoinaction");

                const joinText = document.getElementById("categoryJoinText");
                const leaveText = document.getElementById("categoryLeaveText");
                const pendingText = document.getElementById("categoryPendingText");
                async function handleCategoryAction() {
                    if (actionbutton.classList.contains("btn-success")) {
                        const status = await socket.emit("plugins.categoryJoinGroup.join", { cid: {cid}  });
                        actionbutton.classList.remove("btn-success");
                        joinText.classList.add("hidden");
                        if (status == "joined") {
                            actionbutton.classList.add("btn-danger");
                            leaveText.classList.remove("hidden");
                        } else if (status == "pending") {
                            actionbutton.classList.add("btn-warning");
                            pendingText.classList.remove("hidden");
                        }
                    } else if (actionbutton.classList.contains("btn-danger") {
                        bootbox.confirm(await translator.translate("[[categoryjoingroup:confirm]]"), async (result) => {
                            if (!result) return;
                            await socket.emit("plugins.categoryJoinGroup.leave", { cid: {cid} });
                            actionbutton.classList.remove("btn-danger");
                            leaveText.classList.add("hidden");
                            actionbutton.classList.remove("btn-warning");
                            pendingText.classList.add("hidden");
                            actionbutton.classList.add("btn-success");
                            joinText.classList.remove("hidden");
                        })
                    }
                }
                actionbutton.addEventListener("click", handleCategoryAction);
            }
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', registerCategoryGroupEvents);
            } else {
                registerCategoryGroupEvents();
            }
        })();
</script>
{{{ end }}}
