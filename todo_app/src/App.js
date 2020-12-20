import React, { Component } from "react";
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Link, Redirect, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';

const autocomplete_categories = [];

const todo_api_url = '/api/v1/todos';

const categorty_api_url = '/api/v1/categories';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Todos: [],
            Categories: {},
            todo_data: false,
            category_data: false,
            value: '',
            // isFilter: false
        }
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }

    componentDidMount() {
        console.log('appbar mounting');
        this.setCategories();
        this.setTodos();  
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevState.isFilter !== this.state.isFilter) {
    //         this.props.history.replace({pathname: '/Home', aboutProps: {Todos: this.state.Todos, Categories: this.state.Categories}});
    //         console.log("filter done");
    //         //Need to reset isFilter
    //         this.setState({
    //             isFilter: false
    //         })
    //     }
    // }


    async setTodos() {
        const response = await fetch(todo_api_url);
        if (response !== null) {
            const parsed_response = await response.json();
            this.setState({
                Todos: parsed_response,
                todo_data: true
            })
        }

        // .then(responses => {
            
        //     if (responses === null) {
        //         return null;
        //     } else {
        //         return responses.json();
        //     }
        // })
        // .then(parsed_responses => {
        //     //console.log("parsed responses"+parsed_responses)
        //     if (parsed_responses !== null) {
        //         this.setState({
        //             Todos: parsed_responses,
        //             todo_data: true
        //         })
        //     }
        // })
    }

    async setCategories() {
        const response = await fetch(categorty_api_url);
        if (response !== null) {
            const parsed_response = await response.json();
            var temp = {};
            for (let category of parsed_response) {
                temp[category.id] = category.name;
            }
            if (autocomplete_categories.length === 0) {
                autocomplete_categories.push({ title: 'All' });
                for (let category of parsed_response) {
                    autocomplete_categories.push({ title: category.name });
                }
            }
            this.setState({
                Categories: temp,
                category_data: true
            })
        }

        // .then(responses => {
        //     if (responses === null) {
        //         return null;
        //     } else {
        //         return responses.json();
        //     }
        // })
        // .then(parsed_responses => {
        //     if (parsed_responses !== null) {
        //         var temp = {};
        //         for (let category of parsed_responses) {
        //             temp[category.id] = category.name;
        //         }
        //         if (autocomplete_categories.length === 0) {
        //             autocomplete_categories.push({ title: 'All' });
        //             for (let category of parsed_responses) {
        //                 autocomplete_categories.push({ title: category.name });
        //             }
        //         }
        //         this.setState({
        //             Categories: temp,
        //             category_data: true
        //         })
        //     }
        // })
    }

    handleCategoryChange(event, values) {
        this.setState({
            value: values
        })
        //console.log("value change" + this.state.value)
    }

    async handleFilter() {
        //console.log(this.state.value);
        var api_url = '';
        if (this.state.value === "All") {
            api_url = todo_api_url
        } else {
            api_url = todo_api_url + '/search/' + Object.keys(this.state.Categories).find(key => this.state.Categories[key] === this.state.value);
        }
        console.log("filter url" + api_url)
        const response = await fetch(api_url);
        if (response !== null) {
            const parsed_response = await response.json();
            this.props.history.replace({pathname: '/Home', aboutProps: {Todos: parsed_response, Categories: this.state.Categories}});
        }
        // .then(responses => {
        //     if (responses === null) {
        //         return null;
        //     } else {
        //         return responses.json();
        //     }
        // })
        // .then(parsed_responses => {
        //     //console.log("filter results"+parsed_responses)
        //     if (parsed_responses !== null) {
        //         this.setState({
        //             Todos: parsed_responses,
        //             isFilter: true
        //         })
        //     }
        // })
        
    }

    render() {
        console.log(this.state.Todos);
        console.log(this.state.Categories);
        return (
            <div>
                <AppBar className = 'appbar'>
                    <Toolbar>
                        <div style = {{display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', width:'100%'}}>
                            <div style = {{display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', width:'15%'}}>
                                <h1>TodoList</h1>

                                <nav>
                                    <Link to = {{pathname: '/Home'}} style={{textDecoration:'none', color:'white'}}>
                                        <h4>Home</h4>
                                    </Link>
                                </nav>
                            </div>
                            <div style = {{display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'flex-end', width:'85%'}}>
                                <Autocomplete
                                    id="search_todo"
                                    options={autocomplete_categories}
                                    getOptionLabel={(option) => option.title}
                                    className = 'textbox'
                                    defaultValue = {autocomplete_categories[0]}
                                    onInputChange = {this.handleCategoryChange}
                                    renderInput={(params) => <TextField {...params} label="Filter By Categories" variant="outlined"/>}
                                />
                                <Button variant="outlined" onClick={this.handleFilter} style={{backgroundColor: 'white', marginInline: "1%"}}>Filter</Button>
                            </div>
                        </div>
                    </Toolbar>
                </AppBar>
                {(this.state.todo_data === true && this.state.category_data === true)
                    ? window.location.pathname === '/' 
                        ? <Redirect to ={{pathname: '/Home', aboutProps: {Todos: this.state.Todos, Categories: this.state.Categories, autocomplete_categories: autocomplete_categories}}}/>
                        : <br/>
                    : <br/>}
            </div>
        )
    }

    
}

export default withRouter(App)
