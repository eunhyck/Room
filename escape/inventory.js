// 인벤토리 시스템
class Inventory {
  constructor() {
    this.items = {}; // 일반 아이템은 세션별로 관리
    this.importantItems = {}; // 중요 아이템은 로컬스토리지에서 로드
    this.isMinimized = false;
    this.loadImportantItems(); // 중요 아이템 로드
    this.init();
  }

  // 중요 아이템 로드 (로컬스토리지에서)
  loadImportantItems() {
    try {
      const saved = localStorage.getItem('escapeGameImportantItems');
      if (saved) {
        this.importantItems = JSON.parse(saved);
      }
    } catch (e) {
      console.log('중요 아이템 로드 실패:', e);
      this.importantItems = {};
    }
  }

  // 중요 아이템 저장 (로컬스토리지에)
  saveImportantItems() {
    try {
      localStorage.setItem('escapeGameImportantItems', JSON.stringify(this.importantItems));
    } catch (e) {
      console.log('중요 아이템 저장 실패:', e);
    }
  }


  // 중요 아이템 추가 (중요보관함에 저장)
  addImportantItem(itemName, count = 1) {
    if (this.importantItems[itemName]) {
      this.importantItems[itemName] += count;
    } else {
      this.importantItems[itemName] = count;
    }
    this.saveImportantItems(); // 로컬스토리지에 저장
    this.render();
  }

  // 일반 아이템 추가 (일반 보관함에 저장)
  addItem(itemName, count = 1) {
    if (this.items[itemName]) {
      this.items[itemName] += count;
    } else {
      this.items[itemName] = count;
    }
    this.render();
  }

  // 아이템 제거 (일반 보관함에서)
  removeItem(itemName, count = 1) {
    if (this.items[itemName]) {
      this.items[itemName] -= count;
      if (this.items[itemName] <= 0) {
        delete this.items[itemName];
      }
      this.render();
      return true;
    }
    return false;
  }

  // 중요 아이템 제거 (중요보관함에서)
  removeImportantItem(itemName, count = 1) {
    if (this.importantItems[itemName]) {
      this.importantItems[itemName] -= count;
      if (this.importantItems[itemName] <= 0) {
        delete this.importantItems[itemName];
      }
      this.saveImportantItems(); // 로컬스토리지에 저장
      this.render();
      return true;
    }
    return false;
  }

  // 아이템 확인 (일반 보관함에서)
  hasItem(itemName, count = 1) {
    return this.items[itemName] && this.items[itemName] >= count;
  }

  // 중요 아이템 확인 (중요보관함에서)
  hasImportantItem(itemName, count = 1) {
    return this.importantItems[itemName] && this.importantItems[itemName] >= count;
  }

  // 아이템 개수 확인 (일반 보관함에서)
  getItemCount(itemName) {
    return this.items[itemName] || 0;
  }

  // 중요 아이템 개수 확인 (중요보관함에서)
  getImportantItemCount(itemName) {
    return this.importantItems[itemName] || 0;
  }

  // 인벤토리 초기화
  clearInventory() {
    this.items = {};
    this.importantItems = {};
    this.render();
  }

  // 일반 아이템만 초기화 (중요 아이템은 유지)
  clearNormalInventory() {
    this.items = {};
    this.loadImportantItems(); // 중요 아이템 다시 로드
    this.render();
  }

  // 인벤토리 HTML 생성
  createInventoryHTML() {
    const container = document.createElement('div');
    container.className = 'inventory-container';
    container.id = 'inventory-container';

    const header = document.createElement('div');
    header.className = 'inventory-header';

    const title = document.createElement('div');
    title.className = 'inventory-title';
    title.textContent = '가방';

    const toggle = document.createElement('button');
    toggle.className = 'inventory-toggle';
    toggle.textContent = '−';
    toggle.onclick = () => this.toggleMinimize();

    header.appendChild(title);
    header.appendChild(toggle);

    const content = document.createElement('div');
    content.className = 'inventory-content';
    content.id = 'inventory-content';

    container.appendChild(header);
    container.appendChild(content);

    return container;
  }

