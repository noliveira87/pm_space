// src/utils/dateUtils.js

export const calculateEndDate = (startDate, remainingWork, allocatedMembers) => {
  const totalHours = parseInt(remainingWork, 10);
  const totalDailyAllocatedHours = allocatedMembers.reduce((sum, member) => {
    return sum + member.allocations.reduce((dailySum, allocation) => dailySum + (allocation.allocated_hours || 0), 0);
  }, 0);

  if (totalDailyAllocatedHours === 0) {
    throw new Error('Total daily allocated hours cannot be zero.');
  }

  const totalWorkDays = Math.ceil(totalHours / totalDailyAllocatedHours);
  let end_date = new Date(startDate); // Inicializa endDate com startDate
  let daysAdded = 0;

  while (daysAdded < totalWorkDays) {
    // Verifica se a data não é sábado (6) nem domingo (0)
    if (end_date.getDay() !== 0 && end_date.getDay() !== 6) {
      daysAdded++;
    }
    if (daysAdded < totalWorkDays) {
      end_date.setDate(end_date.getDate() + 1);
    }
  }

  return end_date;
};
