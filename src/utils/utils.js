export const calculateRemainingPills = (medication) => {
    const { totalPerBox, pillsWeek, lastRefillDate } = medication;

    const weeklyConsumption = Object.values(pillsWeek).reduce((sum, pills) => sum + pills, 0);
    const daysSinceLastRefill = Math.floor(
      (new Date() - new Date(lastRefillDate)) / (1000 * 60 * 60 * 24)
    );

    const weeksElapsed = Math.floor(daysSinceLastRefill / 7);
    const daysRemaining = daysSinceLastRefill % 7;

    let pillsConsumed = weeksElapsed * weeklyConsumption;

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for (let i = 0; i < daysRemaining; i++) {
      pillsConsumed += pillsWeek[days[i]] || 0;
    }

    return Math.max(0, totalPerBox - pillsConsumed);
  };

