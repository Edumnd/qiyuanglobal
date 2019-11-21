/*
	Slimbox v1.41 - The ultimate lightweight Lightbox clone
	by Christophe Beyls (http://www.digitalia.be) - MIT-style license.
	Inspired by the original Lightbox v2 by Lokesh Dhakar.
*/
function create_my_overlay(overlay_id, width, height)
{
	var var_overlay = new YAHOO.widget.Panel(overlay_id,{
		width: width,
		height: height,
		visible: true,

		close: true,
		constraintoviewport: true,
		fixedcenter: 'contained',
		modal: true,
		draggable: false,
        
		zindex: 1000
	});

    var_overlay.hideEvent.subscribe(function(){
        if (tinymce.EditorManager.activeEditor != null) tinymce.EditorManager.activeEditor.remove();
    });
    var_overlay._focusFirstModal = function() {};
    
    var_overlay.setHeader('&nbsp;');
	var_overlay.setBody('');
	var_overlay.setFooter('');    
	var_overlay.render(document.body);
	return var_overlay;
}
var overlay={};
var Lightbox = {
	init: function()
	{
            overlay = create_my_overlay("cms_overlay", 'auto', 'auto');
            overlay.hide();
	},

	show: function(inner_div){
        return overlay.show();
	},		

	close: function(){
        if (tinymce.EditorManager.activeEditor != null) tinymce.EditorManager.activeEditor.remove();
        return overlay.hide();
	},
	
	get_html: function(runmode_name,params)
	{		
	    if (params == null) params = {};
	    body_blocker.create_block();
	    var send_url = ajax_prefix+'?rm='+runmode_name;
        var req = new JsHttpRequest();
        req.onreadystatechange = function()
        {
        	if (req.readyState == 4)
            {
	        	Lightbox.req = req;	                
				if (req.responseJS.success == null) var success = 0;
        		else var success = req.responseJS.success;	
                if (success == 1)
                {
                  	Lightbox.close();
                }
                else
                {
                    var html = req.responseJS.html;                    
                    if(req.responseJS.title!=undefined && req.responseJS.title != null)
                        overlay.setHeader(req.responseJS.title);
                    overlay.setBody(html);
                    Lightbox.show('');
                    overlay.center();
                    if(req.responseJS.text_to_init)
                    {
                        init_js(req.responseJS.text_to_init);
                    }                    
                }
                body_blocker.remove_block();
                Lightbox.get_html_callback();
                Lightbox.get_html_callback = function(req){};
            }
        };
        req.caching = false;
        req.open('POST', send_url, true);
        req.send({ q: params});
	},
	
	submit_form: function(form,runmode_name)
	{
	  	body_blocker.create_block();
	  	var params = {};
	  	for(var i = 0; i < form.elements.length; i++)
	  	{
	    	var element = form.elements[i];
	    	var type = form.elements[i].type;
	    	if (form.elements[i].tagName != 'FIELDSET' && form.elements[i].type != 'checkbox' && form.elements[i].type != 'radio')
	      		params[form.elements[i].name] = form.elements[i].value;
	    
	    	if (form.elements[i].type == 'textarea' && !form.elements[i].value)
	    	{
				//alert(tinyMCE._cleanupHTML);
	      		//params[form.elements[i].name] = tinyMCE.getContent();
	      		//params[form.elements[i].name] = form.elements[i].value;
                    if(form.elements[i].id != "" && tinyMCE.get(form.elements[i].id) != undefined)
                        params[form.elements[i].name] = tinyMCE.get(form.elements[i].id).getContent();
                    else params[form.elements[i].name] = form.elements[i].value;
                    
                    if (params[form.elements[i].name] == '') params[form.elements[i].name] = form.elements[i].value; 
    		}	      
	    	if (form.elements[i].type == 'checkbox' && form.elements[i].checked)
	      		params[form.elements[i].name] = form.elements[i].value;
	    	else if(form.elements[i].type == 'checkbox' && !form.elements[i].checked)
	      		params[form.elements[i].name] = '';
	    	if (form.elements[i].type == 'radio' && form.elements[i].checked)
	      		params[form.elements[i].name] = form.elements[i].value;
	    	if (form.elements[i].type == 'select-multiple')
	    	{
	      		var values = [];
	      		for (var o=0;o<form.elements[i].options.length;o++)
	      		{
	        		if (form.elements[i].options[o].selected)
		  				values[values.length] = form.elements[i].options[o].value;
	      		}
	      		params[form.elements[i].name] = values;
	    	}
	  	}
	  	var send_url = ajax_prefix+'?rm='+runmode_name;

	  	var req = new JsHttpRequest();
        req.onreadystatechange = function()
        {
            if (req.readyState == 4)
            {	      			
                Lightbox.req = req;
                if (req.responseJS.success == null) var success = 0;
                else var success = req.responseJS.success;

                if (success == 1)
                {
                    Lightbox.close();
                }
                else
                {
                    var html = req.responseJS.html;
                    overlay.setBody(html);
                    Lightbox.show();
                }
                Lightbox.submit_form_callback();
                body_blocker.remove_block();
                Lightbox.submit_form_callback = function(){};			
            }
        };
        req.caching = false;
        req.open('POST', send_url, true);
        req.send({ q: params});
	},

	submit_form_callback: function()
	{
	},

	get_html_callback: function()
	{
	}
};

YAHOO.util.Event.onDOMReady(function()
{
    Lightbox.init();    
});

function init_js(text_to_init)
{
    eval(text_to_init);
}