/**
 *	Draw a line on the canvas in javascript
 *	@author Liao XiongJie
 *	@mailto liaoxj@networkbench.com
 *	
 *	Networkbench systems corp.
 *	visit http://www.networkbench.com
 */
function NBGraphics(canvas, color) {
	this.canvas = canvas ? typeof(canvas) == "string" ? document.getElementById(canvas) : canvas : document.body;
	this.color = color || "#000";
	if(this.canvas.getContext != undefined) {
		this.__canvas_ctx = this.canvas.getContext("2d");
		this.__canvas_ctx.strokeStyle = this.color;
		this.__canvas_ctx.lineWidth = 1;
		this.__path_begined = false;
		this.__path_closed = false;
		this.html = null;

		this.paint = function() {
			if(this.__path_begined && !this.__path_closed) {
				this.__canvas_ctx.closePath();
				this.__canvas_ctx.stroke();
				this.__path_begined = false;
				this.__path_closed = true;
			}
		};

		this.clear = function() {};
		this.lineTo = __line_to_canvas;
		
	} else {
		this.__canvas_ctx = null;
		this.html = "";

		this.paint = function() {
			if(this.html) {
				if(document.body.insertAdjacentHTML != undefined) {
					this.canvas.insertAdjacentHTML("BeforeEnd", this.html);
				} else if(document.createRange != undefined) {
					var range = document.createRange();
					range.setStartBefore(this.canvas);
					this.canvas.appendChild(range.createContextualFragment(this.html));
				}

				this.html = "";
			}
		};

		this.clear = function(){this.canvas.innerHTML="";this.html="";};
		this.lineTo = __line_to_transform;
	}
}

function __line_to_canvas(x1, y1, x2, y2, lineStyle) {
	if(this.__canvas_ctx) {		
		if(!this.__path_begined) {
			this.__canvas_ctx.beginPath();
			this.__path_begined = true;
		}

		if(lineStyle == 1) {
			//dashed
			var dashes = [5, 5];
			__dash_to_canvas(this.__canvas_ctx, x1, y1, x2, y2, dashes)
		} else if(lineStyle == 2) {
			//dotted
			var dashes = [2, 4];
			__dash_to_canvas(this.__canvas_ctx, x1, y1, x2, y2, dashes)
		} else {
			this.__canvas_ctx.moveTo(x1, y1);
			this.__canvas_ctx.lineTo(x2, y2);
		}
	}
}

function __dash_to_canvas(ctx, x1, y1, x2, y2, dashes) {
	var tmp, x3, y3, dashed;

	if(x1 == x2) {
		if(y1 > y2) {
			tmp = y1; y1 = y2; y2 = tmp;
		}
		
		var dy0 = dashes[0], dy1 = dashes[1];
		for(dashed = true, ctx.moveTo(x1, y3 = y1); y3 < y2; dashed = !dashed) {
			if(dashed) {
				y3 += dy0;
				if(y3 > y2) y3 = y2;
				ctx.lineTo(x1, y3);
			} else {
				y3 += dy1;
				ctx.moveTo(x1, y3);
			}
		}

		return;
	}

	if(y1 == y2) {
		if(x1 > x2) {
			tmp = x1; x1 = x2; x2 = tmp;
		}
		var dx0 = dashes[0], dx1 = dashes[1];
		for(dashed = true, ctx.moveTo(x3 = x1, y1); x3 < x2; dashed = !dashed) {
			if(dashed) {
				x3 += dx0;
				if(x3 > x2) x3 = x2;
				ctx.lineTo(x3, y1);
			} else {
				x3 += dx1;
				ctx.moveTo(x3, y1);
			}
		}

		return;
	}

	var dx = x2 - x1;
	var dy = y2 - y1;
	if(Math.abs(dx) >= Math.abs(dy)) {
		//always draw from left to right
		if(x1 > x2) {
			tmp = x1; x1 = x2; x2 = tmp;
			tmp = y1; y1 = y2; y2 = tmp;
		}

		var mx = dy/dx;
		var bx = y1 - mx * x1;
		var dx0 = Math.sqrt(dashes[0] * dashes[0] / ((mx * mx) + 1));
		var dy0 = mx * dx0;
		var dx1 = Math.sqrt(dashes[1] * dashes[1] / ((mx * mx) + 1));
		var dy1 = mx * dx1;
		for(dashed = true, ctx.moveTo(x3 = x1, y3 = y1); x3 < x2; dashed = !dashed) {
			if(dashed) {
				x3 += dx0;
				y3 += dy0;
				if(x3 > x2) x3 = x2;
				ctx.lineTo(x3, y3);
			} else {
				x3 += dx1;
				y3 += dy1;
				ctx.moveTo(x3, y3);
			}
		}
	} else {
		//always draw from top to bottom
		if(y1 > y2) {
			tmp = x1; x1 = x2; x2 = tmp;
			tmp = y1; y1 = y2; y2 = tmp;
		}

		var my = dx/dy;
		var by = x1 - my * y1;
		var dy0 = Math.sqrt(dashes[0] * dashes[0] / ((my * my) + 1));
		var dx0 = my * dy0;
		var dy1 = Math.sqrt(dashes[1] * dashes[1] / ((my * my) + 1));
		var dx1 = my * dy1;
		for(dashed = true, ctx.moveTo(x3 = x1, y3 = y1); y3 < y2; dashed = !dashed) {
			if(dashed) {
				x3 += dx0;
				y3 += dy0;
				if(y3 > y2) y3 = y2;
				ctx.lineTo(x3, y3);
			} else {
				x3 += dx1;
				y3 += dy1;
				ctx.moveTo(x3, y3);
			}
		}
	}
}

