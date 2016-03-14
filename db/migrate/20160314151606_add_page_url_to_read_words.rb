class AddPageUrlToReadWords < ActiveRecord::Migration
  def change
    add_column :read_words, :page_url, :text
  end
end
