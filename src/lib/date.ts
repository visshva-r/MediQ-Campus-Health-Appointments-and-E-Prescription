export const fmtDateTime = (d: Date) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(d);
export const fmtTime = (d: Date) =>
  new Intl.DateTimeFormat("en-IN", { timeStyle: "short" }).format(d);
