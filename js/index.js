// document.addEventListener("DOMContentLoaded", function() {});

// get the books
async function fetchBooks() {
    const res = await fetch('http://localhost:3000/books')
    const json = await res.json()
    json.forEach(book => listBuilder(book))
}
fetchBooks()

// build the books list
let list = document.getElementById('list')
function listBuilder(obj) {
    let li = document.createElement('li')
    li.textContent = obj.title
    list.appendChild(li)
    showDetailsEvent(li, obj)
}

// add click event to the books
function showDetailsEvent(book, obj) {
    book.addEventListener('click', async () => {
        removeAllChildNodes(showPanel)
        const res = await fetch(`http://localhost:3000/books/${obj.id}`)
        let json = await res.json()
        showHandler(json)
    })
}

// clear elements
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// build the show panel for book details
let showPanel = document.getElementById('show-panel')
function showHandler(obj) {
    let thumbnail = document.createElement('img')
    let title = document.createElement('h4')
    let subtitle = document.createElement('h4')
    let author = document.createElement('h4')
    let descrip = document.createElement('p')
    let likeList = document.createElement('ul')
    let btn = document.createElement('button')
    thumbnail.src = obj.img_url
    title.textContent = obj.title
    subtitle.textContent = obj.subtitle
    author.textContent = obj.author
    descrip.textContent = obj.description
    // btn.textContent = "LIKE"
    showPanel.appendChild(thumbnail)
    showPanel.appendChild(title)
    showPanel.appendChild(subtitle)
    showPanel.appendChild(author)
    showPanel.appendChild(descrip)
    showPanel.appendChild(likeList)
    handleLikes(obj, likeList)
    showPanel.appendChild(btn)
    liker(btn, obj, likeList)
    // Array.from(showPanel.querySelectorAll('li')).map(li => console.log(li.textContent))
    if (!Array.from(showPanel.querySelectorAll('li')).find(el => {return el.textContent.includes('chandler')})) {
        btn.textContent = 'LIKE'
    } else {
        btn.textContent = 'UNLIKE'
    }
}



function handleLikes(obj, likeList) {
    obj.users.forEach(user => {
        let users = document.createElement('li')
        users.textContent = user.username
        likeList.appendChild(users)
    })
}

// add click event to like btn
// add new like and refresh show panel
function liker(btn, obj, likeList) {
    // let iLike = []
    // iLike = [...obj.users, {"id": 11, "username": "chandler"}]
    console.log('before:', obj.users)
    btn.addEventListener('click', async () => {
        if (btn.textContent === "LIKE") {
            let arr00 = []
            const res00 = await fetch(`http://localhost:3000/books/${obj.id}`)
            let json00 = await res00.json()
            json00.users.forEach(el => arr00.push(el))
            await fetch(`http://localhost:3000/books/${obj.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }, 
            body: JSON.stringify({
                "users": [
                    ...json00.users,
                    {"id": 11, "username": "chandler"}
                ]
            })
        })
        console.log('after patch:', obj.users)
        const res2 = await fetch(`http://localhost:3000/books/${obj.id}`)
        let json = await res2.json()
        removeAllChildNodes(likeList)
        handleLikes(json, likeList)
        console.log('after fetch:', json.users)
        btn.textContent = "UNLIKE"
    } else {
        let arr = []
        const res0 = await fetch(`http://localhost:3000/books/${obj.id}`)
        let json0 = await res0.json()
        json0.users.forEach(el => arr.push(el))
        console.log('arr:', arr)
        await fetch(`http://localhost:3000/books/${obj.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }, 
            body: JSON.stringify({
                "users": [...arr.slice(0, -1)]
            })
        })
        console.log('unlike patch:', obj.users)
        const res2 = await fetch(`http://localhost:3000/books/${obj.id}`)
        let json = await res2.json()
        removeAllChildNodes(likeList)
        handleLikes(json, likeList)
        console.log('unlike fetch:', json.users)
        btn.textContent = "LIKE"
    }
    })
}