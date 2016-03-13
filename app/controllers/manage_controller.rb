class ManageController < ApplicationController
  def index
    @list_note = WordByWord.all.pluck(:note).uniq
    render json: {list_note: @list_note}, status: 200
  end

  def note_csv
    note = params[:note]
    words = WordByWord.where(note: note)
    respond_to do |format|
      format.html
      format.csv { send_data words.as_csv, type: "text/csv; charset=iso-8859-1; header=present", disposition: "attachment;filename=#{note}.csv" }
    end
  end
end