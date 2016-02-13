class AddAudioToWords < ActiveRecord::Migration
  def change
    add_column :words, :audio, :string
  end
end
