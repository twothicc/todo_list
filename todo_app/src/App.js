import React, { Component } from "react";
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Link, Redirect, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';

var autocomplete_categories = [];

const todo_api_url = '/api/v1/todos';

const categorty_api_url = '/api/v1/categories';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_logged_in: false,
            Todos: [],
            Categories: {},
            todo_data: false,
            category_data: false,
            //This value is the filter value
            value: 'All',
            user: 'Guest',
            user_id: ''
        }
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
    }

    async componentDidMount() {
        
        console.log('LOGIN')
        //Need to have a check here cuz otherwise setCategories complains about non-iterables being returned
        await this.login();
        if (this.state.is_logged_in) {
            this.setCategories();
            this.setTodos(); 
        } else {

        }
        console.log('reload')
        
    }


    componentDidUpdate(prevProps, prevState) {
        //If coming back from login or signup page, it means login/signup is successful. So just login
        if (prevProps.location.aboutProps !== this.props.location.aboutProps) {
            if (this.props.location.aboutProps !== undefined) {
                if (this.props.location.aboutProps.outcome !== undefined) {
                    console.log('actually handling login')
                    this.handleLogin(this.props.location.aboutProps.outcome)
                }
            }
        }  
        

        if (prevState.user !== this.state.user && this.state.user !== 'Guest') {
            this.setCategories();
            this.setTodos();
        }

    }

    //Wait till todos are fetched and parsed. Handles null case
    async setTodos() {
        const response = await fetch(todo_api_url + '/' + this.state.user_id);
        if (response !== null) {
            const parsed_response = await response.json();
            this.setState({
                Todos: parsed_response,
                todo_data: true
            })
        }

    }

    //Wait till categories are fetched and parsed. Handles null case
    async setCategories() {
        const response = await fetch(categorty_api_url + '/' + this.state.user_id);
        if (response !== null) {
            const parsed_response = await response.json();
            var temp = {};
            for (let category of parsed_response) {
                temp[category.id] = category.name;
            }
            if (autocomplete_categories.length === 0) {
                autocomplete_categories.push({ title: 'All' });
                autocomplete_categories.push({title: 'Default'});
                for (let category of parsed_response) {
                    if (category.name !== 'Default') {
                        autocomplete_categories.push({ title: category.name });
                    }
                }
            }
            this.setState({
                Categories: temp,
                category_data: true
            })
        }
    }

    //Changes value dynamically as user types into filter bar
    handleCategoryChange(event, values) {
        this.setState({
            value: values
        })
    }

    //Waits till filterered records are fetched and parsed. Handles null case
    async handleFilter() {
        var api_url = '';
        if (this.state.value === "All") {
            api_url = todo_api_url + '/' + this.state.user_id
        } else {
            api_url = todo_api_url + '/' + this.state.user_id + '/search/' + Object.keys(this.state.Categories).find(key => this.state.Categories[key] === this.state.value);
        }
        console.log("filter url" + api_url)
        const response = await fetch(api_url);
        if (response !== null) {
            const parsed_response = await response.json();
            this.props.history.replace({pathname: '/Home', aboutProps: {Todos: parsed_response, Categories: this.state.Categories, user_id: this.state.user_id}});
        }
        
    }

    handleLogin(data) {
        this.setState({
            is_logged_in: true,
            user: data.user.username,
            user_id: data.user.id
        })
    }

    //Pretty much need a clean slate on logout
    handleLogout() {
        autocomplete_categories = [];
        this.setState({
            is_logged_in: false,
            user: 'Guest',
            user_id: '',
            Todos: [],
            Categories: {},
            todo_data: false,
            category_data: false,
            value: 'All'
        })
    }

    async login() {
        console.log('attempting login');
        const response = await fetch('/logged_in');
        const parsed_response = await response.json();
        if (parsed_response.logged_in) {
            this.handleLogin(parsed_response);
        } else {
            this.handleLogout();
        }
    }

    async logout() {
        const response = await fetch('/logout', {
            method: 'POST'
        });
        const parsed_response = await response.json();
        if (parsed_response.logged_out) {
            this.handleLogout();
            this.props.history.replace('/');
        } else {
            //Shld display error logout failed.
        }
    }




    render() {
        //console.log(this.state.Todos);
        //console.log(this.state.Categories);
        
        return this.state.is_logged_in 
        ? (
            <div>

                <AppBar className = 'appbar'>

                    <Toolbar>

                        <div style = {{display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', width:'100%'}}>

                            <div style = {{display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', width:'30%'}}>

                                <h1>TodoList</h1>

                                <nav>

                                    <Link to = {{pathname: '/Home'}} style={{textDecoration:'none', color:'white'}}>

                                        <h4>Home</h4>

                                    </Link>

                                </nav>

                                <h4>{this.state.user}</h4>

                                <Button variant = 'outlined' style = {{backgroundColor: 'white', marginInline: '1%'}} onClick={this.logout}>Logout</Button>

                            </div>

                            <div style = {{display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'flex-end', width:'70%'}}>

                                <Autocomplete
                                    id="search_todo"
                                    options={autocomplete_categories}
                                    getOptionLabel={(option) => option.title}
                                    className = 'textbox'
                                    defaultValue = {autocomplete_categories[0]}
                                    onInputChange = {this.handleCategoryChange}
                                    renderInput={(params) => 
                                        <TextField 
                                            {...params} 
                                            label="Filter By Categories" 
                                            variant="outlined"
                                        />}
                                />

                                <Button 
                                    variant="outlined" 
                                    onClick={this.handleFilter} 
                                    style={{backgroundColor: 'white', marginInline: "1%"}}
                                >
                                    Filter
                                </Button>

                            </div>

                        </div>

                    </Toolbar>

                </AppBar>

                {(this.state.todo_data === true && this.state.category_data === true)
                    ? window.location.pathname === '/'
                        ? <Redirect to ={{pathname: '/Home', 
                            aboutProps: {
                                Todos: this.state.Todos, 
                                Categories: this.state.Categories, 
                                autocomplete_categories: autocomplete_categories,
                                user_id: this.state.user_id
                            }}}/>
                        : <br/>
                    : <br/>}

            </div>
        )
        : (
            
            <div style={{position: 'fixed', display: "flex", flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', 
                backgroundColor: "#3f51b5", width: '100%', height: '7%', top: '0%'}}>

                    <h2 style={{color: 'white', marginLeft: '1%'}}>TodoList</h2>
                    <div style={{borderLeft: '2px solid white', height: '100%', marginLeft: '1%'}}></div>
                    <Link to = {{pathname: '/Login'}} style={{color: 'white', marginLeft: '1%'}}><h3>Login</h3></Link>
                    <Link to = {{pathname: '/Signup'}} style={{color: 'white', marginLeft: '1%'}}><h3>Signup</h3></Link>
                    
            </div>                
                
        )
    }

    
}

export default withRouter(App)
