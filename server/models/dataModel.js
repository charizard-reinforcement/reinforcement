import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const dataSchema = new Schema(
  {
    // ID for each data
    _id: Schema.Types.ObjectId,
    userId: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: [true, 'Please provided copied data'],
    },
  },
  { timestamps: true },
);

const Data = model('Data', dataSchema);
export default Data;
