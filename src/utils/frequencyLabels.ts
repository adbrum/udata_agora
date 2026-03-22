export const frequencyLabelsMap: Record<string, string> = {
  unknown: "Desconhecida",
  punctual: "Pontual",
  continuous: "Contínua",
  hourly: "Horária",
  fourTimesADay: "4 vezes ao dia",
  threeTimesADay: "3 vezes ao dia",
  semidaily: "Semidiária",
  daily: "Diária",
  fourTimesAWeek: "4 vezes por semana",
  threeTimesAWeek: "3 vezes por semana",
  semiweekly: "Bissemanal",
  weekly: "Semanal",
  biweekly: "Quinzenal",
  threeTimesAMonth: "3 vezes por mês",
  semimonthly: "Bimensal",
  monthly: "Mensal",
  bimonthly: "Bimestral",
  quarterly: "Trimestral",
  threeTimesAYear: "3 vezes por ano",
  semiannual: "Semestral",
  annual: "Anual",
  biennial: "Bienal",
  triennial: "Trienal",
  quinquennial: "Quinquenal",
  irregular: "Irregular",
};

export function getFrequencyLabel(id: string, fallbackLabel: string): string {
  return frequencyLabelsMap[id] || fallbackLabel;
}
