$(document).ready(function() {
  var today = new Date();
  var currentMonth = today.getMonth(); // plus 1 to have an exact current month
  var currentYear = today.getFullYear();
  var lowerLimit = 120;
  var isCalendarShowing = true;

  $(".js-calendar__icon").on("click", showCalendar); 
  $(".js-select__month").on("change", jumpToSelectedMonth); 
  $(".js-select__year").on("change", jumpToSelectedYear);   
  $(".js-prev__month").on("click", moveToPreviousMonth);
  $(".js-next__month").on("click", moveToNextMonth);
  $(".js-prev__year").on("click", moveToPreviousYear);
  $(".js-next__year").on("click", moveToNextYear);
  $(".js-date").on("click",".js-cell__days", getDateData);
  
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
                  row = row + "<td class='cell--bg__black'>' '</td>";
              }
              else if (date > daysInMonth && i < 6) {
                  row = row + "<td class='cell--bg__black'>' '</td>";
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
      for(var i = (currentYear - lowerLimit); i <= currentYear; i++) {
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
      if(currentYear === today.getFullYear() && currentMonth === 11) 
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
      if(currentYear === today.getFullYear())
        return;
      currentYear++;
      updateCalendarData(currentMonth, currentYear, today);    
  }
  
  function getDateData() {
    var dateStr = $(this).html() + "/" + (currentMonth + 1) + "/" + currentYear;
    $(".js-table__calendar").hide();
    isCalendarShowing = true;
    $(".js-textbox__birthday").empty().val(dateStr);
    console.log(dateStr);
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
  
    updateCalendarData(currentMonth, currentYear, today);
    init();
});

