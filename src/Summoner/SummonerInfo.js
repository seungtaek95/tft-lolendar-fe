import './SummonerInfo.css';

import { renew } from "../api/summoner/summoner-api";
import { getLastRenewedAtText } from "../util/StatUtil";

function SummonerInfo({ summonerView }) {
  const onClickRenew = () => {
    renew(summonerView.summonerNo)
      .then(res => {
        switch (res.matchRenewResultStatus) {
          case 'QUEUED':
            alert("매치 갱신 큐에 등록되었습니다. 1시간까지 걸릴 수 있습니다.");
            return window.location.reload();
          case 'ALREADY_PROCESSING':
            return alert("이미 갱신 큐에 등록되어있습니다. 기다려주세요.");
          case 'RECENTLY_RENEWED':
            return alert("최근에 갱신을 시도하였습니다. 잠시 후 다시 시도해주세요.");
          default:
            return alert("알 수 없는 문제가 발생했습니다.");
        }
      })
      .catch(e => {
        alert("갱신에 실패하였습니다.");
      });
  }

  return (
    <div className="summoner_info_container">
      <img className="summoner_info_profile_icon_img" src={`http://ddragon.leagueoflegends.com/cdn/13.3.1/img/profileicon/${summonerView.profileIconId}.png`} alt="profile_icon" />
      <div className="summoner_info_name_renew_container">
        <div className="summoner_info_name_text">
          {summonerView.name}
        </div>
        <div>
          {summonerView.isRenewProcessing
              ? <button className="disabled_renew_button">통계 갱신중</button>
              : <button className="renew_button" onClick={onClickRenew}>통계 갱신</button>}
          {summonerView.lastManualRenewedAt && `마지막 갱신: ${getLastRenewedAtText(summonerView.lastManualRenewedAt)}`}
        </div>
      </div>
    </div>
  )
}

export default SummonerInfo;
