import logo from './logo.svg';
import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      todoList:[],
      activeItem: {
        id: null,
        title: '',
        completed: false,
        time: ''
      },
      editing: false
    }
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getCookie = this.getCookie.bind(this)
    this.editTitle = this.editTitle.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.strikeItem = this.strikeItem.bind(this)
  };

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

  getUrl(){
    return 'http://127.0.0.1:8000/api/task/' 
  }

  componentDidMount(){
      this.fetchTasks()
  }
  
  fetchTasks() {
    console.log("Working")

    fetch(this.getUrl())
    .then(response => response.json())
    .then(data => 
      this.setState({
        todoList: data
      }))

  }

  handleChange(e) {
    let value = e.target.value

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title: value
      }
    })
  }

  handleSubmit(e){
    e.preventDefault()

    const csrftoken = this.getCookie('csrftoken');

    let url = this.getUrl()
    let method = 'POST'

    if (this.state.editing == true) {
      method = 'PUT'
      url = `http://127.0.0.1:8000/api/task/${this.state.activeItem.id}/`
      this.setState({
        editing: false
      })
    }
    
    fetch(url, {
      method: method,
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
      this.fetchTasks()
      this.setState({
        activeItem:{
          id: null,
          title: '',
          completed: false,
        }
      })
    }).catch(function(error) {
      console.error('ERROR', error);
    })
  }

  editTitle(task){
    this.setState({
      activeItem: task,
      editing: true,
    })
  }

  deleteItem(task){
    const csrftoken = this.getCookie('csrftoken');
    fetch(`http://127.0.0.1:8000/api/task/${task.id}/`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      'X-CSRFToken': csrftoken
    },
    }).then((response) => {
      this.fetchTasks()
    })
  }

  strikeItem(task) {
    task.completed = !task.completed
    const csrftoken = this.getCookie('csrftoken');
    fetch(`http://127.0.0.1:8000/api/task/${task.id}/`, {
    method:'PUT',
    headers:{
      'Content-type':'application/json',
      'X-CSRFToken':csrftoken,
    },
      body:JSON.stringify({'completed': task.completed, 'title':task.title})
      }).then(() => {
        this.fetchTasks()
      })
  }

  render (){
    let task = this.state.todoList
    let self = this
    return (
      <div className='container'>
        <div id="task-container" className='card mx-auto' style={{width: 600, marginTop: 100}}>
          <div className='d-flex-inline'>
            <form onSubmit={this.handleSubmit} id="form">
              <div className='flex-wrapper card-body d-flex m-5'>
                <div style={{flex: 6}}>
                  <input onChange={this.handleChange} className='form-control mr-5' id="title" name="title" value={this.state.activeItem.title} placeholder="Write your Task !"></input>

                </div>

                <div style={{flex: 1}}>
                  <input id="submit" className='btn btn-warning' type="submit" name="add" value="Add your Task !" />
                </div>

              </div>
            </form>
            
            <div id='task-list card'>
            <h3 className='container text-center'>Click in your task to cross it !</h3>
              {task.map(function (task, index) {
                return (
                  <div key={index} className='d-flex card-body'>

                    <div onClick={() => self.strikeItem(task)} style={{flex: 9}} className='d-flex shadow-sm card-body'>
                      {
                        task.completed == false ? 
                        (<span>{task.title}</span>) :
                        (<strike>{task.title}</strike>)
                      }
                    </div>

                    <div style={{flex: 7}} className='d-flex shadow-sm card-body'>
                      {
                        task.completed == false ?
                        (<span>{task.date}</span>) :
                        (<strike>{task.date}</strike>)
                      }
                    </div>

                    <div style={{flex: 1}} className='d-flex shadow-sm card-body'>
                      <button onClick={() => self.editTitle(task)} className='btn btn-sm btn btn-info'>Edit</button>
                    </div>    

                    <div style={{flex: 1}} className='d-flex shadow-sm card-body'>
                    <button onClick={() => self.deleteItem(task)} className='btn btn-sm btn-outline-danger'>Del</button>
                    </div>    

                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
