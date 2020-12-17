class CreateTodos < ActiveRecord::Migration[6.0]
  def change
    create_table :todos do |t|
      t.text :name
      t.text :body
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
