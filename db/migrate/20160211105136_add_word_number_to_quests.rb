class AddWordNumberToQuests < ActiveRecord::Migration
  def change
    add_column :quests, :word_number, :integer, default: 0
  end
end
