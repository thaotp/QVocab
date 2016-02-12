class Quest < ActiveRecord::Base

  MEAN = 1
  NAME = 2


  scope :active, -> (user_id) { where(starting: true).where('user_id = ? OR owner_id = ?', user_id, user_id).order('id DESC') }
  before_create :unactive, :set_rules


  def take_quests
    # words = Word.where(note: self.course).offset(self.level.to_i).limit(self.word_number)
    p self
    words = Word.where(main: true).take(self.word_number)
    means = Word.where.not(means: "").pluck(:means)
    names = Word.where(main: true).pluck(:name)
    rules = self.words_id.split(',').map(&:to_i)

    quests = rules.each_with_index.map do |rule, index|
      if(rule == MEAN)
        words[index].take_quest(rule, means.clone)
      elsif rule == NAME
        if words[index].examp.blank?
          words[index].take_quest(MEAN, means.clone)
        else
          words[index].take_quest(rule, names.clone)
        end
      end
    end

  end

  private

  def set_rules
    self.words_id = WORD_NUMBER.times.map{ 1 + Random.rand(2) }.join(',')
  end

  def unactive
    active_quest = Quest.active(self.user_id).last
    active_quest.update(starting: false) if active_quest.present?
  end
end
