const addTaskButton = document.getElementById('addTaskButton');

let taskTitle = '';
let selectedHours = '';
let selectedMinutes = '';
let selectedDay = '';
let selectedMonth = '';
let selectedYear = '';
let selectedDate = '';
let taskObject={};
let notifyCheckBox='';

addTaskButton.addEventListener('click', function () {
    taskTitle = document.querySelectorAll('input[type=text]')[0].value;
    selectedHours = document.querySelectorAll('input[type=number]')[0].value;
    selectedMinutes = document.querySelectorAll('input[type=number]')[1].value;
    selectedDay = document.getElementById('day').value;
    selectedMonth = document.getElementById('month').value;
    selectedYear = document.getElementById('year').value;
    notifyCheckBox = document.getElementById('notifyCheckbox').checked;;


    selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay, selectedHours, selectedMinutes);
    taskObject={
        task_title:taskTitle,
        day:selectedDay,
        hours:selectedHours,
        minutes:selectedMinutes,
        notified:notifyCheckBox,
        year:selectedYear,
        month:selectedMonth
    }
    console.log(`task object created`,taskObject)
});
