class Category < ApplicationRecord
    validates :name, presence: true
    has_many :todos
    belongs_to :user
end
