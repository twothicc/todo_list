import React, {Component} from 'react';
import './View.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const todo_api_url = '/api/v1/todos';

const category_api_url = '/api/v1/categories';

var autocomplete_categories = [];

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            body: '',
            category_id: '',
            category: '',
            categories: {},
            open: false,
            isDelete: false
        }
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleFormTitleChange = this.handleFormTitleChange.bind(this);
        this.handleFormContentChange = this.handleFormContentChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        this.setTodo();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.isDelete !== this.state.isDelete) {
            this.props.history.push('/Home')
        }
    }

    setTodo() {
        if (this.props.location.aboutProps === undefined) {
            this.fetchTodo();
            this.fetchCategories();
            console.log('reload');
        } else {
            this.setState({
                id: this.props.location.aboutProps.id,
                name: this.props.location.aboutProps.name,
                body: this.props.location.aboutProps.body,
                category_id: this.props.location.aboutProps.category_id,
                category: this.props.location.aboutProps.category,
                categories: this.props.location.aboutProps.categories
            });
            if (autocomplete_categories.length === 0) {
                autocomplete_categories = this.props.location.aboutProps.autocomplete_categories;
            }
            console.log('use props');
        }
        
    }

    fetchTodo() {
        var temp = window.location.pathname.split('/');
        var id = temp[temp.length - 1];
        fetch(todo_api_url + "/" + id, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(parsed_response => this.setState({
            id: parsed_response.id,
            name: parsed_response.name,
            body: parsed_response.body,
            category_id: parsed_response.category_id
        }))
    }

    fetchCategories() {
        fetch(category_api_url, {
            method: 'GET'
        })
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
                    categories: temp
                })
                this.setState({
                    category: this.state.categories[this.state.category_id]
                })
            }
        })
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

    updateState(data) {
        this.setState({
            name: data.name,
            body: data.body,
            category_id: data.category_id
        })
        this.setState({
            category: this.state.categories[this.state.category_id]
        })
    }

    async formSubmit(formData) {
        var data = new FormData(formData);
        const category_input = data.get('todo[category_id]');
        const category_id = Object.keys(this.state.categories).find(key => this.state.categories[key] === category_input);
        data.set('todo[category_id]', category_id);
        await fetch(todo_api_url + "/" + this.state.id, {
            method: "PUT",
            mode: 'cors',
            body: data
        })
        .then(response => response.json())
        .then(parsed_response => this.updateState(parsed_response));
        this.handleClose();
        console.log("updated");
    }

    handleFormTitleChange(event) {
        this.setState({
            name: event.target.value
        })
    }

    handleFormContentChange(event) {
        this.setState({
            body: event.target.value
        })
    }

    handleDelete() {
        fetch(todo_api_url + "/" + this.state.id, {
            method: "DELETE",
            mode: 'cors'
        })
        .then(response => {
            this.setState({
                isDelete: response.ok
            })
        })
    }



    render() {
        var indexofautocompletecategories = 0;
        for (let i = 0; i < autocomplete_categories.length; i = i + 1 ) {
            if (autocomplete_categories[i]['title'] === this.state.category) {
                indexofautocompletecategories = i;
            }
        }
        return (
            <div className='viewcard_container'>
                <Card className='view_container'>
                    <CardContent style={{width: "100%"}}>
                        <h1 style = {{textAlign: "center", fontWeight: 'bold'}}>{this.state.name}</h1>
                        <hr/>
                        <h4 style = {{textAlign: "justify", width:'90%', marginInline:'auto'}}>{this.state.body}</h4>
                        <h5 style={{width:'90%', marginInline:'auto', color: 'cornflowerblue', textAlign: 'justify'}}>{this.state.category}</h5>
                    </CardContent>
                    <CardActions className='icon_container'>
                        <Button size='small' startIcon={<EditIcon/>} onClick={this.handleClickOpen}/>
                        <Dialog scroll='paper' fullWidth open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Edit Todo</DialogTitle>
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
                                        value={this.state.name}
                                        onChange={this.handleFormTitleChange}
                                        name='todo[name]'
                                        multiline
                                        fullWidth
                                    />
                                    <TextField
                                        id='body_input'
                                        margin='dense'
                                        label='Content'
                                        type='text'
                                        value={this.state.body}
                                        onChange={this.handleFormContentChange}
                                        name='todo[body]'
                                        multiline
                                        fullWidth
                                    />
                                    <Autocomplete
                                        id="category_input"
                                        options={autocomplete_categories}
                                        getOptionLabel={(option) => option.title}
                                        defaultValue = {autocomplete_categories[indexofautocompletecategories]}
                                        renderInput={(params) => <TextField {...params} label="Category" name='todo[category_id]' margin='dense' id='category_id_input' type='text' multiline fullWidth/>}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.handleClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button type='submit' color="primary">
                                        Edit
                                    </Button>
                                </DialogActions>
                            </form>
                        </Dialog>
                        <Button size='medium' startIcon={<DeleteIcon/>} onClick={this.handleDelete}/>
                    </CardActions>
                </Card>
            </div>
        )
    }
}

export default View