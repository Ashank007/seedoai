import mongoose from 'mongoose'

const FacultySchema = new mongoose.Schema(
	{
		name: {
			type: String
		},
		email: {
			type: String
		},
		password: {
			type: String
		},
		facultyid: {
			type: String
		},
		timestamps: [
			{
				att_type: {
					type: String,
					enum: ['CheckIn', 'CheckOut']
				},
				date: {
					type: String
				}
			}
		],
		block: {
			type: String
		},
		uploads: [
			{
				fileurl: {
					type: String
				},
				uploadedAt: {
					type: Date,
					default: Date.now()
				}
			}
		],
		leaves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Leave' }]
	},
	{ versionKey: false }
)

const Faculty = mongoose.model('Faculty', FacultySchema)

export default Faculty
