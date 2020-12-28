class ChangeDefaultTodoCategory < ActiveRecord::Migration[6.0]
  def change
    change_column_default :todos, :user_id, 1
    change_column_default :categories, :user_id, 1
  end
end
