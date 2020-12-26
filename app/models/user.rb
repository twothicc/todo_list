class User < ApplicationRecord
    has_secure_password
    validates :username, presence: true, uniqueness: true, length: { minimum: 4 }
    has_many :todos
    has_many :categories
end
