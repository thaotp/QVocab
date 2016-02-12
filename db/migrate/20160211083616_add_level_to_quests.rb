class AddLevelToQuests < ActiveRecord::Migration
  def change
    add_column :quests, :level, :string
  end
end
