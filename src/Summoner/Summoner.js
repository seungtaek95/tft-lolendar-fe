import './Summoner.css';

import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { searchSummoner } from "../api/summoner/summoner-api";
import Header from "../Header/Header";
import SummonerInfo from "./SummonerInfo";
import SummonerStat from "./SummonerStat";
import Footer from '../Footer/Footer';

function Summoner() {  
  const { summonerName } = useParams();
  const [summonerView, setSummonerView] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isFailed, setIsFailed] = useState(false);

  // 소환사 이름으로 소환사 정보 조회
  useEffect(() => {
    async function fetchSummoner() {
      const summonerView = await searchSummoner(summonerName);
      setIsLoading(false);
      setSummonerView(summonerView);
    }

    fetchSummoner()
      .catch(e => {
        console.error(e);
        setIsLoading(false);
        setIsFailed(true);
      });
  }, [summonerName]);

  return (
    <div className="summoner">
      <Header />
      <div className="summoner_container">
        {isLoading && (
          <div>Loading...</div>
        )}
        {isFailed && (
          <div>
            <p>소환사 정보를 가져오는데 실패했습니다ㅠ</p>
            <p>{summonerName}</p>
          </div>
        )}
        {!isLoading && !isFailed && (
          <>
            <SummonerInfo summonerView={summonerView} />
            <SummonerStat summonerView={summonerView} />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Summoner;
