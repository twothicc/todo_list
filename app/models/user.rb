class User < ApplicationRecord
    has_secure_password
    validates :username, presence: true, uniqueness: true, length: { minimum: 4 }
    has_many :todos
    has_many :categories
    after_save :create_category_and_welcome

    def create_category_and_welcome
        new_user = User.last
        id = new_user.id
        @default_category = Category.create(name: 'Default', user_id: id)
        welcome_todo = Todo.create(name: 'Welcome', body: 'Make a Todo!', user_id: id, category_id: @default_category.id)
    end
end