  // 인벤토리 렌더링
  render() {
    const content = document.getElementById('inventory-content');
    if (!content) return;

    content.innerHTML = '';

    // 중요보관함 섹션
    const importantSection = document.createElement('div');
    importantSection.className = 'important-section';
    importantSection.innerHTML = `
      <div class="section-header">
        <span class="section-icon">🔒</span>
        <span class="section-title">중요보관함</span>
      </div>
    `;

    const importantItemsContainer = document.createElement('div');
    importantItemsContainer.className = 'important-items-container';

    const importantItemNames = Object.keys(this.importantItems);
    
    if (importantItemNames.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'important-empty';
      emptyMsg.innerHTML = `
        <div style="font-size: 14px; opacity: 0.7;">중요 아이템이 없습니다</div>
      `;
      importantItemsContainer.appendChild(emptyMsg);
    } else {
      importantItemNames.forEach((itemName, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'important-inventory-item';
        itemDiv.style.animationDelay = `${index * 0.1}s`;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'important-item-name';
        nameSpan.textContent = itemName;

        const countSpan = document.createElement('span');
        countSpan.className = 'important-item-count';
        countSpan.textContent = this.importantItems[itemName];

        // 중요 아이템 클릭 시 상세 정보 표시 (스위치 순서 힌트와 데이터 칩은 useItem 함수 호출)
        if (itemName === '스위치 순서 힌트' || itemName === '데이터 칩') {
          itemDiv.onclick = () => this.useItem(itemName);
        } else {
          itemDiv.onclick = () => this.showImportantItemInfo(itemName);
        }

        itemDiv.appendChild(nameSpan);
        itemDiv.appendChild(countSpan);
        importantItemsContainer.appendChild(itemDiv);
      });
    }

    importantSection.appendChild(importantItemsContainer);

    // 일반 보관함 섹션
    const normalSection = document.createElement('div');
    normalSection.className = 'normal-section';
    normalSection.innerHTML = `
      <div class="section-header">
        <span class="section-icon">📦</span>
        <span class="section-title">일반 보관함</span>
      </div>
    `;

    const normalItemsContainer = document.createElement('div');
    normalItemsContainer.className = 'normal-items-container';

    const itemNames = Object.keys(this.items);
    
    if (itemNames.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'inventory-empty';
      emptyMsg.innerHTML = `
        <div style="font-size: 32px; margin-bottom: 10px; opacity: 0.5;">📦</div>
        <div>일반 보관함이 비어있습니다</div>
        <div style="font-size: 12px; margin-top: 5px; opacity: 0.7;">아이템을 수집해보세요!</div>
      `;
      normalItemsContainer.appendChild(emptyMsg);
    } else {
      itemNames.forEach((itemName, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.style.animationDelay = `${index * 0.1}s`;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'item-name';
        nameSpan.textContent = itemName;

        const countSpan = document.createElement('span');
        countSpan.className = 'item-count';
        countSpan.textContent = this.items[itemName];

        // 일반 아이템 클릭 시 상세 정보 표시
        itemDiv.onclick = () => this.useItem(itemName);

        itemDiv.appendChild(nameSpan);
        itemDiv.appendChild(countSpan);
        normalItemsContainer.appendChild(itemDiv);
      });
    }

    normalSection.appendChild(normalItemsContainer);

    // 섹션들을 content에 추가
    content.appendChild(importantSection);
    content.appendChild(normalSection);
  }

  // 아이템 사용
  useItem(itemName) {
    // 특정 아이템들의 사용 효과
    switch(itemName) {
      case '일지':
        this.showItemInfo(itemName, '당신의 기억과 관찰을 기록한 일지입니다. 스토리 진행에 따라 중요한 힌트가 될 수 있습니다.');
        break;
      case '차트 조각':
        this.inspectChartPiece();
        break;
      case '벽 낙서 조각':
        this.inspectWallGraffiti();
        break;
      case '메모 조각':
        this.inspectMemoPiece();
        break;
      case '스티커 조각':
        this.inspectStickerPiece();
        break;
      case '정비 점검표':
        this.inspectMaintenanceReport();
        break;
      case 'CCTV 녹화본':
        this.inspectCCTVFootage();
        break;
      case '구겨진 쪽지':
        this.inspectCrumpledNote();
        break;
      case '서랍 열쇠':
        this.inspectDrawerKey();
        break;
      case '잠금장치 조각':
        this.inspectLockPiece();
        break;
      case '스위치 순서 힌트':
        this.inspectSwitchOrderHint();
        break;
             case '데이터 칩':
         this.useDataChip();
         break;
      case '빨간 스위치 조각':
        this.inspectRedSwitch();
        break;
      case '파란 스위치 조각':
        this.inspectBlueSwitch();
        break;
      case '초록 스위치 조각':
        this.inspectGreenSwitch();
        break;
      case '빠진 레버':
        this.inspectMissingLever();
        break;
      case '빨간 스위치':
        this.inspectRedSwitchFull();
        break;
      case '파란 스위치':
        this.inspectBlueSwitchFull();
        break;
      case '초록 스위치':
        this.inspectGreenSwitchFull();
        break;
      default:
        this.showItemInfo(itemName, '이 아이템에 대한 정보가 없습니다.');
    }
  }

