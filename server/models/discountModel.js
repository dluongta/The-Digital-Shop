import mongoose from 'mongoose';

const discountSchema = mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // ===============================================
    // THÊM TRƯỜNG NÀY ĐỂ THEO DÕI AI ĐÃ SỬ DỤNG MÃ
    // ===============================================
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

const Discount = mongoose.model('Discount', discountSchema);
export default Discount;