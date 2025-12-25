// 힌트 아이템 가방 시스템
class HintInventory {
  constructor() {
    this.items = {}; // 로컬스토리지 대신 빈 객체로 시작
    this.isMinimized = false;
    this.init();
  }

  // 힌트 아이템 추가
  addHintItem(itemName, count = 1) {
    if (this.items[itemName]) {
      this.items[itemName] += count;
    } else {
      this.items[itemName] = count;
    }
    this.render(); // 로컬스토리지 저장 제거
  }

  // 힌트 아이템 제거
  removeHintItem(itemName, count = 1) {
    if (this.items[itemName]) {
      this.items[itemName] -= count;
      if (this.items[itemName] <= 0) {
        delete this.items[itemName];
      }
      this.render(); // 로컬스토리지 저장 제거
      return true;
    }
    return false;
  }

  // 힌트 아이템 확인
  hasHintItem(itemName, count = 1) {
    return this.items[itemName] && this.items[itemName] >= count;
  }

  // 힌트 아이템 개수 확인
  getHintItemCount(itemName) {
    return this.items[itemName] || 0;
  }

  // 힌트 인벤토리 초기화
  clearHintInventory() {
    this.items = {};
    this.render(); // 로컬스토리지 저장 제거
  }

  // 힌트 인벤토리 HTML 생성
  createHintInventoryHTML() {
    const container = document.createElement('div');
    container.className = 'hint-inventory-container';
    container.id = 'hint-inventory-container';

    const header = document.createElement('div');
    header.className = 'hint-inventory-header';

    const title = document.createElement('div');
    title.className = 'hint-inventory-title';
    title.textContent = '힌트 가방';

    const toggle = document.createElement('button');
    toggle.className = 'hint-inventory-toggle';
    toggle.textContent = '−';
    toggle.onclick = () => this.toggleMinimize();

    header.appendChild(title);
    header.appendChild(toggle);

    const content = document.createElement('div');
    content.className = 'hint-inventory-content';
    content.id = 'hint-inventory-content';

    container.appendChild(header);
    container.appendChild(content);

    return container;
  }

  // 힌트 인벤토리 렌더링
  render() {
    const content = document.getElementById('hint-inventory-content');
    if (!content) return;

    content.innerHTML = '';

    const itemNames = Object.keys(this.items);
    
    if (itemNames.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'hint-inventory-empty';
      emptyMsg.innerHTML = `
        <div style="font-size: 32px; margin-bottom: 10px; opacity: 0.5;">💡</div>
        <div>힌트 가방이 비어있습니다</div>
        <div style="font-size: 12px; margin-top: 5px; opacity: 0.7;">힌트 아이템을 수집해보세요!</div>
      `;
      content.appendChild(emptyMsg);
      return;
    }

    itemNames.forEach((itemName, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'hint-inventory-item';
      itemDiv.style.animationDelay = `${index * 0.1}s`;

      // 힌트 아이템별 아이콘
      const getHintItemIcon = (itemName) => {
        const icons = {
          '스위치 순서 힌트': '🔢',
          '전원 패턴 힌트': '⚡',
          '색상 순서 힌트': '🎨',
          '기계 작동 힌트': '⚙️',
          '비밀번호 힌트': '🔐',
          '방향 힌트': '🧭',
          '시간 힌트': '⏰',
          '패턴 힌트': '📊'
        };
        return icons[itemName] || '💡';
      };

      const iconSpan = document.createElement('span');
      iconSpan.textContent = getHintItemIcon(itemName);
      iconSpan.style.cssText = `
        font-size: 18px;
        margin-right: 10px;
        opacity: 0.8;
      `;

      const nameSpan = document.createElement('span');
      nameSpan.className = 'hint-item-name';
      nameSpan.textContent = itemName;

      const countSpan = document.createElement('span');
      countSpan.className = 'hint-item-count';
      countSpan.textContent = this.items[itemName];

      // 힌트 아이템 클릭 시 상세 정보 표시
      itemDiv.onclick = () => this.showHintItemInfo(itemName);

      itemDiv.appendChild(iconSpan);
      itemDiv.appendChild(nameSpan);
      itemDiv.appendChild(countSpan);
      content.appendChild(itemDiv);
    });
  }

