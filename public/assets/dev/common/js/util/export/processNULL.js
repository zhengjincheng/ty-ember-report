define(function(require, exports,module){
	ty.processNULL=function (num,unit){
		if((num == undefined ) || (num == -1)){
			return '-';
		}
		if(unit == '%'){
			return (num*100+0.0000000001).toFixed(2)+unit;		
		}else if(unit=='ms'){
			return (num/1000.0+0.0000000001).toFixed(3)+'s'; 
		}else if(unit=='times'){
			return num;
		}else if((typeof num)=='number'){
			num=num+0.0000000001;
			return num.toFixed(2) + unit;
		}else{
			return num + unit;
		}
		
	}	
	return $;
});
