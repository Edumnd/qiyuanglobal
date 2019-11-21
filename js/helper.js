if (typeof($) != 'function') {
    $ = function (id) {
        return document.getElementById(id);
    }
}

function show_hide_el(id) {
    var el = $(id);
    el.style.display = el.style.display == 'block' ? 'none' : 'block';
}

function show_hide_els(id, list) {
    for (i in list) {
        if (document.getElementById(list[i]).style.display == 'block')
            document.getElementById(list[i]).style.display = 'none';
    }
    show_hide_el(id);
}

function clear_form(form_id) {
	var f = typeof(form_id)=='object' ? $(form_id) : $("#" + form_id);
	f.find('input:text').val("");
	f.find('textarea').html("");
	f.find('input:checkbox').each(function(){this.checked=false;});
	f.find('input:radio').each(function(){this.checked=false;});
	f.find('select').each(function(){$(this).val($(this).find("option:first").val());});
    if($('.selectpicker').length>0){
        $('.selectpicker').selectpicker('render');
    }
}

calendarClear = function () {
    calendar_obj.calendar_el.value = '';
    if (calendar_obj.calendar_hidden_el)
        calendar_obj.calendar_hidden_el.value = '';
    calendar_obj.dialog.hide();
};

calendarClass = function () {
    var calendar_el = null;
    var calendar_hidden_el = null;
    var calendar = null;
    var dialog = null;

    this.show_calendar = function (el, hidden_id, clr_btn, render_obj) {
        this.calendar_el = el;
        this.calendar_hidden_el = hidden_id ? $(hidden_id) : null;
        clr_btn = true;
        if (!this.dialog) {
            this.dialog = new YAHOO.widget.Dialog('container_calendar', {
                visible: false,
                buttons: [],
                draggable: false,
                close: true
            });
            this.dialog.setHeader('Pick A Date');
            this.dialog.setBody('<h1>Pick a Date</h1><div id="calendar_box_id" style="margin: 0 0 5px 0; float: none;"></div><div>Hour:<input type="text" name="calendar_hour" id="calendar_hour_id" maxlength="2" style="width:20px">Minute:<input style="width:20px" type="text" name="calendar_minute" id="calendar_minute_id" maxlength="2"></div>');
            this.dialog.render(render_obj);

            this.dialog.showEvent.subscribe(function () {
                if (YAHOO.env.ua.ie) this.dialog.fireEvent("changeContent");
            });
        }
        this.dialog.cfg.setProperty('context', [el, "tl", "bl"]);

        this.dialog.cfg.setProperty('buttons', clr_btn ? [
            {text: "Clear", handler: calendarClear, isDefault: false},
            {text: "Set", handler: {
                fn: this.set_dt, // The handler to call when the event fires.
                obj: this, // An object to pass back to the handler.
                scope: this // The object to use for the scope of the handler.
            }, isDefault: true}
        ] : []);

        if (!this.calendar) {
            this.calendar = new YAHOO.widget.Calendar("calendar_box_id", {
                navigator: true,
                hide_blank_weeks: true
            });

            this.calendar.render();

            this.calendar.selectEvent.subscribe(function () {
                if (this.calendar.getSelectedDates().length > 0) {
                    var selDate = this.calendar.getSelectedDates()[0];
                    // Pretty Date Output, using Calendar's Locale values: Friday, 8 February 2008
                    //var wStr = this.calendar.cfg.getProperty("WEEKDAYS_LONG")[selDate.getDay()];
                    var dStr = selDate.getDate();
                    var mStr = selDate.getMonth() + 1;
                    var yStr = selDate.getFullYear();
                    var hour = parseInt($('#calendar_hour_id').val());
                    if (isNaN(hour))
                        hour = 0;
                    var minute = parseInt($('#calendar_minute_id').val());
                    if (isNaN(minute))
                        minute = 0;
                    if ((mStr + '').length == 1)
                        mStr = "0" + mStr;
                    if ((dStr + '').length == 1)
                        dStr = "0" + dStr;
                    if ((hour + '').length == 1)
                        hour = "0" + hour;
                    if ((minute + '').length == 1)
                        minute = "0" + minute;
                    var res = dStr + '/' + mStr + '/' + yStr + ' ' + hour + ':' + minute;
                    this.calendar_el.value = res;
                    if (this.calendar_hidden_el)
                        this.calendar_hidden_el.value = res;
                } else {
                }
                //this.dialog.hide();
            }, this, true);
            this.dialog.calendar = this.caledar;
        }
        var cur_date = new Date();

        var input_date = this.calendar_el.value;

        if (input_date != '' && input_date != '-') {
            var input_date_time = input_date.split(' ');
            var splt = input_date_time[0].split('/');
            var y = parseInt(splt[2], 10),
                m = parseInt(splt[1], 10) - 1,
                d = parseInt(splt[0], 10);
            var hour = parseInt($('#calendar_hour_id').val());
            if (isNaN(hour))
                hour = 0;
            var minute = parseInt($('#calendar_minute_id').val());
            if (isNaN(minute))
                minute = 0;
            if (!isNaN(y) && !isNaN(m) && !isNaN(d))
                cur_date.setFullYear(y, m, d);
            var splt2 = input_date_time[1].split(':');
            $('#calendar_hour_id').val(splt2[0]);
            $('#calendar_minute_id').val(splt2[1]);
        }


        this.calendar.select(cur_date);
        this.calendar.setYear(cur_date.getFullYear());
        this.calendar.setMonth(cur_date.getMonth());
        this.calendar.render();
        this.dialog.show();
        this.dialog.bringToTop();
    };

    this.set_dt = function () {
        if (this.calendar.getSelectedDates().length > 0) {
            var selDate = this.calendar.getSelectedDates()[0];
            var dStr = selDate.getDate();
            var mStr = selDate.getMonth() + 1;
            var yStr = selDate.getFullYear();
            var hour = parseInt($('#calendar_hour_id').val());
            if (isNaN(hour))
                hour = 0;
            var minute = parseInt($('#calendar_minute_id').val());
            if (isNaN(minute))
                minute = 0;
            if ((mStr + '').length == 1)
                mStr = "0" + mStr;
            if ((dStr + '').length == 1)
                dStr = "0" + dStr;
            if ((hour + '').length == 1)
                hour = "0" + hour;
            if ((minute + '').length == 1)
                minute = "0" + minute;
            var res = dStr + '/' + mStr + '/' + yStr + ' ' + hour + ':' + minute;
            this.calendar_el.value = res;
            if (this.calendar_hidden_el)
                this.calendar_hidden_el.value = res;
            this.dialog.hide();
        }
    };

    this.hide_calendar = function () {
        if (this.dialog) {
            this.dialog.hide();
        }
    };
};
var calendar_obj = new calendarClass();

