class AddUserRefToTodos < ActiveRecord::Migration[6.0]
  def change
    add_reference :todos, :user, null: false, foreign_key: true, default: 3
  end
end
