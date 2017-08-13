let formEl = document.getElementById('add-form')

formEl.addEventListener('submit', submitListAction)

function submitListAction(e){
	e.preventDefault();

	let listNameInput = document.getElementById('add-list')
	let listName = document.getElementById('add-list').value

	// if there's something in the field create a list
	new List(listName)

	// clear field after submit
	listNameInput.value = ""
	
	renderAll()

	
	let addTaskForm = document.getElementById('add-task')
	addTaskForm.style.display = 'block'
	addTaskForm.addEventListener('submit', submitTaskAction)

	// delete buttons
	const deleteTask = document.querySelectorAll('.destroyTask')
	deleteTask.forEach(taskButton => taskButton.addEventListener('click', deleteTaskAction))
	const deleteList = document.querySelectorAll('.destroyList')
	deleteList.forEach(listButton => listButton.addEventListener('click', deleteListAction))
}

function deleteListAction(e){
	List.deleteById(this.dataset.listId)
	// this.parentNode.remove()
	renderAll()
}

function deleteTaskAction(e){
	//pass in taskID then listID
	Task.deleteById(this.dataset.taskId, this.parentNode.parentNode.dataset.listId)
	this.parentNode.remove()
}

function addDeleteHandlers(){
	const deleteTask = document.querySelectorAll('.destroyTask')
	deleteTask.forEach(taskButton => taskButton.addEventListener('click', deleteTaskAction))
	const deleteList = document.querySelectorAll('.destroyList')
	deleteList.forEach(listButton => listButton.addEventListener('click', deleteListAction))
}

function renderAll(){
	const parentEl = document.getElementById('all-lists')
	const allListsHTML = List.renderAll()
	parentEl.innerHTML = allListsHTML

	// append options
	document.getElementById('select-list').innerHTML = List.renderSelectList()


	//fade in on all lists
	TweenLite.fromTo(parentEl, 1.5, {
		autoAlpha: 0,
		y: -30,
		ease: 'Power2'
	},
	{
		autoAlpha: 1,
		y: 0,
		ease: 'Power2'
	}
	)

	// delete button event handler
	addDeleteHandlers()
}

function submitTaskAction(e){
	e.preventDefault();

	let listInput = document.getElementById('select-list')
	let descriptionInput = document.getElementById('task-description')
	let priorityInput = document.getElementById('task-priority')
	new Task(listInput.value, descriptionInput.value, priorityInput.value)

	// clear all values besides list
	descriptionInput.value = ""
	priorityInput.value = ""

	// rerender all
	renderAll()

}

const List = (function createList(){

	allLists = []
	// allListsHTML = []
	return class List {
		constructor(name){
			this.name = name
			this.id = List.all().length
			this.tasks = []
			allLists.push(this)
			
		}

		render(){
			const filterDeleted = this.tasks.filter(task => {if (task != 'null'){return task}})
			const listTasks = filterDeleted.map(task => task.render()).join("")


			return `
			<div class="list" data-list-id="${this.id}"">
				<button class="btn btn-danger destroyList" data-list-id="${this.id}")">X</button><h4>${this.name}</h4>
				${listTasks}
			</div>
			`
		}

		static renderAll(){
			const filterDeleted = this.all().filter(list => {if (list != 'null'){return list}})
			const allListsHTML = filterDeleted.map(list => list.render()).join("")

			return `
			<div class="lists-wrapper">
				${allListsHTML}
			</div>
			`
		}

		static renderSelectList(){
			const filterDeleted = this.all().filter(list => {if (list != 'null'){return list}})
			const listOptions = filterDeleted.map(list => {return `<option value="${list.id}">${list.name}</option>`}).join("")
			return listOptions
		}

		static deleteById(id){
 			// allLists = allLists.filter(list => list.id != id)
 			allLists[id] = null
			renderAll()
		}

		static all(){
			return allLists.slice()
		}
	}
})()

const Task =(function createTask(){

	let allTasks = []

	return class Task{
		constructor(list, description, priority){
			this.list = List.all()[list]
			this.description = description
			this.priority = priority
			this.id = this.list.tasks.length
			this.list.tasks.push(this)
			allTasks.push(this)
		}

		render(){
			return `
				<div class="task-item">
					<button class="btn btn-danger destroyTask" data-task-id="${this.id}">X</button><h5>${this.description} Priority: ${this.priority}</h5>
				</div>
			`
		}

		static deleteById(taskId, listId){
			let parentList = List.all()[listId]
			parentList.tasks[taskId] = null
			//parentList.tasks = parentList.tasks.filter(task => {if (task != 'null'){return task}})
			renderAll()
		}

		static all(){
			return allTasks.slice()
		}
	}
})()
