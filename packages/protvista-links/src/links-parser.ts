const parseToRowData = (text: string, threshold: number): ArrayOfNumberArray =>
  text
    .split("\n")
    .slice(1)
    .map((line) => {
      const [n1, n2, _, __, p] = line.split(" ");
      return [+n1, +n2, +p];
    })
    .filter(([_, __, p]) => p > threshold);

export const parseLinksAssociative = (
  text: string,
  threshold: number
): LinksObject => {
  const rawData = parseToRowData(text, threshold);
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
export const parseLinks = (text: string, threshold: number): ContactObject => {
  const rawData = parseToRowData(text, threshold);
  const contacts: Contacts = {};
  rawData.forEach(([n1, n2]) => {
    if (!contacts[n1]) contacts[n1] = new Set<number>();
    if (!contacts[n2]) contacts[n2] = new Set<number>();
    contacts[n1].add(n2);
    contacts[n2].add(n1);
  });
  return {
    contacts,
  };
};

export const contactObjectToLinkList = (
  contacts: ContactObject
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
