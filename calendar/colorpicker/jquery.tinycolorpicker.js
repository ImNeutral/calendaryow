;(function(factory) {
    if(typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    else if(typeof exports === 'object') {
        module.exports = factory(require("jquery"));
    }
    else {
        factory(jQuery);
    }
}
(function($) {
    var pluginName = "tinycolorpicker"
    ,   defaults   = {
            colors : ["#ffffff", "#A7194B","#FE2712","#FB9902","#FABC02","#FEFE33","#D0EA2B","#66B032","#0391CE","#0247FE","#3D01A5","#8601AF"]
        ,   backgroundUrl : null
        }
    ;

    function Plugin($container, options) {
        /**
         * The options of the colorpicker extended with the defaults.
         *
         * @property options
         * @type Object
         */
        this.options = $.extend({}, defaults, options);

        /**
         * @property _defaults
         * @type Object
         * @private
         * @default defaults
         */
        this._defaults = defaults;

        /**
         * @property _name
         * @type String
         * @private
         * @final
         * @default 'tinycolorpicker'
         */
        this._name = pluginName;

        var self = this
        ,   $track = $container.find(".track")
        ,   $color = $container.find(".color")
        ,   $canvas = null
        ,   $colorInput = $container.find(".colorInput")
        ,   $dropdown = $container.find(".dropdown")
        ,   $dropdownItem = $dropdown.find("li").remove()

        ,   context = null
        ,   mouseIsDown = false
        ,   hasCanvas = !!document.createElement("canvas").getContext
        ,   touchEvents = "ontouchstart" in document.documentElement
        ;

        /**
         * The current active color in hex.
         *
         * @property colorHex
         * @type String
         * @default ""
         */
        this.colorHex = "";

        /**
         * The current active color in rgb.
         *
         * @property colorRGB
         * @type String
         * @default ""
         */
        this.colorRGB = "";

        /**
         * @method _initialize
         * @private
         */
        function _initialize() {
            if(hasCanvas) {
                $canvas = $("<canvas></canvas>");
                $track.append($canvas);

                context = $canvas[0].getContext( "2d" );

                _setImage();
            }
            else {
                $.each(self.options.colors, function(index, color) {
                    var $clone = $dropdownItem.clone();

                    $clone.css("backgroundColor", color);
                    $clone.attr("data-color", color);

                    $dropdown.append($clone);
                });
            }

            _setEvents();

            return self;
        }

        /**
         * @method _setImage
         * @private
         */
        function _setImage() {
            var colorPicker = new Image();
            $track.css("background-image", "none");

            //colorPicker.src = "data:image/png;base64,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";
            colorPicker.src = "data:image/png;base64,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";
            colorPicker.crossOrigin = "Anonymous";
            $(colorPicker).load(function() {
                $canvas.attr("width", this.width);
                $canvas.attr("height", this.height);

                context.drawImage(colorPicker, 0, 0, this.width, this.height);
            });
        }

        /**
         * @method _setEvents
         * @private
         */
        function _setEvents() {
            var eventType = touchEvents ? "touchstart" : "mousedown";

            if(hasCanvas) {
                $color.bind(eventType, function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    $track.toggle();

                    $(document).bind("mousedown.colorpicker", function(event) {
                        $(document).unbind(".colorpicker");

                        self.close();
                    });
                });

                if(!touchEvents) {
                    $canvas.mousedown(function(event) {
                        mouseIsDown = true;

                        _getColorCanvas(event);

                        $(document).bind("mouseup.colorpicker", function(event) {
                            $(document).unbind(".colorpicker");

                            self.close();

                            return false;
                        });

                        return false;
                    });

                    $canvas.mousemove(_getColorCanvas);
                }
                else {
                    $canvas.bind("touchstart", function(event) {
                        mouseIsDown = true;

                        _getColorCanvas(event.originalEvent.touches[0]);

                        return false;
                    });

                    $canvas.bind("touchmove", function(event) {
                        _getColorCanvas(event.originalEvent.touches[0]);

                        return false;
                    });

                    $canvas.bind("touchend", function(event) {
                        self.close();

                        return false;
                    });
                }
            }
            else {
                $color.bind("mousedown", function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    $dropdown.toggle();
                });

                $dropdown.delegate("li", "mousedown", function(event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    var color = $(this).attr("data-color");

                    self.setColor(color);

                    $dropdown.hide();
                });
            }
        }

        /**
         * @method _getColorCanvas
         * @private
         */
        function _getColorCanvas(event) {
            if(mouseIsDown) {
                var $target = $(event.target)
                ,   offset = $target.offset()
                ,   colorData = context.getImageData(event.pageX - offset.left, event.pageY - offset.top, 1, 1).data
                ;

                self.setColor("rgb(" + colorData[0] + "," + colorData[1] + "," + colorData[2] + ")");

                /**
                 * The change event will trigger when a new color is set.
                 *
                 * @event change
                 */
                $container.trigger("change", [self.colorHex, self.colorRGB]);
            }
        }

        /**
         * Set the color to a given hex or rgb color.
         *
         * @method setColor
         * @chainable
         */
        this.setColor = function(color) {
            if(color.indexOf("#") >= 0) {
                self.colorHex = color;
                self.colorRGB = self.hexToRgb(self.colorHex);
            }
            else {
                self.colorRGB = color;
                self.colorHex = self.rgbToHex(self.colorRGB);
            }

            $color.find(".colorInner").css("backgroundColor", self.colorHex);
            $colorInput.val(self.colorHex);
        };

        /**
         * Close the picker
         *
         * @method close
         * @chainable
         */
        this.close = function() {
            mouseIsDown = false;

            $track.hide();
        };

        /**
         * Convert hex to rgb
         *
         * @method hexToRgb
         * @chainable
         */
        this.hexToRgb = function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

            return "rgb(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + ")";
        };

        /**
         * Convert rgb to hex
         *
         * @method rgbToHex
         * @chainable
         */
        this.rgbToHex = function(rgb) {
            var result = rgb.match(/\d+/g);

            function hex(x) {
                var digits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
                return isNaN(x) ? "00" : digits[(x - x % 16 ) / 16] + digits[x % 16];
            }

            return "#" + hex(result[0]) + hex(result[1]) + hex(result[2]);
        };

       return _initialize();
    }

    /**
     * @class tinycolorpicker
     * @constructor
     * @param {Object} options
        @param {Array} [options.colors=[]] fallback colors for old browsers (ie8-).
        @param {String} [options.backgroundUrl=''] It will look for a css image on the track div. If not found it will look if there's a url in this property.
     */
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if(!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin($(this), options));
            }
        });
    };
}));