  // 차트 조각 조사
  inspectChartPiece() {
    const [d1] = this.getRoom1Digits();
    const message = `차트를 자세히 살펴보니 환자의 혈압 기록에서 특이한 패턴이 보인다. 
    숫자 '${d1}'이 반복적으로 나타나고 있다. 이것이 비밀번호의 첫 번째 숫자인 것 같다.`;
    
    this.showItemInfo('차트 조각', message);
    if (window.addJournalEntry) {
      window.addJournalEntry(`차트 조각을 분석했다. 혈압 기록에서 숫자 '${d1}'의 패턴을 발견했다. 이것이 첫 번째 단서일 것이다.`, 'clue');
    }
  }

  // 벽 낙서 조각 조사
  inspectWallGraffiti() {
    const [, d2] = this.getRoom1Digits();
    const message = `벽의 낙서를 자세히 보니 동그라미로 강조된 숫자 '${d2}'가 있다. 
    주변의 낙서들과는 다른 필체로 보인다. 누군가 의도적으로 남긴 것 같다.`;
    
    this.showItemInfo('벽 낙서 조각', message);
    if (window.addJournalEntry) {
      window.addJournalEntry(`벽 낙서 조각을 분석했다. 동그라미로 강조된 숫자 '${d2}'를 발견했다. 두 번째 단서다.`, 'clue');
    }
  }

  // 메모 조각 조사
  inspectMemoPiece() {
    const [, , d3] = this.getRoom1Digits();
    const message = `메모의 문장 끝마다 밑줄이 쳐져 있다. 마지막 밑줄 옆에 작은 숫자 '${d3}'가 적혀 있다. 
    이 메모는 누군가가 급하게 쓴 것 같다.`;
    
    this.showItemInfo('메모 조각', message);
    if (window.addJournalEntry) {
      window.addJournalEntry(`메모 조각을 분석했다. 문장 끝의 밑줄 옆에 숫자 '${d3}'를 발견했다. 세 번째 단서다.`, 'clue');
    }
  }

  // 스티커 조각 조사
  inspectStickerPiece() {
    const [, , , d4] = this.getRoom1Digits();
    const message = `스티커를 자세히 보니 닳아 지워진 부분이 많지만, 숫자 '${d4}'만은 또렷하게 보인다. 
    이 스티커는 오랫동안 붙어있었던 것 같다.`;
    
    this.showItemInfo('스티커 조각', message);
    if (window.addJournalEntry) {
      window.addJournalEntry(`스티커 조각을 분석했다. 닳아 지워진 스티커에서 숫자 '${d4}'를 발견했다. 마지막 단서다.`, 'clue');
    }
  }

  // 정비 점검표 조사
  inspectMaintenanceReport() {
    // room2의 첫 번째 숫자 힌트 제공
    const [d1] = this.getRoom2Digits();
    const message = `정비 점검표를 자세히 보니 볼펜 자국으로 '${d1}'이 두 번 덧그려져 있다. 
    정비원이 의도적으로 남긴 것 같다. 이것이 비밀번호의 첫 번째 숫자인 것 같다.`;
    
    this.showItemInfo('정비 점검표', message);
    if (window.addJournalEntry) {
      window.addJournalEntry(`정비 점검표를 분석했다. 볼펜 자국으로 덧그려진 숫자 '${d1}'을 발견했다. 이것이 첫 번째 단서다.`, 'clue');
    }
  }

