class AddCourseToQuests < ActiveRecord::Migration
  def change
    add_column :quests, :course, :string
  end
end
