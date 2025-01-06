import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const dataSchema = new Schema (
  {
    // ID for each data
    _id: Schema.Types.ObjectId,
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    data: {
      type: String,
      required: [true, 'Please provided copied data'],
    },
  },
  { timestamps: true },
);

const Data = model('Data', dataSchema);
export default Data;