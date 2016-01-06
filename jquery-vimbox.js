;(function($) {
  
  $(function() {
    var keymap = {
      8: 'backspace', 9: '\t', 13: '\n', 16: 'shift', 17: 'ctrl', 18: 'alt', 19: 'pause', 20: 'caps', 27: 'esc', 32: ' ', 33: 'page up', 34: 'page down', 35: 'end',
      36: 'home', 37: 'left', 38: 'up', 39: 'right', 40: 'down', 45: 'insert', 46: 'delete', 48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8',
      57: '9', 65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h', 73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm', 78: 'n', 79: 'o', 80: 'p', 81: 'q',
      82: 'r', 83: 's', 84: 't', 85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z', 91: 'lwin', 92: 'rwin', 93: 'select', 96: '0', 97: '1', 98: '2', 99: '3', 100: '4',
      101: '5', 102: '6', 103: '7', 104: '8', 105: '9', 112: 'f1', 113: 'f2', 114: 'f3', 115: 'f4', 116: 'f5', 117: 'f6', 118: 'f7', 119: 'f8', 120: 'f9', 121: 'f10',
      122: 'f11', 123: 'f13', 144: 'numlock', 145: 'scrolllock', 186: ';', 187: '=', 188: ',', 189: '-', 190: '.', 191: '/', 192: '`', 219: '[', 220: '\\', 221: ']', 222: "'"
    };

    var vi = {
    };

    var mappings = {
      insert: {
      },
      normal: {
      },
      visual: {
      }
    };

    function Vimbox (element, config) {
      config = config || {};
      this.element = element;
      this.vimbox = $(element);
      this.options = $.extend(true, {}, vi, config.options || {});
      this.mappings = $.extend(true, {}, mappings, config.mappings || {});
      this.mode = 'insert';
      this.init();
    };

    Vimbox.prototype.init = function() {
      var self = this;
      self.vimbox.on('keydown', function(event) {
        var char = keymap[event.which];
        // If we're in a non-insert mode or the key pressed was
        // tab, enter, or escape, prevent the default
        if (self.options.mode !== 'insert' || [9, 13, 27].indexOf(event.which) > -1) {
          event.preventDefault();
          self['_' + self.options.mode + 'Mode'](char);
        }
      });
    };

    Vimbox.prototype._insertMode = function(char) {
      if (this.options.imap[char]) {
        this.options.imap[char]();
      } else {
        this._insertAt(char);
      }
    };

    Vimbox.prototype._insertAt = function(text) {
      var self = this;
      var pos = self.element.selectionStart;
      var letters = self.vimbox.val().split('');
      letters.splice(pos, 0, text);
      self.vimbox.val(letters.join(''));
      // Chrome bug prevents setSelectionRange from working normally
      setTimeout(function() {
        self.element.setSelectionRange(pos + 1, pos + 1);
      }, 0);
    };

    $.fn.vimbox = function(method) {
      return this.each(function() {
        var instance = $.data(this, 'plugin_vimbox');
        if (!instance || typeof method === 'object') {
          return $.data(this, 'plugin_vimbox', new Vimbox(this, method));
        } else {
          if (!method) return instance.init();
          try { return instance[method].apply(instance, [].slice.call(arguments, 1)); }
          catch (e) { console.log(e.message); }
          finally { return instance; }
        }
      });
    };
  });

})(jQuery);
