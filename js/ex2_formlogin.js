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
  // $(".js-form__submit").on( "submit", submitUserData );
  $(".js-form__submit").on("click",".js-button__submit", submitUserData);
  
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
          row = row + "</tr>"
          $(".js-date").append(row);
          row = "";
      } 
  }

  function init() {
      var dateStr = today.getDate() + "/" + (currentMonth + 1) + "/" + currentYear;
      for(var i = (currentYear - lowerLimit); i <= (currentYear + upperLimit); i++) {
          if(i === currentYear)
              $(".js-select__year").append("<option selected>" + i + "</option>"); 
          else
              $(".js-select__year").append("<option>" + i + "</option>"); 
      }
      $(".js-select__month").val(currentMonth);
      $(".js-textbox__birthday").val(dateStr);
  }

  function moveToPreviousMonth() {
      if(currentYear === (today.getFullYear() - lowerLimit) && currentMonth === 0) 
        return;
      currentYear = (currentMonth === 0) ? (currentYear - 1) : currentYear;
      currentMonth = (currentMonth === 0) ? 11 : (currentMonth - 1);      
      updateCalendarData(currentMonth, currentYear, today);            
  }

  function moveToNextMonth() {     
      if(currentYear === (today.getFullYear() + upperLimit) && currentMonth === 11) 
        return; 
      currentYear = (currentMonth === 11) ? (currentYear + 1) : currentYear;
      currentMonth = (currentMonth === 11) ? 0 : (currentMonth + 1); 
      updateCalendarData(currentMonth, currentYear, today);
  }

  function jumpToSelectedMonth() {
      currentMonth = parseInt($(this).val());
      updateCalendarData(currentMonth, currentYear, today);
  }

  function jumpToSelectedYear() {
      currentYear = parseInt($(this).val());
      updateCalendarData(currentMonth, currentYear, today);
  }
  
  function moveToPreviousYear() {
      if(currentYear === (today.getFullYear() - lowerLimit))
        return;
      currentYear--;
      updateCalendarData(currentMonth, currentYear, today);    
  }
  
  function moveToNextYear() {
      if(currentYear === (today.getFullYear() + upperLimit))
        return;
      currentYear++;
      updateCalendarData(currentMonth, currentYear, today);    
  }
  
  function getDateData() {
    var dateStr = $(this).html() + "/" + (currentMonth + 1) + "/" + currentYear;
    $(".js-table__calendar").hide();
    isCalendarShowing = true;
    $(".js-textbox__birthday").empty().val(dateStr);
  }
  
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
  
  function submitUserData(event) {
      var submitData = getSubmitData();
      var isDataValidated = validateSubmitData(submitData);
      if(isDataValidated) { 
        alert(submitData.username + " " + submitData.pass);
        $.ajax({
          url: "./check_dang_nhap.php",
          method: "GET",
          data: { username : submitData.username, pass : submitData.pass},
          success : function(response){
            alert(response);
            // if (response == "1") {
              // alert("Đăng nhập thành công");
            // }else{
              // alert("Tên đăng nhập hoặc mật khẩu không chính xác !");
            // }
          }
        });
      }
      else {
          event.preventDefault();
      }
  }
  
  function getSubmitData() {
      var username = $("#js-username").val();
      var pass = $("#js-password").val();
      var email = $("#js-email").val();
      var birthday = $("#js-birthday").val();
      var submitData = new SubmitData(username, pass, email, birthday);
      return submitData;
  }
  
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

      $(".js-error__username").empty();
      $(".js-error__password").empty();
      $(".js-error__email").empty();
      $(".js-error__birthday").empty(); 

      errUsername = ValidateUsername(submitData);
      console.log(errUsername);
      errPassword = ValidatePass(submitData);
      errEmail = ValidateEmail(submitData);
      errBirthday = ValidateBirthday(submitData);
      $(".js-error__username").html(errList[errUsername]);
      $(".js-error__password").html(errList[errPassword]);
      $(".js-error__email").html(errList[errEmail]);
      $(".js-error__birthday").html(errList[errBirthday]);
      
       if(errUsername != undefined || errPassword != undefined || errEmail != undefined || errBirthday != undefined) {
          return false;
       }
       return true;

  }

  function ValidateUsername(submitData) {
      if(submitData.username.length <= 0) {
          return "errBlank";
      }
      else if(submitData.username.indexOf(' ') > 0) {
          return "errSpace"
      } 
      else if(submitData.username.length < 8) {
          return "errMin"
      }       
  }
  function ValidatePass(submitData) {
      if(submitData.pass.length <= 0) {
          return "errBlank";
      }
      else if(submitData.pass.indexOf(' ') > 0) {
          return "errSpace"
      } 
      else if(submitData.pass.length < 8) {
          return "errMin"
      }       
  }
  function ValidateEmail(submitData) {
      if(submitData.email.length <= 0) {
          return "errBlank";
      }
      else if(submitData.email.indexOf(' ') > 0) {
          return "errSpace"
      } 
      else if(submitData.email.length < 8) {
          return "errMin"
      }
      else if(!isRightEmailFormat(submitData))
         return "errEmail";
  }
  
  function ValidateBirthday(submitData) {
      if(submitData.birthday.length <= 0) {
          return "errBlank";
      }
      else if(submitData.birthday.indexOf(' ') > 0) {
          return "errSpace"
      } 
      else if(submitData.birthday.length < 8) {
          return "errMin"
      }       
  }
  
  function isRightEmailFormat(submitData) {
      var emailFormat = new RegExp("^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$");
      //console.log(emailFormat.test(submitData.email));
      if(!emailFormat.test(submitData.email)) return false;
      return true;
  }
  
  var today = new Date();
  var currentMonth = today.getMonth(); // plus 1 to have an exact current month
  var currentYear = today.getFullYear();
  var lowerLimit = 100;
  var upperLimit = 100;
  var isCalendarShowing = true;
  var errList = {
    errBlank  : "Can not be left blank.",
    errSpace  : "Can not have space.",
    errMin    : "The number of character is at least 8.",
    errEmail  : "Wrong email format"
  }
  
  updateCalendarData(currentMonth, currentYear, today);
  init();
});

