class CreateWordByWords < ActiveRecord::Migration
  def change
    create_table :word_by_words do |t|
      t.string :name
      t.string :gender
      t.string :means
      t.text :pron
      t.text :define
      t.string :examp
      t.string :text
      t.text :note
      t.string :family_word
      t.string :audio

      t.timestamps null: false
    end
  end
end
