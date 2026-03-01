// Seleccion de elementos
const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const itemCount = document.querySelector('#item-count');
const clearCompletedBtn = document.querySelector('#clear-completed');
const filterBtns = document.querySelectorAll('.filter-btn');

// Estado inicial: Cargar de LocalStorage o empezar vacío
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// --- FUNCIONES PRINCIPALES ---

function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';
    
    // Filtrar tareas antes de mostrar
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'pending') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${todo.completed ? 'completed' : ''}" onclick="toggleTodo(${todo.id})">
                ${todo.text}
            </span>
            <button onclick="deleteTodo(${todo.id})">X</button>
        `;
        todoList.appendChild(li);
    });

    updateStats();
}

function updateStats() {
    const pending = todos.filter(t => !t.completed).length;
    itemCount.textContent = `${pending} tareas pendientes`;
}

// --- ACCIONES ---

function addTodo(e) {
    e.preventDefault();
    const newTask = {
        id: Date.now(),
        text: todoInput.value,
        completed: false
    };
    todos.push(newTask);
    todoInput.value = '';
    saveAndRender();
}

window.toggleTodo = (id) => {
    todos = todos.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    saveAndRender();
};

window.deleteTodo = (id) => {
    todos = todos.filter(t => t.id !== id);
    saveAndRender();
};

function saveAndRender() {
    saveToLocalStorage();
    renderTodos();
}

// --- EVENTOS ---

todoForm.addEventListener('submit', addTodo);

clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(t => !t.completed);
    saveAndRender();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});


renderTodos();