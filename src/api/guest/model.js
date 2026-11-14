const { Schema, model } = require('mongoose')

// "hasChild" = vienen con un menor; "dish" = aportación gastronómica
const guestSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    name: { type: String, required: true, trim: true },
    dish: { type: String, required: true, trim: true },
    drink: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

module.exports = model('Guest', guestSchema, 'invitados')
