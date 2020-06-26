const express = require('express')
var bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const port = 8080

var idCount = 0;

function student(username, email) {
    this.username = username;
    this.email = email;
    this.grades = [];
    this.studentId = ++idCount
};

var students = []

app.get('/', (req, res)=> {
    res.send('Student Application Landing Page')
})

// GET /students - returns a list of all students
// this endpoint, optionally, accepts query parameters
// GET /students?search=<query> - returns a list of students filtered on name matching the given query
app.get('/students', (req, res)=> {
    
    if (req.query.search !== undefined) {
        res.send(students.filter(element => element.username.includes(req.query.search)))
    } else {
        res.send(students)
    }
})

//GET /students/:studentId - returns details of a specific student by student id
app.get('/students/:studentId', (req, res)=> {
    res.send(students.find(element => element.studentId ==  req.params.studentId))
})

//GET /grades/:studentId - returns all grades for a given student by student id
app.get('/grades/:studentId', (req, res) => {
    res.send(students.find(element => element.studentId ==  req.params.studentId).grades)
})

//POST /grades
// records a new grade, returns success status in JSON response 
//      (meaning you do not need to actually store the grade in a database. 
//      You do need to validate that the user supplied at least a grade, and a studentId)
app.post('/grades', (req, res) => {
    let student = undefined
    if(req.body.studentId != undefined && req.body.grade != undefined){
        student = students.find(element => element.studentId ==  req.body.studentId)
    }
    if(student != undefined){
        student.grades.push(req.body.grade)
        res.json({ success: true })
    } else {
        res.json({ success: false })
    }
})

// POST /register
// creates a new user, returns success status in JSON response 
//      (meaning you do not need to actually store the user info in a database. 
//      You do need to validate that the user supplied username and email)
app.post('/register', (req,res) => {

    if(req.body.username !== undefined && req.body.email !== undefined){
        students.push(new student(req.body.username, req.body.email))
        res.json({ success: true })
    } else {
        res.json({ success: false })
    }
})

app.listen(port)

console.log('Running application on %s...', port)
