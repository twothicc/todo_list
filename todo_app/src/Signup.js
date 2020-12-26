import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            password_confirmation: '',
            error: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitSignupRequest = this.submitSignupRequest.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordConfirmationChange = this.handlePasswordConfirmationChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.submitSignupRequest(event.target);
    }

    async submitSignupRequest(formData) {
        const data = new FormData(formData);
        const response = await fetch('/users', {
            method: 'POST',
            body: data
        });
        const parsed_response = await response.json();
        if (parsed_response.status === 'created') {
            //Need to get App.js to handle this shit
            this.props.history.push({pathname: '/', aboutProps: {outcome: parsed_response}})
        } else {
            this.setState({
                error: true
            })
        }
    }

    handleUsernameChange(event) {
        this.setState({
            username: event.target.value
        })
    }

    handlePasswordChange(event) {
        this.setState({
            password: event.target.value
        })
    }

    handlePasswordConfirmationChange(event) {
        this.setState({
            password_confirmation: event.target.value
        })
    }

    render() {
        return (
            <div>
                <form
                    onSubmit={this.handleSubmit}
                    id='todo_form'
                    autoComplete='off'>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="username_input"
                        label="username"
                        type="text"
                        name='user[username]'
                        value={this.state.username}
                        onChange={this.handleUsernameChange}
                        multiline
                        fullWidth
                    />

                    <TextField
                        id='password_input'
                        margin='dense'
                        label='password'
                        type='text'
                        name='user[password]'
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                        multiline
                        fullWidth
                    />

                    <TextField
                        id='password_confirmation_input'
                        margin='dense'
                        label='password_confirmation'
                        type='text'
                        name='user[password_confirmation]'
                        value={this.state.password_confirmation}
                        onChange={this.handlePasswordConfirmationChange}
                        multiline
                        fullWidth
                    />
                    <Button 
                        variant="outlined" 
                        color="primary"
                        size='medium'
                        type='submit'
                        >
                        Signup
                    </Button>
                </form>
            </div>
        )
    }

}

export default Signup