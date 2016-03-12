class AddPhotoUrlToWords < ActiveRecord::Migration
  def change
    add_column :words, :photo_url, :text
  end
end
