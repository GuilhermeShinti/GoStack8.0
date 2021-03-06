const express = require('express')
const app = express()
const projects = []
let numberOfRequests = 0;

app.use(express.json())

app.use((req, res, next) => {
    numberOfRequests++
    console.log(numberOfRequests)
    return next()
})

app.post('/projects', (req, res) => {
    const project = req.body
    if (!project.tasks) {
        project.tasks = []
    }
    projects.push(project)
    return res.json(projects)
})

app.get('/projects', (req, res) => {
    return res.json(projects)
})

app.put('/projects/:id', checkIfProjectExist, (req, res) => {
    const { id } = req.params
    const { title } = req.body
    const index = projects.findIndex(p => p.id == id)
    const project = projects[index]
    project.title = title
    res.json(project)
})

app.delete('/projects/:id', checkIfProjectExist, (req, res) => {
    const { id } = req.params
    const index = projects.findIndex(p => p.id == id)
    projects.splice(index, 1)
    return res.json(projects)
})

app.post('/projects/:id/tasks', checkIfProjectExist, (req, res) => {
    const { id } = req.params
    const { title } = req.body
    const index = projects.findIndex(p => p.id == id)
    const project = projects[index]
    project.tasks.push(title)
    return res.json(project)
})

function checkIfProjectExist(req, res, next) {
    const { id } = req.params
    const index = projects.findIndex(p => p.id == id)
    if (index == -1) {
        return res.status(400).json({ error: 'Projeto não encontrado.' });
    }
    return next()
}

app.listen(3000)