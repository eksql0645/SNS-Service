const { Op, Sequelize } = require('sequelize');

/**
 * 쿼리 생성
 * @author JKS <eksql0645@gmail.com>
 * @function getQuery
 * @param {Object} data req.query로 받아온 데이터
 * @returns {Object} 조건에 따라 생성된 query 객체
 */
const getQuery = (data) => {
  let { sort, seq, seach, tag } = data;

  seq = parseInt(seq);
  sort = parseInt(sort);

  const query = {};

  // sort => 0: createdAt / 1: like / 2: hits
  // seq => 0: 내림차순(DESC) / 1: 오름차순(ASC)

  // default: createdAt / 내림차순
  if (!sort) {
    sort = 0;
  }
  if (!seq) {
    seq = 0;
  }

  // 작성일 정렬
  if (sort === 0) {
    if (!seq) {
      query.ordering = [['createdAt', 'DESC']];
    } else if (seq) {
      query.ordering = [['createdAt', 'ASC']];
    }
    // 좋아요 정렬
  } else if (sort === 1) {
    if (!seq) {
      query.ordering = [['like', 'DESC']];
    } else if (seq) {
      query.ordering = [['like', 'ASC']];
    }
    // 조회수 정렬
  } else if (sort === 2) {
    if (!seq) {
      query.ordering = [['hits', 'DESC']];
    } else if (seq) {
      query.ordering = [['hits', 'ASC']];
    }
  }

  // 태그 조회
  if (tag) {
    let tagList = tag.trim().split(',');
    tagList = tagList.map((tag) => {
      return `#${tag}`;
    });
    query.tagWhere = { tag: { [Op.in]: tagList } };
    query.tagHaving = Sequelize.literal(
      `COUNT(DISTINCT Tags.tag) = ${tagList.length}`
    );
    query.group = ['id'];
  }

  // 제목 검색
  if (seach) {
    query.seaching = {
      title: {
        [Op.like]: `%${seach}%`,
      },
    };
  }

  return query;
};

module.exports = { getQuery };
