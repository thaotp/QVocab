class WordByWord < WordCommon
  PER_PAGE = 50

  scope :in_day, -> { where('created_at > ?', 24.hours.ago ) }
  scope :moment, -> { where('created_at > ?', 1.hours.ago ) }
  scope :means_empty, -> { where('means is NULL or means = ?', "") }
  scope :had_means, -> { where('means is not NULL or means <> ?', "") }
  scope :randomize, -> { order('random()') }

  mount_uploader :audio, AudioUploader

  validates_uniqueness_of :name

end
