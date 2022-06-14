{{{ if categoryGroupExists }}}

<div class="join-group-widget btn-group">
        <button type="button" id="categoryjoin" class="btn btn-success categoryjoin {{{ if (categoryGroupIsMember || categoryGroupisPending) }}}hidden{{{ end }}}"><i class="fa fa-plus"></i><span class="hidden-sm hidden-xs"> [[categoryjoingroup:join]]</span></button>
        <button type="button" id="categoryleave" class="btn btn-danger categoryleave {{{ if !categoryGroupIsMember }}}hidden{{{ end }}}"><i class="fa fa-times"></i><span class="hidden-sm hidden-xs"> [[categoryjoingroup:leave]]</span></button>
        <button type="button" id="categorypending" class="btn btn-warning categorypending {{{ if !categoryGroupisPending  }}}hidden{{{ end }}}" disabled><i class="fa fa-clock-o"></i><span class="hidden-sm hidden-xs"> [[categoryjoingroup:pending]]</span></button>
        <a type="button" id="goToGroup" class="btn btn-default" href="{relative_path}/groups/{groupSlug}"></i><i class="fa fa-users"></i></a>
</div>

<script>
    (
        function() {
            async function registerCategoryGroupEvents() {
                const [bootbox, translator] = await app.require(['bootbox', 'translator']);
                const categoryjoinbutton = document.getElementById("categoryjoin");
                const categoryleavebutton = document.getElementById("categoryleave");
                const categorypendingbutton = document.getElementById("categorypending");
                async function handleCategoryJoin() {
                    const status = await socket.emit("plugins.categoryJoinGroup.join", { cid: {cid}  });
                    categoryjoinbutton.classList.add("hidden");
                    if (status == "joined") {
                        categoryleavebutton.classList.remove("hidden");
                    } else if (status == "pending") {
                        categorypendingbutton.classList.remove("hidden");
                    }
                }
                async function handleCategoryLeave() {
                    bootbox.confirm(await translator.translate("[[categoryjoingroup:confirm]]"), async (result) => {
                        if (!result) return;
                        await socket.emit("plugins.categoryJoinGroup.leave", { cid: {cid} });
                        categoryleavebutton.classList.add("hidden");
                        categorypendingbutton.classList.add("hidden");
                        categoryjoinbutton.classList.remove("hidden");
                    })
                }
                categoryjoinbutton.addEventListener("click", handleCategoryJoin);
                categoryleavebutton.addEventListener("click", handleCategoryLeave);
            }
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', registerCategoryGroupEvents);
            } else {
                registerCategoryGroupEvents();
            }
        })();
</script>
{{{ end }}}