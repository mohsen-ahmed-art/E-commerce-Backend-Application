import { Schema, Model, model } from "mongoose";
import { IWishlistItem } from "./wishlist.interface";

const wishlistSchema: Schema<IWishlistItem> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

/* ======= Return virtuals when using JSON/Object ======= */
wishlistSchema.set("toJSON", { virtuals: true });
wishlistSchema.set("toObject", { virtuals: true });

/* ======= Auto-populate product data ======= */
function autoPopulateProduct(this: any, next: Function) {
  if (this.getOptions && this.getOptions().autoPopulate === false) {
    return next();
  }

  // Prevent double-population
  try {
    if (typeof this.populated === "function" && this.populated("product")) {
      return next();
    }
  } catch (_) {}

  this.populate({
    path: "product",
    // OPTIONAL: include only specific product fields
    // select: "name price images shopId"
  });

  next();
}

wishlistSchema.pre(/^find/, autoPopulateProduct);
wishlistSchema.pre("findOne", autoPopulateProduct);
// wishlistSchema.pre("findById", autoPopulateProduct);

const Wishlist: Model<IWishlistItem> = model<IWishlistItem>(
  "Wishlist",
  wishlistSchema
);

export default Wishlist;
