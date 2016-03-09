class Sentence < ActiveRecord::Base
  scope :in_day, -> { where('created_at > ?', 24.hours.ago ) }
end
