const bcrypt = require('bcrypt');
const { postModel, userModel, tagModel, postTagModel } = require('../models');
const errorCodes = require('../utils/errorCodes');
const { nanoid } = require('nanoid');
const getQuery = require('../utils/getQuery');

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
        // 이미 존재하는 태그인지 확인
        const isExistedTag = await tagModel.findTag(tag);
        // 새로운 태그라면 nanoid와 tag 할당
        if (!isExistedTag) {
          return {
            id: nanoid(),
            tag,
          };
        }
        // 이미 존재하는 태그라면 기존 태그의 id만 반환
        return {
          id: isExistedTag.id,
        };
      })
    );

    // 이미 존재하는 태그의 경우
    const existedTag = tagList.filter((ele) => {
      return !ele.tag;
    });

    // 새로운 태그의 경우
    const newTag = tagList.filter((ele) => {
      return ele.tag;
    });

    // 게시글 생성
    const post = await postModel.createPost(postInfo);

    // 게시글 생성 후 tag 및 중간테이블 데이터 생성
    if (tagList.length !== 0) {
      // 기존에 생성된 태그가 있는 경우
      if (existedTag.length !== 0) {
        // 중간테이블 데이터만 생성
        existedTag.map(async (tag) => {
          await postTagModel.createPostTag(tag.id, post.id);
        });
      }
      // 새로운 태그가 있는 경우
      if (newTag.length !== 0) {
        // 태그 및 중간테이블 데이터 생성
        newTag.map(async (tag) => {
          const newTag = await tagModel.createTag(tag);
          await postTagModel.createPostTag(newTag.id, post.id);
        });
      }
    }
    return post;
  } catch (err) {
    return err;
  }
};

/**
 * 게시글 전체조회
 * @author JKS <eksql0645@gmail.com>
 * @function getPosts
 * @param {Int} page 현재 페이지
 * @returns {Array} 조회된 post 객체들이 담긴 배열
 */
const getPosts = async (data) => {
  try {
    // 페이지네이션
    let { page, limit } = data;

    // default: 10/page
    if (!limit) {
      limit = 10;
    }

    let offset = 0;
    page = parseInt(page);
    limit = parseInt(limit);

    if (page > 1) {
      offset = limit * (page - 1);
    }

    // 쿼리
    const query = getQuery(data);

    const posts = await postModel.findPosts(offset, limit, query);

    return posts;
  } catch (err) {
    return err;
  }
};

module.exports = { addPost, getPosts };
