import { writeFileSync } from "node:fs";
import { buildInvoiceData } from "../lib/invoice-data.ts";
import { generateInvoicePdf } from "../lib/invoice-pdf.ts";

const row = {
  id: "543665ab-fb3d-4794-9c96-7dcd25deefc1",
  reference_id: "st_1792253655757",
  user_id: "32879ff8-0ef7-4c95-a5d4-dfa7b9081f5e",
  customer_name: "Álvaro Araújo",
  customer_name_snapshot: null,
  email: "alvaroaraujodxd@gmail.com",
  amount: 15,
  plan_type: "pro",
  status: "approved",
  provider: "stripe",
  stripe_id: null,
  stripe_customer_id: null,
  stripe_charge_id: null,
  stripe_invoice_id: null,
  stripe_subscription_id: "sub_1URaGnJpNL78U7iCK7dlMVAe",
  stripe_refund_id: null,
  refunded_amount: null,
  refunded_at: null,
  invoice_kind: "purchase",
  created_at: "2026-10-17T16:15:41.000Z",
  updated_at: "2026-10-19T13:27:52.000Z",
  paid_at: "2026-10-17T16:15:41.000Z",
  period_start: "2026-10-17T16:15:41.000Z",
  period_end: "2026-11-17T16:15:41.000Z",
  billing_period: "month",
  currency: "BRL",
  payment_method: null,
};
const license = {
  license_key: "VOLTRIS-PRO-257682-20261117-21E5A428FFBF67C4",
  plan_type: "pro",
  max_devices: 3,
  created_at: "2026-10-17T16:17:00.000Z",
  activated_at: "2026-10-17T16:17:00.000Z",
  expires_at: "2026-11-17T00:00:00+00:00",
  revoked: false,
  user_id: "32879ff8-0ef7-4c95-a5d4-dfa7b9081f5e",
  devicesInUse: 0,
  client_id: "257682",
};
const data = buildInvoiceData({ row, license });
console.log("planLabel:", data.planLabel, "| billingLabel:", data.billingLabel, "| billingPeriod:", data.billingPeriod, "| kindLabel:", data.productKindLabel);
const out = await generateInvoicePdf(data);
writeFileSync("scripts/_nova-fatura.pdf", out.bytes);
// versão sem object streams, só para inspeção/comparação
const { PDFDocument } = await import("pdf-lib");
const doc = await PDFDocument.load(out.bytes, { updateMetadata: false });
writeFileSync("scripts/_nova-plain.pdf", await doc.save({ useObjectStreams: false }));
console.log("PDF gerado:", out.bytes.length, "bytes |", out.fileName);
