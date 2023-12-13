import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    filename: {
      type: [] as string[],
      required: true,
    },

    secure_url: {
      type: [] as string[],
      required: true,
    },
    format: {
      type: [] as String[],
      required: true,
    },
    sizeInBytes: {
      type: [] as string[],
      required: true,
    },
    sender: {
      type: [] as string[],
    },
    receiver: {
      type: [] as string[],
    },
  },
  {
    timestamps: true,
  }
);

interface IFile extends Document {
  filename: string;
  secure_url: string;
  sizeInBytes: string;
  format: string;
  sender?: string;
  receiver?: string;
}

export default mongoose.model<IFile>("File", fileSchema);