  // CCTV 녹화본 조사
  inspectCCTVFootage() {
    // room2의 두 번째 숫자 힌트 제공
    const [, d2] = this.getRoom2Digits();
    const message = `CCTV 영상을 자세히 보니 화면 하단의 타임코드가 깜빡인다. 
    ... 00:0${d2}:** ... 마치 누군가 일부러 남긴 듯하다. 이것이 비밀번호의 두 번째 숫자인 것 같다.`;
    
    this.showItemInfo('CCTV 녹화본', message);
    if (window.addJournalEntry) {
      window.addJournalEntry(`CCTV 녹화본을 분석했다. 타임코드에서 숫자 '${d2}'를 발견했다. 이것이 두 번째 단서다.`, 'clue');
    }
  }

  // 구겨진 쪽지 조사
  inspectCrumpledNote() {
    // room2의 세 번째 숫자 힌트 제공
    const [, , d3] = this.getRoom2Digits();
    const message = `구겨진 쪽지를 펴서 보니 숫자 하나가 세모로 표시되어 있다: ${d3}. 
    누군가가 급하게 쓴 것 같다. 이것이 비밀번호의 세 번째 숫자인 것 같다.`;
    
    this.showItemInfo('구겨진 쪽지', message);
    if (window.addJournalEntry) {
      window.addJournalEntry(`구겨진 쪽지를 분석했다. 세모로 표시된 숫자 '${d3}'을 발견했다. 이것이 세 번째 단서다.`, 'clue');
    }
  }

  // 서랍 열쇠 조사
  inspectDrawerKey() {
    const message = `서랍 열쇠를 자세히 보니 특별한 모양의 열쇠다. 
    열쇠 손잡이 부분에 작은 숫자가 새겨져 있다. 이 열쇠로 특정 서랍을 열 수 있을 것 같다.`;
    
    this.showItemInfo('서랍 열쇠', message);
    if (window.addJournalEntry) {
      window.addJournalEntry('서랍 열쇠를 확인했다. 열쇠 손잡이에 새겨진 숫자에서 중요한 단서를 발견했다.', 'clue');
    }
  }

  // 잠금장치 조각 조사
  inspectLockPiece() {
    // room2의 네 번째 숫자 힌트 제공
    const [, , , d4] = this.getRoom2Digits();
    const message = `잠금장치 조각을 자세히 보니 표면에 작은 흠집이 있다. 
    각인처럼 보이는 '${d4}'이 눈에 밟힌다. 이것이 비밀번호의 마지막 숫자인 것 같다.`;
    
    this.showItemInfo('잠금장치 조각', message);
    if (window.addJournalEntry) {
      window.addJournalEntry(`잠금장치 조각을 분석했다. 흠집 사이로 보이는 숫자 '${d4}'을 발견했다. 이것이 마지막 단서다.`, 'clue');
    }
  }

  // 스위치 순서 힌트 조사
  inspectSwitchOrderHint() {
    const message = `스위치 순서 힌트를 자세히 보니 전원 시스템의 작동 순서가 적혀 있다. 
    '빨강-파랑-초록' 순서로 스위치를 누르면 전원이 복구된다고 명시되어 있다. 
    이 순서를 정확히 따라야만 시스템이 정상 작동할 것 같다.`;
    
    this.showItemInfo('스위치 순서 힌트', message);
    if (window.addJournalEntry) {
      window.addJournalEntry('스위치 순서 힌트를 확인했다. "빨강-파랑-초록" 순서로 스위치를 눌러야 한다는 중요한 정보를 발견했다.', 'clue');
    }
  }

  // 데이터 칩 조사
  inspectDataChip() {
    const message = `데이터 칩을 자세히 보니 수술실의 기억 데이터가 담겨 있다. 
    칩의 일부가 손상되어 있지만, 복구 가능한 상태다. 이 칩을 단말기에 삽입하면 기억이 되살아날 것 같다.`;
    
    this.showItemInfo('데이터 칩', message);
    if (window.addJournalEntry) {
      window.addJournalEntry('데이터 칩을 확인했다. 수술실의 기억 데이터가 담겨 있고, 단말기에 삽입하면 기억이 복구될 것 같다.', 'memory');
    }
  }

