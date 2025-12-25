  // 페이지 로드 시 초기화
  document.addEventListener('DOMContentLoaded', () => {
    // 일반 아이템만 초기화 (중요 아이템은 유지)
    if (window.inventory) {
      window.inventory.clearNormalInventory();
    }
    
    // 일지 초기화
    if (window.journal) {
      window.journal.clearJournal();
    }
  });

let powerOn = false;
// 고정된 4자리 비밀번호 (일관성 보장)
const ROOM2_CODE = "1234";
const d1 = 1;
const d2 = 2;
const d3 = 3;
const d4 = 4;
function getRoom2Hint() {
  const d = ROOM2_CODE.split('').map(n => parseInt(n, 10));
  const prodFirstLast = d[0] * d[3];
  const middleCompare = d[1] > d[2] ? '둘째가 셋째보다 큽니다' : (d[1] < d[2] ? '셋째가 둘째보다 큽니다' : '둘째와 셋째는 같습니다');
  return `힌트: 첫째×마지막=${prodFirstLast}, ${middleCompare}`;
}

function getRoom2Digits() {
  return [d1, d2, d3, d4];
}

function interact(target) {
  const scene = document.getElementById('scene-text');
  const message = document.getElementById('message');
  message.innerText = '';

  switch (target) {
    case 'breaker':
              if (!powerOn) {
          powerOn = true;
          scene.innerText = `차단기 레버 옆에 정비 점검표가 붙어 있다. 볼펜 자국으로 무언가가 덧그려져 있는 것 같다.`;
          if (!hasInInventory('정비 점검표')) {
            addToInventory('정비 점검표', 1);
            message.innerText = '차단기에서 정비 점검표를 얻었습니다.';
            // 일지에 아이템 획득 기록 추가
            addJournalEntry('전원 차단기에서 정비 점검표를 발견했다. 볼펜 자국으로 덧그려진 것이 있어 중요한 단서일 것 같다.', 'observation');
          }
      } else {
        scene.innerText = "이미 전원이 켜져 있습니다.";
      }
      break;

    case 'cctv':
      if (powerOn) {
        scene.innerText = `CCTV 화면이 깜빡이며 재생되고 있다. 화면 하단의 타임코드가 계속 변하고 있다.`;
        if (!hasInInventory('CCTV 녹화본')) {
          addToInventory('CCTV 녹화본', 1);
          message.innerText = 'CCTV에서 녹화본을 얻었습니다.';
          // 일지에 아이템 획득 기록 추가
          addJournalEntry('CCTV 모니터에서 녹화본을 발견했다. 타임코드가 계속 변하고 있어 누군가가 의도적으로 남긴 것 같다.', 'observation');
        }
      } else {
        scene.innerText = "모니터는 꺼져 있습니다. 전원이 필요합니다.";
      }
      break;

    case 'note':
      (function(){ 
        const [, , d3] = getRoom2Digits(); 
        scene.innerText = `구겨진 쪽지에는 숫자 하나가 세모로 표시되어 있다: ${d3}`;
        if (!hasInInventory('구겨진 쪽지')) {
          addToInventory('구겨진 쪽지', 1);
          message.innerText = '바닥에서 구겨진 쪽지를 얻었습니다.';
          // 일지에 아이템 획득 기록 추가
          addJournalEntry('바닥에서 구겨진 쪽지를 발견했다. 세모로 표시된 숫자가 있어 중요한 단서일 것 같다.', 'observation');
        }
      })();
      break;
    case 'random':
      // 무작위로 스위치 순서 힌트 아이템을 얻을 수 있음
      const randomChance = Math.random();
      if (randomChance < 0.25 && !hasInImportantInventory('스위치 순서 힌트')) {
        scene.innerText = "주변을 더 자세히 둘러보던 중 전원 차단기 옆에서 사용설명서를 발견했다. '스위치 순서: 빨강-파랑-초록'이라고 명시되어 있다.";
        addToImportantInventory('스위치 순서 힌트', 1);
        message.innerText = '스위치 순서 힌트를 발견했습니다!';
        addJournalEntry('주변을 더 자세히 둘러보던 중 전원 차단기 사용설명서에서 스위치 순서에 대한 중요한 힌트를 발견했다.', 'clue');
      } else if (randomChance < 0.5 && !hasInInventory('잠금장치 조각')) {
        // 네 번째 숫자 힌트 제공
        const [, , , d4] = getRoom2Digits();
        scene.innerText = `주변을 더 자세히 둘러보던 중 바닥에서 작은 잠금장치 조각을 발견했다. 표면에 흠집이 있어 보인다.`;
        addToInventory('잠금장치 조각', 1);
        message.innerText = '잠금장치 조각을 발견했습니다!';
        addJournalEntry('주변을 더 자세히 둘러보던 중 바닥에서 잠금장치 조각을 발견했다. 표면의 흠집에서 중요한 단서를 찾을 수 있을 것 같다.', 'clue');
      } else if (randomChance < 0.75 && !hasInImportantInventory('실험자의 열쇠')) {
        // 실험자의 열쇠 추가 기회
        scene.innerText = "주변을 더 자세히 둘러보던 중 CCTV 모니터 뒤에서 실험자들이 사용하는 열쇠를 발견했다. 이 열쇠는 실험 시설의 모든 문을 열 수 있는 마스터 키인 것 같다.";
        addToImportantInventory('실험자의 열쇠', 1);
        message.innerText = '실험자의 열쇠를 발견했습니다! 이것은 매우 중요한 아이템입니다.';
        addJournalEntry('CCTV 모니터 뒤에서 실험자들이 사용하는 마스터 열쇠를 발견했다. 이 열쇠로 실험 시설의 모든 문을 열 수 있을 것 같다.', 'clue');
      } else {
        scene.innerText = "주변을 더 자세히 둘러보았지만 특별한 것은 발견하지 못했다. 다른 곳을 더 자세히 살펴보는 것이 좋겠다.";
        message.innerText = '특별한 것을 발견하지 못했습니다.';
        addJournalEntry('주변을 더 자세히 둘러보았지만 특별한 것을 발견하지 못했다.', 'observation');
      }
      break;
  }
}

