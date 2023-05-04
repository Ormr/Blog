import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../components/Post';
import Container from '../components/Container';
import { useGetPostsQuery, useToggleLikePostMutation } from '../services/api/PostsApi';
import TogglePostForm from '../components/forms/TogglePostForm';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import AnchorProvider from '../components/AnchorProvider';

const usePagination = ({ itemsPerPage }: any) => {
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    if (totalCount >= itemsPerPage) {
      setPageCount(Math.ceil(totalCount / itemsPerPage));
    }
  }, [offset, itemsPerPage, totalCount]);

  const handlePageClick = (event: any) => {
    if (!totalCount) return;

    const newOffset = (event.selected * itemsPerPage) % totalCount;
    setOffset(newOffset);
  };

  return {
    totalCount,
    setTotalCount,
    offset,
    itemsPerPage,
    pageCount,
    handlePageClick,
  };
};

const LIMIT = 10;

const MainPage: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { offset, pageCount, setTotalCount, handlePageClick } = usePagination({ itemsPerPage: LIMIT });
  const { data, isLoading } = useGetPostsQuery({ offset, limit: LIMIT });
  const [toggleLike] = useToggleLikePostMutation();

  useEffect(() => {
    if (data?.count) {
      setTotalCount(data?.count);
    }
  }, [data?.count]);

  return (
    <>
      <Container>
        {isLoading ? (
          <Spinner className="h-full w-full flex items-center justify-center" />
        ) : (
          <div className="flex flex-col gap-6">
            <AnchorProvider>
              {data?.items?.length ? (
                data?.items?.map((post: any) => (
                  <Post
                    key={post.id}
                    onLikeClick={async () => toggleLike({ isLiked: post.isLiked, postId: post.id })}
                    onCommentClick={() => navigate(`/posts/${post.id}`)}
                    onRepostClick={() => console.log('!')}
                    {...post}
                  />
                ))
              ) : (
                <NoPosts />
              )}
            </AnchorProvider>
          </div>
        )}
        <div>
          <Pagination
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
          />
        </div>
      </Container>
      <TogglePostForm />
    </>
  );
};

const NoPosts = () => <div className="">There is no posts yet :(</div>;

export default MainPage;
