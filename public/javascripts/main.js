let button = document.querySelectorAll('#editComment')
let span = document.querySelectorAll('#inputComment')
Array.from(button).forEach(elem => {
    elem.addEventListener('click', async(e)=>{
        e.preventDefault()
        let input = document.createElement('input')
        input.value = document.querySelector(`#comment_${e.target.dataset.id} span`).textContent
        input.name = 'comment_update'
        let inputId = document.createElement('input')
        inputId.value = e.target.dataset.id
        inputId.type = "hidden"
        inputId.name = 'commentId'
        document.querySelector(`#comment_${e.target.dataset.id} span`).remove()
        const form = document.createElement('form')
        form.appendChild(input)
        form.appendChild(inputId)
        form.method = "POST"
        form.action = `/blog/${e.target.dataset.id}/edit_comments`
        const formButton = document.createElement('button')
        formButton.type = 'submit'
        formButton.textContent = 'Save'
        form.appendChild(formButton)
        elem.parentElement.remove()
        document.querySelector(`#commentsUl #comment_${e.target.dataset.id}`).appendChild(form)
    })
})