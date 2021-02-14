import { useLazyQuery, useQuery } from "@apollo/client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Post from "../components/Post";
import { Dimmer, Grid, Loader, Segment } from "semantic-ui-react";
import { POSTS_PAGINATION_QUERY } from "../graphql/post/query";

interface PostsPaginationVar {
  offset: number;
  limit: number;
}

const LIMIT = 5;

function Home() {
  const [offset, setOffset] = useState<number>(0);

  const { loading, data, fetchMore } = useQuery<any, PostsPaginationVar>(
    POSTS_PAGINATION_QUERY,
    {
      variables: {
        offset: offset,
        limit: LIMIT,
      },
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    }
  );
  const dataRef = useRef(data);
  const loadingRef = useRef(loading);

  useEffect(() => {
    checkPagination();
    window.addEventListener("scroll", checkPagination);

    return () => {
      window.removeEventListener("scroll", checkPagination);
    };
  }, []);

  const checkPagination = async () => {
    const scrollPos = window.innerHeight + window.scrollY;
    const scrollHeight = document.body.scrollHeight;

    if (loadingRef.current) return null;

    if (scrollPos >= scrollHeight - 300) {
      setOffset((prevOffset) => {
        if (
          dataRef.current &&
          dataRef.current.postsPagination.length < prevOffset
        ) {
          return prevOffset;
        }

        const nextOffset = prevOffset + LIMIT;
        fetchMore({
          variables: {
            offset: nextOffset,
            limit: LIMIT,
          },
        });
        return nextOffset;
      });
    }
  };

  if (data) dataRef.current = data;
  loadingRef.current = loading;

  return (
    <div className="margin-top-container">
      <Grid centered>
        <Grid.Column width={10}>
          {data?.postsPagination.map((data: any) => {
            return <Post loading={false} data={data} />;
          })}
          {loading && <Loader active inline="centered" />}
          <div className="padding-3"></div>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default Home;
