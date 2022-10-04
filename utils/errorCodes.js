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
  notCorrectPassword: '비밀번호가 일치하지 않습니다.',
  failedSignUp: '회원가입 중 문제가 생겼습니다. 다시 시도해주세요.',
  // POST
  canNotFindPost: '게시글이 존재하지 않습니다.',
  canNotCreatePost: '게시글이 생성되지 않았습니다.',
  // validator
  required: '필수 값입니다.',
  wrongFormat: '형식을 맞춰주세요.',
  wrongEmailFormat: '올바른 이메일 형식이 아닙니다.',
  wrongPwdFormat: '8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.',
  requiredReLogin: '토큰을 새로 생성하기 위해 재로그인 해주세요.',
  tokenExpiredError: 'token이 만료되었습니다.',
  forbiddenApproach: '로그인한 유저만 사용할 수 있는 서비스입니다.',
  unusualToken: '정상적인 토큰이 아닙니다.',
  availableToken: '이미 사용가능한 토큰입니다.',
  notMatchToken: 'refresh token이 일치하지 않습니다.',
  tooLongString: '요청 데이터가 제한글자수를 넘었습니다.',
  onlyUseInt: '정수만 입력가능합니다.',
  dateFormat: 'YYYYMMDD로 입력하세요.',
};
