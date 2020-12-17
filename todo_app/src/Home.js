import React, { Component } from "react";
import './Home.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';


const todo_api_url = '/api/v1/todos';

const category_api_url = '/api/v1/categories';

var autocomplete_categories = [];

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Todos: [],
            Categories: {},
            open: false,
            formName: '',
            formBody: '',
            isCategoryCreated: false,
            isCategoryDeleted: false
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addToTodos = this.addToTodos.bind(this);
        this.removeFromTodos = this.removeFromTodos.bind(this);
        this.handleSubmitCategory = this.handleSubmitCategory.bind(this);
        this.handleCategoryCreate = this.handleCategoryCreate.bind(this);
        this.handleCategoryDelete = this.handleCategoryDelete.bind(this);
    }

    componentDidMount() {
        this.setTodos();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.aboutProps !== this.props.location.aboutProps) {
            this.setTodos();
        }
        if (prevState.isCategoryCreated !== this.state.isCategoryCreated || prevState.isCategoryDeleted !== this.state.isCategoryDeleted) {
            
            window.location.replace('/');
            
        }
    }

    setTodos() {
        if (this.props.location.aboutProps === undefined) {
            this.fetchTodos();
            this.fetchCategories();
            console.log('reload');
        } else {
            this.setState({
                Todos: this.props.location.aboutProps.Todos,
                Categories: this.props.location.aboutProps.Categories,
            })
            if (autocomplete_categories.length === 0) {
                autocomplete_categories = this.props.location.aboutProps.autocomplete_categories.filter(listing => listing['title'] !== 'All')
            }
            console.log("use props");
        }
    }

    fetchTodos() {
        fetch(todo_api_url)
        .then(responses => {
            
            if (responses === null) {
                return null;
            } else {
                return responses.json();
            }
        })
        .then(parsed_responses => {
            if (parsed_responses !== null) {
                this.setState({
                    Todos: parsed_responses
                })
            }
        })
    }

    fetchCategories() {
        fetch(category_api_url)
        .then(responses => {
            if (responses === null) {
                return null;
            } else {
                return responses.json();
            }
        })
        .then(parsed_responses => {
            if (parsed_responses !== null) {
                var temp = {};
                for (let category of parsed_responses) {
                    temp[category.id] = category.name;
                }
                if (autocomplete_categories.length === 0) {
                    for (let category of parsed_responses) {
                        autocomplete_categories.push({title: category.name});
                    }
                }
                this.setState({
                    Categories: temp
                })
            }
        })
    }


    handleDelete(event) {
        console.log(event.currentTarget.id);
        const id = event.currentTarget.id;
        fetch(todo_api_url + "/" + id, {
            method: "DELETE"
        })
        .then(() => this.removeFromTodos(id));
    }


    handleClickOpen() {
        this.setState({
            open: true
        })
    };
    
    handleClose() {
        this.setState({
            open: false
        })
    };

    handleSubmit(event) {
        event.preventDefault();
        this.formSubmit(event.target);
    }

    addToTodos(data) {
        var temp = this.state.Todos;
        temp.unshift(data);
        this.setState({
            Todos: temp
        })
    }

    removeFromTodos(id) {
        var temp = this.state.Todos;
        var result = temp.filter(todo => todo.id !== parseInt(id));
        this.setState({
            Todos: result
        })
    }


    handleSubmitCategory(event) {
        event.preventDefault();
        this.handleCategoryCreate(event.target);
    }

    //appbar also has to change its autocomplete_categories, so there is a need to reload
    async handleCategoryCreate(formData) {
        var data = new FormData(formData);
        await fetch(category_api_url, {
            method: "POST",
            mode: 'cors',
            body: data
        })
        .then(response => this.setState({
            isCategoryCreated: response.ok
        }));
    }

    handleCategoryDelete(event) {
        fetch(category_api_url + "/" + event.currentTarget.id, {
            method: 'DELETE'
        })
        .then(response => this.setState({
            isCategoryDeleted: response.ok
        }))
    }

    async formSubmit(formData) {
        var data = new FormData(formData);
        const category_input = data.get('todo[category_id]');
        const category_id = Object.keys(this.state.Categories).find(key => this.state.Categories[key] === category_input);
        data.set('todo[category_id]', category_id);
        await fetch(todo_api_url, {
            method: "POST",
            mode: 'cors',
            body: data
        })
        .then(response => response.json())
        .then(parsed_response => this.addToTodos(parsed_response));
        this.handleClose();
        console.log("added new Todo"+this.state.Todos);
    }

    render() {
        console.log(this.state.Todos);
        console.log(this.state.Categories);
        console.log("is category deleted" + this.state.isCategoryDeleted);
        return (
            <div style ={{width: '100%'}}>

                <Button 
                    style ={{zIndex: "1", position: 'fixed',width:'45%', left: '27.5%', backgroundColor: 'white'}} 
                    size='large' 
                    variant="outlined" 
                    color="primary" 
                    onClick={this.handleClickOpen}>
                    Create New Todo
                </Button>
                
                <Dialog scroll='paper' fullWidth open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Create Todo</DialogTitle>
                    <form
                        onSubmit={this.handleSubmit}
                        id='todo_form'
                        autoComplete='off'>  
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name_input"
                                label="Title"
                                type="text"
                                name='todo[name]'
                                multiline
                                fullWidth
                            />
                            <TextField
                                id='body_input'
                                margin='dense'
                                label='Content'
                                type='text'
                                name='todo[body]'
                                multiline
                                fullWidth
                            />
                            <Autocomplete
                                id="category_input"
                                options={autocomplete_categories}
                                getOptionLabel={(option) => option.title}
                                defaultValue = {autocomplete_categories[0]}
                                renderInput={(params) => <TextField {...params} label="Category" name='todo[category_id]' margin='dense' id='category_id_input' type='text' multiline fullWidth/>}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button type='submit' color="primary">
                                Create
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
                <div style={{position: 'relative', display: 'flex', flexDirection: 'row', width: "100%", height: 'auto', justifyContent: 'space-around', marginTop: '5%'}}>
                    <div style={{width: '30%'}}/>
                    <div className = 'card_container'>
                        
                        {this.state.Todos.map(todo => (
                            
                            <Card key = {todo.id} className = 'card'>
                                <CardContent>
                                    <h2 className='title'>{todo.name}</h2>
                                    <h4 className='body'>{todo.body}</h4>
                                    <h5 className = 'category_text'>{this.state.Categories[todo.category_id]}</h5>
                                </CardContent>
                                <CardActions className = "icon_container">
                                    <Link to = {{pathname: `/Home/${todo.id}`, 
                                        aboutProps: {
                                            id: todo.id, 
                                            name: todo.name, 
                                            body: todo.body, 
                                            category_id: todo.category_id, 
                                            category: this.state.Categories[todo.category_id],
                                            categories: this.state.Categories,
                                            autocomplete_categories: autocomplete_categories}}}>
                                        <Button size="small">Expand</Button>
                                    </Link>
                                    <Button id={todo.id} size="small" startIcon={<DeleteIcon/>} onClick={this.handleDelete}/>
                                </CardActions>
                            </Card> 
                        ))}
                    </div>
                    <div style={{width: '30%'}}>
                        <h3 style={{textAlign: 'center', width: '60%', marginInline: 'auto',  textDecoration: 'underline'}}>Categories</h3>
                        {Object.keys(this.state.Categories).map(key => (
                            <Card key = {key} style={{width: '60%', height: 'auto', marginInline: 'auto', marginTop: '1%', textAlign: 'center'}}>
                                <CardContent>
                                    <h4>{this.state.Categories[key]}</h4>
                                </CardContent>
                                <CardActions>
                                    {(key === '1') ? <br/> :
                                    <Button id={key} style={{width: '100%'}} size = 'small' onClick={this.handleCategoryDelete} startIcon = {<DeleteIcon/>}/>}
                                </CardActions>
                            </Card>
                        ))}
                        <form
                            onSubmit={this.handleSubmitCategory}
                            id='category_form'
                            autoComplete='off'
                            >
                            <TextField
                                margin="dense"
                                id="category_input"
                                label="Category Name"
                                type="text"
                                name='category[name]'
                                multiline
                                style={{width: '60%', left: '20%', marginTop: '1%'}}
                            />
                            <Button 
                                variant="outlined" 
                                color="primary"
                                size='medium'
                                type='submit'
                                style={{backgroundColor: 'white', width: '60%', left: '20%', marginTop: '1%'}}>
                                Add Category
                            </Button>
                        </form>
                        
                    </div>
                </div>
                
            </div>
        )
    }
}

export default Home