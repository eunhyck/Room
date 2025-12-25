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

let switchSequence = [];
let powerRestored = false;
let chipInserted = false;
let missingSwitchFound = false;

// 스위치 순서는 힌트를 통해서만 알아낼 수 있음
const correctSequence = ['red', 'blue', 'green'];

function initializeSurgery() {
  // reset state
  switchSequence = [];
  powerRestored = false;
  chipInserted = false;
  missingSwitchFound = false;
  // reset UI
  try {
    const scene = document.getElementById('scene-text');
    const message = document.getElementById('message');
    const choices = document.getElementById('choice-buttons');
    if (scene) scene.innerText = "차가운 수술실. 수술대, 뇌파 단말기, 그리고 꺼진 전원 스위치가 보입니다. 스위치 중 하나가 빠져있는 것 같습니다.";
    if (message) message.innerText = '';
    if (choices) choices.style.display = 'none';
  } catch (_) {
    // ignore if elements not yet present
  }
}

window.addEventListener('DOMContentLoaded', initializeSurgery);
// Handle back-forward cache restore to ensure fresh state
window.addEventListener('pageshow', (ev) => {
  if (ev.persisted) {
    initializeSurgery();
  }
});

// 빠진 스위치 찾기 함수
function inspect(target) {
  const scene = document.getElementById('scene-text');
  const message = document.getElementById('message');
  message.innerText = '';

  if (target === 'missingSwitch') {
    if (!missingSwitchFound) {
      scene.innerText = "바닥 구석에서 빠진 스위치를 발견했습니다! 이것은 전원 차단기의 일부인 것 같습니다.";
      message.innerText = "빠진 스위치를 발견했습니다!";
      addToImportantInventory('빠진 레버', 1); // 중요 아이템으로 추가
      addJournalEntry('바닥에서 빠진 스위치를 발견했다. 이것을 차단기에 다시 설치해야 할 것 같다.', 'clue');
      missingSwitchFound = true;
      
      // 실험자의 열쇠도 함께 발견할 수 있는 기회
      if (Math.random() < 0.4 && !hasInImportantInventory('실험자의 열쇠')) {
        setTimeout(() => {
          scene.innerText = "빠진 스위치를 발견했습니다! 그리고 그 옆에서 실험자들이 사용하는 열쇠도 발견했습니다.";
          message.innerText = "빠진 스위치와 실험자의 열쇠를 발견했습니다!";
          addToImportantInventory('실험자의 열쇠', 1);
          addJournalEntry('빠진 스위치와 함께 실험자들이 사용하는 마스터 열쇠를 발견했다. 이 열쇠로 실험 시설의 모든 문을 열 수 있을 것 같다.', 'clue');
        }, 1000);
      }
    } else {
      scene.innerText = "빠진 스위치는 이미 찾았습니다. 이제 전원 차단기에 설치할 수 있습니다.";
      message.innerText = "빠진 스위치는 이미 찾았습니다.";
    }
  }
}

function toggleSwitch(color) {
  if (!missingSwitchFound) {
    const message = document.getElementById('message');
    message.innerText = "빠진 스위치가 있어서 스위치를 누를 수 없습니다. 먼저 빠진 스위치를 찾아야 합니다.";
    return;
  }

  switchSequence.push(color);
  const message = document.getElementById('message');
  
  if (switchSequence.length === 3) {
    checkSwitchSequence();
  } else {
    message.innerText = `${color} 스위치를 눌렀습니다. (${switchSequence.length}/3)`;
  }
}

function checkSwitchSequence() {
  const message = document.getElementById('message');
  if (JSON.stringify(switchSequence) === JSON.stringify(correctSequence)) {
    powerRestored = true;
    message.innerText = "전원이 복구되었습니다! 단말기가 작동합니다.";
    addJournalEntry('올바른 순서로 스위치를 눌러 전원을 복구했다.', 'clue');
  } else {
    message.innerText = "스위치 순서가 틀렸습니다. 힌트를 다시 확인해보세요.";
    addJournalEntry('잘못된 순서로 스위치를 눌렀다. 힌트를 다시 확인해야겠다.', 'observation');
  }
  switchSequence = [];
}

function insertChip() {
  const message = document.getElementById('message');
  if (!powerRestored) {
    message.innerText = "전원이 꺼져 있어 칩을 삽입할 수 없습니다. 먼저 스위치를 올바른 순서로 눌러야 합니다.";
    return;
  }
  if (!chipInserted) {
    chipInserted = true;
    
    // 선택지 숨기기
    const options = document.getElementById('options');
    options.style.display = 'none';
    
    // 씬 텍스트 업데이트
    document.getElementById('scene-text').innerText =
      "단말기에 영상이 재생됩니다.\n\n[화면 속 당신은 다른 피실험자를 제압하고, 연구원에게 다가갑니다.]\n연구원: '그만둬! 넌 우리 모두를 죽이게 될 거야!'\n\n기억은 점점 더 선명해집니다...";
    
    // 선택 버튼 표시
    const choiceButtons = document.getElementById('choice-buttons');
    choiceButtons.style.display = 'block';
    
    message.innerText = '';
    
    // 데이터 칩 아이템 추가 (중요 아이템)
    if (!hasInImportantInventory('데이터 칩')) {
      addToImportantInventory('데이터 칩', 1);
      addJournalEntry('단말기에서 데이터 칩을 획득했다. 이제 기억을 확인할 수 있다.', 'clue');
    }
  } else {
    message.innerText = "영상이 이미 재생되었습니다.";
  }
}

function choose(decision) {
  const message = document.getElementById('message');
  if (decision === 'accept') {
    message.innerText = "당신은 이 기억이 진실임을 받아들입니다. 숨겨진 감정이 되살아납니다. (이동 중...)";
    addJournalEntry('기억을 받아들였다. 숨겨진 감정이 되살아나기 시작한다.', 'memory');
    setTimeout(() => {
      window.location.replace('../rooms4/observation.html?accept=1');
    }, 2000);
  } else {
    message.innerText = "당신은 이 기억이 조작되었다고 믿습니다. 진실은 다른 곳에 있습니다. (이동 중...)";
    addJournalEntry('기억을 거부했다. 진실은 다른 곳에 있을 것이다.', 'memory');
    setTimeout(() => {
      window.location.replace('../rooms4/observation.html?accept=0');
    }, 2000);
  }
}
