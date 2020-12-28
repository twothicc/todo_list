Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :todos, path: 'todos/:user'
      resources :categories, path: 'categories/:user'
    end
  end

  get '/api/v1/todos/:user/search/:category_id' => 'api/v1/todos#search'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  get '*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end

  post '/login',    to: 'sessions#create'
  post '/logout',   to: 'sessions#destroy'
  get '/logged_in', to: 'sessions#is_logged_in?'
  
  resources :users, only: [:create, :show, :index] do 
    resources :items, only: [:create, :show, :index, :destroy]
  end
  
end
