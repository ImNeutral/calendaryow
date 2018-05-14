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
