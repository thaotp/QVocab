# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160314151606) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "quests", force: :cascade do |t|
    t.integer  "owner_id"
    t.integer  "user_id"
    t.string   "words_id"
    t.integer  "winner_id"
    t.boolean  "starting",    default: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "course"
    t.string   "level"
    t.integer  "word_number", default: 0
  end

  create_table "read_words", force: :cascade do |t|
    t.string   "name"
    t.string   "gender"
    t.string   "means"
    t.text     "pron"
    t.text     "define"
    t.string   "examp"
    t.string   "text"
    t.text     "note"
    t.string   "family_word"
    t.string   "audio"
    t.text     "photo_url"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.text     "page_url"
  end

  create_table "roles", force: :cascade do |t|
    t.string   "name"
    t.integer  "resource_id"
    t.string   "resource_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "roles", ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id", using: :btree
  add_index "roles", ["name"], name: "index_roles_on_name", using: :btree

  create_table "sentences", force: :cascade do |t|
    t.text     "name"
    t.text     "means"
    t.string   "note"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "users_roles", id: false, force: :cascade do |t|
    t.integer "user_id"
    t.integer "role_id"
  end

  add_index "users_roles", ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id", using: :btree

  create_table "word_by_words", force: :cascade do |t|
    t.string   "name"
    t.string   "gender"
    t.string   "means"
    t.text     "pron"
    t.text     "define"
    t.string   "examp"
    t.string   "text"
    t.text     "note"
    t.string   "family_word"
    t.string   "audio"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.text     "photo_url"
  end

  create_table "words", force: :cascade do |t|
    t.string   "name"
    t.string   "gender"
    t.string   "means"
    t.text     "pron"
    t.text     "define"
    t.text     "examp"
    t.integer  "root_word_id"
    t.string   "status"
    t.integer  "display_order"
    t.boolean  "main",          default: false
    t.text     "note"
    t.boolean  "csv"
    t.string   "family_word"
    t.boolean  "unknown"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "audio"
    t.text     "photo_url"
  end

end
