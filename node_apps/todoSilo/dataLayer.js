
var express = require('express');
var path = require('path');
var uuidv4 = require("uuid/v4");
var generator = require('generate-password');

var bodyParser = require('body-parser');

var app = express();
var port = 8190;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));   


app.use(function(req, res, next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    //Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");

    //Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "X-requested-with,content-type");

    next();

});

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//for generate GUID
var uuidv4 = require("uuid/v4");


mongoose.connect('mongodb://hugopuissant:bla1bla1@ds113942.mlab.com:13942/todo-silo-youmeo', function (err) {
    if(err){
        throw err;
    }else{
        console.log('mongo connected');
    }
});

//declare schema TASK
var TaskSchema = Schema({
    _id:String,
    name:String,
    done:Boolean,
    user_id: String
});

//Init model
var TaskModel = mongoose.model('tasks', TaskSchema);


// GET TASK SET FOR USER
app.post('/silo/getTaskSet', function(request, response){
    module.exports.getTaskSet(request.body.user_id, function(res){
        response.send(res);
    })
})

// GET TASK BY ID
app.post('/silo/findTaskById', function(request, response){
    module.exports.findTaskById(request.body.todo_id, function(res){
        response.send(res);
    })
})

// UPDATE TASK
app.post('/silo/updateTask', function(request, response){
    module.exports.updateTask(request.body, function(res){
        response.send(res);
    })
})

// ADD TASK
app.post('/silo/addTask', function(request, response){
    module.exports.updateTask(request.body, function(res){
        response.send(res);
    })
})

// DELETE TASK
app.post('/silo/deleteTaskById', function(request, response){
    module.exports.updateTask(request.body.id, function(res){
        response.send(res);
    })
})


module.exports = {

    /**
     * Renvoie le set de todos pour l'utilisateur
     * @param {*} user_id 
     * @param {*} cb 
     */
    getTaskSet: function(user_id, cb){
        TaskModel.find({'user_id':user_id}, function (err, taskset) {
            if(err){
                throw err;
            }else{
                if(taskset != null){
                    cb({
                        success : true,
                        data : taskset
                    });
                }else{
                    cb({
                        success : false,
                        errorSet : ['ERROR']
                    });
                }
            }
        });
    },

    /**
     * Renvoie le todo correspondant à l'id
     * @param {*} todo_id 
     * @param {*} cb 
     */
    findTaskById: function(todo_id, cb){
        TaskModel.findById(todo_id,function(err, task){
            if(err){
                throw err;
            }else{
                if(task!=null){
                    cb({
                        success : true, 
                        task: task
                    });
                }else{
                    cb({
                        success : false, 
                        errorSet: ['NOT_FOUND']
                    });
                }
            }
        });
    },

    /**
     * Met a jour le todo
     * @param {*} task 
     * @param {*} cb 
     */
    updateTask: function(task, cb){
        TaskModel.findByIdAndUpdate(task.id, task, function(err, task){
            if(err){
                throw err;
            }else{
                cb({success: true});
            }
        });
    },

    // RAjouter username
    addTask: function(task, cb){
        var taskToSave = new TaskModel({
            _id:task.id,
            name:task.name,
            done:task.done,
            user_id:task.user_id
        });
        taskToSave.save(function(err){
            if(err){
                throw err;
            }else{
                cb({success: true});
            }
        });
    },

    deleteTaskById: function(id, cb){
        TaskModel.findByIdAndRemove(id, function(err, todo){
            if (err){
                throw err;
            }else{
                cb({success : true});
            }
        });
    }
};


////////////////
console.log("Server started port " + port);
if(process.env.PORT !== undefined){
    port= process.env.PORT;
}
app.listen(port);
