let total = 0

const list = document.querySelector('#list')
const inputTask = document.querySelector('#inputTask')
const btnAdd = document.querySelector('#btnAdd')
const btnClearAll = document.querySelector('#btnClearAll')
const stats = document.querySelector('#stats')
const btnDownload = document.querySelector('#btnDownload')

inputTask.addEventListener('input', () => {
  btnAdd.disabled = inputTask.value.trim() === ''
})

inputTask.addEventListener('keydown', e => {
  if (e.key === 'Enter') btnAdd.click()
})

function updateStats() {
  stats.innerText = `${total} ${total === 1 ? 'tarefa' : 'tarefas'}`
}

btnAdd.addEventListener('click', () => {
  const taskText = inputTask.value.trim()
  if (!taskText) return

  const li = document.createElement('li')
  
  // Criando um span para o texto para melhor controle no CSS
  const span = document.createElement('span')
  span.innerText = taskText
  li.appendChild(span)

  const btnCheck = document.createElement('button')
  btnCheck.className = 'check'
  btnCheck.innerText = '✔'
  btnCheck.onclick = e => {
    e.stopPropagation()
    li.classList.toggle('done')
  }

  const btnRemove = document.createElement('button')
  btnRemove.className = 'remove'
  btnRemove.innerText = 'X'
  btnRemove.onclick = e => {
    e.stopPropagation()
    li.remove()
    total--
    updateStats()
  }

  li.append(btnCheck, btnRemove)
  list.appendChild(li)

  inputTask.value = ''
  inputTask.focus()

  total++
  updateStats()
})

btnClearAll.addEventListener('click', () => {
  if(confirm("Deseja realmente limpar todas as tarefas?")) {
    list.innerHTML = ''
    total = 0
    updateStats()
  }
})

const text = 'Duart Dev todos os direitos reservados.'
let idx = 0
function typeWriter() {
  const footerElement = document.getElementById('footer-text')
  if (idx < text.length) {
    footerElement.innerHTML += text[idx++]
    setTimeout(typeWriter, 60)
  }
}
typeWriter()

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
