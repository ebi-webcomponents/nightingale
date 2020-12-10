type ArrayOfNumberArray = Array<Array<number>>;
interface LinksObject {
  contacts: ArrayOfNumberArray;
}
interface ContactObject {
  contacts: Contacts;
  maxNumberOfContacts: number;
}

interface NumberArray {
  [index: number]: number;
}

interface Contacts {
  [contactPosition: number]: Set<number>;
}

type LinksData = string | ContactObject;

type ContactEntry = [number, Set<number>];

type ContactLink = Array<number>;
