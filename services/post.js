const bcrypt = require('bcrypt');
const { postModel, userModel, tagModel, postTagModel } = require('../models');
const errorCodes = require('../utils/errorCodes');
const { nanoid } = require('nanoid');

/**
 * 게시글 생성
 * @author JKS <eksql0645@gmail.com>
 * @function addPost
 * @param {Object} postInfo post 생성 시 필요한 정보
 * @param {String} postInfo.title 게시글 제목
 * @param {String} postInfo.content 게시글 내용
 * @param {String} postInfo.image 게시글 첨부이미지
 * @param {String} postInfo.weather 날씨정보
 * @param {String} postInfo.tag 해쉬태그
 * @param {String} postInfo.userId user id
 * @returns {Object} 생성된 post 객체
 */
const addPost = async (postInfo) => {
  try {
    const user = await userModel.findUserById(postInfo.postUserId);
    if (!user) {
      throw new Error(errorCodes.canNotFindUser);
    }
    // 회원의 닉네임을 작성자명으로 설정
    postInfo.writer = user.nick;

    // 비밀번호 해쉬화
    postInfo.password = await bcrypt.hash(postInfo.password, 10);

    // 문자열로 된 태그 구분 짓기
    let tagList = postInfo.tag.split(',');

    // postInfo에서 tag 삭제
    delete postInfo.tag;

    // 각 태그를 id와 함께 객체로 재구성
    tagList = await Promise.all(
      tagList.map(async (tag) => {
        const isExistedTag = await tagModel.findTag(tag);
        // 이미 존재하는 태그라면 생성하지 않음
        if (!isExistedTag) {
          return {
            id: nanoid(),
            tag,
          };
        }
      })
    );

    // tagList 중 존재하지 않는 값 제거
    tagList = tagList.filter((tag) => {
      return tag !== undefined;
    });

    // 게시글 생성
    const post = await postModel.createPost(postInfo);

    // 게시글 생성 후 새로운 tag가 존재하면 tag 및 중간테이블 데이터 생성
    if (tagList.length !== 0) {
      tagList.map(async (tag) => {
        const newTag = await tagModel.createTag(tag);
        await postTagModel.createPostTag(newTag.id, post.id);
      });
    }

    return post;
  } catch (err) {
    return err;
  }
};

module.exports = { addPost };
