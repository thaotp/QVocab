class CreateWord < ActiveRecord::Migration
  def change
    create_table :words do |t|
      t.string :name
      t.string :gender
      t.string :means
      t.text :pron
      t.text :define
      t.text :examp
      t.integer :root_word_id
      t.string :status
      t.integer :display_order
      t.boolean :main, :default => false
      t.text :note
      t.boolean :csv
      t.string :family_word
      t.boolean :unknown

      t.timestamps
    end
  end
end
