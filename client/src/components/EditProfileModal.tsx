import { useMutation } from "@apollo/client";
import React, { useRef, useState } from "react";
import {
  Button,
  Modal,
  Image,
  Header,
  Icon,
  TextArea,
  Form,
  Input,
  Ref,
} from "semantic-ui-react";
import { EDIT_USER_MUTATION } from "../graphql/user/mutation";

interface EditUserVar {
  profilePic: string;
  bio: string;
}

interface PropType {
  profilePic: string;
  bio: string;
  refetch: any;
}

function EditProfileButton() {
  return (
    <a>
      <Icon name="edit" /> Edit
    </a>
  );
}

function EditProfileModal({
  profilePic: originalProfilePic,
  bio: originalBio,
  refetch,
}: PropType) {
  const [open, setOpen] = useState<boolean>(false);
  const [picture, setPicture] = useState<string>(originalProfilePic);
  const [bio, setBio] = useState<string>(originalBio);
  const [loading, setLoading] = useState<boolean>(false);

  const previewRef = useRef<HTMLImageElement>(null);

  const [editUserMutation] = useMutation<any, EditUserVar>(EDIT_USER_MUTATION);

  const handleEditUser = async () => {
    setLoading(true);
    let pictureLink = picture;
    if (previewRef.current && previewRef.current.src !== picture)
      pictureLink = previewRef.current.src;

    await editUserMutation({
      variables: { profilePic: pictureLink, bio: bio },
    });
    await refetch();
    handleClose();
  };

  const handleClose = () => {
    setLoading(false);
    setOpen(false);
  };

  return (
    <Modal
      onClose={handleClose}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={EditProfileButton()}
    >
      <Modal.Header>Edit your Profile</Modal.Header>
      <Modal.Content>
        {/* <Ref innerRef={previewRef}> */}
        <img
          // size="medium"
          className="preview-img"
          ref={previewRef}
          src={picture}
          // wrapped
          // bordered
          onError={(e: any) => {
            if (previewRef.current)
              previewRef.current.src =
                "https://react.semantic-ui.com/images/wireframe/image.png";
          }}
        />
        {/* </Ref> */}

        <Modal.Description style={{ width: "100%" }}>
          <Form>
            <Form.Input
              label="Profile picture"
              placeholder="Link"
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
            />
            <Form.TextArea
              label="Bio"
              rows="5"
              placeholder="Tell the world about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="black" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleEditUser} color="blue" loading={loading}>
          Update
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default EditProfileModal;
