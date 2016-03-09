class WordByWord < ActiveRecord::Base
  require 'csv'
  PER_PAGE = 2

  scope :in_day, -> { where('created_at > ?', 24.hours.ago ) }
  scope :moment, -> { where('created_at > ?', 1.hours.ago ) }
  scope :means_empty, -> { where('means is NULL or means = ?', "") }
  scope :had_means, -> { where('means is not NULL or means <> ?', "") }

  mount_uploader :audio, AudioUploader

  validates_uniqueness_of :name

  URL_DICTIONARY_EN = "http://dictionary.cambridge.org/dictionary/english"

  def self.set_word string, note = ''
    if note.blank?
      p 'missing note'
      return;
    end

    arr = string.gsub("\n", '').gsub("/", '0').split('0').map(&:strip).reject(&:empty?)
    arr = arr.uniq
    arr.map! do |w|
      {name: w, note: note, pron: WordByWord.set_pron(w)}
    end
    arr_obj = create(arr) || []
    return if arr_obj.empty?
    download_audio(arr_obj)

  end

  def self.save_words words
    words.each do |word|
      word[:pron] = WordByWord.set_pron(word[:name])
    end

    arr_obj = create(words) || []
    return if arr_obj.empty?
    download_audio(arr_obj)
    true
  end

  def self.set_pron name
    pron = name.strip.split(" ").map do |word|
      begin
        get_pron word.gsub(/[^0-9A-Za-z]/, '').singularize
      rescue OpenURI::HTTPError => e
        ""
      end
    end.join(' ')

    "/#{pron}/"
  end

  def self.get_pron word
    page = Nokogiri::HTML(open("#{URL_DICTIONARY_EN}/#{word}"))
    pron = page.css('.di-body .pron .ipa')[0].text.strip
    pron
  end

  def self.to_csv words
    return if words.blank?
    note = words.sample.note

    column_names = [:name, :means, :pron]

    file = CSV.open("#{Dir.pwd}/csv/#{note}-#{Time.now}.csv", "w") do |csv|
      words.each do |word|
        csv << word.attributes.values_at(*column_names.map(&:to_s))
      end
    end
    p "Done ..."
  end

  def self.download_audio words
    agent = Mechanize.new
    folder = "/Users/THAO-NUS/Dropbox/Job/ShowVocal/audio"
    agent.pluggable_parser.default = Mechanize::Download
    words.each do |word|
      next if word.name.include?('-')
      name = word.name.gsub(/[^a-zA-Z. ]/, "").split(" ").join('-')
      next if File.exists?("#{folder}/#{name}.mp3")

      if word.name.index(/\s/).present?
        readspeaker word.name.gsub(/[^a-zA-Z. ]/, ""), folder
      else
        path = "#{URL_DICTIONARY_EN}/#{word.name}"
        begin
          doc = Nokogiri::HTML(open(path))
          link_mp3 = doc.css('.sound.us')[0].attributes["data-src-mp3"].value
          agent.get(link_mp3).save("#{folder}/#{word.name}.mp3")
        rescue Exception => e
          readspeaker word.name.gsub(/[^a-zA-Z. ]/, ""), folder
        end
      end
    end
  end

  def self.readspeaker word, folder
    begin
      params = {t: word}.to_query
      audio = RestClient.get "http://responsivevoice.org/responsivevoice/getvoice.php?#{params}&tl=en-US"
      name = word.split(" ").join('-')
      open("#{folder}/#{name}.mp3", 'wb') { |f| f.write audio }
    rescue Exception => e
      p e
    end
  end



end
