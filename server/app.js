const express = require('express');

let toDoItems = [
    {
      todoItemId: 0,
      name: 'an item',
      priority: 3,
      completed: false
    },
    {
      todoItemId: 1,
      name: 'another item',
      priority: 2,
      completed: false
    },
    {
      todoItemId: 2,
      name: 'a done item',
      priority: 1,
      completed: true
    }
];

const app = express();

app.use(express.json());
//app.use(express.urlencoded({extend:true}));

app.get('/', (req, res) => {
    let ok = {
        status: "ok"
    }
    res.status(200).json(ok);
});

app.get('/api/TodoItems', (req, res) => {
    res.status(200).json(toDoItems);
});

app.get('/api/TodoItems/:number', (req, res) => {
    let id = req.params.number;
    let itemIndex = getItemIndex(id);

    if (itemIndex != null){
        let item = toDoItems[itemIndex];
        res.status(200).json(item);
    }
    else{
        sendNotFound(res, id);
    }
});

app.post('/api/TodoItems/', (req, res) => {
    let newItem = req.body;
    let duplicate = false;

    for (let item of toDoItems){
        if (newItem.todoItemId === item.todoItemId){
            duplicate = true;
            item.name = newItem.name;
            item.priority = newItem.priority;
            item.completed = newItem.completed;
            break;    
        }
    }
    if (!duplicate){
        toDoItems.push(newItem);
    }
    res.status(201).json(newItem);
});

app.delete('/api/TodoItems/:number', (req, res) => {
    let id = req.params.number;
    let itemIndex = getItemIndex(id);

    if (itemIndex != null){
        let item = toDoItems[itemIndex];
        toDoItems.splice(itemIndex, 1);
        res.status(200).json(item);
    }
    else{
        sendNotFound(res, id);
    }
});

function getItemIndex(itemId){
    for (let i=0; i<toDoItems.length; i++){
        if (toDoItems[i].todoItemId == itemId){
            return i;
        }
    }
    return null;
}

function sendNotFound(res, id){
    let notFound = {
        status: "Item with ID of " + id + " can not be found"
    }
    res.status(404).json(notFound);
}

module.exports = app;
