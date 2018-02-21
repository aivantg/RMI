# Constants
NUM_USERS = 5
NUM_PORTFOLIOS = 5
NUM_BUILDINGS = 15
BUILDING_TYPES = [
  { name: 'Big Box Retail' },
  { name: 'Small Office' }
]
CATEGORIES = [
  { name: 'Spaces' },
  { name: 'Lighting - Interior' }
].freeze
QUESTIONS = [
  { question:
    { question_type: 'dropdown', category_id: 1, text: 'Do you have a full set of building drawings available in electronic format you can share?', status: 'published', parameter: 'isupload' },
    options: [
      { text: 'yes' },
      { text: 'no' }
    ] },
  { question:
    { question_type: 'range', category_id: 1, text: 'What is the area in ft2 of the conditioned floor space?', status: 'published', parameter: 'cfs_area' },
    options: [
      { min: 1, max: 100 }
    ] },
  { question:
    { question_type: 'range', category_id: 1, text: 'Please estimate how much space the office space accounts for in the building in percentage.', status: 'published', parameter: 'perc_office_space' },
    options: [
      { min: 1, max: 100 }
    ] },
  { question:
    { question_type: 'range', category_id: 1, text: 'Please estimate how much space the Back of House space accounts for in the building in percentage.', status: 'published', parameter: 'perc_boh_space' },
    options: [
      { min: 1, max: 100 }
    ] },
  { question:
    { question_type: 'range', category_id: 1, text: 'Please estimate how much space the retail space accounts for in the building in percentage.', status: 'published', parameter: 'perc_ret_space' },
    options: [
      { min: 1, max: 100 }
    ] },
  { question:
    { question_type: 'range', category_id: 1, text: 'Please estimate how much space the restaurant/dining/kitchen space accounts for in the building in percentage.', status: 'published', parameter: 'perc_din_space' },
    options: [
      { min: 1, max: 100 }
    ] },
  { question:
    { question_type: 'range', category_id: 1, text: 'Please estimate how much space the data center space accounts for in the building in percentage.', status: 'published', parameter: 'perc_ds_space' },
    options: [
      { min: 1, max: 100 }
    ] },
  { question:
    { question_type: 'range', category_id: 1, text: 'Please estimate how much space the garage space accounts for in the building in percentage.', status: 'published', parameter: 'perc_gar_space' },
    options: [
      { min: 1, max: 100 }
    ] },
  { question:
    { question_type: 'range', category_id: 1, text: 'Please estimate how much space the garage space accounts for in the building in percentage.', status: 'published', parameter: 'perc_gar_space' },
    options: [
      { min: 1, max: 100 }
    ] }
].freeze

DEPENDENT_QUESTIONS = [
  { id: 10, question_type: 'range', category_id: 1, text: 'What percentage of the office space is leased to tenents?', status: 'published', parameter: 'perc_os_tenents', parent_option_type: 'range_option', parent_option_id: 2 },
  { id: 11, question_type: 'range', category_id: 1, text: 'What percentage of the office space is occupied by owner?', status: 'published', parameter: 'perc_os_owner', parent_option_type: 'range_option', parent_option_id: 2 },
  { id: 12, question_type: 'free', category_id: 1, text: 'Please upload building drawings.', status: 'published', parameter: 'upload_url', parent_option_type: 'dropdown_option', parent_option_id: 1 }
].freeze



def make_rmi_user
  1.upto(NUM_USERS) do |n|
    rmi_user = RmiUser.create(
      id: n,
      first_name: Faker::Name.unique.first_name,
      last_name: Faker::Name.unique.last_name,
      password: 'password',
      password_confirmation: 'password',
      phone: '11231231234',
      email: "rmi_user#{n}@test.com"
    )
    rmi_user.save
  end
end

def make_asset_manager
  1.upto(NUM_USERS) do |n|
    asset_manager = AssetManager.create(
      id: n,
      first_name: Faker::Name.unique.first_name,
      last_name: Faker::Name.unique.last_name,
      password: 'password',
      password_confirmation: 'password',
      phone: '11231231234',
      email: "asset_manager#{n}@test.com"
    )
    asset_manager.save
  end
end

def make_portfolio
  AssetManager.all.each do |a|
    portfolio = a.create_portfolio(
      name: Faker::Company.unique.name
    )
    portfolio.save
  end
end

def make_bulding_types
  BUILDING_TYPES.each do |b|
    building_type = BuildingType.create(b)
    building_type.save
  end
end

def make_categories
  CATEGORIES.each do |c|
    category = Category.create(c)
    category.save
  end
end

def make_questions_options
  BuildingType.all.each do |b_type|
    QUESTIONS.each do |q|
      question = b_type.questions.create(q[:question])
      question.save
      q[:options].each do |o|
        option =
          case question.question_type
          when 'dropdown'
            question.dropdown_options.create(o)
          when 'range'
            question.range_options.create(o)
          end
        option.save
      end
    end
  end
end

def make_buildings
  Portfolio.all.each do |p|
    1.upto(NUM_BUILDINGS) do
      building_type_id = rand(1..BuildingType.all.size)
      building = p.buildings.create(
        building_type_id: building_type_id,
        address: Faker::Address.street_address,
        city: Faker::Address.city,
        state: Faker::Address.state.tr(' ', '_'),
        zip: 12_345,
        name: Faker::Company.unique.name \
              + BuildingType.find(building_type_id).name
      )
      building.save
    end
  end
end

make_rmi_user
make_asset_manager
make_portfolio
make_bulding_types
make_categories
make_questions_options
make_buildings
