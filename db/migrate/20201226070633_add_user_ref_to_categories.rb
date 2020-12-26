class AddUserRefToCategories < ActiveRecord::Migration[6.0]
  def change
    add_reference :categories, :user, null: false, foreign_key: true, default: 3
  end
end