  // 빨간 스위치 조각 조사
  inspectRedSwitch() {
    const message = `빨간 스위치 조각을 보니 전원 스위치의 일부다. 
    스위치 위에 "1"이라는 숫자가 새겨져 있다. 이것이 첫 번째 순서인 것 같다.`;
    
    this.showItemInfo('빨간 스위치 조각', message);
    if (window.addJournalEntry) {
      window.addJournalEntry('빨간 스위치 조각을 확인했다. 스위치 위에 "1"이라는 숫자가 새겨져 있어 첫 번째 순서임을 알 수 있다.', 'clue');
    }
  }

  // 파란 스위치 조각 조사
  inspectBlueSwitch() {
    const message = `파란 스위치 조각을 보니 전원 스위치의 일부다. 
    스위치 위에 "2"라는 숫자가 새겨져 있다. 이것이 두 번째 순서인 것 같다.`;
    
    this.showItemInfo('파란 스위치 조각', message);
    if (window.addJournalEntry) {
      window.addJournalEntry('파란 스위치 조각을 확인했다. 스위치 위에 "2"라는 숫자가 새겨져 있어 두 번째 순서임을 알 수 있다.', 'clue');
    }
  }

  // 초록 스위치 조각 조사
  inspectGreenSwitch() {
    const message = `초록 스위치 조각을 보니 전원 스위치의 일부다. 
    스위치 위에 "3"이라는 숫자가 새겨져 있다. 이것이 세 번째 순서인 것 같다.`;
    
    this.showItemInfo('초록 스위치 조각', message);
    if (window.addJournalEntry) {
      window.addJournalEntry('초록 스위치 조각을 확인했다. 스위치 위에 "3"이라는 숫자가 새겨져 있어 세 번째 순서임을 알 수 있다.', 'clue');
    }
  }

  // 첫 번째 방의 숫자들 가져오기
  getRoom1Digits() {
    // main.js의 ROOM1_CODE와 일치하도록 고정된 값 반환
    return [5, 6, 7, 8];
  }

  // 두 번째 방의 숫자들 가져오기 (정비 점검표 힌트용)
  getRoom2Digits() {
    // lobby.js의 ROOM2_CODE와 일치하도록 고정된 값 반환
    return [1, 2, 3, 4];
  }

  // 빠진 레버 조사
  inspectMissingLever() {
    const message = `빠진 레버를 자세히 보니 전원 차단기의 일부다. 
    레버 손잡이 부분에 "전원 복구용"이라는 라벨이 붙어 있다. 
    이 레버를 차단기에 다시 설치하면 전원이 복구될 것 같다.`;
    
    this.showItemInfo('빠진 레버', message);
    if (window.addJournalEntry) {
      window.addJournalEntry('빠진 레버를 확인했다. 전원 차단기에 다시 설치하면 전원이 복구될 것 같다.', 'clue');
    }
  }

  // 완전한 빨간 스위치 조사
  inspectRedSwitchFull() {
    const message = `완전한 빨간 스위치를 보니 수술실의 전원 스위치다. 
    스위치 위에 "1"이라는 숫자가 명확하게 새겨져 있고, 
    "비상 전원"이라는 라벨이 붙어 있다. 이것이 첫 번째 순서인 것 같다.`;
    
    this.showItemInfo('빨간 스위치', message);
    if (window.addJournalEntry) {
      window.addJournalEntry('빨간 스위치를 확인했다. "비상 전원" 라벨이 붙어 있고 첫 번째 순서임을 알 수 있다.', 'clue');
    }
  }

  // 완전한 파란 스위치 조사
  inspectBlueSwitchFull() {
    const message = `완전한 파란 스위치를 보니 수술실의 전원 스위치다. 
    스위치 위에 "2"라는 숫자가 명확하게 새겨져 있고, 
    "일반 전원"이라는 라벨이 붙어 있다. 이것이 두 번째 순서인 것 같다.`;
    
    this.showItemInfo('파란 스위치', message);
    if (window.addJournalEntry) {
      window.addJournalEntry('파란 스위치를 확인했다. "일반 전원" 라벨이 붙어 있고 두 번째 순서임을 알 수 있다.', 'clue');
    }
  }

