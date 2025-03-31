import mongoose from 'mongoose'

const LeavesSchema = new mongoose.Schema(
	{
		reason: {
			type: String
		},
		startdate: {
			type: String
		},
		enddate: {
			type: String
		},
		leavestatus: {
			type: String,
			enum: ['Approved', 'Canceled', 'Pending'],
			default: 'Pending'
		},
		proof: {
			type: String
		},
		appliedby: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Faculty'
		}
	},
	{ versionKey: false }
)

const Leave = mongoose.model('Leave', LeavesSchema)

export default Leave
