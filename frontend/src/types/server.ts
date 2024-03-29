interface PostVariable {
  postId: string;
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

interface NoticeVariable {
  noticeId: string;
}

interface NoticeResponse {
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

interface NoticeListVariable {
  pagination: {
    skip: number;
    take: number;
  };
  orderBy: {
    createdAt: string;
  };
}

interface NoticeItem {
  authorId: string;
  content: string;
  createdAt: number;
  postId: string;
  status: string;
  title: string;
  updatedAt: number;
}

interface NoticeListResponse {
  posts: { list: NoticeItem[]; totalCount: number };
}

interface PostListVariable {
  pagination: {
    skip: number;
    take: number;
  };
  orderBy: {
    createdAt: string;
  };
}

interface PostItem {
  authorId: string;
  content: string;
  createdAt: number;
  postId: string;
  status: string;
  title: string;
  updatedAt: number;
}

interface PostListResponse {
  posts: { list: PostItem[]; totalCount: number };
}

interface UserVariable {
  userId: string;
}

interface UserResponse {
  getUserById: {
    userName: string;
  };
}

export type {
  PostVariable,
  PostResponse,
  NoticeVariable,
  NoticeResponse,
  NoticeListVariable,
  NoticeListResponse,
  PostListVariable,
  PostListResponse,
  UserResponse,
  UserVariable
};
