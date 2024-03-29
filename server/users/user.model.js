const mongoose = require('mongoose');

const { Schema } = mongoose;

const Answer = Schema(
  {
    questionId: { type: String },
    type: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    userInput: { type: Schema.Types.Mixed }
  },
  { _id: false, default: [] }
);

const Iteration = Schema(
  {
    id: { type: String },
    startedAt: { type: Date },
    finishedAt: { type: Date },
    pausedAt: { type: [Number], default: [] },
    stoppedAtIndex: { type: Number, default: -1 },
    questionsToSkip: { type: [String], _id: false, default: [] },
    answers: [Answer]
  },
  { _id: false, default: [] }
);

const User = mongoose.model(
  'User',
  new mongoose.Schema(
    {
      email: { type: String, unique: true, lowercase: true, required: true },
      password: { type: String, required: true },
      firstName: { type: String, default: '' },
      lastName: { type: String, default: '' },
      hasAcceptedConsentForm: { type: Boolean, default: false },
      screeningData: { type: [String], default: [] },
      screeningStatus: { type: String, enum: ['Accept', 'Reject', 'Wait', ''], default: '' },
      iterations: [Iteration],
      roles: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Role'
        }
      ]
    },
    { timestamps: true }
  ).set('toJSON', {
    virtuals: true,
    versionKey: false,
    // minimize: false,
    transform(doc, ret) {
      const transformed = ret;
      delete transformed.password;
      delete transformed.roles;
      delete transformed.createdAt;
      delete transformed.updatedAt;
      return transformed;
    }
  })
);

module.exports = User;
