let total = 0
const list = document.querySelector('#list')
const inputTask = document.querySelector('#inputTask')
const btnAdd = document.querySelector('#btnAdd')
const btnClearAll = document.querySelector('#btnClearAll')
const stats = document.querySelector('#stats')
const btnDownload = document.querySelector('#btnDownload')

// 1. FUNÇÃO PARA SALVAR NO LOCALSTORAGE
function saveToLocalStorage() {
  const tasks = [...list.children].map(li => ({
    text: li.querySelector('span').innerText,
    done: li.classList.contains('done')
  }))
  localStorage.setItem('todo_turbo_tasks', JSON.stringify(tasks))
}

// 2. FUNÇÃO PARA CARREGAR DO LOCALSTORAGE AO ABRIR O SITE
function loadFromLocalStorage() {
  const savedTasks = localStorage.getItem('todo_turbo_tasks')
  if (savedTasks) {
    const tasks = JSON.parse(savedTasks)
    tasks.forEach(task => {
      createTaskElement(task.text, task.done)
    })
  }
}

function updateStats() {
  stats.innerText = `${total} ${total === 1 ? 'tarefa' : 'tarefas'}`
}

// Função auxiliar para criar o elemento da tarefa na tela
function createTaskElement(text, isDone = false) {
  const li = document.createElement('li')
  if (isDone) li.classList.add('done')
  
  const span = document.createElement('span')
  span.innerText = text
  li.appendChild(span)

  const btnCheck = document.createElement('button')
  btnCheck.className = 'check'
  btnCheck.innerText = '✔'
  btnCheck.onclick = e => {
    e.stopPropagation()
    li.classList.toggle('done')
    saveToLocalStorage() // Salva a alteração de status
  }

  const btnRemove = document.createElement('button')
  btnRemove.className = 'remove'
  btnRemove.innerText = 'X'
  btnRemove.onclick = e => {
    e.stopPropagation()
    li.remove()
    total--
    updateStats()
    saveToLocalStorage() // Salva após remover
  }

  li.append(btnCheck, btnRemove)
  list.appendChild(li)
  
  total++
  updateStats()
}

inputTask.addEventListener('input', () => {
  btnAdd.disabled = inputTask.value.trim() === ''
})

inputTask.addEventListener('keydown', e => {
  if (e.key === 'Enter') btnAdd.click()
})

btnAdd.addEventListener('click', () => {
  const taskText = inputTask.value.trim()
  if (!taskText) return

  createTaskElement(taskText)
  saveToLocalStorage() // Salva a nova tarefa

  inputTask.value = ''
  inputTask.focus()
})

btnClearAll.addEventListener('click', () => {
  if(confirm("Deseja realmente limpar todas as tarefas?")) {
    list.innerHTML = ''
    total = 0
    updateStats()
    localStorage.removeItem('todo_turbo_tasks') // Limpa o armazenamento
  }
})

// Efeito Typewriter
const text = 'Duart Dev todos os direitos reservados.'
let idx = 0
function typeWriter() {
  const footerElement = document.getElementById('footer-text')
  if (footerElement && idx < text.length) {
    footerElement.innerHTML += text[idx++]
    setTimeout(typeWriter, 60)
  }
}

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage()
  typeWriter()
})

btnDownload.addEventListener('click', () => {
  const data = [...list.children]
    .map(li => {
      const isDone = li.classList.contains('done') ? '[✔]' : '[ ]'
      const content = li.querySelector('span').innerText
      return `${isDone} ${content}`
    })
    .join('\n')

  if (!data) return alert('Sua lista está vazia!')

  const blob = new Blob([data], { type: 'text/plain' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'minhas_tarefas.txt'
  a.click()
  URL.revokeObjectURL(a.href)
})
