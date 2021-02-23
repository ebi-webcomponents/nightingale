export type ArrayOfNumberArray = Array<Array<number>>;
export interface LinksObject {
  contacts: ArrayOfNumberArray;
}
export interface ContactObject {
  contacts: Contacts;
  maxNumberOfContacts: number;
  selected?: number;
  isHold?: boolean;
}

export interface NumberArray {
  [index: number]: number;
}

export interface Contacts {
  [contactPosition: number]: Set<number>;
}

export type LinksData = string | ContactObject;

export type ContactEntry = [number, Set<number>];

export type ContactLink = Array<number>;