function create_overlay(overlay_id, sizes, header, footer, body) {
    var overlay = new YAHOO.widget.Panel(overlay_id, {
        width: sizes['width'],
        height: sizes['height'],
        //height: 'max-content',
        visible: true,
        close: true,
        constraintoviewport: true,
        fixedcenter: 'contained',
        modal: true,
        draggable: false,
        underlay: 'none',
        zindex: 1000
    });
    overlay.hideEvent.subscribe(function(){
        tinymce.EditorManager.activeEditor.remove();
    });
    overlay._focusFirstModal = function() {};


    body = body || "";

    overlay.setHeader(header);
    overlay.setBody(body);
    overlay.setFooter(footer);
    overlay.render(document.body);


    var target = document.getElementById(overlay_id);
    var $target = $(target);
    var lastWidth = 0;

    var observer = new MutationObserver(function(mutations) {
        var newWidth = $target.width();

        if (lastWidth !== newWidth) {
            overlay.center();
            lastWidth = newWidth;
        }
    });

    observer.observe(target, { attributes: true, subtree: true });


    return overlay;
}

function overlay_draw(container, req, tinymce = null, validationName = null, scrollbar = null) {
    container.setBody(req.responseJS.html);
    container.show();

    if (scrollbar!==null) init_scrollbar(scrollbar);
    if (tinymce!==null) {
        try {
            tinymce.EditorManager.activeEditor.remove();
        } catch (Ex) {
            //console.error(Ex.stack);
        }
        load_tiny(function(){container.center();});
    }
    if (validationName!==null) validator.add(validationName);
    container.center();
}

