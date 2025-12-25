// 일지 시스템
class Journal {
  constructor() {
    this.entries = []; // 로컬스토리지 대신 빈 배열로 시작
    this.isMinimized = false;
    this.init();
  }

  // 일지 항목 추가
  addEntry(text, type = 'observation') {
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleString('ko-KR'),
      text: text,
      type: type // 'observation', 'memory', 'clue', 'emotion'
    };
    
    this.entries.push(entry);
    this.render(); // 로컬스토리지 저장 제거
  }

  // 일지 항목 제거
  removeEntry(entryId) {
    this.entries = this.entries.filter(entry => entry.id !== entryId);
    this.render(); // 로컬스토리지 저장 제거
  }

  // 일지 초기화
  clearJournal() {
    this.entries = [];
    this.render(); // 로컬스토리지 저장 제거
  }

  // 일지 HTML 생성
  createJournalHTML() {
    const container = document.createElement('div');
    container.className = 'journal-container';
    container.id = 'journal-container';

    const header = document.createElement('div');
    header.className = 'journal-header';

    const title = document.createElement('div');
    title.className = 'journal-title';
    title.textContent = '일지';

    const toggle = document.createElement('button');
    toggle.className = 'journal-toggle';
    toggle.textContent = '−';
    toggle.onclick = () => this.toggleMinimize();

    header.appendChild(title);
    header.appendChild(toggle);

    const content = document.createElement('div');
    content.className = 'journal-content';
    content.id = 'journal-content';

    container.appendChild(header);
    container.appendChild(content);

    return container;
  }

  // 일지 렌더링
  render() {
    const content = document.getElementById('journal-content');
    if (!content) return;

    content.innerHTML = '';

    if (this.entries.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'journal-empty';
      emptyMsg.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 8px; opacity: 0.5;">📖</div>
        <div>일지가 비어있습니다</div>
        <div style="font-size: 11px; margin-top: 4px; opacity: 0.7;">스토리를 진행하면 기록이 추가됩니다</div>
      `;
      content.appendChild(emptyMsg);
      return;
    }

    this.entries.forEach((entry, index) => {
      const entryDiv = document.createElement('div');
      entryDiv.className = 'journal-entry';
      entryDiv.style.animationDelay = `${index * 0.1}s`;

      // 일지 타입별 아이콘
      const getTypeIcon = (type) => {
        const icons = {
          'observation': '👁️',
          'memory': '🧠',
          'clue': '🔍',
          'emotion': '💭'
        };
        return icons[type] || '📝';
      };

      const iconSpan = document.createElement('span');
      iconSpan.textContent = getTypeIcon(entry.type);
      iconSpan.style.cssText = `
        font-size: 14px;
        margin-right: 8px;
        opacity: 0.8;
      `;

      const dateDiv = document.createElement('div');
      dateDiv.className = 'journal-entry-date';
      dateDiv.textContent = entry.date;

      const textDiv = document.createElement('div');
      textDiv.className = 'journal-entry-text';
      textDiv.textContent = entry.text;

      // 일지 항목 클릭 시 상세 보기
      entryDiv.onclick = () => this.showEntryDetail(entry);

      entryDiv.appendChild(iconSpan);
      entryDiv.appendChild(dateDiv);
      entryDiv.appendChild(textDiv);
      content.appendChild(entryDiv);
    });
  }

  // 일지 항목 상세 보기
  showEntryDetail(entry) {
    // 기존 상세창이 있다면 제거
    const existingDetail = document.getElementById('journal-detail');
    if (existingDetail) {
      existingDetail.remove();
    }

    const detailDiv = document.createElement('div');
    detailDiv.id = 'journal-detail';
    detailDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2000;
      max-width: 500px;
      text-align: center;
      animation: fadeInScale 0.3s ease-out;
    `;

    const getTypeIcon = (type) => {
      const icons = {
        'observation': '👁️',
        'memory': '🧠',
        'clue': '🔍',
        'emotion': '💭'
      };
      return icons[type] || '📝';
    };

    const getTypeName = (type) => {
      const names = {
        'observation': '관찰',
        'memory': '기억',
        'clue': '단서',
        'emotion': '감정'
      };
      return names[type] || '기록';
    };

    detailDiv.innerHTML = `
      <div style="
        background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid rgba(255, 193, 7, 0.4);
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(15px);
      ">
        <div style="font-size: 48px; margin-bottom: 15px;">${getTypeIcon(entry.type)}</div>
        <div style="
          color: #ffc107;
          font-size: 14px;
          margin-bottom: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        ">${getTypeName(entry.type)}</div>
        <div style="
          color: #ffc107;
          font-size: 12px;
          margin-bottom: 20px;
          opacity: 0.8;
        ">${entry.date}</div>
        <p style="
          color: #e8f4fd;
          font-size: 16px;
          line-height: 1.6;
          margin: 0 0 25px 0;
          opacity: 0.9;
          text-align: left;
        ">${entry.text}</p>
        <button onclick="this.closest('#journal-detail').remove()" style="
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
    const closeBtn = detailDiv.querySelector('button');
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.transform = 'translateY(-2px)';
      closeBtn.style.boxShadow = '0 5px 15px rgba(255, 193, 7, 0.3)';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.transform = 'translateY(0)';
      closeBtn.style.boxShadow = 'none';
    });

    document.body.appendChild(detailDiv);

    // 배경 클릭으로 닫기 (제거 - 자동 닫기 방지)
    // detailDiv.addEventListener('click', (e) => {
    //   if (e.target === detailDiv) {
    //     detailDiv.remove();
    //   }
    // });

    // 자동으로 닫기 제거 (닫기 버튼으로만 닫기)
    // setTimeout(() => {
    //   if (detailDiv.parentElement) {
    //     detailDiv.style.animation = 'fadeOutScale 0.3s ease-in';
    //     setTimeout(() => {
    //       if (detailDiv.parentElement) {
    //         detailDiv.remove();
    //       }
    //     }, 300);
    //   }
    // }, 8000);
  }

  // 최소화/최대화 토글
  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    const container = document.getElementById('journal-container');
    const toggle = container.querySelector('.journal-toggle');
    
    if (this.isMinimized) {
      container.classList.add('journal-minimized');
      toggle.textContent = '+';
    } else {
      container.classList.remove('journal-minimized');
      toggle.textContent = '−';
    }
  }

  // 일지 초기화
  init() {
    // 기존 일지가 있다면 제거
    const existing = document.getElementById('journal-container');
    if (existing) {
      existing.remove();
    }

    // 사이드바에 일지 추가
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      const journalHTML = this.createJournalHTML();
      sidebar.appendChild(journalHTML);
      this.render();
    } else {
      // 사이드바가 없으면 body에 추가 (fallback)
      const journalHTML = this.createJournalHTML();
      document.body.appendChild(journalHTML);
      this.render();
    }
  }

  // 스토리 진행에 따른 자동 일지 추가
  addStoryEntry(roomNumber, action, result) {
    const entries = {
      1: {
        'chart': '침대 옆 차트에서 숫자 단서를 발견했다. 이게 무엇을 의미하는 걸까?',
        'wall': '벽의 낙서에서 또 다른 숫자를 찾았다. 누군가 일부러 남긴 것 같다.',
        'memo': '바닥의 메모에서 세 번째 숫자를 발견했다. 이 모든 것이 연결되어 있는 것 같다.',
        'lock': '서랍장의 자물쇠를 열었다. 안에서 중요한 단서를 찾을 수 있을 것 같다.'
      },
      2: {
        'breaker': '전원 차단기를 조사했다. 정비 기록에서 숫자 단서를 발견했다.',
        'cctv': 'CCTV 모니터에서 타임코드가 깜빡이는 것을 발견했다. 누군가 의도적으로 남긴 것 같다.',
        'note': '바닥의 쪽지에서 세모로 표시된 숫자를 발견했다. 이것도 단서일 것이다.',
        'lock': '문 잠금 장치를 조사했다. 흠집에서 숫자를 발견했다.'
      },
      3: {
        'red_switch': '빨간 스위치를 눌렀다. 순서가 중요한 것 같다.',
        'blue_switch': '파란 스위치를 눌렀다. 전원이 복구되는 것 같다.',
        'green_switch': '초록 스위치를 눌렀다. 이제 단말기가 작동할 것이다.',
        'chip': '데이터 칩을 삽입했다. 기억이 되살아나는 것 같다.'
      },
      6: {
        'dialogue': '관찰실에 도착했다. 서랍 안에 중요한 것이 있을 것 같다.',
        'puzzle': '서랍의 비밀번호 퍼즐을 풀었다. 안에서 중요한 단서를 발견했다.'
      }
    };

    if (entries[roomNumber] && entries[roomNumber][action]) {
      this.addEntry(entries[roomNumber][action], 'observation');
    }
  }

  // 감정 변화 기록
  addEmotionEntry(emotion) {
    const emotionTexts = {
      'anger': '분노가 가득하다. 이 모든 것에 대한 복수를 원한다.',
      'despair': '절망에 빠져있다. 하지만 아직 희망이 있을지도 모른다.',
      'empathy': '그들을 이해할 수 있다. 모두 계획된 일이었을 것이다.',
      'neutral': '침착하게 상황을 파악하고 있다. 진실을 찾아야 한다.'
    };

    if (emotionTexts[emotion]) {
      this.addEntry(emotionTexts[emotion], 'emotion');
    }
  }

  // 기억 회복 기록
  addMemoryEntry(memory) {
    this.addEntry(memory, 'memory');
  }

  // 단서 발견 기록
  addClueEntry(clue) {
    this.addEntry(clue, 'clue');
  }
}

// 전역 일지 인스턴스 생성
let journal;

// 페이지 로드 시 일지 초기화
document.addEventListener('DOMContentLoaded', () => {
  journal = new Journal();
  
  // 초기 일지 항목 추가 (게임 시작 시)
  if (journal.entries.length === 0) {
    journal.addEntry('낯선 병실에서 깨어났다. 기억이 없다. 이곳이 어디지?', 'observation');
    journal.addEntry('주변을 살펴보니 낙서와 메모들이 있다. 누군가가 나를 위해 남긴 것 같다.', 'clue');
  }
});

// 전역 함수로 일지 접근 가능하게 설정
window.addJournalEntry = (text, type) => {
  if (journal) journal.addEntry(text, type);
};

window.addStoryEntry = (roomNumber, action, result) => {
  if (journal) journal.addStoryEntry(roomNumber, action, result);
};

window.addEmotionEntry = (emotion) => {
  if (journal) journal.addEmotionEntry(emotion);
};

window.addMemoryEntry = (memory) => {
  if (journal) journal.addMemoryEntry(memory);
};

window.addClueEntry = (clue) => {
  if (journal) journal.addClueEntry(clue);
};

window.clearJournal = () => {
  if (journal) journal.clearJournal();
};
