import { z } from 'zod';

export const CategoryFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subCategoryId: z.string().optional(),
  quantity: z.string().min(1, 'Quantity is required'),
  minimumBudget: z.string().optional(),
  productType: z.string().optional(),
  budgetRange: z.string().optional(), // Added for budget range field
  // budget:z.coerce.number().refine((value)=> value >= 0, { message: "Budget must be greater than 0" }),

  oldProductValue: z
    .object({
      min: z.string().optional(),
      max: z.string().optional(),
    })
    .optional(),

  productCondition: z.string().optional(),
  image: z.string().optional(),
  document: z.string().optional(),
  description: z.string().min(1, 'Description is required'),

  paymentAndDelivery: z.object({
    ex_deliveryDate: z.date().optional(),
    paymentMode: z.string().optional(),
    gstNumber: z.string().optional(),
    organizationName: z.string().optional(),
    organizationAddress: z.string().optional(),
  }),

  draft: z.boolean().optional(),
  gst_requirement: z.string().optional(),

  brand: z.string().optional(),
  additionalDeliveryAndPackage: z.string().optional(),
  gender: z.string().optional(),
  typeOfAccessories: z.string().optional(),
  fuelType: z.string().optional(),
  model: z.string().optional(),
  color: z.string().optional(),
  transmission: z.string().optional(),
  conditionOfProduct: z.string().optional(),
  constructionToolType: z.string().optional(),
  toolType: z.string().optional(),
  rateAService: z.string().optional(),
  brandName: z.string().optional(),
  typeOfVehicle: z.string().optional(),
  typeOfProduct: z.string().optional(),
});

export const ProfileSchema = z.object({
  // UI collects one Full Name field; split into firstName/lastName before
  // submit so the backend contract (separate fields) is unchanged.
  fullName: z.string().min(1, 'Full Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  address: z.string().min(1, 'Address is required').min(3, 'Address is too short'),
  accountRole: z.string().optional(),
  organizationName: z.string().optional(),
  procurementRole: z.string().optional(),
  gstin: z.string().optional(),
  supplierCategories: z.string().optional(),
  businessName: z.string().optional(),
  // Supplier "Organisation Details" fields
  roleInCompany: z.string().optional(),
  website: z.string().optional(),
  businessDescription: z.string().optional(),
  accomplishments: z.string().optional(),
  topProblemsSolved: z.string().optional(),
  industriesServed: z.string().optional(),
  certifications: z.string().optional(),
  businessSince: z.string().optional(),
  businessPhone: z.string().optional(),
  storeAddress: z.string().optional(),
});

export const productOverviewBidSchema = z.object({
  // Single-product mode uses this field; multi-product mode uses items[].unitPrice
  // (validated manually at submit). Allow empty for multi mode, but reject
  // non-numeric / non-positive values instead of accepting anything (was z.any()).
  unitPrice: z
    .union([z.literal(''), z.coerce.number().positive('Unit price must be greater than 0')])
    .optional(),
  freightCost: z.coerce.number().min(0).optional(),
  
  earliestDeliveryDate: z
    .union([z.coerce.date(), z.undefined()]) // it can be date or undefined
    .refine(value => value !== undefined, {
      message: 'Delivery Timeline is required',
    }),
  sellerType: z.string().optional(),
  taxes: z.string().optional(), // We'll parse this as a percentage in the UI
  buyerNote: z.string().optional(),
  freightTerms: z.string().optional(),
  location: z.string().optional(),
  paymentTerms: z.string().optional(),
  priceBasis: z.string().optional(),
});
