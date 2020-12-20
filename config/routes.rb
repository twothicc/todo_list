Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :todos
      resources :categories
    end
  end

  get '/api/v1/todos/search/:category_id' => 'api/v1/todos#search'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  get '*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
  
end
