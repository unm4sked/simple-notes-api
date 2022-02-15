import { DateTime } from "luxon";
import { FullNote } from "../domain/interfaces/note";

export const markdownScheme = (note: FullNote) => `
#Note
## _${note.title}_

${splitWordsToLines(note.text)}

**created on:** *${DateTime.fromISO(note.createdAt).toFormat("yyyy LLL dd HH:mm:ss")}*\n
**note valid until:** *${DateTime.fromISO(note.expirationDate).toFormat("yyyy LLL dd HH:mm:ss")}*\n
`;

const splitWordsToLines = (text: string, chunk = 10) => {
  const arr = text.split(" ").filter((word) => word);
  let output = "";

  let i,
    j = 0;
  for (i = 0, j = arr.length; i < j; i += chunk) {
    const tmp = arr.slice(i, i + chunk);
    output += `> ${tmp.join(" ")} \n`;
  }

  return output;
};
