class CreateSentences < ActiveRecord::Migration
  def change
    create_table :sentences do |t|
      t.text :name
      t.text :means
      t.string :note

      t.timestamps null: false
    end
  end
end
