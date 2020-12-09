const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * * Question Schema
 * @param uuid
 * @param index - Place in FFQ
 * @param type - One of the three main question types (Frequency Question, Amount Question or User Input Question)
 * @param parenQuestion -
 * @param childQuestion -
 * @param isAnswered - Weather or not the question was answered
 * @param possibleAnswers - All Answers the user could have selected
 * @param answer - The answer the user has given
 */

const Question = new Schema(
  {
    questionUUID: { type: String, required: true, unique: true },
    index: { type: Number, required: true, unique: true },
    questionType: { type: String, required: true },
    parenQuestion: { type: Schema.Types.ObjectId, required: false },
    childQuestion: { type: Schema.Types.ObjectId, required: false },
    title: { type: String, required: true },
    category: { type: String, required: true },
    possibleAnswers: { type: [String], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('questions', Question);