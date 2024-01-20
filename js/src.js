const  tasksTable= document.querySelector('#to-do-table') 

function displayNotification(msg) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(registration => {
            return navigator.serviceWorker.ready.then(() => {
                return Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        const options = {
                            body: msg,
                            icon: '../images/notification-flat.png',
                            data: {
                                dateOfArrival: Date.now(),
                                primaryKey: 1
                            },
                            actions: [
                                { action: 'explore', title: 'Turn Off Notifcation', icon: '../images/checkmark.png' },
                                { action: 'close', title: 'Close the notification', icon: '../images/xmark.png' }
                            ]
                        };
                        registration.showNotification('Hello World!', options);
                    }
                });
            });
        }).catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    }
}




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
let arrOfAllTasks=[];

addTaskButton.addEventListener('click',     async function  () {
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
    addTask(taskObject);
    const data = await getAllTasks();
    drawTasksTable(data);
});


tasksTable.addEventListener('click', function (e) {
    console.log('table clicked')
    const target = e.target;
    if (target && target.id === 'deleteButton') {
        handleTaskDeleteButton(e);
    }
});


// const showNotification=function(msg){
// if('Notifaction' in window){
//     new Notification('I need your permession' , {body:msg})
// }
// }

// const notificationButton = document.getElementById('notificationButton');
// notificationButton.addEventListener('click', function(){
//     if(Notification in window && Notification.permission !== 'granted'){
//         Notification.requestPermission().then(function(permission){
//             if(permission==='granted'){
//                 showNotification('Thank you for your permission')
//             }
//         })
//     }
// })

const startInterval = async () => {
    // Use a regular function as the setInterval callback
    setInterval(async () => {
      await checkDeadline(); // Call the function inside the setInterval
    }, 7000);
  };

  startInterval();
