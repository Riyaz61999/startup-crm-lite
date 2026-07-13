import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Lead Schema definition for Startup CRM Lite.
 */
export const leadSchema = new Schema(
  {
    /**
     * The full name of the lead contact person.
     * Must be between 2 and 100 characters, trimmed.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Lead name must be at least 2 characters long'],
      maxlength: [100, 'Lead name cannot exceed 100 characters']
    },

    /**
     * The company associated with the lead.
     * Trimmed, required field.
     * @type {String}
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },

    /**
     * The email address for the lead contact.
     * Validated using a regular expression, trimmed.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },

    /**
     * Optional phone number of the lead.
     * Trimmed field.
     * @type {String}
     */
    phone: {
      type: String,
      trim: true
    },

    /**
     * The current status of the lead in the sales pipeline.
     * Restricted to specific frontend-matching status values.
     * Defaults to 'New'.
     * @type {String}
     */
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
        message: 'Status must be: New, Contacted, Meeting Scheduled, Proposal Sent, Won, or Lost'
      },
      default: 'New'
    },

    /**
     * The source from which the lead originated.
     * Restricted to specific frontend-matching source values.
     * Defaults to 'Website'.
     * @type {String}
     */
    source: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
        message: 'Source must be: Website, Referral, LinkedIn, Cold Call, Email Campaign, or Other'
      },
      default: 'Website'
    },

    /**
     * Optional notes or background information about the lead.
     * Maximum 1000 characters.
     * @type {String}
     */
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },

    /**
     * The owner (User) who created or is assigned to this lead.
     * Required field linking to the User model.
     * @type {mongoose.Types.ObjectId}
     */
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead owner (User ID) is required']
    }
  },
  {
    // Automatically manage createdAt and updatedAt fields
    timestamps: true,
    // Enable virtual fields to be included when converting documents to JSON or Objects
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Virtual field 'age' representing the number of days since the lead was created.
 * Useful for pipeline and sales cycle analytics.
 */
leadSchema.virtual('age').get(function () {
  if (!this.createdAt) {
    return 0;
  }
  const timeDifference = Date.now() - this.createdAt.getTime();
  const daysDifference = timeDifference / (1000 * 3600 * 24);
  return Math.floor(daysDifference);
});

// Indexes for optimization
// Index on email for fast lookups (e.g., preventing duplicate leads or searching)
leadSchema.index({ email: 1 });

// Compound index on (owner, status) for fast filtered dashboard/pipeline queries
leadSchema.index({ owner: 1, status: 1 });

// Compound index on (owner, createdAt) for date filtering and chronological sorting
leadSchema.index({ owner: 1, createdAt: -1 });

// Compound index on (owner, source) for source breakdown
leadSchema.index({ owner: 1, source: 1 });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
