// src/utils/dateUtils.js

export const calculateEndDate = (startDate, remainingWork, allocatedMembers) => {
    const totalHours = parseInt(remainingWork, 10);
  
    // Total daily allocated hours by all team members
    const totalDailyAllocatedHours = allocatedMembers.reduce((sum, member) => {
      return sum + (member.allocatedHours || 0);
    }, 0);
  
    if (totalDailyAllocatedHours === 0) {
      throw new Error('Total daily allocated hours cannot be zero.');
    }
  
    // Total days needed to complete the work
    const totalWorkDays = Math.ceil(totalHours / totalDailyAllocatedHours);
  
    let endDate = new Date(startDate);
    let daysAdded = 0;
  
    // Calculate the number of working days (excluding weekends)
    while (daysAdded < totalWorkDays) {
      if (endDate.getDay() !== 0 && endDate.getDay() !== 6) { // Excluding Sundays and Saturdays
        daysAdded++;
      }
      if (daysAdded < totalWorkDays) {
        endDate.setDate(endDate.getDate() + 1);
      }
    }
  
    return endDate;
  };
  