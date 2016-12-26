define(function function_name(require, exports, module) {
	ty.textLength = function() {
		if (!arguments.length || !s)
			return 0;
		if ("" == s)
			return 0;
		var l = 0;
		for (var i = 0; i < s.length; i++) {
			if (s.charCodeAt(i) > 255)
				l += 2;
			else
				l++;
		}
		return l * 6;
	}
});