  // 완전한 초록 스위치 조사
  inspectGreenSwitchFull() {
    const message = `완전한 초록 스위치를 보니 수술실의 전원 스위치다. 
    스위치 위에 "3"이라는 숫자가 명확하게 새겨져 있고, 
    "보조 전원"이라는 라벨이 붙어 있다. 이것이 세 번째 순서인 것 같다.`;
    
    this.showItemInfo('초록 스위치', message);
    if (window.addJournalEntry) {
      window.addJournalEntry('초록 스위치를 확인했다. "보조 전원" 라벨이 붙어 있고 세 번째 순서임을 알 수 있다.', 'clue');
    }
  }

  // 아이템 정보 표시
  showItemInfo(itemName, description) {
    // 기존 정보창이 있다면 제거
    const existingInfo = document.getElementById('item-info');
    if (existingInfo) {
      existingInfo.remove();
    }

    const infoDiv = document.createElement('div');
    infoDiv.id = 'item-info';
    infoDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2000;
      max-width: 400px;
      text-align: center;
      animation: fadeInScale 0.3s ease-out;
    `;

    // 아이템별 아이콘
          const getItemIcon = (itemName) => {
        const icons = {
          '일지': '📖',
          '차트 조각': '📊',
          '벽 낙서 조각': '🎨',
          '메모 조각': '📝',
          '스티커 조각': '🏷️',
          '정비 점검표': '📋',
          'CCTV 녹화본': '📹',
          '구겨진 쪽지': '📄',
          '잠금장치 조각': '🔒',
          '서랍 열쇠': '🗝️',
          '스위치 순서 힌트': '🔢',
          '데이터 칩': '💾',
          '빨간 스위치 조각': '🔴',
          '파란 스위치 조각': '🔵',
          '초록 스위치 조각': '🟢',
          '빠진 레버': '⚡',
          '빨간 스위치': '🔴',
          '파란 스위치': '🔵',
          '초록 스위치': '🟢'
        };
        return icons[itemName] || '📦';
      };

    infoDiv.innerHTML = `
      <div style="
        background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid rgba(74, 158, 255, 0.4);
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(15px);
      ">
        <div style="font-size: 48px; margin-bottom: 15px;">${getItemIcon(itemName)}</div>
        <h3 style="
          color: #4a9eff;
          font-size: 20px;
          margin: 0 0 15px 0;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        ">${itemName}</h3>
        <p style="
          color: #e8f4fd;
          font-size: 16px;
          line-height: 1.6;
          margin: 0 0 25px 0;
          opacity: 0.9;
        ">${description}</p>
        <button onclick="this.closest('#item-info').remove()" style="
          background: linear-gradient(135deg, #4a9eff 0%, #2980b9 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">닫기</button>
      </div>
    `;

    // 호버 효과 추가
    const closeBtn = infoDiv.querySelector('button');
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.transform = 'translateY(-2px)';
      closeBtn.style.boxShadow = '0 5px 15px rgba(74, 158, 255, 0.3)';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.transform = 'translateY(0)';
      closeBtn.style.boxShadow = 'none';
    });

    document.body.appendChild(infoDiv);

    // 배경 클릭으로 닫기 (제거 - 자동 닫기 방지)
    // infoDiv.addEventListener('click', (e) => {
    //   if (e.target === infoDiv) {
    //     infoDiv.remove();
    //   }
    // });

    // 자동으로 닫기 제거 (닫기 버튼으로만 닫기)
    // setTimeout(() => {
    //   if (infoDiv.parentElement) {
    //     infoDiv.style.animation = 'fadeOutScale 0.3s ease-in';
    //     setTimeout(() => {
    //       if (infoDiv.parentElement) {
    //         infoDiv.remove();
    //       }
    //     }, 300);
    //   }
    // }, 5000);
  }

  // 중요 아이템 정보 표시
  showImportantItemInfo(itemName) {
    // 기존 정보창이 있다면 제거
    const existingInfo = document.getElementById('item-info');
    if (existingInfo) {
      existingInfo.remove();
    }

    const infoDiv = document.createElement('div');
    infoDiv.id = 'item-info';
    infoDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2000;
      max-width: 400px;
      text-align: center;
      animation: fadeInScale 0.3s ease-out;
    `;

          // 중요 아이템별 상세 정보
      const getImportantItemInfo = (itemName) => {
        const info = {
          '빠진 레버': '전원 차단기에 빠진 중요한 부품입니다. 이것을 설치해야만 스위치를 사용할 수 있습니다.',
          '데이터 칩': '단말기에서 추출한 중요한 데이터가 담긴 칩입니다. 기억을 복원하는 데 사용할 수 있습니다.',
          '서랍 열쇠': '서랍을 열 수 있는 열쇠입니다. 중요한 단서가 있을 것 같습니다.',
          '빠진 스위치': '전원 시스템에 빠진 스위치입니다. 이것을 찾아야만 전원을 복구할 수 있습니다.',
          '스위치 순서 힌트': '전원 시스템의 스위치를 누르는 순서에 대한 중요한 힌트입니다. 이 순서를 따라야만 전원이 복구됩니다.'
        };
        return info[itemName] || '이 중요 아이템에 대한 정보가 없습니다.';
      };

          // 중요 아이템별 아이콘
      const getImportantItemIcon = (itemName) => {
        const icons = {
          '빠진 레버': '⚡',
          '데이터 칩': '💾',
          '서랍 열쇠': '🗝️',
          '빠진 스위치': '🔌',
          '스위치 순서 힌트': '🔢'
        };
        return icons[itemName] || '🔒';
      };

    // 사용 가능한 아이템인지 확인
    const canUseItem = (itemName) => {
      return ['빠진 레버', '데이터 칩'].includes(itemName);
    };

    const useButton = canUseItem(itemName) ? `
      <button onclick="useImportantItem('${itemName}')" style="
        background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-right: 10px;
      ">사용하기</button>
    ` : '';

    infoDiv.innerHTML = `
      <div style="
        background: linear-gradient(145deg, #2d1b69 0%, #1a103f 100%);
        border: 2px solid rgba(255, 193, 7, 0.4);
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(15px);
      ">
        <div style="font-size: 48px; margin-bottom: 15px;">${getImportantItemIcon(itemName)}</div>
        <h3 style="
          color: #ffc107;
          font-size: 20px;
          margin: 0 0 15px 0;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        ">${itemName}</h3>
        <p style="
          color: #e8f4fd;
          font-size: 16px;
          line-height: 1.6;
          margin: 0 0 25px 0;
          opacity: 0.9;
        ">${getImportantItemInfo(itemName)}</p>
        <div style="display: flex; justify-content: center; gap: 10px;">
          ${useButton}
          <button onclick="this.closest('#item-info').remove()" style="
            background: linear-gradient(135deg, #666 0%, #444 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          ">닫기</button>
        </div>
      </div>
    `;

    // 호버 효과 추가
    const buttons = infoDiv.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
        btn.style.boxShadow = '0 5px 15px rgba(255, 193, 7, 0.3)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = 'none';
      });
    });

    document.body.appendChild(infoDiv);
  }

  // 중요 아이템 사용
  useImportantItem(itemName) {
    switch(itemName) {
      case '빠진 레버':
        this.useMissingLever();
        break;
      case '데이터 칩':
        this.useDataChip();
        break;
      default:
        console.log(`${itemName} 아이템을 사용할 수 없습니다.`);
    }
  }

  // 빠진 레버 사용
  useMissingLever() {
    // 정보창 닫기
    const infoDiv = document.getElementById('item-info');
    if (infoDiv) {
      infoDiv.remove();
    }
    
    // 사용 성공 메시지
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      z-index: 3000;
      animation: slideInRight 0.3s ease-out;
    `;
    message.textContent = '빠진 레버를 사용했습니다! 이제 스위치를 사용할 수 있습니다.';
    
    document.body.appendChild(message);
    
    // 3초 후 자동으로 제거
    setTimeout(() => {
      if (message.parentElement) {
        message.remove();
      }
    }, 3000);
    
    // 빠진 레버 사용 후 제거
    this.removeImportantItem('빠진 레버', 1);
    
    // 일지에 기록 추가
    if (window.addJournalEntry) {
      window.addJournalEntry('빠진 레버를 사용했다. 이제 전원 차단기가 정상 작동할 것이다.', 'clue');
    }
  }

  // 데이터 칩 사용
  useDataChip() {
    // 정보창 닫기
    const infoDiv = document.getElementById('item-info');
    if (infoDiv) {
      infoDiv.remove();
    }
    
    // 수술실에서만 사용 가능
    if (window.location.pathname.includes('surgery.html')) {
      // 선택지 숨기기
      const options = document.getElementById('options');
      if (options) {
        options.style.display = 'none';
      }
      
      // 선택 버튼 표시
      const choiceButtons = document.getElementById('choice-buttons');
      if (choiceButtons) {
        choiceButtons.style.display = 'block';
      }
      
      // 씬 텍스트 업데이트
      const sceneText = document.getElementById('scene-text');
      if (sceneText) {
        sceneText.innerText = "단말기에 영상이 재생됩니다.\n\n[화면 속 당신은 다른 피실험자를 제압하고, 연구원에게 다가갑니다.]\n연구원: '그만둬! 넌 우리 모두를 죽이게 될 거야!'\n\n기억은 점점 더 선명해집니다...";
      }
      
      // 메시지 초기화
      const message = document.getElementById('message');
      if (message) {
        message.innerText = '';
      }
      
      // 데이터 칩 사용 후 제거
      this.removeImportantItem('데이터 칩', 1);
      
      // 일지에 기록 추가
      if (window.addJournalEntry) {
        window.addJournalEntry('데이터 칩을 사용했다. 단말기에서 기억이 재생되기 시작한다.', 'memory');
      }
    } else {
      // 다른 방에서는 일반적인 사용 메시지
      const message = document.createElement('div');
      message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
      `;
      message.textContent = '데이터 칩을 사용했습니다!';
      
      document.body.appendChild(message);
      
      setTimeout(() => {
        if (message.parentElement) {
          message.remove();
        }
      }, 3000);
    }
  }

  // 최소화/최대화 토글
  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    const container = document.getElementById('inventory-container');
    const toggle = container.querySelector('.inventory-toggle');
    
    if (this.isMinimized) {
      container.classList.add('inventory-minimized');
      toggle.textContent = '+';
    } else {
      container.classList.remove('inventory-minimized');
      toggle.textContent = '−';
    }
  }

  // 인벤토리 초기화
  init() {
    // 기존 인벤토리가 있다면 제거
    const existing = document.getElementById('inventory-container');
    if (existing) {
      existing.remove();
    }

    // 사이드바에 인벤토리 추가
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      const inventoryHTML = this.createInventoryHTML();
      sidebar.appendChild(inventoryHTML);
      this.render();
    } else {
      // 사이드바가 없으면 body에 추가 (fallback)
      const inventoryHTML = this.createInventoryHTML();
      document.body.appendChild(inventoryHTML);
      this.render();
    }
  }
}

