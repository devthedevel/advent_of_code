def readFile(name = "test.txt")
  puts "Reading input from #{name}"
  file = File.open(name)
  data = file.readlines.map(&:chomp)
  file.close

  return data
end

def partOne(data)
  calibrationValues = data.map do |line|
    nums = line.chars.select { |char| char.match(/\d/) }
    num = "#{nums.first}#{nums.last}".to_i
  end

  sum = calibrationValues.reduce(0) { |sum, num| sum + num }
  puts "The sum of the calibration values is #{sum}"

end

def partTwo(data)
  allowedValues = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  valueMap = {
    "one" => 1,
    "two" => 2,
    "three" => 3,
    "four" => 4,
    "five" => 5,
    "six" => 6,
    "seven" => 7,
    "eight" => 8,
    "nine" => 9
  }

  calibrationValues = data.map do |line|
    values = []

    allowedValues.each do |value|
      idx = line.index(value)
      lastIndex = line.index(value, -1 - value.length)

      values.push(
        {
          "value" => value,
          "index" => idx
        },
        {
          "value" => value,
          "index" => lastIndex
        }
      )
    end

    filtered = values.select { |value| value["index"] != nil}.uniq

    sorted = filtered
    .sort { |a, b| a["index"] <=> b["index"] }
    .map { |i| valueMap[i["value"]] || i["value"].to_i }

    "#{sorted.first}#{sorted.last}".to_i
  end

  sum = calibrationValues.reduce(0) { |sum, num| sum + num }
  puts "The sum of the calibration values is #{sum}"

end

if __FILE__ == $0
  data = readFile("input.txt")
  # partOne(data)

  partTwo(data)
end
