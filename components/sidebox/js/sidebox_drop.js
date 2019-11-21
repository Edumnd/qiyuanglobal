(function () {

    var Dom = YAHOO.util.Dom;
    var Event = YAHOO.util.Event;
    var DDM = YAHOO.util.DragDropMgr;

//////////////////////////////////////////////////////////////////////////////
// example app
//////////////////////////////////////////////////////////////////////////////
    YAHOO.example.DDApp = {

        init: function () {
            var i, j;
            if (document.getElementById("ulleft")) {
                new YAHOO.util.DDTarget("ulleft");
                var left_children = YAHOO.util.Dom.getChildren(document.getElementById("ulleft"));
                for (j = 0; j < left_children.length; j = j + 1)
                    new YAHOO.example.DDList(left_children[j].id);
            }
            if (document.getElementById("ulfooter")) {
                new YAHOO.util.DDTarget("ulfooter");
                var footer_children = YAHOO.util.Dom.getChildren(document.getElementById("ulfooter"));
                for (j = 0; j < footer_children.length; j = j + 1)
                    new YAHOO.example.DDList(footer_children[j].id);

            }
            if (document.getElementById("ulcenter")) {
                new YAHOO.util.DDTarget("ulcenter");
                var center_children = YAHOO.util.Dom.getChildren(document.getElementById("ulcenter"));
                for (j = 0; j < center_children.length; j = j + 1)
                    new YAHOO.example.DDList(center_children[j].id);
            }
            if (document.getElementById("ulright")) {
                new YAHOO.util.DDTarget("ulright");
                var right_children = YAHOO.util.Dom.getChildren(document.getElementById("ulright"));
                for (j = 0; j < right_children.length; j = j + 1)
                    new YAHOO.example.DDList(right_children[j].id);
            }
        },

        showOrder: function () {

            var parseList = function (ul) {
                //var items = ul.getElementsByTagName("li");
                var items = ul.getElementsByClassName("drag_drop_collection_element");

                var out = " ";
                for (i = 0; i < items.length; i = i + 1) {
                    out += items[i].id + ",";
                }
                return out;
            };

            var list = {};
            ul_left = Dom.get("ul" + "left");
            if (ul_left)
                list['left'] = parseList(ul_left);
            ul_center = Dom.get("ul" + "center");
            if (ul_center)
                list['center'] = parseList(ul_center);
            ul_right = Dom.get("ul" + "right");
            if (ul_right)
                list['right'] = parseList(ul_right);
            ul_footer = Dom.get("ul" + "footer");
            if (ul_footer)
                list['footer'] = parseList(ul_footer);
            sidebox.save_order(list);
        }

    };

//////////////////////////////////////////////////////////////////////////////
// custom drag and drop implementation
//////////////////////////////////////////////////////////////////////////////

    YAHOO.example.DDList = function (id, sGroup, config) {

        YAHOO.example.DDList.superclass.constructor.call(this, id, sGroup, config);

        this.logger = this.logger || YAHOO;
        var el = this.getDragEl();
        Dom.setStyle(el, "opacity", 0.67); // The proxy is slightly transparent

        this.goingUp = false;
        this.lastY = 0;
    };

    YAHOO.extend(YAHOO.example.DDList, YAHOO.util.DDProxy, {

        startDrag: function (x, y) {
            this.logger.log(this.id + " startDrag");
            // make the proxy look like the source element
            var dragEl = this.getDragEl();
            var clickEl = this.getEl();
            Dom.setStyle(clickEl, "visibility", "hidden");
            dragEl.innerHTML = clickEl.innerHTML;
            Dom.setStyle(dragEl, "color", Dom.getStyle(clickEl, "color"));
            Dom.setStyle(dragEl, "backgroundColor", Dom.getStyle(clickEl, "backgroundColor"));
            Dom.setStyle(dragEl, "border", "2px solid gray");
        },

        endDrag: function (e) {

            var srcEl = this.getEl();
            var proxy = this.getDragEl();

            // Show the proxy element and animate it to the src element's location
            Dom.setStyle(proxy, "visibility", "");

            var a = new YAHOO.util.Motion(
                proxy, {
                    points: {
                        to: Dom.getXY(srcEl)
                    }
                },
                0.2,
                YAHOO.util.Easing.easeOut
            );

            var proxyid = proxy.id;
            var thisid = this.id;

            // Hide the proxy and show the source element when finished with the animation
            a.onComplete.subscribe(function () {
                Dom.setStyle(proxyid, "visibility", "hidden");
                Dom.setStyle(thisid, "visibility", "");
                Dom.setStyle(thisid, "border", "");
            });
            a.animate();
            YAHOO.example.DDApp.showOrder();
            ul_left = Dom.get("ul" + "left");
            if (ul_left) {
                var items_left = ul_left.getElementsByClassName("drag_drop_collection_element");
                if (items_left.length > 0) {
                    document.getElementById("drop_left").style.display = 'none';
                }
                else {
                    document.getElementById("drop_left").style.display = 'block';
                }
            }

            ul_center = Dom.get("ul" + "center");
            if (ul_center) {
                var items_center = ul_center.getElementsByClassName("drag_drop_collection_element");
                if (items_center.length > 0) {
                    document.getElementById("drop_center").style.display = 'none';
                }
                else {
                    document.getElementById("drop_center").style.display = 'block';
                }
            }

            ul_right = Dom.get("ul" + "right");
            if (ul_right) {
                var items_right = ul_right.getElementsByClassName("drag_drop_collection_element");
                if (items_right.length > 0) {
                    document.getElementById("drop_right").style.display = 'none';
                }
                else {
                    document.getElementById("drop_right").style.display = 'block';
                }
            }
            ul_footer = Dom.get("ul" + "footer");
            if (ul_footer) {
                var items_footer = ul_footer.getElementsByClassName("drag_drop_collection_element");
                if (items_footer.length > 0) {
                    document.getElementById("drop_footer").style.display = 'none';
                }
                else {
                    document.getElementById("drop_footer").style.dzxcisplay = 'block';
                }
            }
            var count_childs = Dom.get(proxyid).children.length;
            for (var i=0; i < count_childs; i++)
                Dom.get(proxyid).children[0].remove();
        },

        onDragDrop: function (e, id) {

            // If there is one drop interaction, the li was dropped either on the list,
            // or it was dropped on the current location of the source element.
            if (DDM.interactionInfo.drop.length === 1) {

                // The position of the cursor at the time of the drop (YAHOO.util.Point)
                var pt = DDM.interactionInfo.point;

                // The region occupied by the source element at the time of the drop
                var region = DDM.interactionInfo.sourceRegion;

                // Check to see if we are over the source element's location.  We will
                // append to the bottom of the list once we are sure it was a drop in
                // the negative space (the area of the list without any list items)
                if (!region.intersect(pt)) {
                    var destEl = Dom.get(id);
                    var destDD = DDM.getDDById(id);
                    //alert(destEl);
                    destEl.appendChild(this.getEl());
                    destDD.isEmpty = false;
                    DDM.refreshCache();
                }

            }
        },

        onDrag: function (e) {

            // Keep track of the direction of the drag for use during onDragOver
            var y = Event.getPageY(e);

            if (y < this.lastY) {
                this.goingUp = true;
            } else if (y > this.lastY) {
                this.goingUp = false;
            }

            this.lastY = y;
        },

        onDragOver: function (e, id) {

            var srcEl = this.getEl();
            var destEl = Dom.get(id);

            // We are only concerned with list items, we ignore the dragover
            // notifications for the list.
            //if (destEl.nodeName.toLowerCase() == "li") {
            if (YAHOO.util.Dom.hasClass(id, 'drag_drop_collection_element')) {
                var orig_p = srcEl.parentNode;
                var p = destEl.parentNode;

                if (this.goingUp) {
                    p.insertBefore(srcEl, destEl); // insert above
                } else {
                    p.insertBefore(srcEl, destEl.nextSibling); // insert below
                }

                DDM.refreshCache();
            }
        }
    });

    Event.onDOMReady(YAHOO.example.DDApp.init, YAHOO.example.DDApp, true);
})();