function __line_to_transform(x1, y1, x2, y2, lineStyle) {
	if(x1 == x2) {
		if(y1 < y2) {
			this.html += __create_rect_at(x1, y1, 1, y2 - y1, this.color, lineStyle);
		} else {
			this.html += __create_rect_at(x1, y2, 1, y1 - y2, this.color, lineStyle);
		}

		return;
	}

	if(y1 == y2) {
		if(x1 < x2) {
			this.html += __create_rect_at(x1, y1, x2 - x1, 1, this.color, lineStyle);
		} else {
			this.html += __create_rect_at(x2, y1, x1 - x2, 1, this.color, lineStyle);
		}

		return;
	}

	if(x1 > x2) {
		var x3 = x1;
		x1 = x2;
		x2 = x3;
		var y3 = y1;
		y1 = y2;
		y2 = y3;
	}

	var dx = x2 - x1;
	var dy = y2 - y1;
	var distance = Math.round(Math.sqrt(dx * dx + dy * dy));
	var angle = Math.atan(dy/dx);
	this.html += __create_rect_at(x1, y1, distance, 1, this.color, lineStyle, angle);
}

function __create_rect_at(x, y, width, height, color, lineStyle, rotateAngle) {
	var sintheta, costheta;
	var _isIE = true;
	//alert(rotateAngle +"---"+_isIE);
	if(_isIE && rotateAngle) {
		//provide an offset of y for IE if rotateAngle is less than 0
		sintheta = Math.sin(rotateAngle);
		costheta = Math.cos(rotateAngle);
		if(rotateAngle < 0)	y += width * sintheta;
	}

	var borderStyle = (lineStyle == 1 ? "dashed" : lineStyle == 2 ? "dotted" : "solid");
	var html = "<DIV style=\"position:absolute;left:" + x + "px;top:" + y + "px;width:" + width + "px;" + "height:" + height + "px;" + 
				(width > 1 ? "border-top" : "border-left") + ":1px " + borderStyle + " " + color + ";overflow:hidden;";
	if(rotateAngle) {
		//rotate the rectangle with an angle
		if(_isIE) {
			html += "filter:progid:DXImageTransform.Microsoft.Matrix(SizingMethod='auto expand',M11=" + costheta + ",M12=" + (-sintheta) + ",M21=" + sintheta + ",M22=" + costheta + ");";
		} else if(_isFirefox) {
			var transformName = __get_transform_property();
			if(transformName) {
				html += transformName + ":rotate(" + rotateAngle + "rad);" + transformName + "-origin:top left;";
			} else {
				//NOT supported yet
				return "";
			}
		}
	}

	html += "\"></DIV>"
	return html;
}

function __get_transform_property() {
	if(window["__prop_transform"]) return window["__prop_transform"];
	var propName;
	if(typeof(document.body.style.MozTransform) != undefined) {
		propName = "-moz-transform";
	} else if(typeof(document.body.style.WebkitTransform) != undefined) {
		propName = "-webkit-transform";
	} else if(typeof(document.body.style.transform) != undefined) {
		propName = "transform";
	}

	if(propName) {
		window["__prop_transform"] = propName;
		window["__prop_transform_origin"] = propName + "-origin";
	}

	return propName;
}