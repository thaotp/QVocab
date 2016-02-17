class WordsController < ApplicationController
  def index
    words = WordByWord.where(means: nil)
    render json: words
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