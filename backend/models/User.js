import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

/**
 * User Schema definition for Startup CRM Lite.
 */
export const userSchema = new Schema(
  {
    /**
     * The username of the user.
     * Must be between 2 and 50 characters, trimmed.
     * @type {String}
     */
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [2, 'Username must be at least 2 characters long'],
      maxlength: [50, 'Username cannot exceed 50 characters']
    },

    /**
     * The mobile number of the user.
     * @type {String}
     */
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true
    },

    /**
     * The unique email address of the user.
     * Validated using a regular expression, converted to lowercase, and trimmed.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          // Standard email validation regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },

    /**
     * Hashed password of the user.
     * Must be at least 6 characters before hashing.
     * @type {String}
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },

    /**
     * The role assigned to the user defining their access permissions.
     * Allowed roles are 'admin' and 'user'. Defaults to 'admin'.
     * @type {String}
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: 'Role must be either admin or user'
      },
      default: 'admin'
    },

    /**
     * Flag indicating if the user account is active.
     * Defaults to true.
     * @type {Boolean}
     */
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    // Automatically manage createdAt and updatedAt fields
    timestamps: true
  }
);

/**
 * Pre-save middleware to hash the password before saving it to the database.
 * Only hashes the password if it has been modified or is new.
 */
userSchema.pre('save', async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return;
  }

  // Generate a salt and hash the password with 10 rounds
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compares a candidate plain text password with the hashed password in the database.
 * 
 * @param {String} candidatePassword - The plain text password to compare.
 * @returns {Promise<Boolean>} True if password matches, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Overrides the default toJSON method to ensure sensitive information like
 * the password is removed from the JSON output returned by the API.
 * 
 * @returns {Object} The clean user object without password field.
 */
userSchema.methods.toJSON = function () {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

const User = mongoose.model('User', userSchema);

export default User;
