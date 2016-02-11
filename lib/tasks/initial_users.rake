namespace :initial_users do
  desc "Initial User"
  task :create => :environment do
    User.create(email: 'admin@gmail.com', password: 12345678, password_confirmation: 12345678)
    User.create(email: 'user@gmail.com', password: 12345678, password_confirmation: 12345678)
  end

end