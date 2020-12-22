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
            form_name: '',
            form_body: '',
            category_id: '',
            category: '',
            categories: {},
            open: false,
            error: false,
            error_msg: ''
        }
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleFormTitleChange = this.handleFormTitleChange.bind(this);
        this.handleFormContentChange = this.handleFormContentChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    componentDidMount() {
        this.setTodo();
    }

    //Reduces need to fetch data from database but simply using aboutProps in URL if made available
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
                form_name: this.props.location.aboutProps.name,
                form_body: this.props.location.aboutProps.body,
                category_id: this.props.location.aboutProps.category_id,
                category: this.props.location.aboutProps.category,
                categories: this.props.location.aboutProps.categories,
                filter: this.props.location.aboutProps.filter
            });
            if (autocomplete_categories.length === 0) {
                autocomplete_categories = this.props.location.aboutProps.autocomplete_categories;
            }
            console.log('use props');
        }
        
    }

    //Waits for todo to be fetched and parsed. Handles null case. Need to be using window.location.hash instead since hashrouter is used now
    async fetchTodo() {
        var temp = window.location.hash.split('/');
        var id = temp[temp.length - 1];
        const response = await fetch(todo_api_url + "/" + id, {
            method: 'GET'
        });
        if (response !== null) {
            const parsed_response = await response.json();
            this.setState({
                id: parsed_response.id,
                name: parsed_response.name,
                body: parsed_response.body,
                category_id: parsed_response.category_id
            })
        }
    }

    //Waits for categories to be fetched and parsed. Handles null case
    async fetchCategories() {
        const response = await fetch(category_api_url, {
            method: 'GET'
        });
        if (response !== null) {
            const parsed_response = await response.json();
            var temp = {};
            for (let category of parsed_response) {
                temp[category.id] = category.name;
            }
            //If autocomplete options are not empty, this would create duplicate fixed options. Hence check required
            if (autocomplete_categories.length === 0) {
                for (let category of parsed_response) {
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
    }

    //Opens dialog
    handleClickOpen() {
        this.setState({
            open: true
        })
    };
    
    //Closes dialog
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

    //Changes the current state to match the updated record
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

    //No need to wait reload page. Simply update state to match updated record
    async formSubmit(formData) {
        var data = new FormData(formData);
        const category_input = data.get('todo[category_id]');
        const category_id = Object.keys(this.state.categories).find(key => this.state.categories[key] === category_input);
        data.set('todo[category_id]', category_id);
        const response = await fetch(todo_api_url + "/" + this.state.id, {
            method: "PUT",
            mode: 'cors',
            body: data
        });
        const parsed_response = await response.json();
        if (response.ok) {
            this.updateState(parsed_response);
        } else {
            const msg = parsed_response.name[0];
            this.handleError('Todo name ' + msg);
            this.setState({
                form_name: this.state.name,
                form_body: this.state.body
            })
        }
        this.handleClose();
        console.log("updated");
    }

    //Changes name dynamically as user inputs in Textfield
    handleFormTitleChange(event) {
        this.setState({
            form_name: event.target.value
        })
    }

    //Same as above
    handleFormContentChange(event) {
        this.setState({
            form_body: event.target.value
        })
    }

    //wait for current record to be deleted. If deleted, then record is gone, go back to home page
    async handleDelete() {
        const response = await fetch(todo_api_url + "/" + this.state.id, {
            method: "DELETE",
            mode: 'cors'
        });
        if (response.ok) {
            this.props.history.push('/Home')
        }
    }

    handleError(msg) {
        this.setState({
            error: true,
            error_msg: msg
        });
        setTimeout(() => {
            this.setState({
                error: false,
                msg: ''
            })
        }, 1000);
    }



    render() {
        //Need to find the index of the current record's category in autocomplete options since mui autocomplete requires it to set default value
        var indexofautocompletecategories = 0;
        for (let i = 0; i < autocomplete_categories.length; i = i + 1 ) {
            if (autocomplete_categories[i]['title'] === this.state.category) {
                indexofautocompletecategories = i;
            }
        }
        return (
            <div className='viewcard_container'>
                {this.state.error ? 
                    <h3 style={{color: 'red', zIndex: '2', position: 'fixed', left: '40%', width: '20%', textAlign: 'center', top: '40%'}}>{this.state.error_msg}</h3>
                    : <br/>}

                <Card className='view_container'>

                    <CardContent style={{width: "100%"}}>

                        <h1 style = {{textAlign: "center", fontWeight: 'bold'}}>{this.state.name}</h1>

                        <hr/>

                        <h4 style = {{textAlign: "justify", width:'90%', marginInline:'auto'}}>{this.state.body}</h4>

                        <h5 style={{width:'90%', marginInline:'auto', color: 'cornflowerblue', textAlign: 'justify'}}>{this.state.category}</h5>

                    </CardContent>

                    <CardActions className='icon_container'>

                        <Button 
                            size='small' 
                            startIcon={<EditIcon/>} 
                            onClick={this.handleClickOpen}
                        />

                        <Dialog 
                            scroll='paper' 
                            fullWidth open={this.state.open} 
                            onClose={this.handleClose} 
                            aria-labelledby="form-dialog-title"
                        >

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
                                        value={this.state.form_name}
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
                                        value={this.state.form_body}
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

                                    <Button type='submit' color="primary">Edit</Button>

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