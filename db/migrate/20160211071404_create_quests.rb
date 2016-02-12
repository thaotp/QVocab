class CreateQuests < ActiveRecord::Migration
  def change
    create_table :quests do |t|
      t.integer :owner_id
      t.integer :user_id
      t.string :words_id
      t.integer :winner_id
      t.boolean :starting, default: false

      t.timestamps null: false
    end
  end
end
