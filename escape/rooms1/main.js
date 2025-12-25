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

const ROOM1_CODE = "5678";
function getRoom1Hint() {
  const d = ROOM1_CODE.split('').map(n => parseInt(n, 10));
  const sum = d.reduce((a, b) => a + b, 0);
  const lastParity = d[3] % 2 === 0 ? '짝수' : '홀수';
  return `힌트: 첫째 자리는 ${d[0]}, 자릿수 합은 ${sum}, 마지막 자리는 ${lastParity}`;
}

function getRoom1Digits() {
  return ROOM1_CODE.split('');
}

function inspect(target) {
  const scene = document.getElementById('scene-text');
  const message = document.getElementById('message');
  message.innerText = '';

  switch (target) {
    case 'chart':
      // 힌트 선택지: 비밀번호의 첫 번째 숫자 보여주기
      (function(){ 
        const [d1] = getRoom1Digits(); 
        scene.innerText = `차트 구석에 흐릿한 표식이 보인다: '${d1}'. 이것이 무엇을 뜻하는 걸까?`;
        message.innerText = '차트에서 첫 번째 숫자 단서를 발견했습니다.';
        addToInventory('차트 조각', 1);
        addJournalEntry('차트에서 숫자 단서가 적힌 조각을 발견했다. 자세히 살펴보면 더 많은 정보를 얻을 수 있을 것 같다.', 'observation');
      })();
      break;
    case 'wall':
      // 힌트 선택지: 비밀번호의 두 번째 숫자 보여주기
      (function(){ 
        const [, d2] = getRoom1Digits(); 
        scene.innerText = `벽 낙서 사이에 동그라미로 강조된 숫자 하나가 있다: ${d2}`;
        message.innerText = '벽에서 두 번째 숫자 단서를 발견했습니다.';
        addToInventory('벽 낙서 조각', 1);
        addJournalEntry('벽의 낙서에서 동그라미로 강조된 숫자가 있는 조각을 발견했다. 다른 낙서들과는 다른 필체다.', 'observation');
      })();
      break;
    case 'memo':
      // 힌트 선택지: 비밀번호의 세 번째 숫자 보여주기
      (function(){ 
        const [, , d3] = getRoom1Digits(); 
        scene.innerText = `메모의 문장 끝마다 밑줄이 쳐져 있다. 마지막 밑줄 옆에 작은 숫자 '${d3}'가 적혀 있다.`;
        message.innerText = '바닥에서 세 번째 숫자 단서를 발견했습니다.';
        addToInventory('메모 조각', 1);
        addJournalEntry('바닥의 메모에서 문장 끝에 밑줄과 숫자가 있는 조각을 발견했다. 누군가가 급하게 쓴 것 같다.', 'observation');
      })();
      break;
    case 'sticker':
      // 힌트 선택지: 비밀번호의 네 번째 숫자 보여주기
      (function(){ 
        const [, , , d4] = getRoom1Digits(); 
        scene.innerText = `스티커를 자세히 보니 닳아 지워진 부분이 많지만, 숫자 '${d4}'만은 또렷하게 보인다.`;
        message.innerText = '스티커에서 네 번째 숫자 단서를 발견했습니다.';
        addToInventory('스티커 조각', 1);
        addJournalEntry('침대에 붙은 스티커에서 숫자 단서를 발견했다. 오랫동안 붙어있었던 것 같다.', 'observation');
      })();
      break;
    case 'random':
      // 무작위로 스위치 순서 힌트 아이템을 얻을 수 있음
      const randomChance = Math.random();
      if (randomChance < 0.3 && !hasInImportantInventory('스위치 순서 힌트')) {
        scene.innerText = "주변을 더 자세히 둘러보던 중 벽 구석에서 작은 메모지를 발견했다. '빨강-파랑-초록 순서로 스위치를 누르면 전원이 복구된다'고 적혀 있다.";
        addToImportantInventory('스위치 순서 힌트', 1);
        message.innerText = '스위치 순서 힌트를 발견했습니다!';
        addJournalEntry('주변을 더 자세히 둘러보던 중 벽 구석에서 스위치 순서에 대한 중요한 힌트를 발견했다.', 'clue');
      } else if (randomChance < 0.6 && !hasInImportantInventory('실험자의 열쇠')) {
        // 실험자의 열쇠 힌트 추가
        scene.innerText = "주변을 더 자세히 둘러보던 중 바닥에서 실험자들이 사용하는 열쇠를 발견했다. 이 열쇠는 실험 시설의 모든 문을 열 수 있는 마스터 키인 것 같다.";
        addToImportantInventory('실험자의 열쇠', 1);
        message.innerText = '실험자의 열쇠를 발견했습니다! 이것은 매우 중요한 아이템입니다.';
        addJournalEntry('바닥에서 실험자들이 사용하는 마스터 열쇠를 발견했다. 이 열쇠로 실험 시설의 모든 문을 열 수 있을 것 같다.', 'clue');
      } else {
        scene.innerText = "주변을 더 자세히 둘러보았지만 특별한 것은 발견하지 못했다. 다른 곳을 더 자세히 살펴보는 것이 좋겠다.";
        message.innerText = '특별한 것을 발견하지 못했습니다.';
        addJournalEntry('주변을 더 자세히 둘러보았지만 특별한 것은 발견하지 못했다.', 'observation');
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
    document.getElementById('scene-text').innerText = '낡은 병실의 문 앞에 서 있다. 문에는 4자리 비밀번호 자물쇠가 달려 있다. 비밀번호를 입력해야 문을 열 수 있을 것 같다.';
    document.getElementById('message').innerText = '비밀번호를 입력하세요.';
  }
  
  function submitCode() {
    const code = document.getElementById('code').value;
    const message = document.getElementById('message');
  
    if (code === ROOM1_CODE) {
      message.innerText = "딸깍— 자물쇠가 열렸습니다. 문이 열리고 로비로 이동합니다...";
      // 일지에 성공 기록 추가
      addJournalEntry('낡은 병실의 문을 열었다. 이제 로비로 나갈 수 있다.', 'clue');
      setTimeout(() => {
        window.location.href = '../rooms2/lobby.html';
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
    document.getElementById('scene-text').innerText = '낡은 병실에 갇혀있다. 주변을 둘러보니 차트, 벽 낙서, 메모, 스티커 등이 보인다. 이곳을 빠져나가기 위한 단서를 찾아보자.';
    document.getElementById('message').innerText = '';
  }


