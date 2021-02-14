import { ApolloQueryResult, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { Card, Icon, Image, Placeholder } from "semantic-ui-react";
import { AuthContext } from "../context/authContext";
import { FOLLOW_MUTATION } from "../graphql/user/mutation";
import { RETRIEVE_USER_QUERY } from "../graphql/user/query";
import { RetrieveUserType } from "../type/UserType";
import EditProfileModal from "./EditProfileModal";

interface FollowerDataType {
  numFollowers: number;
  didFollow: boolean;
}

interface FollowerType {
  id: number;
}

interface FollowVar {
  followUserId: number;
}

interface PropType {
  meProfile: boolean;
  loading: boolean;
  data: RetrieveUserType | null;
  refetch: any;
}

function ProfileCard({ meProfile, loading, data, refetch }: PropType) {
  const authContext = useContext(AuthContext);

  const [followerData, setFollowerData] = useState<FollowerDataType>({
    numFollowers: 0,
    didFollow: false,
  });

  const [followMutation] = useMutation<any, FollowVar>(FOLLOW_MUTATION, {
    errorPolicy: "all",
  });

  const handleFollow = async () => {
    if (!meProfile && data) {
      await followMutation({
        variables: {
          followUserId: data.id,
        },
      });
      refetch();
    }
  };

  useEffect(() => {
    if (data) {
      const followers: FollowerType[] = Array.from(new Set(data.followers));
      let newFollowerData: FollowerDataType = {
        numFollowers: followers.length,
        didFollow: false,
      };

      if (authContext.me) {
        const follow = followers.filter(
          (follower) => follower.id === authContext.me!.id
        );
        if (follow.length) newFollowerData.didFollow = true;
      }

      setFollowerData(newFollowerData);
    }
  }, [authContext.me, data?.followers]);

  if (loading)
    return (
      <Card>
        <Placeholder>
          <Placeholder.Image square />
        </Placeholder>
        <Card.Content>
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line length="very short" />
              <Placeholder.Line length="medium" />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line length="short" />
              <Placeholder.Line length="long" />
              <Placeholder.Line length="medium" />
            </Placeholder.Paragraph>
          </Placeholder>
        </Card.Content>
      </Card>
    );

  let interactButton = null;
  if (meProfile) {
    interactButton = (
      <EditProfileModal
        profilePic={data?.profilePic || ""}
        bio={data?.bio || ""}
        refetch={refetch}
      />
    );
  } else if (!authContext.me) {
    interactButton = null;
  } else {
    if (followerData.didFollow) {
      interactButton = (
        <a onClick={handleFollow}>
          <Icon name="checkmark" /> following
        </a>
      );
    } else {
      interactButton = (
        <a onClick={handleFollow}>
          <Icon name="user plus" /> Follow
        </a>
      );
    }
  }

  return (
    <Card>
      <Image src={data?.profilePic} size="medium" ui={false} wrapped bordered />
      <Card.Content>
        <Card.Header>
          {data?.fullName}
          <small className="float-right">{interactButton}</small>
        </Card.Header>
        <Card.Meta>
          {data && (
            <span className="date">
              Joined in {new Date(data.createdAt).getFullYear()}
            </span>
          )}
        </Card.Meta>
        <Card.Description>{data?.bio}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="extra-wrapper">
          <span>
            <strong>{followerData.numFollowers}</strong> Follower
            {followerData.numFollowers === 1 ? "" : "s"}
          </span>
          <span>
            <strong>{data?.following.length}</strong> Following
          </span>
        </div>
      </Card.Content>
    </Card>
  );
}

export default ProfileCard;
