SideBox = function () {

    var t = this;
    t.filter = {'title': "", 'description': "", 'text': "", 'status': "", 'global_search': ""};

    t.function_formatter = function (eCell, oRecord, oColumn, oData) {
        eCell.data_table_i = this;

        var delete_href = '<a href="javascript:void(0);" onclick="sidebox.delete_sidebox(' + oData + ');">' + icon_const.delete_i() + '</a> ',
            edit_href = '<a href="' + script_url + 'AdminSideBox/' + oData + '">' + icon_const.edit() + '</a> ',
            act_href = '';

        if (oRecord.getData('box_active') == 1)
            act_href = '<a href="javascript:void(0);" onclick="sidebox.deactive(' + oData + ' );">' + icon_const.deact() + '</a> ';
        else
            act_href = '<a href="javascript:void(0);" onclick="sidebox.active(' + oData + ' );">' + icon_const.act() + '</a> ';

        eCell.innerHTML = edit_href + act_href + delete_href;
    };

    t.function_active_formatter = function (eCell, oRecord, oColumn, oData) {
        if (oData == 1)
            eCell.innerHTML = 'Active';
        else
            eCell.innerHTML = '<p class="important">Inactive</p>';
    };

    t.deactive = function (id) {
        params = {id: id, action: 'deactive'};
        var req = new JsHttpRequest();

        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                sidebox_list.onPaginatorChangeRequest(sidebox_list.getState().pagination);
            }
        };
        req.caching = false;
        req.open('POST', ajax_prefix + '?rm=ajax_manage_sidebox', true);
        req.send(params);
    };

    t.active = function (id) {
        params = {id: id, action: 'active'};
        var req = new JsHttpRequest();

        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                sidebox_list.onPaginatorChangeRequest(sidebox_list.getState().pagination);
            }
        };
        req.caching = false;
        req.open('POST', ajax_prefix + '?rm=ajax_manage_sidebox', true);
        req.send(params);
    };

    t.delete_sidebox = function (id) {
        confirm_callback(
            {
                title : 'Are you sure?',
                type: 'warning'
            },
            function(){
                params = {id: id, action: 'delete'};
                var req = new JsHttpRequest();

                req.onreadystatechange = function () {
                    if (req.readyState == 4) {
                        if (req.responseJS.errors) {
                            var str = '';
                            for (var i = 0; i < req.responseJS.errors.length; i++) {
                                str += req.responseJS.errors[i] + '\n';
                            }
                            swal('Error!', str, 'error');
                        }
                        sidebox_list.onPaginatorChangeRequest(sidebox_list.getState().pagination);
                    }
                };
                req.caching = false;
                req.open('POST', ajax_prefix + '?rm=ajax_manage_sidebox', true);
                req.send(params);
            }
        );
    };

    t.edit_sidebox = function (id, action) {
        if (this['e_c_overlay'] == undefined) {
            this['e_c_overlay'] = new YAHOO.widget.Panel('e_c_overlay', {
                width: "800px",
                //height: "550px",
                visible: true,
                close: true,
                constraintoviewport: true,
                fixedcenter: true,
                modal: true,
                draggable: false
            });
            this['e_c_overlay'].hideEvent.subscribe(function(){
                tinymce.EditorManager.activeEditor.remove();
            });
            this['e_c_overlay']._focusFirstModal = function() {};
        }
        this['e_c_overlay'].setHeader(id > 0 ? 'Edit Side Box' : 'Add Side Box');
        this['e_c_overlay'].setBody('Loading...');
        this['e_c_overlay'].setFooter('');
        this['e_c_overlay'].render(document.body);

        if (action != undefined && (!action[5]))  params = {id: id, align: action[3], page_id: action[4], seo: action[2]};
        else if (action != undefined && (action[5]))  params = {id: id, seo: action[2]};
        else
            params = {id: id, action: 'edit'};

        var req = new JsHttpRequest();
        req.overlay = this['e_c_overlay'];
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                req.overlay.setBody(req.responseJS.html);
                req.overlay.show();
                validator.add('sidebox_manager');
                init_scrollbar(".sections");

                load_tiny(function () {
                    req.overlay.center();
                });
                req.overlay.subscribe("hide", function (event) {
                    if ((action != undefined) && action[2] && action[2] != 'p')document.location.href = url + action[2];
                });
                req.overlay.center();
            }
        };
        req.caching = false;
        req.open('POST', ajax_prefix + '?rm=ajax_edit_sidebox', true);
        req.send(params);
    };

    t.save_sidebox = function (form_id) {
        if (!validator.check('sidebox_manager'))  return false;
        //now we prepared params and ready to send
        document.forms[form_id].elements['text'].value = tinyMCE.get('textid').getContent();
        var params = get_form_params(form_id);
        var req = new JsHttpRequest();
        params['active'] = 1;
        params['save'] = 1;
        req.sidebox = this;
        req.overlay = this['e_c_overlay'];

        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (!req.responseJS.success) {
                    req.sidebox['e_c_overlay'].setBody(req.responseJS.html);
                }
                else {
                    if (req.sidebox['e_c_overlay'] != undefined) {
                        tinymce.EditorManager.activeEditor.remove();
                        req.sidebox['e_c_overlay'].destroy();
                        delete req.sidebox['e_c_overlay'];
                        
                        if (req.responseJS.flag != 0)
                        {
                            swal('Error!', 'This has not been applied to all Pages. The maximum number has been reached on some pages', 'error');
                        }

                        if (params['seo'] != undefined && params['seo'] != "undefined" && params['seo'] != "" && params['seo'] != "0") {
                            if (params['seo'] == url) {
                                document.location.href = url;
                            } else {
                                document.location.href = url + params['seo'];
                            }
                           
                            return;
                            /* if (req.responseJS.errors) {
                                var errors_plain = "";
                                for (var i = 0; i < req.responseJS.errors.length; i++) {
                                    errors_plain += req.responseJS.errors[i] + "\r\n";
                                }
                                alert(errors_plain);
                                }*/
                        }
                    }

                    sidebox_list.onPaginatorChangeRequest(sidebox_list.getState().pagination);
                }
            }
        };
        req.caching = false;
        req.open('POST', ajax_prefix + '?rm=ajax_edit_sidebox', true);
        req.send(params);
    };

    t.save_order = function (list) {

        var req = new JsHttpRequest();
        var params = {};
        params['out'] = list;
        params['action'] = 'save_order';
        req.overlay = this['e_c_overlay'];

        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (!req.responseJS.success) {
                    if (req.responseJS.errors) {
                        var errors_plain = "";
                        for (var i = 0; i < req.responseJS.errors.length; i++) {
                            errors_plain += req.responseJS.errors[i] + "\r\n";
                        }
                        swal('Error!', errors_plain, 'error');
                        document.location.reload();
                    }
                }
            }
        };

        req.caching = false;
        req.open('POST', ajax_prefix + '?rm=ajax_manage_sidebox_page', true);
        req.send(params);
    };

    t.delete_assignment = function (assignment_id, button) {

        var req = new JsHttpRequest(),
            params = {id: assignment_id};

        jQuery(button).hide().before("<span>Deleting...</span>");

        req.overlay = this['e_c_overlay'];

        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (!req.responseJS.success) {
                    swal('Error!', 'An error occurred', 'error');
                } else {
                    jQuery(button).parent().parent().remove();
                }
            }
        };

        req.caching = false;
        req.open('POST', ajax_prefix + '?rm=ajax_delete_sidebox_page', true);
        req.send(params);
    };

    t.all_pages = function(sidebox_id)
    {
         if (this['a_a_overlay'] == undefined) {
            this['a_a_overlay'] = new YAHOO.widget.Panel('a_a_overlay', {
                width: "500px",
                visible: true,
                close: true,
                constraintoviewport: true,
                fixedcenter: true,
                modal: true,
                draggable: true
            });
        }
        this['a_a_overlay'].setHeader("All Pages");
        this['a_a_overlay'].setBody('Loading...');
        this['a_a_overlay'].setFooter('');
        this['a_a_overlay'].render(document.body);

        var params = {"id": sidebox_id};
        var req = new JsHttpRequest();
        req.overlay = this['a_a_overlay'];
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                req.overlay.setBody(req.responseJS.html);
                req.overlay.show();
                req.overlay.center();
            }
        };
        req.caching = false;
        req.open('POST', ajax_prefix + '?rm=ajax_sidebox_pages', true);
        req.send(params);
    };
    
    t.all_pages_admin = function (eCell, oRecord, oColumn, oData)
    {
         if (oRecord.getData('all_pages_count')!= 0)
            eCell.innerHTML = '<a href="javascript:void(0);" onclick="sidebox.all_pages(' + oData + ' );">' + oRecord.getData('all_pages_count') + '</a> ';
        else
            eCell.innerHTML = oRecord.getData('all_pages_count');
    };

    t.attach_to_all_pages = function (sidebox_id) {
        if (this['a_a_overlay'] == undefined) {
            this['a_a_overlay'] = new YAHOO.widget.Panel('a_a_overlay', {
                width: "300px",
                visible: true,
                close: true,
                constraintoviewport: true,
                fixedcenter: true,
                modal: true,
                draggable: true
            });
        }
        this['a_a_overlay'].setHeader("Attach Settings");
        this['a_a_overlay'].setBody('Loading...');
        this['a_a_overlay'].setFooter('');
        this['a_a_overlay'].render(document.body);

        var params = {"sidebox_id": sidebox_id};
        var req = new JsHttpRequest();
        req.overlay = this['a_a_overlay'];
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                req.overlay.setBody(req.responseJS.html);
                req.overlay.show();
                req.overlay.center();
            }
        };
        req.caching = false;
        req.open('POST', ajax_prefix + '?rm=ajax_sidebox_attach_to_all', true);
        req.send(params);
    };

    t.attach_to_all_pages_save = function (form_id) {
        var params = get_form_params(form_id),
            req = new JsHttpRequest();

        req.a_overlay = this['a_a_overlay'];
        req.edit_overlay = this['e_c_overlay'];
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                req.a_overlay.hide();
                req.edit_overlay.hide();
                if (req.responseJS.flag != 0)
                {
                    swal('Error!', 'This has not been applied to all Pages. The maximum number has been reached on some pages', 'error');
                }
                sidebox_list.onPaginatorChangeRequest(sidebox_list.getState().pagination);
                
            }
        };
        req.caching = false;
        req.open('POST', ajax_prefix + '?rm=ajax_sidebox_attach_to_all', true);
        req.send(params);
    };

    t.delete_from_all_pages = function (sidebox_id) {
        var params = {"sidebox_id": sidebox_id},
            req = new JsHttpRequest();

        req.edit_overlay = this['e_c_overlay'];
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                req.edit_overlay.hide();
                sidebox_list.onPaginatorChangeRequest(sidebox_list.getState().pagination);
            }
        };
        req.caching = false;
        req.open('POST', ajax_prefix + '?rm=ajax_sidebox_delete_from_all', true);
        req.send(params);
    };

    t.generate_request = function (oState, oSelf) {
        // Set defaults
        oState = oState || {pagination: null, sortedBy: null};
        var sort = (oState.sortedBy) ? oState.sortedBy.key : oSelf.getColumnSet().keys[0].getKey();
        var dir = (oState.sortedBy && oState.sortedBy.dir === YAHOO.widget.DataTable.CLASS_DESC) ? "desc" : "asc";
        var startIndex = (oState.pagination) ? oState.pagination.recordOffset : 0;
        var results = (oState.pagination) ? oState.pagination.rowsPerPage : null;

        // Build the request
        return  "sort=" + sort +
            "&dir=" + dir +
            "&startIndex=" + startIndex +
            "&filter[global_search]=" +  (t.filter['global_search'] || '')+
            "&filter[title]=" + t.filter['title'] +
            "&filter[description]=" + t.filter['description'] +
            "&filter[text]=" + t.filter['text'] +
            "&filter[status]=" + t.filter['status'] +
            ((results !== null) ? "&results=" + results : "");
    };

    t.search_go = function (form_id) {
        t.filter = get_form_params(form_id);
        var pagination = sidebox_list.getState().pagination;
        pagination.recordOffset = 0;
        sidebox_list.onPaginatorChangeRequest(pagination);
    };

    t.search_clear = function (form_id) {
        clear_form(form_id);
        t.search_go(form_id);
    };
};
var sidebox = new SideBox();
