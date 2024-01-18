
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
      tx.store.add({
        task_title: 'task 1',
        created: new Date().getTime(),
      }),
      tx.done
    ]);
  }


//   createStoreInDB();
//   addTask();