// 전역 인벤토리 인스턴스 생성
let inventory;

// 페이지 로드 시 인벤토리 초기화
document.addEventListener('DOMContentLoaded', () => {
  inventory = new Inventory();
});

// 전역 함수로 인벤토리 접근 가능하게 설정
window.addToInventory = (itemName, count) => {
  if (inventory) inventory.addItem(itemName, count);
};

window.addToImportantInventory = (itemName, count) => {
  if (inventory) inventory.addImportantItem(itemName, count);
};

window.removeFromInventory = (itemName, count) => {
  if (inventory) return inventory.removeItem(itemName, count);
  return false;
};

window.removeFromImportantInventory = (itemName, count) => {
  if (inventory) return inventory.removeImportantItem(itemName, count);
  return false;
};

window.hasInInventory = (itemName, count) => {
  if (inventory) return inventory.hasItem(itemName, count);
  return false;
};

window.hasInImportantInventory = (itemName, count) => {
  if (inventory) return inventory.hasImportantItem(itemName, count);
  return false;
};

window.getInventoryCount = (itemName) => {
  if (inventory) return inventory.getItemCount(itemName);
  return 0;
};

window.getImportantInventoryCount = (itemName) => {
  if (inventory) return inventory.getImportantItemCount(itemName);
  return 0;
};

window.clearInventory = () => {
  if (inventory) inventory.clearInventory();
};

window.clearNormalInventory = () => {
  if (inventory) inventory.clearNormalInventory();
};

window.useImportantItem = (itemName) => {
  if (inventory) inventory.useImportantItem(itemName);
};
