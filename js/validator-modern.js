//HTMLInputElement.prototype.validate = '';
//HTMLTextAreaElement.prototype.validate = '';

function Validator()
{
	this.version = '1.0';
	var integer_regexp = /^\d+$/;
	var mail_regexp = /^[^@]+@[^@]+\.[^.|@]+$/;
	var numeric_regexp = /^\d+(\.\d+)?$/;
	
	var login_regexp = /^[\w|_|\d]{4,20}$/;
	var car_name_regexp = /^[\w|_| |-|\d]{1,32}$/;
	var password_regexp = /^.{1,25}$/;

	//TODO CMS-602
	//secure password
	var small = /^[a-z]+$/;
	var big = /[A-Z]+/;
	var symbol = /[!@#$%^]+/;
	var numb = /[0-9]+/;

	//var date_regexp = /^\d\d\/\d\d\/\d\d\d\d$/;
	var date_regexp = /^\d\d\.\d\d\.\d\d\d\d$/;
	var year_regexp = /^\d\d\d\d$/;
	var url_regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	
	this.add_error_style = add_error_style;
	this.clear_external = clear_external;
	var currentElement	= null;
	to_check = {};
	var inputsWithErrors = Array();
	var hexDigit = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F");
	this.add = add;
	var span = false;
	var focus = false;
    var old_style = '';
    this.set_active = function(form_name, elem_name, active) {

        to_check[form_name][elem_name]['active'] = active;
        if (!active) {
            for(var wp = 0; wp < inputsWithErrors.length; wp++)
            {
                if (inputsWithErrors[wp].name == elem_name && typeof(inputsWithErrors[wp]) != 'undefined' && typeof(inputsWithErrors[wp].parentNode) != 'undefined' && inputsWithErrors[wp].parentNode != null) {
                    inputsWithErrors[wp].parentNode.removeChild(inputsWithErrors[wp].parentNode.lastChild);
                    inputsWithErrors.splice(wp, 1);
                    break;
                }
            }
        }
    }

    function live_mode(form_name)
	{
        $('form *[data-validate-mode="live"]').on('input keyup',function () {
        	currentElement = $(this);
            check(form_name,true);
        });
        $('.custom-input-x').on('fileselect', function(event) {
            currentElement = $(this);
            check(form_name,true);
        });
        $('.form-control.selectpicker').on('change', function (e) {
            currentElement = $(this);
            check(form_name,true);
			//console().log("test");
        });
	}
	
	function clear_external()
	{
		clear_errors();
	}
	
	function set_span(b)
	{
		span = b;
	}

	this.set_span = set_span;
	
	function add(form_name,no_submit)
	{
		var form_to_add = document.forms[form_name];
		if(typeof(to_check[form_name]) == 'undefined') {
			to_check[form_name] = {};
			for (var i = 0; i < form_to_add.elements.length; i++) {
				var elem = form_to_add.elements[i];
				var data_validate = $(elem).attr('data-validate');
				//alert(elem);
				if (typeof(data_validate) != 'undefined' && data_validate != '') {
					var restriction = data_validate.split('___');
					//restriction[1] = restriction[1].replace(/_/g, ' ');
					to_check[form_name][elem.name] = {limit: restriction[0], message: restriction[1], active: true};
					data_validate = '';
				}
				if ((elem.value != "Submit") && (elem.type != "button") && (elem.type != "submit")) {
					elem.onclick = function () {
						return check_error_click(this);
					}
				}
			}
		}

		if(!no_submit)
		{
            //alert(1);
			form_to_add.onsubmit = function() {
				return check(form_name,false);
			};
		}
		//alert(form_to_add.onsubmit);
		live_mode(form_name);
	}

	function check_process(form_name,input,result,current) {
        var checking 	= to_check[form_name][input];

        try {
            if (!checking.active) {
                //continue;
                return result;
            }

            if (checking.limit == 'string')
            {
                if(document.forms[form_name].elements[input].value == null || document.forms[form_name].elements[input].value=='')
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);

                }
            }
            else if (checking.limit == 'selected')
            {
                if (document.forms[form_name].elements[input].checked == false)
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);

                }
            }
            else if (checking.limit == 'file')
            {
                if (document.forms[form_name].elements[input].value == null || document.forms[form_name].elements[input].value=='' || document.forms[form_name].elements[input].value=='No File Selected')
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);

                }
            }
            else if (checking.limit == 'string_empty')
            {
                //anything
            }
            else if (checking.limit == 'login')
            {
                if(!login_regexp.test(document.forms[form_name].elements[input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }
            else if (checking.limit == 'nick')
            {
                if(!login_regexp.test(document.forms[form_name].elements[input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }
            else if (checking.limit == 'password')
            {
                if(!password_regexp.test(document.forms[form_name].elements[input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }
            else if (checking.limit == 'secure_password') {	// TODO CMS-602
                if (!password_regexp.test(document.forms[form_name].elements[input].value)) {
                    result = false;
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                } else {
                    var err_mess = "";
                    if (document.forms[form_name].elements[input].value.length < 8) {
                        err_mess += "Please enter at least 8 characters.\n";
                    }
                    if (!big.test(document.forms[form_name].elements[input].value)) {
                        err_mess += "Please enter at least 1 capital letter.\n";
                    }
                    if (!symbol.test(document.forms[form_name].elements[input].value) && !numb.test(document.forms[form_name].elements[input].value)) {
                        err_mess += "Please enter at least 1 number or symbol (!@#$%^).\n";
                    }
                    if (err_mess) {
                        result = false;
                        add_new_error_style(document.forms[form_name].elements[input], err_mess, current);
                    }
                }
            }
            else if(checking.limit == 'integer')
            {
            	var el	= document.forms[form_name].elements[input];
            	var tmp = el.value;
                if(!integer_regexp.test(tmp))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }
            else if(checking.limit == 'integer_not_null')
            {
                if(document.forms[form_name].elements[input].value == 0 || !integer_regexp.test(document.forms[form_name].elements[input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }
            else if(checking.limit == 'integer_empty')
            {
                if(document.forms[form_name].elements[input].value.length>0  && !integer_regexp.test(document.forms[form_name].elements[input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }
            else if(checking.limit == 'date')
            {
                if(!date_regexp.test(document.forms[form_name].elements[input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }
            else if(checking.limit == 'date_empty')
            {
                if(document.forms[form_name].elements[input].value.length > 0 && !date_regexp.test(document.forms[form_name].elements[input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }
            else if(checking.limit == 'year')
            {
                if(!year_regexp.test(document.forms[form_name].elements[input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }
            else if(checking.limit == 'year_empty')
            {
                if(document.forms[form_name].elements[input].value.length > 0 && !year_regexp.test(document.forms[form_name].elements[input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }
            else if(checking.limit == 'date_empty')
            {
                if(document.forms[form_name].elements[input].value.length>0  && !date_regexp.test(document.forms[form_name].elements[input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }
            else if(checking.limit == 'numeric')
            {
                if(!numeric_regexp.test(document.forms[form_name].elements[input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }
            else if(checking.limit == 'numeric_empty')
            {
                if(document.forms[form_name].elements[input].value.length>0  && !numeric_regexp.test(document.forms[form_name].elements[input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }
            else if(checking.limit == 'email')
            {
                //alert(document.forms[form_name].elements[input].value.length);
                if(!mail_regexp.test(document.forms[form_name].elements[input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }
            else if(checking.limit == 'email_empty')
            {
                //alert(document.forms[form_name].elements[input].value.length);
                if(!mail_regexp.test(document.forms[form_name].elements[input].value) && document.forms[form_name].elements[input].value.length > 0)
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }
            else if(checking.limit == 'password_register')
            {
                //alert(document.forms[form_name].elements[input].value);
                //alert(document.forms[form_name].elements['retype_' + input].value);
                if(!password_regexp.test(document.forms[form_name].elements[input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
                else if(!password_regexp.test(document.forms[form_name].elements['retype_' + input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements['retype_' + input], checking.message);
                    add_new_error_style(document.forms[form_name].elements['retype_' + input], checking.message, current);
                }
                else if(document.forms[form_name].elements[input].value != document.forms[form_name].elements['retype_' + input].value)
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], 'Password mismatch');
                    add_new_error_style(document.forms[form_name].elements[input], 'Password mismatch', current);
                }
            }
            else if(checking.limit == 'email_register')
            {
                //alert(document.forms[form_name].elements[input].value);
                //alert(document.forms[form_name].elements['retype_' + input].value);
                if(!mail_regexp.test(document.forms[form_name].elements[input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
                else if(!mail_regexp.test(document.forms[form_name].elements['retype_' + input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements['retype_' + input], checking.message);
                    add_new_error_style(document.forms[form_name].elements['retype_' + input], checking.message, current);
                }
                else if(document.forms[form_name].elements[input].value != document.forms[form_name].elements['retype_' + input].value)
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], 'Email mismatch');
                    add_new_error_style(document.forms[form_name].elements[input], 'Email mismatch', current);
                }
            }
            else if (checking.limit == 'url')
            {

                if (!url_regexp.test(document.forms[form_name].elements[input].value))
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }
            else if (checking.limit == 'notempty')
            {
                if (!document.forms[form_name].elements[input].value)
                {
                    result = false;
                    //add_error_style(document.forms[form_name].elements[input], checking.message);
                    add_new_error_style(document.forms[form_name].elements[input], checking.message, current);
                }
            }

        } catch (exception) {
            console.log(exception.name + ":" + exception.message + "\n" + exception.stack)
		}

        return result;
    }
	function check(form_name,current)
	{
        var no_error = true;

        try {
            if (current) {
                try {
                    no_error = check_process(form_name,currentElement.attr('name'),true,current)
                } finally {
                    if (no_error) clear_error(currentElement);
                    currentElement = null;
                }
            } else {
                clear_errors();
                if(typeof(to_check[form_name]) != 'undefined') {
                    for(var input in to_check[form_name]) {no_error=check_process(form_name,input,no_error,current)}
                }
                if(!no_error) create_box(form_name);
            }
        } catch (exception) {
            return false;
            console.log(exception.name + ":" + exception.message + "\n" + exception.stack)
        }

        //if (no_error) alert('alarm');
        return no_error;
	}
	
	this.check = check;
    
    function create_box(name_of_form)
    {
        /*var row = document.getElementById("submit");
        	row = row.getElementsByClassName("col-sm-12")[0];

        if (row) {
            var newDiv = document.createElement('span');
            newDiv.className = 'label label-danger';
            newDiv.id = 'required_id';
            newDiv.innerHTML = 'Required fields*';

            try {
                /!*row.cells[0].appendChild(newDiv);*!/
                row.appendChild(newDiv);
			} catch (exception) {
            	console.log(exception.name + ":" + exception.message + "\n" + exception.stack)
			}

        }*/
        var target = $('#submit .col-sm-12');
        target.append('<span id="required_id" class="with-errors help-block">Required fields*</span>');
        target.addClass('has-error');
    }
	
	function clear_errors()
	{
		for(var wp = 0; wp < inputsWithErrors.length; wp++) 
		{
	    	    if(typeof(inputsWithErrors[wp]) != 'undefined' && typeof(inputsWithErrors[wp].parentNode) != 'undefined' && inputsWithErrors[wp].parentNode != null)
	    	    {
	        	   //inputsWithErrors[wp].parentNode.removeChild(inputsWithErrors[wp].parentNode.lastChild);

                    $(inputsWithErrors[wp]).siblings('.help-block').remove();
                   	$(inputsWithErrors[wp]).closest('div[class^="col-sm-"]').removeClass('has-error has-warning');
	    	    }
		}
        var el = document.getElementById('required_id');
        if (el) el.parentNode.removeChild(el);

		this.focus = false;
		inputsWithErrors = new Array();
	}
    function clear_error(element) {
    	var tmp = element.siblings('.help-block');
        //var tmp = element.siblings('.help-block');
		$(tmp).remove();
		element.closest('div[class^="col-sm-"]').removeClass('has-error has-warning');
    }
	
    function add_new_error_style(input, txt, current)
    {

		var id_temp 				= $(input).attr("name");
		var local_main_container 	= $(input).closest('div[class^="col-sm-"]');
			local_main_container.addClass('has-error');
		var $id_t 					= $('#id_' + id_temp);

		if ( !local_main_container.find('.validation').length ) {
            local_main_container.append("<div class='validation with-errors help-block' id=id_" + id_temp + " >" + txt + "</div>");
		}
		else {
			if ($id_t.css('visibility') == 'hidden') {
				$id_t.css('visibility', 'visible');
			}
		}
		var position = local_main_container.position();
	 	var $id =  $('#id_'+id_temp);
	 	$id.click(function(){return check_error_click(this);});
	 	$id.css('left', position.left + 24);
	 	$id.css('top', position.top - 5);
        if (!current) inputsWithErrors.push(input);
  
    }
    
    function check_error_click(elem)
	{
		var el = document.activeElement;
		var name = elem.name;
		var div = document.getElementById('id_'+ name);
		if (div && div.className=='validation')
		{
	 		div.style.visibility = 'hidden';
		}
		else if(elem.id && elem.className=='validation')
		{
			var temp = document.getElementById(elem.id);
			temp.style.visibility = 'hidden';
		}
	}

	function add_error_style(input, txt) 
    {
		var style = "FFFFFF";//get_current_bgcolor(input);
	        if (!this.focus) 
	        {
	        	input.focus(); 
	        	this.focus = true;
	        }
		if(input.parentNode.innerHTML.search(txt) == -1) 
		{
			var errorTextNode = null;
			if(span)
			{
				errorTextNode = document.createElement('span');
				errorTextNode.style.margin='0px';
			}
			else
			{
				errorTextNode = document.createElement('small');
			}
	            
	        errorTextNode.className = 'required_class';
		    /*if(span)
		    {
			errorTextNode.innerHTML = '<br/>' + txt;
		    }
		    else
		    {*/
			errorTextNode.innerHTML = '' + txt;
		    //}
	            input.parentNode.appendChild(errorTextNode);              
		}
	
		input.style.backgroundColor = "#FF0000";
		inputsWithErrors.push(input);
	
		for(wp = 1; wp <= 10; wp++)
		{
	        window.setTimeout('validator.fade_error_style("'+style+'", ' + wp * 10 + ')', 1000 + (wp * 50));
		}
    }
    
    this.fade_error_style = fade_error_style;
    
    
    function fade_error_style(normalStyle, percent) 
	{       
	    var errorStyle = 'c60c30';
	    var r1 = hex2dec(errorStyle.slice(0,2));
	    var g1 = hex2dec(errorStyle.slice(2,4));
	    var b1 = hex2dec(errorStyle.slice(4,6));
	    
	    var r2 = hex2dec(normalStyle.slice(0,2));
	    var g2 = hex2dec(normalStyle.slice(2,4));
	    var b2 = hex2dec(normalStyle.slice(4,6));
	
	    var pc = percent / 100;
	
	    r= Math.floor(r1+(pc*(r2-r1)) + .5);
	    g= Math.floor(g1+(pc*(g2-g1)) + .5);
	    b= Math.floor(b1+(pc*(b2-b1)) + .5);
	
	    for(var wp = 0; wp < inputsWithErrors.length; wp++) {
	            inputsWithErrors[wp].style.backgroundColor = "#" + dec2hex(r) + dec2hex(g) + dec2hex(b);
	    }
	}
	function hex2dec(hex)
	{
		return(parseInt(hex,16));
	}

	function dec2hex(dec) 
	{
		return(hexDigit[dec>>4]+hexDigit[dec&15]);
	}
	
	
	function get_current_bgcolor(input) 
	{
	    if(input.currentStyle) 
	    {// ie 
	        var style = input.currentStyle.backgroundColor;
	        return style.substring(1,7);
	    }
	    else {// moz
	        var style = '';
	        styleRGB = document.defaultView.getComputedStyle(input, '').getPropertyValue("background-color");
	        var comma = styleRGB.indexOf(',');
	       	style += dec2hex(styleRGB.substring(4, comma));
	        var commaPrevious = comma;
	        comma = styleRGB.indexOf(',', commaPrevious+1);
	        style += dec2hex(styleRGB.substring(commaPrevious+2, comma));
	        style += dec2hex(styleRGB.substring(comma+2, styleRGB.lastIndexOf(')')));
	        return style;
	    }
	}

}

var validator = new Validator();
