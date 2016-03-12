class WordsController < ApplicationController
  before_filter :authenticate_user!, except: [:index]

  def index
    klass = params[:model].classify.constantize if params[:model].present?
    klass ||= "WordByWord".classify.constantize
    words = if(params[:type] == "review")
      klass.had_means.in_day.shuffle
    elsif (params[:type] == "update")
      klass.means_empty.order(id: :desc)
    elsif (params[:type] == "mobile")
      page = params[:page].to_i
      offset = (page - 1) * WordByWord::PER_PAGE
      klass.had_means.order(id: :desc).limit(WordByWord::PER_PAGE).offset(offset).shuffle
    end

    words = klass.had_means.order(id: :desc) if words.blank?

    render json: words
  end

  def review

  end

  def update
    word = WordByWord.find(params[:id])
    word.update(params_word)
    render json: word
  end

  def generate
    string = params[:string]
    arr = string.gsub("\n", '').gsub(".", '').gsub(/\d+/, '0').gsub("/", '0').split('0').map(&:strip).reject(&:empty?)
    render json: {names: arr}
  end

  def create
    words = []
    params[:words].each do |word|
      words << {name: word.downcase, note: params[:note]}
    end
    status = WordByWord.save_words(words) ? 201 : 500
    render json: {}, status: status
  end

  private
  def params_word
    params.permit(:means, :photo_url)
  end
end