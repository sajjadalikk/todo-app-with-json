const express = require('express');

const path = require('path');

const fs = require('fs');

const app = express();

app.set('view engine','ejs');

app.use(express.static('./public'));

app.use(express.urlencoded({ extended: true }));

console.log('yes');






app.get('/',function (req,res)
{
    const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/tasks.json').toString()));

//console.log(tasks);

res.render('todo',{tasks});
});




app.post('/create-task', function(req, res){

    fs.readFile('data/tasks.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        obj.push(req.body); 
        json = JSON.stringify(obj); 
        fs.writeFile('data/tasks.json', json, 'utf8', function readFileCallback(err, data)
        {
            if (err)
            {
                console.log(err);
            } else 
            {
                console.log('data added');
                const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/tasks.json').toString()));
                res.render('todo',{tasks});
            }
        }); 
    }});

});




app.get('/delete-task/:task', (req,res) =>
{
    fs.readFile('./data/tasks.json', (err, data) =>
  {
      if (err) throw err;
      let todos = JSON.parse(data.toString());

      todos.splice(todos.findIndex( x => x.task == req.params.task), 1);
      fs.writeFile('./data/tasks.json', JSON.stringify(todos, null, 4), (err) => {
          if (err) throw err;
      });
      res.redirect('/');
  })
})



app.get('/toggleTodoChecked/:task', (req,res) =>
{
   
   fs.readFile('./data/tasks.json', (err, data) =>
   {
       if (err) throw err;
       let todos = JSON.parse(data.toString());
       const id = todos.findIndex( x => x.task== req.params.task);
       todos[id].isChecked = todos[id].isChecked == "checked"? "" : "checked";
       fs.writeFile('./data/tasks.json', JSON.stringify(todos, null, 4), (err) => {
           if (err) throw err;
       });
       res.redirect('/');
   });
})




app.listen(3000);