function overlay_draw(container, req, tinymce = null, validationName = null, scrollbar = null) {
    container.setBody(req.responseJS.html);
    container.show();

    if (scrollbar!==null) init_scrollbar(scrollbar);
    if (tinymce!==null) {
        try {
            tinymce.EditorManager.activeEditor.remove();
        } catch (Ex) {
            //console.error(Ex.stack);
        }
        load_tiny(function(){container.center();});
    }
    if (validationName!==null) validator.add(validationName);
    container.center();
}

function message_show(msgText) {
    if (!message_overlay) {
        message_overlay = create_overlay('message_overlay', '400px', '', '', '');
        message_overlay.message_box = new Element('p');
        var btn = new Element('input', {type: 'button', 'class': 'submit', value: 'Ok'});
        btn.onclick = function () {
            message_overlay.hide();
        };
        var msgDiv = new Element('div');
        msgDiv.appendChild(message_overlay.message_box);
        msgDiv.appendChild(btn);
        message_overlay.setBody(msgDiv);
    }
    message_overlay.message_box.innerHTML = msgText;
    message_overlay.show();
}
var message_overlay = null;

function get_form_params(form_id) {
    var params = {};
    //var form = $(form_id);
	var form = typeof(form_id)=='object' ? form_id : document.getElementById(form_id);
    if (form) for (var i = 0, l = form.elements.length; i < l; i++) {
        var element = form.elements[i];
        var type = form.elements[i].type;
        if (form.elements[i].tagName != 'FIELDSET' && form.elements[i].type != 'checkbox' && form.elements[i].type != 'radio')
            params[form.elements[i].name] = form.elements[i].value;

        if (form.elements[i].type == 'textarea' && !form.elements[i].value)
            params[form.elements[i].name] = form.elements[i].value;

        if (form.elements[i].type == 'checkbox' && form.elements[i].checked)
            params[form.elements[i].name] = form.elements[i].value;
        else if (form.elements[i].type == 'checkbox' && !form.elements[i].checked)
            params[form.elements[i].name] = '';
        if (form.elements[i].type == 'radio' && form.elements[i].checked)
            params[form.elements[i].name] = form.elements[i].value;

        if (form.elements[i].type == 'select-multiple') {
            var values = [];
            for (var o = 0; o < form.elements[i].options.length; o++)
                if (form.elements[i].options[o].selected)
                    values[values.length] = form.elements[i].options[o].value;
            params[form.elements[i].name] = values;
        }
    }
    return params;
}

Wait = function () {
    var t = this;
    t.open = function (message) {
        if (message == undefined) message = 'Loading, please wait...';
        if (!this['wait']) {
            this['wait'] = create_overlay('wait_overlay', '240px', '', '', '');
            this['wait'].setBody('2<img src="http://l.yimg.com/a/i/us/per/gr/gp/rel_interstitial_loading.gif" />');
        }
        this['wait'].setHeader(message);
        this['wait'].show();
    }

    t.close = function () {
        this['wait'].hide();
    }
}
wait = new Wait();

function addOption(oListbox, text, value, isDefaultSelected, isSelected) {
    var oOption = document.createElement("option");
    oOption.appendChild(document.createTextNode(text));
    oOption.setAttribute("value", value);
    if (isDefaultSelected) oOption.defaultSelected = true;
    else if (isSelected) oOption.selected = true;
    if (oListbox != null)
        oListbox.appendChild(oOption);
}
function fillSelect(select_id, items, selected_id, id_field, title_field) {
    if ($(select_id) != undefined) {
        var select_obj = typeof(select_id)=='object' ? select_id : $('#'+select_id)[0];
        select_obj.options.length = 1;
        for (var i = 0, l = items.length; i < l; i++) {
            addOption(select_obj, items[i][title_field], items[i][id_field], false, (items[i][id_field] == selected_id ? true : false));
        }
    }
}

