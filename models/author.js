var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxlength: 100 },
  family_name: { type: String, required: true, maxlength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

AuthorSchema.virtual('name').get(function () {
  var full_name = '';
  if (this.first_name && this.family_name) {
    full_name = this.family_name + ', ' + this.first_name;
  }
  return full_name;
});

AuthorSchema.virtual('lifespan').get(function () {
  var life_time = '';
  if (this.date_of_birth) {
    life_time = this.date_of_birth.getYear().toString();
  }

  life_time += ' - ';

  if (this.date_of_death) {
    life_time += this.date_of_death.getYear().toString();
  }
  return life_time;
});

AuthorSchema.virtual('url').get(function () {
  return '/catalog/author/' + this._id;
});

module.exports = mongoose.model('Author', AuthorSchema);
