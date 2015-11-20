ENV['RAILS_ENV'] ||= 'test'
Dir[Rails.root.join("test/support/**/*")].each { |f| require f }
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'minitest/mock'
require 'webmock/minitest'
require 'vcr'
require 'minitest/reporters'
require 'capybara/rails'
require 'public_activity/testing'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all
  # Add more helper methods to be used by all tests here...
end

class ActionController::TestCase
  include Devise::TestHelpers
end

VCR.configure do |config|
  config.cassette_library_dir = "test/vcr_cassettes"
  config.hook_into :webmock
end

PublicActivity.enabled = false

Minitest::Reporters.use! [Minitest::Reporters::DefaultReporter.new(:color => true)]

