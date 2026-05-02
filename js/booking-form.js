/* ===================================
   BOOKING FORM — 유효성 검사 & 제출
=================================== */
const form = document.getElementById('consult-form');
if (!form) throw new Error('consult-form not found');

const formFields = document.getElementById('form-fields');
const formSuccess = document.getElementById('form-success');

const nameInput   = document.getElementById('name');
const phoneInput  = document.getElementById('phone');
const privacyChk  = document.getElementById('privacy');

const groupName    = document.getElementById('group-name');
const groupPhone   = document.getElementById('group-phone');
const groupPrivacy = document.getElementById('group-privacy');

/* 전화번호 형식: 01X-XXXX-XXXX 또는 01XXXXXXXXX */
const PHONE_RE = /^01[016789][-\s]?\d{3,4}[-\s]?\d{4}$/;

function setError(group, show) {
  if (!group) return;
  if (show) {
    group.classList.add('has-error');
  } else {
    group.classList.remove('has-error');
  }
}

function validatePhone(value) {
  return PHONE_RE.test(value.trim());
}

/* 실시간 포맷 — 숫자 입력 시 자동 하이픈 */
phoneInput?.addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length > 11) val = val.slice(0, 11);

  if (val.length <= 3) {
    e.target.value = val;
  } else if (val.length <= 7) {
    e.target.value = val.slice(0, 3) + '-' + val.slice(3);
  } else {
    e.target.value = val.slice(0, 3) + '-' + val.slice(3, 7) + '-' + val.slice(7);
  }

  if (val.length >= 10) setError(groupPhone, false);
});

/* 실시간 name 검사 */
nameInput?.addEventListener('input', () => {
  if (nameInput.value.trim().length > 0) setError(groupName, false);
});

/* 실시간 privacy 검사 */
privacyChk?.addEventListener('change', () => {
  if (privacyChk.checked) setError(groupPrivacy, false);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let hasError = false;

  // 이름 검사
  if (!nameInput?.value.trim()) {
    setError(groupName, true);
    hasError = true;
  } else {
    setError(groupName, false);
  }

  // 전화번호 검사
  if (!phoneInput?.value.trim() || !validatePhone(phoneInput.value)) {
    setError(groupPhone, true);
    hasError = true;
  } else {
    setError(groupPhone, false);
  }

  // 개인정보 동의 검사
  if (!privacyChk?.checked) {
    setError(groupPrivacy, true);
    hasError = true;
  } else {
    setError(groupPrivacy, false);
  }

  if (hasError) {
    // 첫 번째 에러 필드로 스크롤
    const firstError = form.querySelector('.has-error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  // 제출 성공 처리 (실제 서버 연동 전 클라이언트 측 피드백)
  const submitBtn = form.querySelector('[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';
  }

  // 실제 서버 연동 시 fetch/XMLHttpRequest 교체
  setTimeout(() => {
    if (formFields) formFields.style.display = 'none';
    if (formSuccess) formSuccess.classList.add('visible');
    formSuccess?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 600);
});
