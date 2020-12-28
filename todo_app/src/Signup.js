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
            error: false,
            error_msg: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitSignupRequest = this.submitSignupRequest.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordConfirmationChange = this.handlePasswordConfirmationChange.bind(this);
        this.handleError = this.handleError.bind(this);
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
            console.log('signup successful ' + parsed_response.user.username)
            this.props.history.push({pathname: '/', aboutProps: {outcome: parsed_response}})
        } else {
            console.log(parsed_response.errors[0])
            this.handleError(parsed_response.errors[0])
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
        return (
            <div style={{position: 'relative', width: '100%', height: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '5%'}}>
                {this.state.error ? 
                    <h3 style={{color: 'red', zIndex: '1', position: 'fixed', left: '40%', width: '20%', textAlign: 'center', top: '40%'}}>{this.state.error_msg}</h3>
                    : <br/>}
                <div style={{display: 'flex', width: '50%', height: 'auto', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
            
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
                            type='password'
                            name='user[password]'
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            fullWidth
                        />

                        <TextField
                            id='password_confirmation_input'
                            margin='dense'
                            label='password_confirmation'
                            type='password'
                            name='user[password_confirmation]'
                            value={this.state.password_confirmation}
                            onChange={this.handlePasswordConfirmationChange}
                            fullWidth
                        />
                        <Button 
                            variant="outlined" 
                            color="primary"
                            size='medium'
                            type='submit'
                            style={{width: '100%', marginTop: '3%', marginBottom: '3%'}}
                            >
                            Signup
                        </Button>
                    </form>
                </div>
            </div>
        )
    }

}

export default Signup