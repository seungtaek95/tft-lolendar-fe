import { useEffect, useState } from "react";

import Calendar from "../Calendar/Calendar";
import { getMonthlyMatchStat } from "../api/match-stat/match-stat-api";
import { getSumPlaytimeText } from "../util/StatUtil";

const now = new Date();

function SummonerStat({summonerName, lastFetchedAt}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [monthlySumPlaytime, setMonthlySumPlaytime] = useState(0);
  const [dailyMatchStatByDayOfMonth, setDailyMatchStatByDayOfMonth] = useState(null);

  useEffect(() => {
    async function fetchMonthlyStat() {
      const monthlyMatchStat = await getMonthlyMatchStat(summonerName, year, month + 1);

      setIsLoading(false);
      setMonthlySumPlaytime(
        monthlyMatchStat.dailyMatchStats.reduce((acc, dailyMatchStat) => acc += dailyMatchStat.playtimeInSeconds, 0)
      );
      setDailyMatchStatByDayOfMonth(
        monthlyMatchStat.dailyMatchStats.reduce((dailyMatchStatByDayOfMonth, dailyMatchStat) => {
          dailyMatchStatByDayOfMonth[dailyMatchStat.dayOfMonth] = dailyMatchStat;
          return dailyMatchStatByDayOfMonth;
        }, {})
      );
    }

    if (lastFetchedAt) {
      setIsLoading(true);
      fetchMonthlyStat()
        .catch(e => {
          console.error(e);
          setIsLoading(false);
          setIsFailed(true);
        });
    } else {
      setIsLoading(false);
    }
  }, [lastFetchedAt, year, month]);

  const onClickPrev = () => {
    now.setMonth(now.getMonth() - 1);
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setIsLoading(true);
    setDailyMatchStatByDayOfMonth(null);
  }

  const onClickNext = () => {
    now.setMonth(now.getMonth() + 1);
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setIsLoading(true);
    setDailyMatchStatByDayOfMonth(null);
  }

  if (isLoading || isFailed) {
    return (
      <div>
        {isLoading && <div>Loading...</div>}
        {isFailed && <div>통계정보를 가져오는데 실패했습니다ㅠ</div>}
      </div>
    )
  }

  return (
    <div>
      {!lastFetchedAt && <div>통계정보가 없는 소환사입니다!</div>}
      {lastFetchedAt && (
        <div>
          <div>이달의 날려버린 시간: {getSumPlaytimeText(monthlySumPlaytime)}</div>
          <Calendar
            year={year}
            month={month}
            onClickPrev={onClickPrev}
            onClickNext={onClickNext}
            dailyMatchStatByDayOfMonth={dailyMatchStatByDayOfMonth} />
        </div>
      )}
    </div>
  );
}

export default SummonerStat;
