
const openDb=async function(){
    console.log(`entered`)
    const dbPromise = await idb.openDB('Tasks',1)
 console.log(dbPromise)
}
// openDb();


 const createStoreInDB =async function (){
    const dbPromise = await idb.openDB('Tasks', 1, {
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

    console.log(`array of all tasks from getAll tasks`, arrOfAllTasks);
    
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
        
        deleteButton.innerText = 'Delete';
        tdDelete.appendChild(deleteButton);
        tdTaskDetails.innerText = `  ${arrOfAllTasks[i].task_title} - ${arrOfAllTasks[i].hours}:${arrOfAllTasks[i].minutes}, ${arrOfAllTasks[i].month} ${arrOfAllTasks[i].day}th ${arrOfAllTasks[i].year}.  ` 
        trObject.appendChild(tdTaskDetails);
        trObject.appendChild(tdDelete);
        table.appendChild(trObject);
    }
}


//   createStoreInDB();
//   addTask();