import { useLazyQuery, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  Dimmer,
  Grid,
  Header,
  Icon,
  Image,
  Loader,
  Menu,
  MenuItemProps,
  Placeholder,
  Ref,
  Segment,
  Sticky,
  Comment,
} from "semantic-ui-react";
import CreatePostModal from "../components/CreatePostModal";
import Post from "../components/Post";
import PostComment from "../components/PostComment";
import ProfileCard from "../components/ProfileCard";
import { AuthContext } from "../context/authContext";
import {
  COMMENTED_QUERY,
  RETRIEVE_USER_QUERY,
  UPVOTED_QUERY,
} from "../graphql/user/query";
import { RetrieveUserType } from "../type/UserType";

interface UserDataType {
  retrieveUser: RetrieveUserType;
}

interface RetrieveUserVar {
  handle: string;
}

function Profile(props: any) {
  const profileHandle = props.match.params.handle;

  const authContext = useContext(AuthContext);

  const contextRef = useRef(null);
  const [activeItem, setActiveItem] = useState<string | undefined>("feed");
  const [meProfile, setMeProfile] = useState<boolean>(false);

  const { loading, data, refetch } = useQuery<UserDataType, RetrieveUserVar>(
    RETRIEVE_USER_QUERY,
    {
      variables: { handle: profileHandle },
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    }
  );
  const [
    upvoted,
    { loading: upvotedLoading, data: upvotedData },
  ] = useLazyQuery<any, RetrieveUserVar>(UPVOTED_QUERY, {
    variables: { handle: profileHandle },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const [
    commented,
    { loading: commentedLoading, data: commentedData },
  ] = useLazyQuery<any, RetrieveUserVar>(COMMENTED_QUERY, {
    variables: { handle: profileHandle },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    if (authContext.me) {
      setMeProfile(authContext.me.handle === profileHandle);
    }
  }, [authContext.me, profileHandle]);

  const handleFeed = () => {
    refetch();
    setActiveItem("feed");
  };

  const handleLiked = () => {
    upvoted({
      variables: {
        handle: profileHandle,
      },
    });
    setActiveItem("liked");
  };

  const handleCommented = () => {
    commented({
      variables: {
        handle: profileHandle,
      },
    });
    setActiveItem("commented");
  };

  let postsBody = null;
  if (loading || upvotedLoading || commentedLoading) {
    postsBody = (
      <Dimmer inverted active>
        <Loader />
      </Dimmer>
    );
  } else {
    let postsData = null;
    let noPostsMsg = "No posts yet";
    let commentsData = null;

    switch (activeItem) {
      case "feed":
        postsData = data?.retrieveUser.posts;
        noPostsMsg = "No posts yet";
        break;
      case "liked":
        postsData = upvotedData?.upvoted.upvotes;
        noPostsMsg = "No liked posts yet";
        break;
      case "commented":
        commentsData = commentedData?.commented.comments;
        break;
    }

    if (postsData) {
      if (postsData.length) {
        postsBody = (
          <>
            {postsData.map((data: any) => {
              return <Post loading={loading} data={data} />;
            })}
          </>
        );
      } else {
        postsBody = (
          <Header as="h2" textAlign="center" disabled>
            {noPostsMsg}
          </Header>
        );
      }
    } else if (commentsData) {
      console.log(commentsData);
      if (commentsData.length) {
        postsBody = (
          <>
            {commentsData.map((data: any) => {
              return (
                <>
                  <Post loading={loading} data={data.post} />
                  <Comment.Group>
                    <PostComment data={data} />
                  </Comment.Group>
                </>
              );
            })}
          </>
        );
      } else {
        postsBody = (
          <Header as="h2" textAlign="center" disabled>
            No comments yet
          </Header>
        );
      }
    }
  }

  return (
    <div className="margin-top-container">
      <Grid>
        <Grid.Row>
          <Grid.Column width={5} stretched>
            <Ref innerRef={contextRef}>
              <Sticky context={contextRef} offset={15}>
                <ProfileCard
                  meProfile={meProfile}
                  loading={loading}
                  data={data ? data.retrieveUser : null}
                  refetch={refetch}
                />
              </Sticky>
            </Ref>
          </Grid.Column>
          <Grid.Column width={11}>
            <Menu attached="top" tabular>
              <Menu.Item
                name="feed"
                active={activeItem === "feed"}
                onClick={handleFeed}
              />
              <Menu.Menu position="right">
                <Menu.Item
                  name="liked"
                  active={activeItem === "liked"}
                  onClick={handleLiked}
                />
                <Menu.Item
                  name="commented"
                  active={activeItem === "commented"}
                  onClick={handleCommented}
                />
              </Menu.Menu>
            </Menu>
            <Segment attached="bottom">
              {meProfile && activeItem === "feed" && (
                <CreatePostModal loading={loading} refetch={refetch} />
              )}
              <br></br>
              <br></br>
              {postsBody}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default Profile;
