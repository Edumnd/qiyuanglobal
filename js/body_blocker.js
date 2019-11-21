function BodyBlocker()
{
    var t = this;
	t.already_in_block = 0;	
	t.create_block = create_block;
	t.remove_block = remove_block;	
	t.wait = null;
	t.main = $('#main_cont');
	//t.cms_overlay = $('#cms_overlay_mask');
	
	function create_block()
	{
		if(t.already_in_block > 0) 
		{
			t.already_in_block = t.already_in_block + 1;
			return false;
		}

        if (!t.wait) {
            t.wait = "<div class='preloader-modal'><div class='preloader-group'>"+
				"<div class='bigSqr'>"+
                "<div class='square first'></div>"+
                "<div class='square second'></div>"+
                "<div class='square third'></div>"+
                "<div class='square fourth'></div>"+
                "</div>"+
                "<div class='text'>loading</div>"+
                "</div></div>" +
				"<div class='modal-backdrop in'></div> ";
            $('body').append(t.wait);
        }
        $('.preloader-modal,.modal-backdrop.in').show();
        t.main.addClass('blur');
		t.already_in_block = t.already_in_block + 1;
	}		

	function remove_block()
	{
		//t.cms_overlay.css("z-index","1003");
		t.main.removeClass('blur');
		$('.preloader-modal,.modal-backdrop.in').hide();
		t.already_in_block = 0;
	}
}
var body_blocker = new BodyBlocker();