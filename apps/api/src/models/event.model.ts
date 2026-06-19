import mongoose, { type Model, type Types } from "mongoose";

export const eventTypes = ["page_view", "click"] as const;
export type EventType = (typeof eventTypes)[number];

export interface EventRecord {
  sessionId: string;
  eventType: EventType;
  pageUrl: string;
  timestamp: Date;
  x?: number;
  y?: number;
  screenWidth?: number;
  screenHeight?: number;
  userAgent: string;
  deviceType: string;
  browser: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EventLean = EventRecord & {
  _id: Types.ObjectId;
};

const eventSchema = new mongoose.Schema<EventRecord>(
  {
    sessionId: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    eventType: {
      type: String,
      required: true,
      enum: eventTypes,
      index: true
    },
    pageUrl: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    timestamp: {
      type: Date,
      required: true,
      index: true
    },
    x: {
      type: Number,
      min: 0
    },
    y: {
      type: Number,
      min: 0
    },
    screenWidth: {
      type: Number,
      min: 0
    },
    screenHeight: {
      type: Number,
      min: 0
    },
    userAgent: {
      type: String,
      default: ""
    },
    deviceType: {
      type: String,
      default: "desktop",
      index: true
    },
    browser: {
      type: String,
      default: "Unknown",
      index: true
    },
    country: {
      type: String,
      default: "Unknown",
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

eventSchema.index({ sessionId: 1, timestamp: 1 });
eventSchema.index({ pageUrl: 1, eventType: 1, timestamp: -1 });
eventSchema.index({ timestamp: -1, sessionId: 1 });

export const EventModel: Model<EventRecord> =
  (mongoose.models.Event as Model<EventRecord> | undefined) ??
  mongoose.model<EventRecord>("Event", eventSchema);
