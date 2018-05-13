
$ = jQuery;

$(() => {
	$(document).on("click", "#captureStart", () => {
		var img = $("#capImage");
		var caption = $("#capcaption");
		var url = $("#siteurl").val();
		var width = $("#w_width").val() - 0;
		var height = $("#w_height").val() - 0;
		var dom = encodeURIComponent( $("#c_dom").val() );
		var waiting = $("#waiting").val();
		var isfull = $("#isfullpage").prop("checked");
		
		if(url.length <= 0){
			return;
		}
		
		var img_url = 
			`/capture/?url=${url}` +
			(width > 0  ? `&width=${width}` : "") +
			(height > 0 ? `&height=${height}` : "") +
			(dom.length > 0 ? `&dom=${dom}` : "") +
			(waiting !== "" ? `&await=${waiting - 0}` : "") +
			(isfull ? `&full=1` : "");
		
		img.removeClass("noimage");
		img.prop("src", img_url);
		
		var url_fullpath = `${location.origin}${img_url}`;
		caption.html(`Access URL: <a class="url-block" href="${url_fullpath}" target="_blank">${url_fullpath}</a>`);
	});
});