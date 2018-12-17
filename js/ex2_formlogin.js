var SubmitData = function(usernameData, passData, emailData, birthdayData) {
    this.username = usernameData;
    this.pass = passData;
    this.email = emailData;   
    this.birthday = birthdayData;       
}

$(document).ready(function() {
    $(".js-calendar__icon").on("click", showCalendar); 
    $(".js-select__month").on("change", jumpToSelectedMonth); 
    $(".js-select__year").on("change", jumpToSelectedYear);   
    $(".js-prev__month").on("click", moveToPreviousMonth);
    $(".js-next__month").on("click", moveToNextMonth);
    $(".js-prev__year").on("click", moveToPreviousYear);
    $(".js-next__year").on("click", moveToNextYear);
    $(".js-date").on("click",".js-cell__days", getDateData);
    $(".js-form__submit").on("click",".js-button__submit", submitUserData);
    
    /*
      Update calendar data
      @param: month, year, today
      @return: N/A
    */
    function updateCalendarData(month, year, today) {    
        var firstDay = (new Date(year, month)).getDay();
        var daysInMonth = 32 - new Date(year, month, 32).getDate();
        $(".js-date").empty();  
        $(".js-select__month").val(currentMonth);
        $(".js-select__year").val(currentYear);
        
        var row;
        // creating all cells
        var date = 1;
        for (var i = 0; i < 6; i++) {
            // creates a table row
            row = "<tr>";
            
            //creating individual cells, filing them up with data.
            for (var j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    row = row + "<td class='cell--bg__gray'>" + "" + "</td>";
                }
                else if (date > daysInMonth && i < 6) {
                    row = row + "<td class='cell--bg__gray'>" + "" + "</td>";
                }
                else {    
                    if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) 
                        row = row + "<td class='cell_days cell--bg__blue js-cell__days'>" + date + "</td>";
                    else           
                        row = row + "<td class='cell_days cell--bg__white js-cell__days'>" + date + "</td>";
                    date++;
                }
            }
            row = row + "</tr>";
            $(".js-date").append(row);
            row = "";
        } 
    }

    /*
      Initialize calendar data
      @param: N/A
      @return: N/A
    */
    function init() {
        var dateStr = today.getDate() + "/" + (currentMonth + 1) + "/" + currentYear;
        for(var i = (currentYear - lowerLimit); i <= currentYear; i++) {
            if(i === currentYear)
                $(".js-select__year").append("<option selected>" + i + "</option>"); 
            else
                $(".js-select__year").append("<option>" + i + "</option>"); 
        }
        $(".js-select__month").val(currentMonth);
        $(".js-birthday").val(dateStr);
        updateCalendarData(currentMonth, currentYear, today);
    }

    /*
      Move to previous month
      @param: N/A
      @return: N/A
    */
    function moveToPreviousMonth() {
        if(currentYear === (today.getFullYear() - lowerLimit) && currentMonth === 0) 
            return;
        currentYear = (currentMonth === 0) ? (currentYear - 1) : currentYear;
        currentMonth = (currentMonth === 0) ? 11 : (currentMonth - 1);      
        updateCalendarData(currentMonth, currentYear, today);            
    }

    /*
      Move to next month
      @param: N/A
      @return: N/A
    */
    function moveToNextMonth() {     
        if(currentYear === today.getFullYear() && currentMonth === 11) 
            return; 
        currentYear = (currentMonth === 11) ? (currentYear + 1) : currentYear;
        currentMonth = (currentMonth === 11) ? 0 : (currentMonth + 1); 
        updateCalendarData(currentMonth, currentYear, today);
    }

    /*
      Jump to selected month
      @param: N/A
      @return: N/A
    */
    function jumpToSelectedMonth() {
        currentMonth = parseInt($(this).val());
        updateCalendarData(currentMonth, currentYear, today);
    }

    /*
      Jump to selected year
      @param: N/A
      @return: N/A
    */
    function jumpToSelectedYear() {
        currentYear = parseInt($(this).val());
        updateCalendarData(currentMonth, currentYear, today);
    }
 
    /*
      Move to previous year
      @param: N/A
      @return: N/A
    */ 
    function moveToPreviousYear() {
        if(currentYear === (today.getFullYear() - lowerLimit))
            return;
        currentYear--;
        updateCalendarData(currentMonth, currentYear, today);    
    }

    /*
      Move to next year
      @param: N/A
      @return: N/A
    */     
    function moveToNextYear() {
        if(currentYear === today.getFullYear())
            return;
        currentYear++;
        updateCalendarData(currentMonth, currentYear, today);    
    }
 
    /*
      Show selected day on textbox
      @param: N/A
      @return: N/A
    */  
    function getDateData() {
        var dateStr = $(this).html() + "/" + (currentMonth + 1) + "/" + currentYear;
        $(".js-table__calendar").hide();
        isCalendarShowing = true;
        $(".js-birthday").empty().val(dateStr);
    }

    /*
      Show/Hide calendar
      @param: N/A
      @return: N/A
    */     
    function showCalendar() {
        if(isCalendarShowing) {
            isCalendarShowing = false;
            $(".js-table__calendar").show();
        }
        else {
            isCalendarShowing = true;
            $(".js-table__calendar").hide();
        }
    }
 
    /*
      Submit user data to server
      @param: event
      @return: N/A
    */   
    function submitUserData(event) {
        var submitData = getSubmitData();
        var isDataValidated = validateSubmitData(submitData);
        if(isDataValidated) { 
            alert(submitData.username + " " + submitData.pass);
            $.ajax({
                url: "./check_dang_nhap.php",
                method: "GET",
                data: { 
                    username : submitData.username, 
                    pass : submitData.pass,
                    email: submitData.email,
                    birthday: submitData.birthday
                },
                dataType: "json",  
                success : function(response) { 
                    alert(response.js_arr); 
                    var js_arr = response.js_arr;
                    if(js_arr[0] === false) {
                        alert("Submit failed");
                        showError(js_arr[2], js_arr[3], js_arr[4], js_arr[5]);  
                    }
                    else if(js_arr[1] === true) {
                        alert("Username already existed. ");
                        alert("Submit failed");
                    }
                    else {
                        alert("Submit succeeded");
                    }
                }
            });
        }
        else {
            event.preventDefault();
        }
    }

    /*
      Get data from textbox
      @param: event
      @return: submitData
    */       
    function getSubmitData() {
        var username = $(".js-username").val();
        var pass = $(".js-password").val();
        var email = $(".js-email").val();
        var birthday = $(".js-birthday").val();
        var submitData = new SubmitData(username, pass, email, birthday);
        return submitData;
    }
 
    /*
      Validate submit data
      @param: submitData
      @return: true, false
    */    
    function validateSubmitData(submitData) {
        var errUsername;
        var errPassword;
        var errEmail;
        var errBirthday;
        // Delete space at the head and tail of the data 
        submitData.username =  $.trim(submitData.username);
        submitData.pass =  $.trim(submitData.pass);
        submitData.email =  $.trim(submitData.email);
        submitData.birthday =  $.trim(submitData.birthday);

        errUsername = validateUsername(submitData);
        errPassword = validatePass(submitData);
        errEmail = validateEmail(submitData);
        errBirthday = validateBirthday(submitData);
        showError(errUsername, errPassword, errEmail, errBirthday);
        
         if(errUsername != undefined || errPassword != undefined || errEmail != undefined || errBirthday != undefined) {
            return false;
         }
         return true;
    }

    /*
      Validate username
      @param: submitData
      @return: errBlank, errSpace, errMin
    */    
    function validateUsername(submitData) {
        if(submitData.username.length <= 0) {
            return "errBlank";
        }
        else if(submitData.username.indexOf(' ') > 0) {
            return "errSpace";
        } 
        else if(submitData.username.length < 8) {
            return "errMin";
        }       
    }
 
    /*
      Validate password
      @param: submitData
      @return: errBlank, errSpace, errMin
    */ 
    function validatePass(submitData) {
        if(submitData.pass.length <= 0) {
            return "errBlank";
        }
        else if(submitData.pass.indexOf(' ') > 0) {
            return "errSpace";
        } 
        else if(submitData.pass.length < 8) {
            return "errMin";
        }       
    }

    /*
      Validate email
      @param: submitData
      @return: errBlank, errSpace, errMin
    */     
    function validateEmail(submitData) {
        if(submitData.email.length <= 0) {
            return "errBlank";
        }
        else if(submitData.email.indexOf(' ') > 0) {
            return "errSpace";
        } 
        else if(submitData.email.length < 8) {
            return "errMin";
        }
        else if(!isRightEmailFormat(submitData))
           return "errEmail";
    }
 
    /*
      Validate birthday
      @param: submitData
      @return: errBlank, errSpace, errMin
    */  
    function validateBirthday(submitData) {
        if(submitData.birthday.length <= 0) {
            return "errBlank";
        }
        else if(submitData.birthday.indexOf(' ') > 0) {
            return "errSpace";
        } 
        else if(submitData.birthday.length < 8) {
            return "errMin";
        }       
    }

    /*
      Validate email format
      @param: submitData
      @return: true, false
    */     
    function isRightEmailFormat(submitData) {
        var emailFormat = new RegExp("^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$");
        if(!emailFormat.test(submitData.email)) return false;
        return true;
    }

    /*
      Show error 
      @param: errUsername, errPassword, errEmail, errBirthday
      @return: N/A
    */     
    function showError(errUsername, errPassword, errEmail, errBirthday) {
        $(".js-error__username").empty();
        $(".js-error__password").empty();
        $(".js-error__email").empty();
        $(".js-error__birthday").empty(); 
        
        $(".js-error__username").html(errList[errUsername]);
        $(".js-error__password").html(errList[errPassword]);
        $(".js-error__email").html(errList[errEmail]);
        $(".js-error__birthday").html(errList[errBirthday]);    
    }
    
    var today = new Date();
    var currentMonth = today.getMonth(); // plus 1 to have an exact current month
    var currentYear = today.getFullYear();
    var lowerLimit = 100;
    var isCalendarShowing = true;
    var errList = {
      errBlank  : "Must not be blank.",
      errSpace  : "Must not have space.",
      errMin    : "The number of character is at least 8.",
      errEmail  : "Wrong email format"
    }
   
    init();
});

