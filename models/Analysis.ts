import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  resumeText: string;
  analysis: {
    overallScore: number;
    summary: string;
    strengths: string[];
    improvements: string[];
    keywords: string[];
  } | null;
  roles: Record<string, unknown>[] | null;
  createdAt: Date;
}

const AnalysisSchema = new Schema<IAnalysis>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    analysis: {
      type: Schema.Types.Mixed,
      default: null,
    },
    roles: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
