class ChangeTodosDefault < ActiveRecord::Migration[6.0]
  def change
    change_column_default :todos, :category_id, from: 0, to: 1
  end
end
