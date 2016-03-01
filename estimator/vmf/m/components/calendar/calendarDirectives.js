/* Calendar Directive */
angular.module('vmfCalendarMod', [])
.directive('vmfCalendar', ['$compile', '$document', '$timeout', function($compile, $document, $timeout) {
    return {
        restrict: 'EA',
        scope: {
            historic:'=',
            startyear:'=',
            endyear:'=',
            customeventname: '@',
            calendarInputId: '@'
        },
        link: function(scope, elem, attrs) {
            var template;
            var j;
            var ind;
            var cfsd;
            var fsm;
            var fsy;
            var fsd;
            var firstdateofmonth;
            var lastdateofmonth;
            var split_first;
            var temp_check;
            //console.log('historic');
            //console.log(scope.historic);
            var temp_historic = scope.historic.split('/');
            var indexFirstCal;
            scope.historic = new Date(temp_historic[2],temp_historic[1]-1,temp_historic[0]);
            //console.log(scope.historic);
            scope.firstyearlist = [];      
            for(i=parseInt(scope.startyear);i<=parseInt(scope.endyear);i++){
                scope.firstyearlist.push(i);
            }

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth(); 
            var yyyy = today.getFullYear();
            scope.first_year = yyyy;
            indexFirstCal = scope.firstyearlist.indexOf(parseInt(yyyy));
            scope.first_month = mm;
            var day = today.getDay();

            
            scope.secondyearlist = new Array(10);
            j = 0;
            for (i = scope.first_year; i <= (scope.first_year + 30); i++) {
                scope.secondyearlist[j++] = i;
            }

            // for first calendar calculating the dates needed , basically first and last day
            var lastday = new Date(yyyy, mm + 1, 0);

            var lastdate = lastday.getDate();
            

            var firstday = new Date(yyyy, mm, 1);
            
            firstday = firstday.getDay();

            var cal_data_first = [];
            var daycount = 1;
            
            daycount = 1;
            cal_data_first = [];
            i = firstday;
            counter = lastdate;
            while (counter !== 0) {
                cal_data_first[i++] = daycount++;

                counter = counter - 1;
            }
           
            daycount = 1;
            
            scope.first_cal = cal_data_first;
            
            mm = mm + 1;

            scope.second_year = yyyy;
            scope.second_month = mm;

          
            var slastday = new Date(yyyy, mm + 1, 0);
            var slastdate = slastday.getDate();
            
            var sfirstday = new Date(yyyy, mm, 1);
            sfirstday = sfirstday.getDay();
            var cal_data_second = [];
            daycount = 1;
            
            cal_data_first = [];
            i = sfirstday;
            counter = slastdate;
            while (counter !== 0) {
                cal_data_second[i++] = daycount++;
                counter = counter - 1;
            }   
            daycount = 1;
            scope.second_cal = cal_data_second;



            // scope.check_if_in_between('first');
            // scope.check_if_in_between('second');
            // functions to support left and right arrows of first calendar
            scope.goleftwithfirst = function(month, year) {
                // if(scope.first_selected_date && !scope.second_selected_date){
                //     scope.first_selected_date = undefined;
                // }   
                // if(!scope.first_selected_date || (scope.first_selected_date && scope.second_selected_date)){        
                    if (scope.first_year === scope.firstyearlist[0] && scope.first_month === 0) {
                        
                        return;
                    }
                    for (i = 0; i < cal_data_first.length; i++) {
                        elem.find('.first-calendar .' + i).removeClass('activefirstcal');
                        elem.find('.first-calendar .' + i).removeClass('activeselectfirstcal');
                    }
                    if (month === 0) {
                        
                        year = year - 1;
                        ////console.log('change in year');
                        //console.log('this is changing the year')
                        elem.find('.firstcaldir .current-selection').text(year);
                        month = 11;
                    } else {
                      
                        month = month - 1;
                    }               
                    var firstday = new Date(year, month, 1);               
                    firstday = firstday.getDay();       
                    var lastday = new Date(year, month + 1, 0);             
                    var lastdate = lastday.getDate();
                    var daycount = 1;
                    cal_data_first = [];
                    i = firstday;
                    counter = lastdate;
                    while (counter !== 0) {
                        cal_data_first[i++] = daycount++;

                        counter = counter - 1;
                    }          
                    scope.first_cal = cal_data_first;           
                    scope.first_month = month;
                    scope.first_year = year;
                // }
                scope.check_if_in_between('first');
                 if(scope.second_month ===(scope.first_month) && scope.first_year === scope.second_year){
                    elem.find('.arrow-left').addClass('hiddenarrow').parent().addClass("disabledarrow");
                }else{
                    elem.find('.arrow-left').removeClass('hiddenarrow').parent().removeClass("disabledarrow");

                }
                
            };
            scope.gorightwithfirst = function(month, year) { 
                //console.log('go right with first');
                // if(!scope.first_selected_date || (scope.first_selected_date && scope.second_selected_date)){ 
                    // if(scope.first_selected_date && !scope.second_selected_date){
                    //     scope.first_selected_date = undefined;
                    // }   
                    for (i = 0; i < cal_data_first.length; i++) {
                        elem.find('.first-calendar .' + i).removeClass('activefirstcal');
                        elem.find('.first-calendar .' + i).removeClass('activeselectfirstcal');
                    }
                    if (month === 11) {
                     
                        year = parseInt(year) + 1;
                        elem.find('.firstcaldir .current-selection').text(year);

                        month = 0;

                    } else {
                       
                        month = month + 1;
                    }

               
                    var firstday = new Date(year, month, 1);
                   
                    firstday = firstday.getDay();
                   

                    var lastday = new Date(year, month + 1, 0);
                    
                    var lastdate = lastday.getDate();
                   


                    var daycount = 1;
                    cal_data_first = [];
                    i = firstday;
                    counter = lastdate;
                    while (counter !== 0) {
                        cal_data_first[i++] = daycount++;

                        counter = counter - 1;
                    }
                   
                    scope.first_cal = cal_data_first;


                    scope.first_month = month;
                    scope.first_year = year;

                    if (scope.first_year === scope.second_year && (scope.first_month === scope.second_month || (scope.first_month -1) === scope.second_month)) {
                        ////console.log('its meeting the condition');
                        scope.gorightwithsecond(scope.first_month, scope.first_year);
                    }
                // }
                scope.check_if_in_between('first');
                 if(scope.second_month ===(scope.first_month) && scope.first_year === scope.second_year){
                    elem.find('.second-calendar .arrow-left').addClass('hiddenarrow').parent().addClass("disabledarrow");
                }else{
                    elem.find('.second-calendar .arrow-left').removeClass('hiddenarrow').parent().removeClass("disabledarrow");

                }
            };
            // end for first            
            // functions to support left and right arrows of second calendar
            scope.goleftwithsecond = function(month, year) {
                ////console.log('go left with second');
                if ((scope.first_year === scope.second_year && (scope.first_month ) === scope.second_month) && !(scope.first_year === (scope.second_year - 1) && scope.first_month === 11)) {
                    ////console.log('can\'t go left ');

                    return;
                }


                if (month === 0) {
                  
                    year = year - 1;

                    month = 11;
                } else {
                   
                    month = month - 1;
                }

           
                var firstday = new Date(year, month, 1);
            
                firstday = firstday.getDay();
              

                var lastday = new Date(year, month + 1, 0);
           
                var lastdate = lastday.getDate();
            


                var daycount = 1;
                cal_data_second = [];
                i = firstday;
                counter = lastdate;
                while (counter !== 0) {
                    cal_data_second[i++] = daycount++;

                    counter = counter - 1;
                }
                
                scope.second_cal = cal_data_second;
                scope.second_month = month;
                scope.second_year = year;
                // for(i=1;i<=42;i++){
                //     elem.find('.second-calendar .' + i).removeClass('vmf-disabled-date');
                // } 
                if(scope.first_selected_date && !scope.second_selected_date){
                    ////console.log('bhagwan chal ja');
                    var fd = new Date(scope.first_selected_date);
                    var sec_cal_first_date = new Date(scope.second_year,scope.second_month,1);
                    var first_date = fd.getDate();
                    // if(!(sec_cal_first_date>= fd)){
                    //     for(i=cal_data_second.indexOf(1);i<cal_data_second.indexOf(first_date);i++){
                    //         elem.find('.second-calendar .' + i).addClass('vmf-disabled-date');
                    //     }    
                    // }
                    
                }
                // //////console.log("currect scope month and year");
                // //////console.log(scope.first_month);
                // //////console.log(scope.first_year);
                 if(scope.second_month ===(scope.first_month) && scope.first_year === scope.second_year){
                    elem.find('.second-calendar .arrow-left').addClass('hiddenarrow').parent().addClass("disabledarrow");
                }else{
                    elem.find('.second-calendar .arrow-left').removeClass('hiddenarrow').parent().removeClass("disabledarrow");

                }
                scope.clearsecondcal();
                scope.check_if_in_between('second');


            };
            scope.gorightwithsecond = function(month, year) {
                // for(i=1;i<=42;i++){
                //     elem.find('.second-calendar .' + i).removeClass('vmf-disabled-date');
                // } 
                if (month === 11) {
                    year = parseInt(year) + 1;
                    month = 0;
                } else {
                    month = month + 1;
                }
                var firstday = new Date(year, month, 1);
                firstday = firstday.getDay();
                var lastday = new Date(year, month + 1, 0);
                var lastdate = lastday.getDate();
                var daycount = 1;
                cal_data_second = [];
                i = firstday;
                counter = lastdate;
                while (counter !== 0) {
                    cal_data_second[i++] = daycount++;

                    counter = counter - 1;
                }
                scope.second_cal = cal_data_second;
                scope.second_month = month;
                scope.second_year = year;
                if(scope.second_month ===(scope.first_month+1) && scope.first_year === scope.second_year){
                    // elem.find('.second-calendar .arrow-left').hide();
                }else{
                    elem.find('.second-calendar .arrow-left').show();

                }
                scope.clearsecondcal();
                ////console.log('go right with second');
                scope.check_if_in_between('second');
                if(scope.second_month ===(scope.first_month) && scope.first_year === scope.second_year){
                    elem.find('.second-calendar .arrow-left').addClass('hiddenarrow').parent().addClass("disabledarrow");
                }else{
                    elem.find('.second-calendar .arrow-left').removeClass('hiddenarrow').parent().removeClass("disabledarrow");

                }



            };
            scope.$watch("first_year", function(newval, oldval) {
                newval = parseInt(newval);
                if (newval) {
                    if(scope.first_selected_date && !scope.second_selected_date){
                        scope.first_selected_date = undefined;
                    }   
                    if((newval > scope.second_year )){
                        ////console.log('changing years');
                        newval = parseInt(newval);
                        scope.first_year = parseInt(newval);                  
                        j = 0;
                        scope.secondyearlist = [];
                        for (i = scope.first_year; i <= (scope.first_year + 25); i++) {
                            scope.secondyearlist[j++] = i;
                        }   
                        ////console.log('replacing the dropdown');               
                        scope.gorightwithfirst(scope.first_month - 1, newval);
                        // elem.find('.secondcaldir').replaceWith($compile('<div vmf-select-list model="second_year" list="secondyearlist" class="yearDropDown secondcaldir"></div>')(scope));
                        
                        
                        $timeout(function() {
                            //console.log('this is changing the year');
                            elem.find('.secondcaldir').replaceWith('<div vmf-select-list model="second_year" list="secondyearlist" pre-select-ind="0" class="yearDropDown secondcaldir"></div>');
                            $compile(elem.find('.secondcaldir')[0])(scope);
                            return;
                            
                        });
                        //console.log('this is changing the year')
                        elem.find('.secondcaldir .current-selection').text(scope.secondyearlist[0]);    
                        
                        if(scope.second_selected_date){
                            if(scope.first_month === scope.second_month){
                                scope.gorightwithsecond(scope.second_month+1,newval);
                            }
                            

                        }else{
                            scope.gorightwithsecond(scope.first_month, newval);    
                        }
                        
                    }else{
                        scope.gorightwithfirst(scope.first_month - 1, newval);
                        scope.first_year = parseInt(newval);   
//                        console.log(scope.first_year);
                        j = 0;
                        scope.secondyearlist = [];
                        for (i = scope.first_year; i <= scope.endyear; i++) {
                            scope.secondyearlist[j++] = i;
                        }  
                        //console.log(scope.secondyearlist);
                        $timeout(function() {
//                            console.log('this is changing the second year');
//                            console.log(scope.second_year);
//                            console.log(scope.secondyearlist);
//                            console.log(scope.secondyearlist.indexOf(scope.second_year));
                            var newIndex = scope.secondyearlist.indexOf(scope.second_year);
                            str = '<div vmf-select-list model="second_year" list="secondyearlist" pre-select-ind="';
                            str += newIndex;
                            str += '" class="yearDropDown secondcaldir"></div>';
                            elem.find('.secondcaldir').replaceWith( str );
                            $compile(elem.find('.secondcaldir')[0])(scope);
                            return;
                            
                        });
                        //  if(scope.second_selected_date){
                        //     if(scope.first_month === scope.second_month){
                        //         // scope.gorightwithsecond(scope.second_month+1,newval);
                        //     }
                            

                        // }else{
                        //     // scope.gorightwithsecond(scope.first_month, newval);    
                        // }


                    }
                }
                
            });

            scope.$watch("second_year", function(newval, oldval) {
                if (newval) {
                    ////console.log("changing second year");
                    //////console.log(scope.second_month);
                    scope.second_year = parseInt(newval);
                    //////console.log(scope.second_year);
                    var index = scope.secondyearlist.indexOf(newval);
                    //console.log('this is changing the year')
                    elem.find('.secondcaldir .current-selection').text(scope.secondyearlist[index]);
                    ////console.log(scope.second_selected_date)
                    if(scope.second_selected_date && scope.second_month === (scope.second_selected_date.split('/')[1]-1)){
                        scope.second_selected_date = newval +'/'+ scope.second_selected_date.split('/')[1] +'/'+ scope.second_selected_date.split('/')[2]  ;

                    }
                    if(scope.second_month < scope.first_month){
                        scope.gorightwithsecond(scope.first_month - 1, scope.second_year);
                    }else{
                        scope.gorightwithsecond(scope.second_month - 1, scope.second_year);    
                    }
                    


                }
            });

            scope.displayCalendar = function() {
                if( elem.find(".calIcon").hasClass("activeCal") ){
                    scope.hideCalendar();
                  }else{
                    elem.find(".calIcon").addClass("activeCal");
                    elem.find('.calendercontainer').css("visibility", "visible");
                    elem.find('.calendercontainer').closest('.vmf-calendar-drop').addClass('calendercontainerActive');
                    elem.find('.first-calendar .month').focus();
                    scope.calendar = true;
                    if(scope.first_selected_date && scope.second_selected_date){
                        //console.log('');
                    }
                }
                // for(i=cal_data_first.indexOf(1);i<=42;i++){
                //     elem.find('.first-calendar .' + i).removeClass('vmf-disabled-date');
                // }
                // for(i=cal_data_second.indexOf(1);i<=42;i++){
                //     elem.find('.second-calendar .' + i).removeClass('vmf-disabled-date');
                // }
                // scope.first_selected_date = "";
                // scope.second_selected_date = "";
            };
            scope.hideCalendar = function() {
                elem.find(".calIcon").removeClass("activeCal");
                elem.find('.calendercontainer').css("visibility", "hidden");
                elem.find('.calendercontainer').closest('.vmf-calendar-drop').removeClass('calendercontainerActive');
                if(scope.first_selected_date && scope.second_selected_date){
                    elem.find('.placeholdersjs').removeClass('placeholdersjs');
                }
                scope.calendar = false;
            };
            scope.convertMonth = function(m_index) {
                var m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                return m[m_index];

            };
            scope.month_double = function(m_index) {
                var m = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
                return m[m_index];

            };
            scope.date_double = function(date){
                if((date < 9)){
                    var d = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09'];
                    return d[date];
                }else{
                    return date;
                }
            };

            scope.selectFirstDate = function(date, month, year) {
                //console.log('select first date');
                // date = date;
                //////console.log(date);
                //////console.log(month);
                //////console.log(year);
                // if(!scope.first_selected_date || (scope.first_selected_date && scope.second_selected_date)){
                    if (cal_data_first[date]) {
                        for (i = 0; i < cal_data_first.length; i++) {
                            elem.find('.first-calendar .' + i).removeClass('activefirstcal');
                            elem.find('.first-calendar .' + i).removeClass('activeselectfirstcal');
                            // elem.find('.first-calendar .' + i).removeClass('vmf-disabled-date');
                        }
                        // for (i = cal_data_first.indexOf(1); i < date; i++) {
                        //     elem.find('.first-calendar .' + i).addClass('vmf-disabled-date');

                        // }

                        
                    }
                    // var temp_f = scope.first_year + '/' + (parseInt(scope.first_month)) + '/' + (parseInt(cal_data_first[date]));
                    // //console.log(temp_f);
                    temp_f = new Date(scope.first_year,parseInt(scope.first_month),parseInt(cal_data_first[date]));
                    //console.log(temp_f);
                    //console.log(scope.historic);
                    if(temp_f>scope.historic){
                        //console.log(temp_f);
                        //console.log(scope.historic);
                        scope.first_selected_date = scope.first_year + '/' + (parseInt(scope.first_month) + 1) + '/' + (parseInt(cal_data_first[date]));
                        scope.show_first_selected_date =  scope.month_double((parseInt(scope.first_month) + 1))   + '/' +  scope.date_double((parseInt(cal_data_first[date]))) + '/' +scope.first_year;
                        elem.find('.first-calendar .' + date).addClass('activeselectfirstcal');
                    // scope.show_date = scope.show_first_selected_date;    
                    }
                    
                    if(scope.second_selected_date){
                        var afsd = scope.first_selected_date.split('/');
                        var fsd = new Date(afsd[0],afsd[1]-1,afsd[2]);
                        var assd = scope.show_second_selected_date.split('/');
                        var ssd = new Date(parseInt(assd[2]),parseInt(assd[0])-1,parseInt(assd[1]));
                        //console.log(fsd);
                        //console.log(ssd);
                        if((fsd < ssd)){
                            scope.show_date = scope.show_first_selected_date + " to " + scope.show_second_selected_date; 
							elem.find(".error-msg").remove();
							elem.find(".has-error").removeClass("has-error");							
                        }
                        
                    }

                    scope.check_if_in_between('first');
                    scope.check_if_in_between('second');

                    // scope.clearsecondcal();
                    //////console.log(scope.first_selected_date);
                // }
                
            };
            scope.hoverFirstDate = function(date, month, year) {
                
                // if(!scope.first_selected_date || (scope.first_selected_date && scope.second_selected_date)){
                    if (cal_data_first[date]) {
                        for (i = 0; i < cal_data_first.length; i++) {
                            elem.find('.first-calendar .' + i).removeClass('hoverselectfirstcal');

                        }
                        for (i = 0; i < cal_data_first.length; i++) {
                            elem.find('.first-calendar .' + i).removeClass('activefirstcalhover');

                        }
                        for (i = date; i < cal_data_first.length; i++) {
                            elem.find('.first-calendar .' + i).addClass('activefirstcalhover');

                        }


                        // elem.find('.first-calendar').removeClass('hoverselectfirstcal');
                        elem.find('.first-calendar .' + date).addClass('hoverselectfirstcal');
                        //////console.log(date);

                    }
                // }
                
                


            };
            scope.hoverSecondDate = function(date, month, year) {
                //console.log('hover second date');               
                if (scope.first_selected_date && scope.first_month !== scope.second_month || (scope.first_selected_date && scope.first_year !== scope.second_year) ) {
                  
                    cfsd = scope.first_selected_date.split('/');
                    fsm = parseInt(cfsd[1]) - 1;
                    fsy = parseInt(cfsd[0]);
                    fsd = parseInt(cfsd[2]);
                    
                    if(parseInt(fsy) === parseInt(scope.first_year)){
                        ind = cal_data_first.indexOf(fsd);     
                    }else{
                        ind = cal_data_first.indexOf(1);
                    }
                   
                   for (i=0;i<cal_data_first.length;i++){
                        elem.find('.first-calendar .' + i).removeClass('activefirstcal');
                   }
                   for (i=ind;i<cal_data_first.length;i++){
                        elem.find('.first-calendar .' + i).addClass('activefirstcal');
                        
                   }                 
                    if (cal_data_second[date] ) {
                        for (i = 0; i < cal_data_second.length; i++) {
                            elem.find('.second-calendar .' + i).removeClass('hoverselectsecondcal');
                            elem.find('.second-calendar .' + i).removeClass('activesecondcal');

                        }
                        for (i = 0; i < date; i++) {
                            if (cal_data_second[i]) {
                                elem.find('.second-calendar .' + i).addClass('activesecondcal');
                            }


                        } 
                        if(cal_data_second[date]){
                            elem.find('.second-calendar .' + date).addClass('hoverselectsecondcal');
                        }            
                                           
                    }
                }
                if(scope.first_selected_date && scope.first_month === month && scope.first_year === year){
                    
                    
                    cfsd = scope.first_selected_date.split('/');
                    fsm = parseInt(cfsd[1]) - 1;
                    fsy = parseInt(cfsd[0]);
                    fsd = parseInt(cfsd[2]);
                    

                   ind = cal_data_first.indexOf(fsd);
                   
                    if(date >= ind){
                        for (i = 0; i < cal_data_second.length; i++) {
                            elem.find('.second-calendar .' + i).removeClass('hoverselectsecondcal');
                            elem.find('.second-calendar .' + i).removeClass('activesecondcal');

                        }
                        for (i = ind; i < date; i++) {
                            if (cal_data_second[i]) {
                                ////console.log(i);
                                ////console.log(cal_data_second[i]);

                                if(elem.find('.second-calendar .'+ i).text()!==''){
                                    elem.find('.second-calendar .' + i).addClass('activesecondcal');    
                                }
                                
                            }


                        }    
                        if(cal_data_second[date]){
                            elem.find('.second-calendar .' + date).addClass('hoverselectsecondcal');
                        }           
                        for (i=0;i<cal_data_first.length;i++){
                            elem.find('.first-calendar .' + i).removeClass('activefirstcal');
                        }
                        for (i=ind;i<=date;i++){
                            if(cal_data_first[i]){
                                elem.find('.first-calendar .' + i).addClass('activefirstcal');
                            }

                            
                                
                        }



                    }
                }


            };
            scope.leavingfirstcal = function() {
                for (i = 0; i < cal_data_first.length; i++) {
                    elem.find('.first-calendar .' + i).removeClass('hoverselectfirstcal');

                }
                for (i = 0; i < cal_data_first.length; i++) {
                    elem.find('.first-calendar .' + i).removeClass('activefirstcalhover');

                }
            };
            scope.clearsecondcal = function() {
                if((scope.first_selected_date && scope.second_selected_date)){
                    //////console.log('leaving second calendar mouseover');
                    for (i = 0; i < 41; i++) {
                        elem.find('.second-calendar .' + i).removeClass('hoverselectsecondcal');
                        elem.find('.second-calendar .' + i).removeClass('activesecondcal');
                        elem.find('.second-calendar .' + i).removeClass('activeselectSecondcal');
                        elem.find('.second-calendar .' + i).removeClass('vmf-disabled-date');

                    }
                    //////console.log('inside if first left');
                    //////console.log(scope.first_selected_date);
                    var cfsd = scope.first_selected_date.split('/');
                    var fsm = parseInt(cfsd[1]) - 1;
                    var fsy = parseInt(cfsd[0]);
                    var fsd = parseInt(cfsd[2]);
                    

                   var ind = cal_data_first.indexOf(fsd);
                   // for (i=0;i<cal_data_first.length;i++){
                   //      elem.find('.first-calendar .' + i).removeClass('activefirstcal');
                   // }
                   // for (i = 0; i < cal_data_second.length; i++) {
                   //      elem.find('.second-calendar .' + i).removeClass('hoverselectsecondcal');
                   //      elem.find('.second-calendar .' + i).removeClass('activesecondcal');

                   //  }

                }
                
            };
            scope.clearfirstcal = function(){
                if((scope.first_selected_date && scope.second_selected_date)){
                    //////console.log('leaving second calendar mouseover');
                    for (i = 0; i <= 41; i++) {
                        elem.find('.first-calendar .' + i).removeClass('activeselectfirstcal');
                        elem.find('.first-calendar .' + i).removeClass('activefirstcal');
                        elem.find('.first-calendar .' + i).removeClass('activeselectSecondcal');
                        elem.find('.first-calendar .' + i).removeClass('vmf-disabled-date');
                         // elem.find('.first-calendar .' + i).removeClass('activefirstcal');


                    }
                    

                }

            };
            scope.leavingsecondcal = function() {
                // if(!scope.second_selected_date && scope.first_selected_date){
                    //////console.log('leaving second calendar mouseover');
                    for (i = 0; i < cal_data_second.length; i++) {
                        elem.find('.second-calendar .' + i).removeClass('hoverselectsecondcal');
                        elem.find('.second-calendar .' + i).removeClass('activesecondcal');

                    }
                    //////console.log('inside if first left');
                    //////console.log(scope.first_selected_date);
                    // var cfsd = scope.first_selected_date.split('/');
                    // var fsm = parseInt(cfsd[1]) - 1;
                    // var fsy = parseInt(cfsd[0]);
                    // var fsd = parseInt(cfsd[2]);
                    

                   // var ind = cal_data_first.indexOf(fsd);
                   for (i=0;i<cal_data_first.length;i++){
                        elem.find('.first-calendar .' + i).removeClass('activefirstcal');
                   }
                   for (i = 0; i < cal_data_second.length; i++) {
                        elem.find('.second-calendar .' + i).removeClass('hoverselectsecondcal');
                        elem.find('.second-calendar .' + i).removeClass('activesecondcal');

                    }
                if(scope.first_selected_date && scope.second_selected_date){
                    scope.check_if_in_between('first');
                    scope.check_if_in_between('second');    
                }
                



                // }
                
            };

            scope.selectSecondDate = function(date, month, year) {
                ////console.log('select second date');
                if(scope.second_selected_date){
                    var ssd = new Date(scope.second_selected_date);
                    var ssdate = ssd.getDate();
                    elem.find('.second-calendar .' + cal_data_second.indexOf(ssdate)).removeClass('activeselectSecondcal');
                }

                if (scope.first_selected_date && cal_data_second[date]) {
                    var fd = parseInt(scope.first_selected_date.split('/')[2]);
                    // ////console.log(cal_data_first);
                    var ind = cal_data_first.indexOf(fd);
                    if(scope.first_month === month){
                        if(date >= ind){
                            
                            scope.second_selected_date = scope.second_year + '/' + (parseInt(scope.second_month) + 1) + '/' + (parseInt(cal_data_second[date]));
                            scope.date_range = scope.first_selected_date + " to " + scope.second_selected_date;
                            scope.show_second_selected_date =  scope.month_double((parseInt(scope.second_month) + 1))  + '/' + scope.date_double((parseInt(cal_data_second[date]))) + '/' + scope.second_year;
                            scope.show_date = scope.show_first_selected_date + " to " + scope.show_second_selected_date; 
                            elem.find('.second-calendar .'+date).addClass('activeselectSecondcal');
							elem.find(".error-msg").remove();
							elem.find(".has-error").removeClass("has-error");
                            scope.hideCalendar();
                        }


                    }else{
                        
                        scope.second_selected_date = scope.second_year + '/' + (parseInt(scope.second_month) + 1) + '/' + (parseInt(cal_data_second[date]));
                        scope.date_range = scope.first_selected_date + " to " + scope.second_selected_date;
                        scope.show_second_selected_date = scope.month_double((parseInt(scope.second_month) + 1)) + '/' +  scope.date_double((parseInt(cal_data_second[date]))) + '/' + scope.second_year;
                        scope.show_date = scope.show_first_selected_date + " to " + scope.show_second_selected_date; 
                        elem.find('.second-calendar .'+date).addClass('activeselectSecondcal');
						elem.find(".error-msg").remove();
						elem.find(".has-error").removeClass("has-error");
                        scope.hideCalendar();


                    }
                                        
                    //////console.log(scope.second_selected_date);
                    
                    //////console.log(scope.date_range);

                    // if(scope.first_selected_date){
                    //              if(cal_data_second[date]){
                    //              for (i=0;i< cal_data_second.length;i++){
                    //                  elem.find('.second-calendar .' + i).removeClass('hoverselectsecondcal');
                    //                  elem.find('.second-calendar .' + i).removeClass('activesecondcal');

                    //              }
                    //              for (i=0;i< date;i++){
                    //                  elem.find('.second-calendar .' + i).addClass('activesecondcal');

                    //              }

                    //              // elem.find('.first-calendar').removeClass('hoverselectfirstcal');
                    //              elem.find('.second-calendar .' + date).addClass('hoverselectsecondcal');
                    //              //////console.log(date);

                    //          }


                    //          }


                    // publishing the custom-event (provided through the scope-options of the directive) 
                    if( scope.customeventname ){
                        scope.publish(scope.customeventname, {
                            'fromDate': scope.first_selected_date,
                            'toDate': scope.second_selected_date
                        });
                    }
                    
                }

            };

            // keyboard events
            scope.onKeydownfirstcal = function(e,first_month,first_year){
                //////console.log(e.keyCode);
                if(e.keyCode === 39){
                    scope.gorightwithfirst(first_month,first_year);
                }
                if(e.keyCode === 37){
                    scope.goleftwithfirst(first_month,first_year);
                }
            }; 
            scope.keyDateChangeFirst =function(e,x,y,z){
                //////console.log(e.keyCode);
                if(e.keyCode === 13){
                   
                    elem.find('.second-calendar .month').focus();
                    scope.selectFirstDate(x,y,z);

                }

                
            };
            scope.checkEmpty = function(val){
                // //////console.log("checkEmpty");
                // //////console.log(val);
                if(val){
                    return true;
                }else{
                    return false;
                }

            };


            $timeout(function() {
                scope.check_if_in_between('first');
                scope.check_if_in_between('second');
                // elem.find('.current-selection').text(scope.first_year);
                // elem.find('.second-calendar .arrow-left').hide();
                // var ul = elem.find('.secondcaldir ul');
                // var scrollPane = ul.jScrollPane({
                //     showArrows: true,
                //     verticalArrowPositions: 'after'
                // });

                // $(".jspDrag").bind('click',function(event) {
                //         event.stopImmediatePropagation();
                //     }
                // );
            });
            
            elem.bind('click',function(e){
                e.stopPropagation();
            });
            $document.bind('click.calendarDirective',function(){
                scope.hideCalendar();
            });

            scope.check_if_in_between = function(calindex){
                //console.log('check if in between ');
                var fsd;
                var ind;
                if(scope.first_selected_date && scope.second_selected_date){
                    var cfsd = scope.first_selected_date.split('/');
                    var fsm = parseInt(cfsd[1]) - 1; 
                    var fsy = parseInt(cfsd[0]);
                    fsd = parseInt(cfsd[2]);                     
                    ind = cal_data_first.indexOf(fsd);

                    var cssd = scope.second_selected_date.split('/');
                    var ssm = parseInt(cssd[1]) - 1; 
                    var ssy = parseInt(cssd[0]);
                    var ssd = parseInt(cssd[2]);                     
                    var sind = cal_data_second.indexOf(ssd);

                    if(scope.first_month === fsm && parseInt(scope.first_year) === fsy && calindex === 'first'){
                        scope.highlightfirst();

                    }

                    if(scope.second_month === ssm && parseInt(scope.second_year) === ssy && calindex === 'second'){
                        scope.clearsecondcal();
                        scope.highlightsecond();


                    }
                    var firstsdate = new Date(scope.first_selected_date);
                    var secondsdate = new Date(scope.second_selected_date);
                    // ////console.log(firstsdate);
                    // ////console.log(secondsdate);
                    if(calindex==="first"){
                        ////console.log('inside to check for highlight whole');
                        firstdateofmonth = new Date(scope.first_year,scope.first_month,1);
                        if(scope.first_month === 11){
                            lastdateofmonth = new Date(scope.first_year+1,0,0);
                        }else{
                            lastdateofmonth = new Date(scope.first_year,scope.first_month+1,0);
                        }
                        if(firstdateofmonth >= firstsdate && lastdateofmonth <= secondsdate){
                            ////console.log('in between the selected dates');
                            scope.fullhighlightfirst(firstdateofmonth,lastdateofmonth);
                        }
                        if(firstdateofmonth <= secondsdate && secondsdate <= lastdateofmonth){
                            if(firstdateofmonth <= firstsdate){
                                ////console.log('we have both here');
                                scope.highlight_both_in_first(firstdateofmonth,lastdateofmonth,firstsdate,secondsdate,false);
                            }else{
                                ////console.log('Your r right bro we have an end date here.');
                                scope.highlight_both_in_first(firstdateofmonth,lastdateofmonth,firstdateofmonth,secondsdate,true);
                            }
                            
                        }
                                                
                        // ////console.log(firstdateofmonth);
                        // ////console.log(lastdateofmonth);
                    }
                    if(calindex==="second"){

                        ////console.log('full highlight for second calendar ');
                        firstdateofmonth = new Date(scope.second_year,scope.second_month,1);
                        if(scope.second_month === 11){
                            lastdateofmonth = new Date(scope.second_year+1,0,0);
                        }else{
                            lastdateofmonth = new Date(scope.second_year,scope.second_month+1,0);
                        }
                        if(firstdateofmonth > firstsdate && lastdateofmonth < secondsdate){
                            ////console.log('in between the selected dates');
                            scope.fullhighlightsecond(firstdateofmonth,lastdateofmonth);
                        }
                        if(firstdateofmonth <= firstsdate && firstsdate <= lastdateofmonth){
                            if(secondsdate <= lastdateofmonth){
                                ////console.log('we have both here for second month');
                                scope.highlight_both_in_second(firstdateofmonth,lastdateofmonth,firstsdate,secondsdate,false);
                            }else{
                                ////console.log('Your r right bro we have an start date here.');
                                scope.highlight_both_in_second(firstdateofmonth,lastdateofmonth,firstsdate,lastdateofmonth,true);
                            }
                            
                        }

                                                
                        ////console.log(firstdateofmonth);
                        ////console.log(lastdateofmonth);
                        
                    }



                }
                if(calindex==='first'){
                    firstdateofmonth = new Date(scope.first_year,scope.first_month,1);
                    if(scope.first_month === 11){
                        lastdateofmonth = new Date(scope.first_year+1,0,0);
                    }else{
                        lastdateofmonth = new Date(scope.first_year,scope.first_month+1,0);
                    }
                    if(firstdateofmonth <= scope.historic && scope.historic <= lastdateofmonth){
                        //console.log('disabled dates in first calendar');
                        for (i = 0; i <= 41; i++) {
                            elem.find('.first-calendar .' + i).removeClass('vmf-disabled-date');

                        }
                        for (i = cal_data_first.indexOf(1); i <= cal_data_first.indexOf(scope.historic.getDate()); i++) {
                            elem.find('.first-calendar .' + i).addClass('vmf-disabled-date');

                        }

                    }else if(lastdateofmonth< scope.historic){
                        for (i = 0; i <= 41; i++) {
                            elem.find('.first-calendar .' + i).removeClass('vmf-disabled-date');

                        }
                        for (i = cal_data_first.indexOf(1); i <= cal_data_first.indexOf(lastdateofmonth.getDate()); i++) {
                            elem.find('.first-calendar .' + i).addClass('vmf-disabled-date');

                        }

                    }else{
                        for (i = 0; i <= 41; i++) {
                            elem.find('.first-calendar .' + i).removeClass('vmf-disabled-date');

                        }


                    }
                    if(scope.first_selected_date && !scope.second_selected_date){
                        //console.log('check if in between and only first selected date');
                        //console.log(scope.first_selected_date);
                        fsd = new Date(scope.first_selected_date);
                        //console.log(fsd);
                        if(firstdateofmonth <= fsd && fsd <= lastdateofmonth){
                            ind = cal_data_first.indexOf(parseInt(fsd.getDate()));
                            elem.find('.first-calendar .' + ind).addClass('activeselectfirstcal');
                            elem.find('.first-calendar .' + ind).addClass('activefirstcal');
                        }
                    }



                }else{
                    firstdateofmonth = new Date(scope.second_year,scope.second_month,1);
                    if(scope.first_selected_date){
                        split_first = scope.first_selected_date.split('/');
                        temp_check = new Date(parseInt(split_first[0]),parseInt(split_first[1] - 1),parseInt(split_first[2])); 
                    }else{  
                        temp_check = scope.historic;
                    }
                    if(scope.second_month === 11){
                        lastdateofmonth = new Date(scope.second_year+1,0,0);
                    }else{
                        lastdateofmonth = new Date(scope.second_year,scope.second_month+1,0);
                    }
                    if(firstdateofmonth <= temp_check && temp_check <= lastdateofmonth){
                        //console.log('disabled dates in second calendar');
                        for (i = 0; i <= 41; i++) {
                            elem.find('.second-calendar .' + i).removeClass('vmf-disabled-date');

                        }
                        for (i = cal_data_second.indexOf(1); i <= cal_data_second.indexOf(temp_check.getDate()); i++) {
                            elem.find('.second-calendar .' + i).addClass('vmf-disabled-date');

                        }
                    }else if(lastdateofmonth < temp_check){
                        for (i = 0; i <= 41; i++) {
                            elem.find('.second-calendar .' + i).removeClass('vmf-disabled-date');

                        }
                        for (i = cal_data_second.indexOf(1); i <= cal_data_second.indexOf(lastdateofmonth.getDate()); i++) {
                            elem.find('.second-calendar .' + i).addClass('vmf-disabled-date');

                        }


                    }else{
                        for (i = 0; i <= 41; i++) {
                            elem.find('.second-calendar .' + i).removeClass('vmf-disabled-date');

                        }


                    }





                }



            };
            scope.highlight_both_in_second = function(first,last,firstsdate,secondsdate,onlyenddate){
                ////console.log('highlight_both_in_second');
                scope.clearsecondcal();
                var daycount = 1;
                cal_data = [];
                firstday = first.getDay();
                lastdate = last.getDate();
                i = firstday;
                counter = lastdate;
                while (counter !== 0) {
                    cal_data[i++] = daycount++;

                    counter = counter - 1;
                }
                // var findex = cal_data.indexOf(fday);
                var fstart = firstsdate.getDate();
                var fend = secondsdate.getDate();
                if(!onlyenddate){
                    elem.find('.second-calendar .'+ cal_data.indexOf(secondsdate.getDate()) ).addClass('activeselectSecondcal');
                }
                // elem.find('.first-calendar .'+ cal_data.indexOf(fend)).addClass('activeselectSecondcal');
                for(i=cal_data.indexOf(firstsdate.getDate());i<=cal_data.indexOf(secondsdate.getDate());i++){
                    elem.find('.second-calendar .'+ i).addClass('activesecondcal');
                }
                // elem.find('.first-calendar .'+ cal_data.indexOf(fend)).addClass('activeselectSecondcal');

            };
            scope.highlight_both_in_first = function(first,last,firstsdate,secondsdate,onlyenddate){
                ////console.log('highlight_both_in_first');
                scope.clearfirstcal();
                var daycount = 1;
                cal_data = [];
                firstday = first.getDay();
                lastdate = last.getDate();
                i = firstday;
                counter = lastdate;
                while (counter !== 0) {
                    cal_data[i++] = daycount++;

                    counter = counter - 1;
                }
                // var findex = cal_data.indexOf(fday);
                var fstart = firstsdate.getDate();
                var fend = secondsdate.getDate();
                if(!onlyenddate){
                    elem.find('.first-calendar .'+ cal_data.indexOf(fstart) ).addClass('activeselectfirstcal');
                }
                // elem.find('.first-calendar .'+ cal_data.indexOf(fend)).addClass('activeselectSecondcal');
                for(i=cal_data.indexOf(fstart);i<=cal_data.indexOf(fend);i++){
                    elem.find('.first-calendar .'+ i).addClass('activefirstcal');
                }
                // elem.find('.first-calendar .'+ cal_data.indexOf(fend)).addClass('activeselectSecondcal');

            };
            scope.fullhighlightfirst = function(first,last){
                ////console.log('fullhighlightfirst');
                var daycount = 1;
                cal_data = [];
                firstday = first.getDay();
                lastdate = last.getDate();
                i = firstday;
                counter = lastdate;
                while (counter !== 0) {
                    cal_data[i++] = daycount++;

                    counter = counter - 1;
                }
                // var findex = cal_data.indexOf(fday);
                for(i=firstday;i<=cal_data.indexOf(lastdate);i++){
                    elem.find('.first-calendar .'+ i).addClass('activefirstcal');
                }

            };
            scope.fullhighlightsecond = function(first,last){
                ////console.log('fullhighlightsecond');
                scope.clearsecondcal();
                var daycount = 1;
                cal_data = [];
                firstday = first.getDay();
                lastdate = last.getDate();
                i = firstday;
                counter = lastdate;
                while (counter !== 0) {
                    cal_data[i++] = daycount++;

                    counter = counter - 1;
                }
                // var findex = cal_data.indexOf(fday);
                for(i=firstday;i<=cal_data.indexOf(lastdate);i++){
                    elem.find('.second-calendar .'+ i).addClass('activesecondcal');
                }

            };
            scope.highlightfirst = function(){
                var fday = parseInt(scope.first_selected_date.split('/')[2]);
                var fy = parseInt(scope.first_selected_date.split('/')[0]);
                var fm = parseInt(scope.first_selected_date.split('/')[1])-1;
                var lastday = new Date(fy, fm + 1, 0);
                var lastdate = lastday.getDate();
                var firstday = new Date(fy, fm, 1);
                firstday = firstday.getDay();
                var cal_data = [];
                var daycount = 1;
                
                
                cal_data = [];
                i = firstday;
                counter = lastdate;
                while (counter !== 0) {
                    cal_data[i++] = daycount++;

                    counter = counter - 1;
                }
                var findex = cal_data.indexOf(fday);
                elem.find('.first-calendar .' + findex).addClass('activeselectfirstcal');
                elem.find('.first-calendar .' + findex).addClass('activefirstcal');
                var end_date  = scope.find_if_in_same();
                if(end_date){
                    end_date = parseInt(scope.second_selected_date.split('/')[2]);
                    end_date = cal_data_second.indexOf(end_date);
                }else{
                    end_date = cal_data.length;
                }
                for(i=findex;i<end_date;i++){
                        elem.find('.first-calendar .' + i).addClass('activefirstcal');                    
                }
            };
            scope.highlightsecond = function(){
                ////console.log('highlight second being called.');
                var fday = parseInt(scope.second_selected_date.split('/')[2]);
                var fy = parseInt(scope.second_selected_date.split('/')[0]);
                var fm = parseInt(scope.second_selected_date.split('/')[1])-1;
                var lastday = new Date(fy, fm + 1, 0);
                var lastdate = lastday.getDate();
                var firstday = new Date(fy, fm, 1);
                firstday = firstday.getDay();
                var cal_data = [];
                daycount = 1;
                
                daycount = 1;
                scal_data = [];
                i = firstday;
                counter = lastdate;
                while (counter !== 0) {
                    scal_data[i++] = daycount++;

                    counter = counter - 1;
                }
                var findex = scal_data.indexOf(fday);
                // var firstdayindex = scal_data.indexOf(firstday);
                elem.find('.second-calendar .' + findex).addClass('activeselectsecondcal');
                elem.find('.second-calendar .' + findex).addClass('activesecondcal');
                var end_date  = scope.find_if_in_same();
                if(end_date){
                    end_date = parseInt(scope.second_selected_date.split('/')[2]);
                    end_date = cal_data_second.indexOf(end_date);
                }else{
                    end_date = scal_data.length;
                }
                for(i=firstday;i<findex;i++){
                        elem.find('.second-calendar .' + i).addClass('activesecondcal');                    
                }
                elem.find('.second-calendar .' + findex).addClass('activeselectSecondcal');                    
            };
            scope.find_if_in_same = function(){
                var fsm = parseInt(scope.first_selected_date.split('/')[1]);
                var fsy =  parseInt(scope.first_selected_date.split('/')[0]);
                var ssm = parseInt(scope.second_selected_date.split('/')[1]);
                var ssy =  parseInt(scope.second_selected_date.split('/')[0]);
                if(fsm === ssm && fsy === ssy){
                    return true;
                }else{
                    return false;
                }
                

            };

            scope.change_date_format = function(date_string){
                return "amit";
            };
			
			scope.$on('resetCalendar', function(){
				scope.clearsecondcal();
				scope.clearfirstcal();
			});

            // end for second

            template = '<div class="vmf-calContainer" ng-click="displayCalendar();"><input ng-model="show_date"  class="vmf-calInput" type="text" id="'+scope.calendarInputId+'" placeholder="Select Dates" readonly><span class="calIcon" ></span></div>' +
                '<div class="calendercontainer">' +
                '<div class="vmf-dateContainer tableBorder">' +
                '   <div class="calSubHeader">' +
                '       <span class="dateSubHead">From..' +
                '       </span>' +
                '       <div vmf-select-list model="first_year" list="firstyearlist"  pre-select-ind="'+ indexFirstCal +'" class="yearDropDown firstcaldir" show-arrows="false">' +
                '       </div>' +
                '   </div>' +
                '<table class="table-condensed first-calendar">' +
                '   <thead>' +
                '      <tr>' +
                '         <th class="prev available"><a href="javascript:void(0)" ng-click="goleftwithfirst(first_month,first_year);" ><span class="arrow-left"></span></a></th>' +
                '         <th colspan="5" tabindex="0" ng-keyup="onKeydownfirstcal($event,first_month,first_year);" class="month" ng-bind="convertMonth(first_month);"> </th>' +
                '         <th class="next available"><a href="javascript:void(0)" ng-click="gorightwithfirst(first_month,first_year);" ><span class="arrow-right"></span></a></th>' +
                '      </tr>  ' +
                '      <tr>' +
                '         <th>S</th>' +
                '         <th>M</th>' +
                '         <th>T</th>' +
                '         <th>W</th>' +
                '         <th>T</th>' +
                '         <th>F</th>' +
                '         <th>S</th>' +
                '      </tr>' +
                '   </thead>' +
                '   <tbody ng-mouseleave = "leavingfirstcal();" ng-swipe-left="gorightwithfirst(first_month,first_year);" ng-swipe-right="goleftwithfirst(first_month,first_year);"  >' +
                '      <tr>' +
                '         <td ng-mouseover="hoverFirstDate(i,first_month,first_year);" tabindex="0" ng-keyup="keyDateChangeFirst($event,i,first_month,first_year);" ng-click="selectFirstDate(i,first_month,first_year);" ng-repeat="i in [0,1,2,3,4,5,6]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(first_cal[i]);">{{first_cal[i]}}</a></td>' +

                '      </tr>' +
                '      <tr>' +
                '         <td ng-mouseover="hoverFirstDate(i,first_month,first_year);" tabindex="0" ng-keyup="keyDateChangeFirst($event,i,first_month,first_year);" ng-click="selectFirstDate(i,first_month,first_year);" ng-repeat="i in [7,8,9,10,11,12,13]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(first_cal[i]);">{{first_cal[i]}}</a></td>' +

                '      </tr>' +
                '      <tr>' +
                '         <td ng-mouseover="hoverFirstDate(i,first_month,first_year);" tabindex="0" ng-keyup="keyDateChangeFirst($event,i,first_month,first_year);" ng-click="selectFirstDate(i,first_month,first_year);" ng-repeat="i in [14,15,16,17,18,19,20]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(first_cal[i]);">{{first_cal[i]}}</a></td>' +
                '      </tr>' +
                '      <tr>' +
                '         <td ng-mouseover="hoverFirstDate(i,first_month,first_year);" tabindex="0" ng-keyup="keyDateChangeFirst($event,i,first_month,first_year);" ng-click="selectFirstDate(i,first_month,first_year);" ng-repeat="i in [21,22,23,24,25,26,27]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(first_cal[i]);">{{first_cal[i]}}</a></td>' +
                '      </tr>' +
                '      <tr  >' +
                '         <td ng-mouseover="hoverFirstDate(i,first_month,first_year);" tabindex="0" ng-keyup="keyDateChangeFirst($event,i,first_month,first_year);" ng-click="selectFirstDate(i,first_month,first_year);" ng-repeat="i in [28,29,30,31,32,33,34]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(first_cal[i]);">{{first_cal[i]}}</a></td>' +
                '      </tr>' +
                '      <tr  >' +
                '         <td ng-mouseover="hoverFirstDate(i,first_month,first_year);" tabindex="0" ng-keyup="keyDateChangeFirst($event,i,first_month,first_year);" ng-click="selectFirstDate(i,first_month,first_year);" ng-repeat="i in [35,36,37,38,39,40,41]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(first_cal[i]);">{{first_cal[i]}}</a></td>' +
                '      </tr>' +
                '   </tbody>' +
                '</table>' +
                '</div>' +
                '<div class="vmf-dateContainer">' +
                '<div class="calSubHeader">' +
                '   <span class="dateSubHead">To..' +
                '   </span>' +
                '   <span ><div vmf-select-list show-arrows="false" model="second_year" list="secondyearlist" pre-select-ind="0" class="yearDropDown secondcaldir"></div></span>' +
                 
                '</div>' +
                '<table class="table-condensed second-calendar">' +
                '   <thead>' +
                '      <tr>' +
                '         <th class="prev available"><a href="javascript:void(0)" ng-click="goleftwithsecond(second_month,second_year);" ><span class="arrow-left"></span></a></th>' +

                '         <th colspan="5" class="month" ng-bind="convertMonth(second_month);"> </th>' +
                '         <th class="next available"><a href="javascript:void(0)" ng-click="gorightwithsecond(second_month,second_year);" ><span class="arrow-right"></span></a></th>' +
                '      </tr>' +
                '      <tr>' +
                '         <th>S</th>' +
                '         <th>M</th>' +
                '         <th>T</th>' +
                '         <th>W</th>' +
                '         <th>T</th>' +
                '         <th>F</th>' +
                '         <th>S</th>' +
                '      </tr>' +
                '   </thead>' +
                '   <tbody ng-mouseleave = "leavingsecondcal();" ng-swipe-left="gorightwithsecond(second_month,second_year);" ng-swipe-right="goleftwithsecond(second_month,second_year);" >' +
                '      <tr>' +
                '         <td ng-mouseover="hoverSecondDate(i,second_month,second_year);" ng-click="selectSecondDate(i,second_month,second_year);" ng-repeat="i in [0,1,2,3,4,5,6]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(second_cal[i]);">{{second_cal[i]}}</a></td>' +

                '      </tr>' +
                '      <tr>' +
                '         <td ng-mouseover="hoverSecondDate(i,second_month,second_year);" ng-click="selectSecondDate(i,second_month,second_year);" ng-repeat="i in [7,8,9,10,11,12,13]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(second_cal[i]);">{{second_cal[i]}}</a></td>' +

                '      </tr>' +
                '      <tr>' +
                '         <td ng-mouseover="hoverSecondDate(i,second_month,second_year);" ng-click="selectSecondDate(i,second_month,second_year);" ng-repeat="i in [14,15,16,17,18,19,20]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)">{{second_cal[i]}}</a></td>' +
                '      </tr>' +
                '      <tr>' +
                '         <td ng-mouseover="hoverSecondDate(i,second_month,second_year);" ng-click="selectSecondDate(i,second_month,second_year);" ng-repeat="i in [21,22,23,24,25,26,27]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(second_cal[i]);">{{second_cal[i]}}</a></td>' +
                '      </tr>' +
                '      <tr>' +
                '         <td ng-mouseover="hoverSecondDate(i,second_month,second_year);" ng-click="selectSecondDate(i,second_month,second_year);" ng-repeat="i in [28,29,30,31,32,33,34]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(second_cal[i]);">{{second_cal[i]}}</a></td>' +
                '      </tr>' +
                '      <tr>' +
                '         <td ng-mouseover="hoverSecondDate(i,second_month,second_year);" ng-click="selectSecondDate(i,second_month,second_year);" ng-repeat="i in [35,36,37,38,39,40,41]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(second_cal[i]);">{{second_cal[i]}}</a></td>' +
                '      </tr>' +
                '   </tbody>' +
                '</table></div></div>';




            elem.append(template);
            // if(scope.customClass){
            //     angular.forEach(scope.customClass, function(item) {
            //         elem.find(item.selector).addClass(item.cusclass);


            //     });
            // }
            $compile(elem.contents())(scope);


        }

    };
}])



