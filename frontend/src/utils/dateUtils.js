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
  let endDate = new Date(startDate); // Inicia com a data de início
  let daysAdded = 0;

  while (daysAdded < totalWorkDays) {
    // Incrementa a data enquanto não atingir o número total de dias de trabalho
    endDate.setDate(endDate.getDate() + 1);

    // Verifica se a data calculada não é um sábado (6) ou domingo (0)
    if (endDate.getDay() !== 0 && endDate.getDay() !== 6) {
      daysAdded++;
    }
  }

  return endDate;
};
