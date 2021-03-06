class WordsController < ApplicationController
  before_filter :authenticate_user!, except: [:index, :sync, :init]
  skip_before_filter :verify_authenticity_token, only: [:sync,:init]

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

  def init
    status = ReadWord.save_words(params_read_word) ? 201 : 500
    render json: {}, status: status
  end

  def sync
    if Rails.env.production?
      words = eval(params[:words])
      words.each do |attr_w|
        word = WordByWord.find_or_create_by(name: attr_w["name"])
        word.update(attr_w)
      end
    end
    render json: {}, status: 201
  end

  private
  def params_read_word
    params.require(:word).permit(:name, :page_url)
  end

  def params_word
    params.permit(:means, :photo_url)
  end
end