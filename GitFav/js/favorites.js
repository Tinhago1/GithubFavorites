import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
  }

  load(){
    this.entries = JSON.parse(localStorage.getItem
    ('github-favorites')) || []
  }

  save(){
    localStorage.setItem('github-favorites', JSON.stringify(this.entries))
  }

  async add(username){
    try{
      
      const UserExists = this.entries.find(entry => entry.login === username)

      if(UserExists){
        throw new Error ('Usuário já cadastrado')
      }



      const user = await GithubUser.search(username)

      if(user.login === undefined){
        throw new Error('Usuáro não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    }catch(error){
      alert(error.message)

    }

  }

  delete(user){
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites{
  constructor(root){
    super(root)

    this.tbody = document.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd(){
    const addButton = this.root.querySelector('.input-group button')
    addButton.onclick = () => {
      const {value} = this.root.querySelector('.input-group input')

      this.add(value)
    }
  }

  update(){
    this.removeAllTr()
    this.toggleBgImg()


    this.entries.forEach( user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.Repositories').textContent = user.public_repos
      row.querySelector('.Followers').textContent = user.followers
      row.querySelector('.user a').href = `https://github.com/${user.login}`

      row.querySelector('.remove').onclick = () => {
        const isOK = confirm('Tem certeza que deseja deletar essa linha?')

        if(isOK){
          this.delete(user)
        }
      }

      this.tbody.append(row)
      
    })
  }

  createRow(){
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <tr>
      <td class="user">
      <img src="https://github.com/diego3g.png" alt="Imagem de Diego">
        <a href="https://github.com/diego3g" target="_blank">
          <p>Diego Fernandes</p>
          <span>diego3g</span>
        </a>
      </td>
      <td class="Repositories"> 123 </td>
      <td class="Followers"> 1234 </td>
      <td>
        <button class="remove">Remover</button>
      </td>

    </tr>
   
   `

    return tr
  }


  removeAllTr(){
  this.tbody.querySelectorAll('tr').forEach((tr) => {
    tr.remove()
  })
  }

  toggleBgImg() {
    const tableEmpty = this.root.querySelector(".table-empty")
       if (this.entries.length === 0) {
        tableEmpty.classList.remove("hide");
       } else {
        tableEmpty.classList.add("hide");
       }
    }

}