// serure password
function keyup_password(input, result) {
    $(input).keyup(function () {
        $(input).val($(input).val().replace(/[^A-Za-z0-9!@#$%^]+/g, ''));
        var pass = $(input).val();
        $(result).text(check(pass));
    });
}

function check(pass) {
    var protect = 0;

    if (pass.length == 0) {
        $("#bg_res").removeClass();
        return "";
    }

    if (pass.length < 8) {

        $("#bg_res").removeClass();
        $("#bg_res").addClass('sp-h-red');

        var len = pass.length === 7 ? pass.length + 1 : pass.length;
        return 'Weak ' + len + '|8';
    }

    var upperCase = new RegExp('[A-Z]');
    var lowerCase = new RegExp('[a-z]');
    var numbers = new RegExp('[0-9]');
    var specialchars = new RegExp('([!,%,&,@,#,$,^,*,?,_,~])');





    //a,s,d,f
    //  var small = "([a-z]+)";
    if (pass.match(lowerCase)) {
        protect++;
    }
    //A,B,C,D
    //  var big = "([A-Z]+)";
    if (pass.match(upperCase)) {
        protect++;
    }
    //1,2,3,4,5 ... 0
    //  var numb = "([0-9]+)";
    if (pass.match(numbers)) {
        protect++;
    }
    //!@#$
    // var vv = "([!@#$%^]+)";
    if (pass.match(specialchars)) {
        protect++;
    }
    if (protect == 2) {
        $("#bg_res").removeClass();
        $("#bg_res").addClass('sp-h-yellow');
        return "Medium";
    }
    if (protect == 3) {
        $("#bg_res").removeClass();
        $("#bg_res").addClass('sp-h-green');
        return "Good";
    }
    if (protect == 4) {
        $("#bg_res").removeClass();
        $("#bg_res").addClass('sp-h-green-v');
        return "Strong";
    }


}

function tiny_add(elements, custom, params) {
	var options = {
		full: {
			theme: "modern",
			plugins: [
				"advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
				"searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
				"save table contextmenu directionality emoticons template paste textcolor responsivefilemanager cms_link storage"
			],
			content_css: ajax_prefix + "css/main.css",
			toolbar1: "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
			toolbar2: "| responsivefilemanager | link unlink anchor | image media | forecolor backcolor  | print preview code | cms_link storage",
			toolbar3: "styleselect | fontsizeselect",
			relative_urls: false,
			convert_urls: false,
			remove_script_host: true,
			paste_text_sticky: true,
			external_filemanager_path: ajax_prefix + "modules/filemanager/",
			filemanager_title: "Responsive Filemanager",
			external_plugins: {"filemanager": ajax_prefix + "modules/filemanager/plugin.min.js"},
			fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt"
		},
		min: {
		}
	};

	if(typeof(params)!='undefined'){
		if(typeof(params.options)!='undefined' && options[params.options]!='undefined') {
			options = options[params.options];
		} else {
			options = options.full;
		}
	} else {
		options = options.full;
	}
	if(!options.menu)
		options.menu = {
			file: {title: 'File', items: 'newdocument'},
//			edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall'},
			edit: {title: 'Edit', items: 'undo redo | selectall'},
			view: {title: 'View', items: 'visualaid'},
			format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'}
		};

	options.selector = elements;
	if(typeof(custom)!='undefined'){
		for(var i in custom)
			options[i] = custom[i];
	}
	tinymce.init(options);
};

function save_panel_position_manager(obj){
	var t = this;
	t.obj = obj;
	t.obj_marginBottom = function(){
		var window_scroll_bottom = $(document).height() - ($(document).scrollTop() + $(window).height());
		t.obj.style.marginBottom = (window_scroll_bottom<=40 ? 40-window_scroll_bottom : 0) + 'px';
	}
	$(document).scroll(t.obj_marginBottom);
	$(window).resize(t.obj_marginBottom);
}
function select_type(data) {
    var vl      = jQuery(data).val();
    //var tagName = data.tagName.toLowerCase();
    //var selects = document.getElementById('select_id');
    var uSelect = jQuery('.select-type-switch');
    var result  = true;

    if (vl=="") result = false;

    if (result) {

        uSelect.not(data).each(function() {
            $(this).val('');
        });

        /*if (tagName == "input") {
            if (selects.length) {
                selects.options[0].selected=true;
            }
        } else if (tagName == "select") {
            //uSelect.val('');
            //document.getElementById('input_id').value = "";
        }*/
    }
}