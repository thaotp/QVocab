class AddPhotoUrlToWordByWords < ActiveRecord::Migration
  def change
    add_column :word_by_words, :photo_url, :text
  end
end
