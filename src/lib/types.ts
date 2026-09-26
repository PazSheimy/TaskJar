import type { PayType } from "@/lib/format";

export type Profile = {
  id: string;
  name: string;
  zip: string | null;
  bio: string | null;
  created_at: string;
};

export type NeedStatus = "open" | "taken" | "done" | "cancelled";

export type Need = {
  id: string;
  owner_id: string;
  title: string;
  category: string;
  description: string;
  zip: string;
  area: string | null;
  pay_type: PayType;
  pay_amount: number | null;
  when_text: string | null;
  status: NeedStatus;
  helper_id: string | null;
  created_at: string;
};

export type NeedWithOwner = Need & {
  owner: Pick<Profile, "id" | "name" | "zip"> | null;
  helper?: Pick<Profile, "id" | "name"> | null;
};

export type Offer = {
  id: string;
  owner_id: string;
  headline: string;
  categories: string[];
  description: string;
  rate_text: string | null;
  zips: string[];
  availability: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type OfferWithOwner = Offer & {
  owner: Pick<Profile, "id" | "name" | "zip" | "bio"> | null;
};

export type ResponseStatus = "pending" | "picked" | "declined";

export type ResponseRow = {
  id: string;
  need_id: string;
  helper_id: string;
  message: string;
  status: ResponseStatus;
  created_at: string;
  helper?: Pick<Profile, "id" | "name" | "zip"> | null;
  need?: Pick<Need, "id" | "title" | "status"> | null;
};

export type Thread = {
  id: string;
  need_id: string | null;
  a_id: string;
  b_id: string;
  last_message_at: string;
  created_at: string;
};

export type ThreadListRow = Thread & {
  a: Pick<Profile, "id" | "name"> | null;
  b: Pick<Profile, "id" | "name"> | null;
  need: Pick<Need, "id" | "title"> | null;
  messages: Pick<Message, "body" | "created_at">[];
};

export type Message = {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};
