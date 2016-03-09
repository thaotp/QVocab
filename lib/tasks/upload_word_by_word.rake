require 'csv'
namespace :word_by_word do
  desc "Upload Word By Word"
  task :upload => :environment do
    dir = "#{Rails.root}/csv"
    word_by_words = []
    Dir["#{dir}/*"].sort_by(&File.method(:ctime)).each do |file|
      note =  file.split('/').last.split('-').first
      csv_text = File.read(file)
      csv = CSV.parse(csv_text, :headers => false)
      csv.each do |row|
        word_by_words << { name: row[0], means: row[1], pron: row[2], note: note }
      end
    end

     WordByWord.create! word_by_words
  end
end