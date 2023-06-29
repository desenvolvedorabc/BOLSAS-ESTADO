export function getAnos() {
  const list = [];
  for (let i = 0; i <= 30; i++) {
    list.push(2000 + i);
  }
  return list;
}

export function getRecentYears() {
  const date = new Date();

  return [date.getFullYear() - 1, date.getFullYear(), date.getFullYear() + 1];
}

export function getMonths() {
  return [
    { number: 1, name: 'Janeiro' },
    { number: 2, name: 'Fevereiro' },
    { number: 3, name: 'Março' },
    { number: 4, name: 'Abril' },
    { number: 5, name: 'Maio' },
    { number: 6, name: 'Junho' },
    { number: 7, name: 'Julho' },
    { number: 8, name: 'Agosto' },
    { number: 9, name: 'Setembro' },
    { number: 10, name: 'Outubro' },
    { number: 11, name: 'Novembro' },
    { number: 12, name: 'Dezembro' },
  ];
}

export function getMonthsName(number) {
  const findMonth = getMonths().find((m) => m.number === number);

  if (findMonth) return findMonth.name;

  return null;
}
