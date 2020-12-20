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
            formBody: ''
        }
        this.setTodos = this.setTodos.bind(this);
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

    //If aboutProps in the URL is changed, it means that a need to rerender page. This is made for filter
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.aboutProps !== this.props.location.aboutProps) {
            this.setTodos();
        }
    }

    //Allows Home state to use the state variables from App, eliminating need to fetch from database unless user refreshes page
    //Also handles case where user refreshes or simply returns to '/home'
    setTodos() {
        //Must first check if aboutProps exists
        if (this.props.location.aboutProps === undefined) {
            this.fetchCategories();
            this.fetchTodos();
            console.log('reload');
        } else {
            this.setState({
                Todos: this.props.location.aboutProps.Todos,
                Categories: this.props.location.aboutProps.Categories,
            })
            //Need to remove the All title from autocomplete_categories object since 'All' isn't an actual record in Categories table
            if (autocomplete_categories.length === 0 && this.props.location.aboutProps.autocomplete_categories !== undefined) {
                autocomplete_categories = this.props.location.aboutProps.autocomplete_categories.filter(listing => listing['title'] !== 'All')
            }
            console.log("home use props");
        }
    }

    //Waits for todos to be fetched and parsed. Handles null case.
    async fetchTodos() {
        const response = await fetch(todo_api_url);
        if (response !== null) {
            const parsed_response = await response.json();
            this.setState({
                Todos: parsed_response
            })
        }
    }

    //Waits for categories to be fetched and parsed. Handles null case
    async fetchCategories() {
        const response = await fetch(category_api_url);
        
        if (response !== null) {
            const parsed_response = await response.json();
            var temp = {};
            for (let category of parsed_response) {
                temp[category.id] = category.name;
            }
            //If autocomplete options isn't empty, then this would just create duplicated fixed options. Hence need to check length
            if (autocomplete_categories.length === 0) {
                for (let category of parsed_response) {
                    autocomplete_categories.push({title: category.name});
                }
            }
            this.setState({
                Categories: temp
            })
        }
    }

    //Deletes todo. No need to wait here, since deleted todo won't be accessed again.
    //Immediately remove it from state using removeFromTodos() ftn
    handleDelete(event) {
        console.log(event.currentTarget.id);
        const id = event.currentTarget.id;
        fetch(todo_api_url + "/" + id, {
            method: "DELETE"
        })
        .then(() => this.removeFromTodos(id));
    }

    //Dialog opens when open is true
    handleClickOpen() {
        this.setState({
            open: true
        })
    };
    
    //This closes the Dialog
    handleClose() {
        this.setState({
            open: false
        })
    };

    //preventDefault is called on the event when submitting the form to prevent a browser reload/refresh.
    handleSubmit(event) {
        event.preventDefault();
        this.formSubmit(event.target);
    }

    //Adds specific todo to Todos state
    addToTodos(data) {
        var temp = this.state.Todos;
        temp.unshift(data);
        this.setState({
            Todos: temp
        })
    }

    //Removes specific todo from Todos state by its id
    removeFromTodos(id) {
        var temp = this.state.Todos;
        var result = temp.filter(todo => todo.id !== parseInt(id));
        this.setState({
            Todos: result
        })
    }

    //Creates new Category
    handleSubmitCategory(event) {
        event.preventDefault();
        this.handleCategoryCreate(event.target);
    }

    //appbar also has to change its autocomplete_categories, so there is a need to reload
    //I understand that replace isn't a great idea here since it deletes the history
    //However, there seems to be some ordering issue whereby pushing to '/' will cause it to pass the current state there immediately to '/home', leading to no change
    //Sometimes the page doesn't even load, yet componentdidmount of the home class produces console messages.
    //Rly out of ideas on how to debug this.
    //Even tried to reset the todo_data and category_data in App.js but no werk.
    async handleCategoryCreate(formData) {
        var data = new FormData(formData);
        const response = await fetch(category_api_url, {
            method: "POST",
            mode: 'cors',
            body: data
        })
        if (response.ok) {
            window.location.replace('/');
        }
    }

    //Same as above
    async handleCategoryDelete(event) {
        const response =  await fetch(category_api_url + "/" + event.currentTarget.id, {
            method: 'DELETE'
        })
        if (response.ok) {
            window.location.replace('/');
        }
    }

    //Adding new Todo by simply reflecting changes immediately in Todos state, no need to reload page
    async formSubmit(formData) {
        var data = new FormData(formData);
        const category_input = data.get('todo[category_id]');
        const category_id = Object.keys(this.state.Categories).find(key => this.state.Categories[key] === category_input);
        data.set('todo[category_id]', category_id);
        const response = await fetch(todo_api_url, {
            method: "POST",
            mode: 'cors',
            body: data
        });
        const parsed_response = await response.json();
        this.addToTodos(parsed_response);
        this.handleClose();
        console.log("added new Todo"+this.state.Todos);
    }

    render() {
        // console.log(this.state.Todos);
        // console.log(this.state.Categories);
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
                                renderInput={(params) => 
                                    <TextField 
                                        {...params} 
                                        label="Category" 
                                        name='todo[category_id]' 
                                        margin='dense' 
                                        id='category_id_input' 
                                        type='text' 
                                        multiline 
                                        fullWidth
                                    />}
                            />

                        </DialogContent>

                        <DialogActions>

                            <Button onClick={this.handleClose} color="primary">Cancel</Button>

                            <Button type='submit' color="primary">Create</Button>

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
                                        <Button 
                                            id={key} 
                                            style={{width: '100%'}} 
                                            size = 'small' 
                                            onClick={this.handleCategoryDelete} 
                                            startIcon = {<DeleteIcon/>}
                                        />}

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