/* Calendar Directive Single */
.directive('vmfCalendarSingle', ['$compile', '$document', '$timeout', function($compile, $document, $timeout) {
    return {
        restrict: 'EA',
        scope: {
            sdate: '@',
            edate: '@'
            
        },
        controller: ['$scope', function($scope) {

           

        }],

        link: function(scope, elem, attrs) {
            var template;
            temp_start = scope.sdate.split('/');
            scope.startdate = new Date(temp_start[2],temp_start[1]-1,temp_start[0]);


            temp_end = scope.edate.split('/');
            scope.enddate = new Date(temp_end[2],temp_end[1]-1,temp_end[0]);

            //console.log(scope.startdate);
            //console.log(scope.enddate);

            scope.firstyearlist = [];
            for(i=scope.startdate.getFullYear();i<= scope.enddate.getFullYear();i++){
                scope.firstyearlist.push(i);
            }
          
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth(); //January is 0!
            var yyyy = today.getFullYear();
            scope.first_year = yyyy;
            var curIndex = scope.firstyearlist.indexOf(yyyy);
            //console.log(curIndex);

            scope.first_month = mm;
            var day = today.getDay();

            // scope.secondyearlist = new Array(10);
            // var j = 0;
            // for (i = scope.first_year; i <= (scope.first_year + 20); i++) {
            //     scope.secondyearlist[j++] = i;
            // }

            var lastday = new Date(yyyy, mm + 1, 0);

            var lastdate = lastday.getDate();
            

            var firstday = new Date(yyyy, mm, 1);
            
            firstday = firstday.getDay();
            
            var cal_data_first = [];
            var daycount = 1;
            
            daycount = 1;
            cal_data_first = [];
            i = firstday;
            counter = lastdate;
            while (counter !== 0) {
                cal_data_first[i++] = daycount++;

                counter = counter - 1;
            }
            
            daycount = 1;
        
            scope.first_cal = cal_data_first;
            
            mm = mm + 1;

            scope.second_year = yyyy;
            scope.second_month = mm;

            
            var slastday = new Date(yyyy, mm + 1, 0);
            var slastdate = slastday.getDate();
          

            var sfirstday = new Date(yyyy, mm, 1);
            sfirstday = sfirstday.getDay();
           



            var cal_data_second = [];
            daycount = 1;
            
            cal_data_first = [];
            i = sfirstday;
            counter = slastdate;
            while (counter !== 0) {
                cal_data_second[i++] = daycount++;

                counter = counter - 1;
            }


            
            daycount = 1;
         
            scope.second_cal = cal_data_second;
           

            scope.goleftwithfirst = function(month, year) {   
                    ////console.log('go left with first');
                    elem.find('.arrow-right').removeClass('hiddenarrow').parent().removeClass("disabledarrow");
                    var firstday;
                    if (scope.first_year === scope.firstyearlist[0] && scope.first_month === 0) {
                        
                        return;
                    }
                    for (i = 0; i < cal_data_first.length; i++) {
                        elem.find('.first-calendar .' + i).removeClass('activefirstcal');
                        elem.find('.first-calendar .' + i).removeClass('activeselectfirstcal');
                    }
                    if (month === 0) {
                        //////console.log('inside if ');
                        year = year - 1;
                        firstday = new Date(year, month, 1);   
                        if(firstday < scope.startdate){
                            //console.log('cant go beyond this date');
                            return;
                        }


                        //console.log('this is changing the year')
                        elem.find('.current-selection').text(year);
                        month = 11;
                    } else {
                        //////console.log('inside else');
                        month = month - 1;
                    }               
                    firstday = new Date(year, month, 1);               
                    firstday = firstday.getDay();       
                    var lastday = new Date(year, month + 1, 0);             
                    var lastdate = lastday.getDate();
                    var daycount = 1;
                    cal_data_first = [];
                    i = firstday;
                    counter = lastdate;
                    while (counter !== 0) {
                        cal_data_first[i++] = daycount++;

                        counter = counter - 1;
                    }          
                    scope.first_cal = cal_data_first;           
                    scope.first_month = month;
                    scope.first_year = year;
                    if(scope.first_selected_date){
                        var fd = new Date(scope.first_selected_date);
                        var firstdate = fd.getDate();
                        var fm = fd.getMonth();
                        var fy = fd.getFullYear();
                        var ind = cal_data_first.indexOf(firstdate);
                        if(fm === scope.first_month && fy === scope.first_year){
                            elem.find('.first-calendar .'+ ind).addClass('activeselectfirstcal');
                        }
                        
                    }
                    if(month ===(scope.startdate.getMonth()) && parseInt(year) === scope.startdate.getFullYear()){
                        elem.find('.arrow-left').addClass('hiddenarrow').parent().addClass("disabledarrow");
                    }else{
                        elem.find('.arrow-left').removeClass('hiddenarrow').parent().removeClass("disabledarrow");

                    }

               
                
            };


            scope.gorightwithfirst = function(month, year) { 
                    ////console.log('go right with first');
                    // if((month -1) ===(scope.enddate.getMonth()) && parseInt(year) === scope.enddate.getFullYear()){
                    //     console.log('cant go beyond this date');
                    //     return;
                    // }
                    elem.find('.arrow-left').removeClass('hiddenarrow').parent().removeClass("disabledarrow");

                    var firstday;
                    for (i = 0; i < cal_data_first.length; i++) {
                        elem.find('.first-calendar .' + i).removeClass('activefirstcal');
                        elem.find('.first-calendar .' + i).removeClass('activeselectfirstcal');
                    }
                    if (month === 11) {
                        //////console.log('inside if ');
                        year = parseInt(year) + 1;
                        //console.log('this is changing the year')
                        firstday = new Date(year, month, 1);
                        //console.log(firstday);
                        if(firstday > scope.enddate){
                            //console.log('cant go beyond this date');
                            return;
                        }
                        elem.find('.current-selection').text(year);

                        month = 0;

                    } else {
                        //////console.log('inside else');
                        month = month + 1;
                    }

               
                    
                    firstday = new Date(year, month, 1);
                    firstday = firstday.getDay();

                   

                    var lastday = new Date(year, month + 1, 0);
                    
                    var lastdate = lastday.getDate();
                   


                    var daycount = 1;
                    cal_data_first = [];
                    i = firstday;
                    counter = lastdate;
                    while (counter !== 0) {
                        cal_data_first[i++] = daycount++;

                        counter = counter - 1;
                    }
                   
                    scope.first_cal = cal_data_first;

                    //////console.log(cal_data_first);
                    scope.first_month = month;
                    scope.first_year = year;

                    if(scope.first_selected_date){
                        var fd = new Date(scope.first_selected_date);
                        var firstdate = fd.getDate();
                        var fm = fd.getMonth();
                        var fy = fd.getFullYear();
                        var ind = cal_data_first.indexOf(firstdate);
                        if(fm === scope.first_month && fy === scope.first_year){
                            elem.find('.first-calendar .'+ ind).addClass('activeselectfirstcal');
                        }
                        
                    }

                    if(month ===(scope.enddate.getMonth()) && parseInt(year) === scope.enddate.getFullYear()){
                        elem.find('.arrow-right').addClass('hiddenarrow').parent().addClass("disabledarrow");
                    }else{
                        elem.find('.arrow-right').removeClass('hiddenarrow').parent().removeClass("disabledarrow");

                    }
                    if(month ===(scope.startdate.getMonth()) && parseInt(year) === scope.startdate.getFullYear()){
                        elem.find('.arrow-left').addClass('hiddenarrow').parent().addClass("disabledarrow");


                    }

                    // if (scope.first_year === scope.second_year && (scope.first_month === scope.second_month || (scope.first_month -1) === scope.second_month)) {
                    //     //////console.log('inside if of gorightwithfirst');
                    //     scope.gorightwithsecond(scope.first_month, scope.first_year);
                    // }
                
            };



            // end for first            


            // functions to support left and right arrows of second calendar

           

            

         

            scope.displayCalendar = function() {
                elem.find(".calIcon").addClass("activeCal");
                elem.find('.calendercontainersingle').css("visibility", "visible").addClass('calendercontainerActive');
                elem.find('.first-calendar .month').focus();
                scope.calendar = true;
            };
            scope.hideCalendar = function() {
                elem.find(".calIcon").removeClass("activeCal");
                elem.find('.calendercontainersingle').css("visibility", "hidden").removeClass('calendercontainerActive');
                elem.find('.placeholdersjs').removeClass('placeholdersjs');
                scope.calendar = false;
            };

            scope.convertMonth = function(m_index) {
                var m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                return m[m_index];

            };
            scope.month_double = function(m_index) {
                var m = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
                return m[m_index];

            };
            scope.month_double = function(m_index) {
                var m = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
                return m[m_index];

            };
            scope.date_double = function(date){
                if((date < 9)){
                    var d = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09'];
                    return d[date];
                }else{
                    return date;
                }
            };

            scope.selectFirstDate = function(date, month, year) {
                // date = date;
                //////console.log(date);
                //////console.log(month);
                //////console.log(year);
                if (cal_data_first[date]) {
                    for (i = 0; i < cal_data_first.length; i++) {
                        elem.find('.first-calendar .' + i).removeClass('activefirstcal');
                        elem.find('.first-calendar .' + i).removeClass('activeselectfirstcal');
                    }
                    // for (i = date; i < cal_data_first.length; i++) {
                    //     elem.find('.first-calendar .' + i).addClass('activefirstcal');

                    // }

                    elem.find('.first-calendar .' + date).addClass('activeselectfirstcal');
                }
                // var fdate = cal_data_first.indexOf(date);
                fdate = cal_data_first[date];
                scope.first_selected_date = scope.first_year + '/' + (parseInt(scope.first_month) + 1) + '/' + (parseInt(fdate));
                scope.date_range = scope.first_selected_date;
                scope.show_date = scope.month_double((parseInt(scope.first_month) + 1)) + '/' + scope.date_double((parseInt(fdate))) + '/' + scope.first_year;
                ////console.log(scope.date_range);
				elem.find(".error-msg").remove();
				elem.find(".has-error").removeClass("has-error");
                scope.hideCalendar();
                //////console.log(scope.first_selected_date);
            };

            scope.hoverFirstDate = function(date, month, year) {
                    ////console.log('hover first entry');
                    ////console.log(date);
                    ////console.log(month);
                    ////console.log(year);
                
                    if (scope.first_cal[date]) {
                        for (i = 0; i < scope.first_cal.length; i++) {
                            elem.find('.first-calendar .' + i).removeClass('hoverselectfirstcal');

                        }
                        for (i = 0; i < scope.first_cal.length; i++) {
                            elem.find('.first-calendar .' + i).removeClass('activefirstcalhover');

                        }
                        for (i = date; i < scope.first_cal.length; i++) {
                            elem.find('.first-calendar .' + i).addClass('activefirstcalhover');

                        }


                        // elem.find('.first-calendar').removeClass('hoverselectfirstcal');
                        elem.find('.first-calendar .' + date).addClass('hoverselectfirstcal');
                        //////console.log(date);

                    }
             
                
                


            };

    


            scope.leavingfirstcal = function() {
                ////console.log('leaving first cal');
                for (i = 0; i < cal_data_first.length; i++) {
                    elem.find('.first-calendar .' + i).removeClass('hoverselectfirstcal');

                }
                for (i = 0; i < cal_data_first.length; i++) {
                    elem.find('.first-calendar .' + i).removeClass('activefirstcalhover');

                }
            };

           

            

            // keyboard events
            scope.onKeydownfirstcal = function(e,first_month,first_year){
                //////console.log(e.keyCode);
                if(e.keyCode === 39){
                    scope.gorightwithfirst(first_month,first_year);
                }
                if(e.keyCode === 37){
                    scope.goleftwithfirst(first_month,first_year);
                }
            }; 
            scope.keyDateChangeFirst =function(e,x,y,z){
                //////console.log(e.keyCode);
                if(e.keyCode === 13){
                   
                    elem.find('.second-calendar .month').focus();
                    scope.selectFirstDate(x,y,z);

                }

                
            };
            scope.checkEmpty = function(val){
                // //////console.log("checkEmpty");
                // //////console.log(val);
                if(val){
                    return true;
                }else{
                    return false;
                }

            };


            $timeout(function() {
                // elem.find('.current-selection').text(scope.first_year);
                // elem.find('.second-calendar .arrow-left').hide();
                // var ul = elem.find('.secondcaldir ul');
                // var scrollPane = ul.jScrollPane({
                //     showArrows: true,
                //     verticalArrowPositions: 'after'
                // });

                // $(".jspDrag").bind('click',function(event) {
                //         event.stopImmediatePropagation();
                //     }
                // );
            });
            
            elem.bind('click',function(e){
                e.stopPropagation();
            });
            $document.bind('click.calendarDirective',function(){
                scope.hideCalendar();
            });

            scope.$watch("first_year", function(newval, oldval) {
                if (newval) {
                    scope.first_year = parseInt(newval);
                    // scope.secondyearlist = [];
                    var j = 0;
                    // for (i = scope.first_year; i <= (scope.first_year + 5); i++) {
                    //     scope.secondyearlist[j++] = i;
                    // }
                    //////console.log(scope.first_year);
                    // if(scope.first_selected_date){
                    //     scope.clearfirstcal(); 
                    // }
                   
                    scope.gorightwithfirst(scope.first_month - 1, newval);



                }
            });

            scope.$on('resetCalendar', function(){
				scope.clearsecondcal();
				scope.clearfirstcal();
			});

            // end for second

            template = '<div class="vmf-calContainer" ng-click="displayCalendar();" ><input ng-model="show_date"  class="vmf-calInput" type="text" id="coverageDates" placeholder="Select Dates" readonly><span class="calIcon" ></span></div>' +
                '<div class="calendercontainersingle">' +
                '<div class="vmf-dateContainer tableBorder">' +
                '   <div class="calSubHeader">' +
                '       <span class="dateSubHead">Year' +
                '       </span>' +
                '       <div vmf-select-list model="first_year" list="firstyearlist"  pre-select-ind="'+ curIndex +'" class="yearDropDown" show-arrows="false">' +
                '       </div>' +
                '   </div>' +
                '<table class="table-condensed first-calendar">' +
                '   <thead>' +
                '      <tr>' +
                '         <th class="prev available"><a href="javascript:void(0)" ng-click="goleftwithfirst(first_month,first_year);" ><span class="arrow-left"></span></a></th>' +
                '         <th colspan="5" tabindex="0" ng-keyup="onKeydownfirstcal($event,first_month,first_year);" class="month" ng-bind="convertMonth(first_month);"> </th>' +
                '         <th class="next available"><a href="javascript:void(0)" ng-click="gorightwithfirst(first_month,first_year);" ><span class="arrow-right"></span></a></th>' +
                '      </tr>  ' +
                '      <tr>' +
                '         <th>S</th>' +
                '         <th>M</th>' +
                '         <th>T</th>' +
                '         <th>W</th>' +
                '         <th>T</th>' +
                '         <th>F</th>' +
                '         <th>S</th>' +
                '      </tr>' +
                '   </thead>' +
                '   <tbody ng-mouseleave = "leavingfirstcal();" ng-swipe-left="gorightwithfirst(first_month,first_year);" ng-swipe-right="goleftwithfirst(first_month,first_year);"  >' +
                '      <tr>' +
                '         <td ng-mouseover="hoverFirstDate(i,first_month,first_year);" tabindex="0" ng-keyup="keyDateChangeFirst($event,i,first_month,first_year);" ng-click="selectFirstDate(i,first_month,first_year);" ng-repeat="i in [0,1,2,3,4,5,6]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(first_cal[i]);">{{first_cal[i]}}</a></td>' +

                '      </tr>' +
                '      <tr>' +
                '         <td ng-mouseover="hoverFirstDate(i,first_month,first_year);" tabindex="0" ng-keyup="keyDateChangeFirst($event,i,first_month,first_year);" ng-click="selectFirstDate(i,first_month,first_year);" ng-repeat="i in [7,8,9,10,11,12,13]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(first_cal[i]);">{{first_cal[i]}}</a></td>' +

                '      </tr>' +
                '      <tr>' +
                '         <td ng-mouseover="hoverFirstDate(i,first_month,first_year);" tabindex="0" ng-keyup="keyDateChangeFirst($event,i,first_month,first_year);" ng-click="selectFirstDate(i,first_month,first_year);" ng-repeat="i in [14,15,16,17,18,19,20]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(first_cal[i]);">{{first_cal[i]}}</a></td>' +
                '      </tr>' +
                '      <tr>' +
                '         <td ng-mouseover="hoverFirstDate(i,first_month,first_year);" tabindex="0" ng-keyup="keyDateChangeFirst($event,i,first_month,first_year);" ng-click="selectFirstDate(i,first_month,first_year);" ng-repeat="i in [21,22,23,24,25,26,27]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(first_cal[i]);">{{first_cal[i]}}</a></td>' +
                '      </tr>' +
                '      <tr ng-if="checkEmpty(first_cal[28]);" >' +
                '         <td ng-mouseover="hoverFirstDate(i,first_month,first_year);" tabindex="0" ng-keyup="keyDateChangeFirst($event,i,first_month,first_year);" ng-click="selectFirstDate(i,first_month,first_year);" ng-repeat="i in [28,29,30,31,32,33,34]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(first_cal[i]);">{{first_cal[i]}}</a></td>' +
                '      </tr>' +
                '      <tr ng-if="checkEmpty(first_cal[35]);" >' +
                '         <td ng-mouseover="hoverFirstDate(i,first_month,first_year);" tabindex="0" ng-keyup="keyDateChangeFirst($event,i,first_month,first_year);" ng-click="selectFirstDate(i,first_month,first_year);" ng-repeat="i in [35,36,37,38,39,40,41]" class="{{i}}" data-title="r0c0"><a href="javascript:void(0)" ng-if="checkEmpty(first_cal[i]);">{{first_cal[i]}}</a></td>' +
                '      </tr>' +
                '   </tbody>' +
                '</table>' +
                '</div>' +
                '</div>';




            elem.append(template);
            // if(scope.customClass){
            //     angular.forEach(scope.customClass, function(item) {
            //         elem.find(item.selector).addClass(item.cusclass);


            //     });
            // }
            $compile(elem.contents())(scope);


        }

    };
}]);