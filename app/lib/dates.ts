export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const todayIso = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
};

export const isValidIsoDate = (value: string) =>
  ISO_DATE.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());

export const yearOf = (isoDate: string) => Number(isoDate.slice(0, 4));