function showCodeInput() {
  const codeInput = document.getElementById('code-input');
  const options = document.getElementById('options');
  
  // 비밀번호 입력 UI 표시, 선택지 숨김
  codeInput.style.display = 'block';
  options.style.display = 'none';
  
  // 씬 텍스트 업데이트
  document.getElementById('scene-text').innerText = '수술실로 향하는 문 앞에 서 있다. 문에는 4자리 비밀번호 자물쇠가 달려 있다. 비밀번호를 입력해야 문을 열 수 있을 것 같다.';
  document.getElementById('message').innerText = '비밀번호를 입력하세요.';
}

function submitCode() {
  const code = document.getElementById('code').value;
  const message = document.getElementById('message');

  if (code === ROOM2_CODE) {
    message.innerText = "문이 열립니다. 어두운 복도를 따라, 당신은 다음 구역으로 발걸음을 옮깁니다...";
    // 일지에 성공 기록 추가
    addJournalEntry('로비의 문을 열었다. 이제 수술실로 향하는 복도로 들어갈 수 있다. 점점 더 깊은 곳으로 들어가는 것 같다.', 'observation');
    setTimeout(() => {
      window.location.href = '../rooms3/surgery.html';
    }, 2000);
  } else {
    message.innerText = `코드가 맞지 않습니다.`;
  }
}

function cancelCodeInput() {
  const codeInput = document.getElementById('code-input');
  const options = document.getElementById('options');
  const codeField = document.getElementById('code');
  
  // 비밀번호 입력 UI 숨김, 선택지 표시
  codeInput.style.display = 'none';
  options.style.display = 'grid';
  
  // 입력 필드 초기화
  codeField.value = '';
  
  // 씬 텍스트와 메시지 복원
  document.getElementById('scene-text').innerText = '로비에 도착했습니다. 전원이 꺼져 있어 어둡고, CCTV 모니터만 깜빡이고 있습니다.';
  document.getElementById('message').innerText = '';
} 