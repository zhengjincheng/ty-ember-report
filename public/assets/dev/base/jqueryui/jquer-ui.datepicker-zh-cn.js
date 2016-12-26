jQuery(function($){  
    $.datepicker.regional['zh-CN'] = {  
        closeText: message_source_i18n.close,  
        prevText: '<'+message_source_i18n.pre_month,  
        nextText: message_source_i18n.next_month+'>',  
        currentText: message_source_i18n.today,  
        monthNames: [message_source_i18n.january,message_source_i18n.february,message_source_i18n.march,message_source_i18n.april,message_source_i18n.may,message_source_i18n.june,  
                     message_source_i18n.july,message_source_i18n.august,message_source_i18n.september,message_source_i18n.october,message_source_i18n.november,message_source_i18n.december],  
        monthNamesShort: [message_source_i18n.one,message_source_i18n.two,message_source_i18n.three,message_source_i18n.four,message_source_i18n.five,message_source_i18n.six,  
                          message_source_i18n.seven,message_source_i18n.eight,message_source_i18n.nine,message_source_i18n.ten,message_source_i18n.eleven,message_source_i18n.twelve],  
        dayNames: [message_source_i18n.sunday,message_source_i18n.mondy,message_source_i18n.tuesday,message_source_i18n.wednesday,message_source_i18n.thursday,message_source_i18n.friday,message_source_i18n.saturday],  
        dayNamesShort: [message_source_i18n.sunday_0,message_source_i18n.mondy_1,message_source_i18n.tuesday_2,message_source_i18n.wednesday_3,message_source_i18n.thursday_4,message_source_i18n.friday_5,message_source_i18n.saturday_6],  
        dayNamesMin: [message_source_i18n.date,message_source_i18n.one,message_source_i18n.two,message_source_i18n.three,message_source_i18n.four,message_source_i18n.five,message_source_i18n.six],  
        weekHeader: message_source_i18n.week,  
        dateFormat: 'yy-mm-dd',  
        firstDay: 1,  
        isRTL: false,  
        showMonthAfterYear: true,  
        yearSuffix: message_source_i18n.year};  
    $.datepicker.setDefaults($.datepicker.regional['zh-CN']);  
}); 