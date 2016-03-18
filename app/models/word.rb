class Word < ActiveRecord::Base
  scope :in_day, -> { where('created_at > ?', 24.hours.ago ) }
  scope :moment, -> { where('created_at > ?', 1.hours.ago ) }
  scope :means_empty, -> { where('means is NULL or means = ?', "") }
  scope :had_means_and_main, -> { where('means is not NULL or means <> ?', "").where(main: true).where(note: "4000 Essential English Words 1")}

  # Audio uploader using carrierwave
  mount_uploader :audio, AudioUploader

  VERB = "verb"

  def self.had_means
    had_means_and_main
  end

  def take_quest(rule, words)
    case rule
    when Quest::MEAN
      rule_one words
    when Quest::NAME
      rule_two words
    else

    end
  end

  private
  def rule_one means
    means.delete(self.means)
    means = means.shuffle.take(3)
    means << self.means
    {id: self.id, question: self.name, anwsers: means.shuffle, right_anwser: self.means, rule: Quest::MEAN, gender: self.gender, name: self.name, pron: self.pron, means: self.means}
  end

  def rule_two names
    names.delete(self.name)
    names = names.shuffle.take(3)
    names << self.name
    past = self.name.sub(/([^aeiouy])y$/,'\1i').sub(/([^aeiouy][aeiou])([^aeiouy])$/,'\1\2\2').sub(/e$/,'')+'ed' if self.gender == VERB

    if(self.gender == VERB && self.examp.include?(past))
      question = self.examp.gsub( /#{past}/i , '.'*past.length )
    else
      question = self.examp.gsub( /#{self.name}/i , '.'*self.name.length )
    end

    {id: self.id, question: question.split(';').last, anwsers: names.shuffle, right_anwser: self.name, rule: Quest::NAME, gender: self.gender, name: self.name, pron: self.pron, means: self.means}
  end
end
