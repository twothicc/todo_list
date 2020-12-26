if Rails.env === 'development' 
    Rails.application.config.session_store :cookie_store, key: '_todo_app', domain: ''
else
    Rails.application.config.session_store :cookie_store, key: '_todo_app'
end