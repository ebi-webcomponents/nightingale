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

export const parseToRowData = (text: string): ArrayOfNumberArray =>
  text
    .split("\n")
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line): number[] => {
      const values = line.trim().split(" ");
      if (values.length === 5) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [n1, n2, _, __, p] = values;
        return [+n1, +n2, +p];
      }
      if (values.length === 3) {
        const [n1, n2, p] = values;
        return [+n1, +n2, +p];
      }
      throw new Error("The file is not valid");
    });

export const filterContacts = (
  data: ArrayOfNumberArray,
  minDistance: number,
  minProbability: number,
): ArrayOfNumberArray =>
  data.filter(([n1, n2, p]) => {
    return Math.abs(n1 - n2) >= minDistance && p > minProbability;
  });

export const parseLinksAssociative = (
  text: string,
  minDistance: number,
  minProbability: number,
): LinksObject => {
  const rawData = filterContacts(
    parseToRowData(text),
    minDistance,
    minProbability,
  );
  const n2set: NumberArray = {};
  const sets: ArrayOfNumberArray = [];
  rawData.forEach(([n1, n2]) => {
    if (!n2set[n1] && !n2set[n2]) {
      n2set[n1] = sets.length;
      n2set[n2] = sets.length;
      sets.push([n1, n2]);
    } else if (n2set[n1] && !n2set[n2]) {
      n2set[n2] = n2set[n1];
      sets[n2set[n1]].push(n2);
    } else if (!n2set[n1] && n2set[n2]) {
      n2set[n1] = n2set[n2];
      sets[n2set[n1]].push(n1);
    } else if (n2set[n1] && n2set[n2] && n2set[n1] !== n2set[n2]) {
      sets[n2set[n2]].forEach((n) => {
        sets[n2set[n1]].push(n);
        n2set[n] = n2set[n1];
      });
    }
  });
  return {
    contacts: sets
      .filter((_, i) => Object.values(n2set).includes(i))
      .map((s) => s.sort((x, y) => x - y)),
  };
};
export const parseLinks = (
  text: string,
  minDistance: number,
  minProbability: number,
): ContactObject => {
  const rawData = parseToRowData(text);
  return getContactsObject(
    filterContacts(rawData, minDistance, minProbability),
  );
};

export const getContactsObject = (
  contacts: ArrayOfNumberArray,
): ContactObject => {
  const contactsObj: Contacts = {};
  contacts.forEach(([n1, n2]) => {
    if (!contactsObj[n1]) contactsObj[n1] = new Set<number>();
    if (!contactsObj[n2]) contactsObj[n2] = new Set<number>();
    contactsObj[n1].add(n2);
    contactsObj[n2].add(n1);
  });
  return {
    contacts: contactsObj,
    maxNumberOfContacts: Math.max(
      ...Object.values(contactsObj).map((s) => s.size),
    ),
  };
};

export const contactObjectToLinkList = (
  contacts: Contacts,
): Array<ContactLink> => {
  const linkList: Array<ContactLink> = [];
  const keys: Set<string> = new Set();
  Object.entries(contacts).forEach(([n1, n2s]) => {
    n2s.forEach((n2: number) => {
      let key = `${n1}-${n2}`;
      let link = [+n1, +n2];
      if (+n1 > +n2) {
        key = `${n2}-${n1}`;
        link = [+n2, +n1];
      }
      if (!keys.has(key)) {
        keys.add(key);
        linkList.push(link);
      }
    });
  });
  return linkList;
};

export default parseLinks;
