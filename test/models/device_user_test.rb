require 'test_helper'

class DeviceUserTest < ActiveSupport::TestCase
  include UniqueHasManyThroughJoinTableTest

  setup do
    @left_object  = devices(:one)
    @right_object = users(:one)
  end
end