  // 힌트 아이템 정보 표시
  showHintItemInfo(itemName) {
    // 기존 정보창이 있다면 제거
    const existingInfo = document.getElementById('hint-item-info');
    if (existingInfo) {
      existingInfo.remove();
    }

    const infoDiv = document.createElement('div');
    infoDiv.id = 'hint-item-info';
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

    // 힌트 아이템별 상세 정보
    const getHintItemInfo = (itemName) => {
      const info = {
        '스위치 순서 힌트': '스위치를 누르는 순서에 대한 중요한 힌트입니다. 이 순서를 따라야만 전원이 복구됩니다.',
        '전원 패턴 힌트': '전원 시스템의 작동 패턴을 알려주는 힌트입니다.',
        '색상 순서 힌트': '색상별 스위치의 올바른 순서를 알려주는 힌트입니다.',
        '기계 작동 힌트': '기계가 작동하는 방식에 대한 힌트입니다.',
        '비밀번호 힌트': '비밀번호를 찾는 데 도움이 되는 힌트입니다.',
        '방향 힌트': '올바른 방향을 찾는 데 도움이 되는 힌트입니다.',
        '시간 힌트': '시간과 관련된 퍼즐을 푸는 힌트입니다.',
        '패턴 힌트': '숨겨진 패턴을 찾는 데 도움이 되는 힌트입니다.'
      };
      return info[itemName] || '이 힌트 아이템에 대한 정보가 없습니다.';
    };

    const getHintItemIcon = (itemName) => {
      const icons = {
        '스위치 순서 힌트': '🔢',
        '전원 패턴 힌트': '⚡',
        '색상 순서 힌트': '🎨',
        '기계 작동 힌트': '⚙️',
        '비밀번호 힌트': '🔐',
        '방향 힌트': '🧭',
        '시간 힌트': '⏰',
        '패턴 힌트': '📊'
      };
      return icons[itemName] || '💡';
    };

    infoDiv.innerHTML = `
      <div style="
        background: linear-gradient(145deg, #2d1b69 0%, #1a103f 100%);
        border: 2px solid rgba(255, 193, 7, 0.4);
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(15px);
      ">
        <div style="font-size: 48px; margin-bottom: 15px;">${getHintItemIcon(itemName)}</div>
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
        ">${getHintItemInfo(itemName)}</p>
        <button onclick="this.closest('#hint-item-info').remove()" style="
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
        ">닫기</button>
      </div>
    `;

    // 호버 효과 추가
    const closeBtn = infoDiv.querySelector('button');
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.transform = 'translateY(-2px)';
      closeBtn.style.boxShadow = '0 5px 15px rgba(255, 193, 7, 0.3)';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.transform = 'translateY(0)';
      closeBtn.style.boxShadow = 'none';
    });

    document.body.appendChild(infoDiv);
  }

  // 최소화/최대화 토글
  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    const container = document.getElementById('hint-inventory-container');
    const toggle = container.querySelector('.hint-inventory-toggle');
    
    if (this.isMinimized) {
      container.classList.add('hint-inventory-minimized');
      toggle.textContent = '+';
    } else {
      container.classList.remove('hint-inventory-minimized');
      toggle.textContent = '−';
    }
  }

  // 힌트 인벤토리 초기화
  init() {
    // 기존 힌트 인벤토리가 있다면 제거
    const existing = document.getElementById('hint-inventory-container');
    if (existing) {
      existing.remove();
    }

    // 사이드바에 힌트 인벤토리 추가
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      const hintInventoryHTML = this.createHintInventoryHTML();
      sidebar.appendChild(hintInventoryHTML);
      this.render();
    } else {
      // 사이드바가 없으면 body에 추가 (fallback)
      const hintInventoryHTML = this.createHintInventoryHTML();
      document.body.appendChild(hintInventoryHTML);
      this.render();
    }
  }
}

// 전역 힌트 인벤토리 인스턴스 생성
let hintInventory;

// 페이지 로드 시 힌트 인벤토리 초기화
document.addEventListener('DOMContentLoaded', () => {
  hintInventory = new HintInventory();
});

// 전역 함수로 힌트 인벤토리 접근 가능하게 설정
window.addToHintInventory = (itemName, count) => {
  if (hintInventory) hintInventory.addHintItem(itemName, count);
};

window.removeFromHintInventory = (itemName, count) => {
  if (hintInventory) return hintInventory.removeHintItem(itemName, count);
  return false;
};

window.hasInHintInventory = (itemName, count) => {
  if (hintInventory) return hintInventory.hasHintItem(itemName, count);
  return false;
};

window.getHintInventoryCount = (itemName) => {
  if (hintInventory) return hintInventory.getHintItemCount(itemName);
  return 0;
};

window.clearHintInventory = () => {
  if (hintInventory) hintInventory.clearHintInventory();
};

// 방 이동 시 힌트 인벤토리 자동 삭제
window.addEventListener('beforeunload', () => {
  if (hintInventory) {
    hintInventory.clearHintInventory();
  }
});
