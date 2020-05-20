const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const QuestionModel = require('./database/Question');
const Answer = require('./database/Answer');

//Database
connection
    .authenticate()
    .then(()=>{
        console.log('Database connection successfully!!!');
    })
    .catch((msgErro)=>{
        console.log(msgErro);
    })
// EJS as View engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res)=>{
    QuestionModel.findAll({ raw: true, order: [
        ['id','DESC']
    ]}).then(questions =>{
        res.render("index", {
            questions
        });
    });
});

app.get('/questions', (req, res)=>{
    res.render('questions');
});

app.post('/savequestion', (req, res)=>{
    var title = req.body.title;
    var description = req.body.description;
    QuestionModel.create({
        title,
        description
    }).then(()=>{
        res.redirect('/')
    });
});


app.get('/question/:id',(req, res)=>{
    var id = req.params.id;
    QuestionModel.findOne({
        where: {id},
    }).then(question => {
        if(question != undefined){
            Answer.findAll({
                where: {questionId: question.id},
                order: [['id','DESC']]
            }).then(answers => {
                res.render("pergunta", {
                    question,
                    answers
                });
            }); 
        }else{
            res.redirect("/")
        }
    });
});

app.post("/answer", (req, res)=>{
    var body = req.body.body;
    var questionId = req.body.question;
    Answer.create({
        body,
        questionId
    }).then(()=>{
        res.redirect('/question/' + questionId);
    });
});

app.listen(8080, ()=>{
    console.log('App is running!');
});