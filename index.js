// express ira controlar as rotas no server
const express = require('express')

// armazeno a função express para chama-la quando quiser
const server = express()

// chamo a função  express para utilizar o método json para exibir objetos no server
server.use(express.json())

//MIDDLEWARE

// a variável numberOfRequests é do tipo let pois irá sofrer modificações
let numberOfRequests = 0;

//Função que conta quantas requisições foram feitas
function logRequests(req,res,next) {
    numberOfRequests++

    console.log(`Número de requisições: ${numberOfRequests}`)

    return next()
}

server.use(logRequests)

//Função verifica se projeto existe pelo ID
function checkProjectId (req,res,next) {
    const { id } = req.params //recebe id por parametro e armazena
    const project = projects.find(p => p.id == id) // procura projeto no array pelo ip 

    if(!project){
        return res.status(400).json({error: "Project ID does not exists"})
    }
    req.project = project;

    return next();
}

// VETOR QUE CRIA OS PROJETOS INICIAIS
const projects = [
    {
        id: "1",
        title: "Projeto Inicial",
        tasks: ["Tarefa Inicial"]
    },
    {
        id: "2",
        title: "Projeto Dois",
        tasks: ["Tarefa 01","Tarefa 02"]
    },
    {
        id: "3",
        title: "Projeto Três",
        tasks: ["Tarefa 01","Tarefa 02", "Tarefa 03"]
    }
]

// * * * ROTAS CRUD * * *

// rota para listar todos os projetos
server.get('/projects', (req,res) => {
    return res.json(projects)
})

// rota para listar apenas um projeto pelo id
server.get('/projects/:id', checkProjectId, (req,res) =>{
    return res.json(req.project);
})

// rota para criar um novo projeto
server.post('/projects', (req,res) => {
    const { id, title } = req.body

    const project = {
        id,
        title,
        tasks: []
    }

    projects.push(project)

    return res.json(projects)
})

// rota para editar o title de um projeto existente
server.put('/projects/:id', checkProjectId, (req,res) => {
    const { id } = req.params //pego o id novamente pois o middleware não passa

    const { title } = req.body

    const project = projects.find(p => p.id == id)

    project.title = title

    return res.json(projects)
})

// rota para editar as tasks de um projeto existente
server.put('/projects/:id/:tasks', checkProjectId, (req,res) => {
    const { id } = req.params //pego o id novamente pois o middleware não passa

    const { tasks } = req.body

    const project = projects.find(p => p.id == id)

    project.tasks = tasks

    return res.json(projects)
})


// rota para deletar um projeto
server.delete('/projects/:id', checkProjectId, (req,res) => {
    const { id } = req.params

    const projectIndex = projects.findIndex(p => p.id == id)

    projects.splice(projectIndex, 1)

    return res.send()
})


server.listen(3002)