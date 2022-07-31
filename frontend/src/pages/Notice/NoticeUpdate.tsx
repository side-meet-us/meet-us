import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { gql, useQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import UpdateLayout from "../../layouts/Admin/UpdateLayout";
import { noticeItemState } from "../../recoil";

interface PostVariable {
  noticeId: string;
}

interface PostResponse {
  getPostById: {
    postId: string;
    title: string;
    content: string;
    status: string;
    authorId: string;
    author: {
      id: string;
      userName: string;
    };
    updatedAt: number;
    createdAt: number;
  };
}

const GET_NOTICE = gql`
  query GetPostById($noticeId: String!) {
    getPostById(id: $noticeId) {
      postId
      title
      content
      status
      authorId
      author {
        id
        userName
      }
      updatedAt
      createdAt
    }
  }
`;

const NoticeUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [notice, updateNotice] = useRecoilState(noticeItemState);
  const noticeId = (params && params.id) || "";

  const { loading, data } = useQuery<PostResponse, PostVariable>(GET_NOTICE, {
    variables: {
      noticeId,
    },
  });

  useEffect(() => {
    if (!noticeId) {
      navigate(-1);
    } else {
      if (!loading && data) {
        const newNotice = {
          id: data.getPostById.postId,
          subject: data.getPostById.title,
          content: data.getPostById.content,
          status: data.getPostById.status,
          register:
            data.getPostById.author.id + data.getPostById.author.userName,
          createdAt: new Date(data.getPostById.createdAt).toLocaleString(),
        };
        updateNotice(newNotice);
      }
    }
  }, [noticeId, navigate, updateNotice, loading, data]);
  return (
    <UpdateLayout
      title="공지사항"
      buttonTitle="공지사항"
      toPath="/admin/notice"
      item={notice}
      updateItem={updateNotice}
    />
  );
};

export default NoticeUpdate;
