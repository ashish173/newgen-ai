import { z } from 'zod';

export const LeadSchema = z.object({
  customerName: z.string().min(1),
  contactPhone: z.string().min(3),
  contactEmail: z.string().email().optional().nullable(),
  address: z.string().optional().nullable(),
  requirements: z.string().optional().nullable(),
});

export const QuoteItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
});

export const QuotationSchema = z.object({
  leadId: z.number().int(),
  items: z.array(QuoteItemSchema).min(1),
});

export const PaymentFlagSchema = z.object({
  leadId: z.number().int(),
  quotationId: z.number().int().optional(),
  flag: z.enum(['NONE', 'PENDING', 'PARTIAL', 'PAID']),
  note: z.string().optional(),
  amount: z.number().optional(),
});

export const SiteVisitSchema = z.object({
  leadId: z.number().int(),
  plannedFor: z.string(),
  assignedTeamId: z.number().int(),
  dueDate: z.string(),
});

export const SurveyUploadSchema = z.object({
  siteVisitId: z.number().int(),
  dueDate: z.string(),
});

export const ProductionAdvanceSchema = z.object({
  productionOrderId: z.number().int(),
  nextStage: z.enum(['BACK_OFFICE', 'FACTORY', 'DISPATCH']),
});

export const InstallationTaskSchema = z.object({
  productionOrderId: z.number().int(),
  assignedTeamId: z.number().int(),
});

export const InstallationCompleteSchema = z.object({
  taskId: z.number().int(),
});
