$.extend(Number.prototype, {
    toMoney: function () {
        var n = this, c = 2, d = ".", t = ",", s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    }
});
$.extend(String.prototype, {
    toNumber: function () { var n = this, f = n != undefined ? parseFloat(parseFloat(n.replace(/,/g, '')).toFixed(2)) : 0; return (!isNaN(f)) ? f : 0; },
    toBoolean: function () {
        var m = { 'n': false, 'N': false, 'no': false, 'NO': false, 'FALSE': false, 'y': true, 'Y': true, 'false': false, 'yes': true, 'YES': true, 'TRUE': true, 'true': true };
        return (m.hasOwnProperty(this)) ? m[this] : false;
    }
});

$.extend($.fn, {
    InputMoney: function () {
      $(this).css('text-align', 'right');
      $(this).bind({
        keypress: function (e) {
          var keyCode = e.keyCode || e.which;
          var MinusKey = $(this)[0].selectionStart == 0 && $(this)[0].selectionEnd == 0;
          var OtherKey = (e.ctrlKey || e.altKey || keyCode == 8 || keyCode == 46 || (MinusKey && keyCode == 45));
          var MoneyKey = (keyCode >= 48 && keyCode <= 57) || keyCode == 46;
          if (!MoneyKey && !OtherKey) { return false; }
        },
        focusin: function (e) { $(this).val($(this).val().replace(/,/g, '')); },
        focusout: function (e) { if($.trim($(this).val()) !== '') { $(this).val($(this).Num()); } }
      });

      return this;
    },
    InputNumber: function () {
      $(this).css('text-align', 'right');
      $(this).keypress(function (e) {
        var keyCode = e.keyCode || e.which;
        var OtherKey = ((e.ctrlKey && keyCode != 86) || e.ctrlKey || e.altKey || keyCode == 8 || keyCode == 46);
        var NumKey = (keyCode >= 48 && keyCode <= 57);// || (e.keyCode>=96 && e.keyCode<=105); // (Number in Keyboard) || (Numpad)
        if (!NumKey && !OtherKey) { return false; }
      });
      return this;
    },
    Num: function () {
      return ($(this).val() != undefined) ? (!isNaN($(this).val().toNumber()) ? $(this).val().toNumber() : 0).toMoney() : 0;
    },
});