class WordsController < ApplicationController
  before_filter :authenticate_user!, except: [:index]

  def index
    words = if(params[:type] == "review")
      WordByWord.had_means.in_day.shuffle
    elsif (params[:type] == "update")
      WordByWord.means_empty.order(id: :desc)
    else (params[:type] == "mobile")
      page = params[:page].to_i
      offset = (page - 1) * WordByWord::PER_PAGE
      WordByWord.had_means.order(id: :desc).limit(WordByWord::PER_PAGE).offset(offset)
    end

    words = WordByWord.had_means.order(id: :desc) if words.blank?

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
    arr = string.gsub("\n", '').gsub(".", '').gsub("/", '0').split('0').map(&:strip).reject(&:empty?)
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
    params.permit(:means)
  end
end