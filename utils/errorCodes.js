// 자주 사용되는 Error Codes의 관리를 위한 파일
module.exports = {
  // 공통
  pageNotFound: '페이지를 찾을 수 없습니다.',
  notUpdate: '수정된 내용이 없습니다.',
  notDelete: '삭제되지 않았습니다.',
  serverError: '서버 에러가 발생하였습니다. 잠시 후 시도하여 주세요.',
  // USER
  canNotFindUser: '존재하지 않는 회원입니다.',
  alreadySignUpEmail: '이미 가입된 이메일입니다.',
  // validator
  required: '필수 값입니다.',
  wrongFormat: '형식을 맞춰주세요.',
  wrongEmailFormat: '올바른 이메일 형식이 아닙니다.',
  wrongPwdFormat: '8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.',
  tooLongString: '요청 데이터가 제한글자수를 넘었습니다.',
  onlyUseInt: '정수만 입력가능합니다.',
  dateFormat: 'YYYYMMDD로 입력하세요.',
};
