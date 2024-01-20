let taskName=''; 

const openDb=async function(){
  
const dbPromise = await idb.openDB('Tasks',1)
 console.log(dbPromise)
}
// openDb();


 const createStoreInDB =async function (){
    const dbPromise = await idb.openDB('Task', 1, {
      upgrade (db) {
        if (!db.objectStoreNames.contains('user_task')) {
            const userTaskObjectStore=db.createObjectStore('user_task',{keyPath:'task_title'});
            userTaskObjectStore.createIndex('task_title', 'task_title', { unique: false });
          }      
          else{
            console.log(`else enterd`)
          }
    }
    });
  }
  
  const addTask =async function  (taskObj) {
    const db = await idb.openDB('Task', 1, {
      upgrade (db) {
        if (!db.objectStoreNames.contains('user_task')) {
            const userTaskObjectStore=db.createObjectStore('user_task',{keyPath:'task_title'});
            userTaskObjectStore.createIndex('task_title', 'task_title', { unique: false });
        }
      }
    });
    
    const tx = db.transaction('user_task', 'readwrite');
  
    await Promise.all([
      tx.store.add(taskObj),
      tx.done
    ]);
  }


  const getAllTasks = async function () {
    let arrOfAllTasks = [];
    const db = await idb.openDB('Task', 1);
    const tx = await db.transaction('user_task', 'readonly');
    let cursor = await tx.store.openCursor();
    
    while (cursor) {
        arrOfAllTasks.push(cursor.value);
        cursor = await cursor.continue();  // Move the cursor to the next item
    }

    // console.log(`array of all tasks from getAllTasks`, arrOfAllTasks);
    // Close the transaction before returning
    tx.done;

    return arrOfAllTasks;  // Return the array if needed
}


  const drawTasksTable = function (arrOfAllTasks) {
    const table = document.getElementById('to-do-table');

    table.innerHTML = '';

    for (let i = 0; i < arrOfAllTasks.length; i++) {
        let trObject = document.createElement('tr');
        let tdTaskDetails = document.createElement('td');
        let deleteButton = document.createElement('button');
        let tdDelete = document.createElement('td');
        deleteButton.id = 'deleteButton';
        deleteButton.innerText = 'Delete';
        tdDelete.appendChild(deleteButton);
        tdTaskDetails.innerText = `${arrOfAllTasks[i].task_title}- ${arrOfAllTasks[i].hours}:${arrOfAllTasks[i].minutes}, ${arrOfAllTasks[i].month} ${arrOfAllTasks[i].day}th ${arrOfAllTasks[i].year}.  ` 
        trObject.appendChild(tdTaskDetails);
        trObject.appendChild(tdDelete);
        table.appendChild(trObject);
    }
} 


 const updateTask=async function(taskObj){
  const db=await idb.openDB('Task',1);

  const tx = await db.transaction('user_task', 'readwrite');
  await Promise.all([

    tx.store.put({
      task_title:taskObj.task_title,
        day:taskObj.day,
        hours:taskObj.hours,
        minutes:taskObj.minutes,
        notified:false,
        year:taskObj.year,
        month:taskObj.month
    })
  ])
}
const checkDeadline = async function () {
  const databases = await indexedDB.databases();
  
  const taskDatabases = databases.filter(db => db.name === "Task");

  if (taskDatabases.length > 0) {

    
      const db = await idb.openDB('Task', 1);
      const tx = await db.transaction('user_task', 'readonly');
      const store = tx.objectStore('user_task');
      const currentDate = new Date();
    
      let cursor = await store.openCursor();
    
      while (cursor) {
        const task = cursor.value;
        const taskDate = new Date(task.year, task.month - 1, task.day, parseInt(task.hours) + 12, task.minutes);
    
        console.log(` from checkDeadline function `, task, ` and task date is `, taskDate, ` and current date is `, currentDate);
    
        if (currentDate > taskDate && task.hasOwnProperty('notified') && task.notified === true) {
          displayNotification(`HEY! Your "${task.task_title}" is now overdue.`);
          updateTask(task);
          cursor.value.notified = false;
        }
    
        cursor = await cursor.continue();
      }
    
      tx.done;
  }
};




 const deleteItemFromStore = async function  (taskName) {
  const db = await idb.openDB('Task', 1);
  await db.delete('user_task', taskName);

}


function handleTaskDeleteButton(e){
  taskName = e.target.closest('tr').childNodes[0].innerText.split('-')[0];
  
  
  deleteItemFromStore(taskName).then(()=>{
    getAllTasks().then(data=>{ 
      drawTasksTable(data)})
  }).catch(err=>console.log(err))

}

  createStoreInDB();
  // addTask();