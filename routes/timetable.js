const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeTableSchema = new Schema({
  day: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lectureHall: {
    type:String
  },

  startTime: { hours: Number, minutes: Number },
  endTime: { hours: Number, minutes: Number },
  professors: [{ type: Schema.Types.ObjectId, ref: 'Professor' }]
});

const TimeTable = mongoose.model('TimeTable', timeTableSchema);

module.exports = TimeTable;