
const modalOverlay = document.getElementById('modalOverlay');
const ctaTriggers = document.querySelectorAll('.cta-trigger');
const modalClose = document.getElementById('modalClose');
const leadForm = document.getElementById('leadForm');

// 오픈 이벤트
ctaTriggers.forEach(button => {
    button.addEventListener('click', () => {
        modalOverlay.classList.add('active');
    });
});

// 닫기 이벤트 (X 버튼)
modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

// 닫기 이벤트 (외부 배경 클릭 시)
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
    }
});

// 폼 제출 이벤트 핸들러
leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // 간단한 처리 시뮬레이션
    alert(`${name}님, 실무 AI 가이드 신청이 완료되었습니다!\n입력하신 이메일(${email})로 가이드북을 발송해 드리며 담당자가 빠르게 연락드리겠습니다.`);
    
    leadForm.reset();
    modalOverlay.classList.remove('active');
});
