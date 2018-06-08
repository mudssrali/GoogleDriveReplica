//Step 1: function add in jQuery
//Step 2: Default Settings
//Step 3: this.each
//Step 4: Write your plugin code


//Here Creating an anonymous function and calling it on the spot (at end of code) by providing 'jQuery' as input
/*
(function ($) {


})(jQuery);
*/

(function ($) {

    //jQuery plugin is a function and we need to add to '$.fn' object.
    //Here bsmodal is our plugin/function name which is taking 'options' as input parameter
    $.fn.bsmodal = function (options) {

        //here we created an object 'default' which holds our default settings
        var defaults = {
            width: 200,
            closeid: '#btnclose',
            openid: '#btnopen',
            saveid: '#btnsave',
            height: 200,
            title: 'BS Modal',
            closeText: 'Close Me',
            saveText: 'Save Me',
            overlayClass: 'modaloverlay',
            onOpen: function () {
                //alert('open'); 
            },
            onclose: function () {
                //alert('closing');
            },
            onsave: function () {
                //alert('saving'); 
            }
        };

        //Merge 'defaults' object with 'options' object. here matching properities of 'defaults' will be overridden by 'options' values
        var opt = $.extend(defaults, options);

        //This plugin will be called on a selector, if selector is returning multiple values, we need to iterate all those items
        //here this is reference to the selectors result

        return this.each(function () {

            //Get current object into a variable
            var $obj = $(this);

            //Bind click event, which will show the modal popup
            $obj.click(function () {

                //check if user has provided a call back function to call on 'onOpen' event
                if (typeof opt.onOpen != 'undefined')
                    opt.onOpen();

                //Get overlay object by specific id
                var $over = $("#bsmodaloverlay");

                //check if overlay exists, if doesn't exist, create a new one
                if ($over.length == 0) {
                    //Create a new div for overlay and apply CSS class to it
                    $over = $("<div id='bsmodaloverlay'></div>").addClass(opt.overlayClass);
                    //Append it to body
                    $("body").append($over);
                }

                //Show overlay
                $over.show();

                //We are expecting that, the selector of element we want to show in modal popup should be 
                //in 'popupdiv' attribute of element which will be clicked to open modal popup
                var popupdiv_selector = $obj.attr("popupdiv");

                //Find object by selector
                var $div = $(popupdiv_selector);
                //Add class on popup element
                $div.addClass("popup-box");

                //Some CSS effects
                $div.fadeIn("slow");
                $div.css({ "top": "25%", "left": "35%" });

                //Find object by 'closeid' selector 
                var $close = $(opt.closeid);

                //Bind event on close button to close the popup
                $close.unbind('click').click(function () {
                    //Remove popup class
                    $div.removeClass("popup-box");
                    //Hide popup element
                    $div.hide();
                    //Remove overlay
                    $over.remove();

                    //Raise onClose event if it exists
                    if (opt.onclose != undefined)
                        opt.onclose();

                    return false;
                }); //End of Close

                //Find object by 'saveid' selector 

                var $save = $(opt.saveid);
                //Bind event on save button to close the popup
                $save.unbind('click').click(function () {
                    //Remove popup class
                    $div.removeClass("popup-box");
                    //Hide popup element
                    $div.hide();
                    //Remove overlay
                    $over.remove();

                    //call onSave call backs if it exists
                    if (opt.onsave != undefined)
                        opt.onsave();
                    return false;
                }); //End of Close
                return false;
            }); //End of hyperlink clicked           

        }); //End of Each

    }; //End of plugin

    //Add object to jQuery to handle global functions for bsmodal
    $.bsmodal = {};

    //If user want to show specific popup element at any time
    $.bsmodal.show = function (selector, options) {
        //Create a dummy div, set its selector and call bsmodal plugin function here and also raise the click event
        $("<a popupdiv='" + selector + "' />").bsmodal(options).trigger("click");
    }//end of show

    //To hide a modal by using some selector
    $.bsmodal.hide = function (selector) {
        //Hide modal popup
        $(selector).hide();
        //Remove overlay
        $("#bsmodaloverlay").remove();
    }//End of hide

})(jQuery);


