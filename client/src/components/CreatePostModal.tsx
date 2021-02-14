import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import {
  Button,
  Header,
  Modal,
  Image,
  Icon,
  TextArea,
  Form,
  Input,
} from "semantic-ui-react";
import { CREATE_POST_MUTATION } from "../graphql/post/mutation";

interface CreatePostVar {
  title: string;
  content: string;
}

interface PropType {
  loading: boolean;
  refetch: any;
}

function ModalButton(profileLoading: boolean) {
  return (
    <Button
      icon
      as="div"
      labelPosition="left"
      color="blue"
      floated="right"
      disabled={profileLoading}
    >
      <Icon name="pencil" />
      Post
    </Button>
  );
}

function CreatePostModal({ loading: profileLoading, refetch }: PropType) {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [createPostMutation] = useMutation<any, CreatePostVar>(
    CREATE_POST_MUTATION
  );

  const handleClose = () => {
    setTitle("");
    setContent("");
    setLoading(false);
    setOpen(false);
  };

  const handleCreatePost = async () => {
    if (title.length && content.length) {
      setLoading(true);
      await createPostMutation({
        variables: {
          title: title,
          content: content,
        },
      });
      await refetch();
      handleClose();
    }
  };

  return (
    <Modal
      onClose={handleClose}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={ModalButton(profileLoading)}
    >
      <Modal.Header>Create a Post</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Input
              placeholder="Title"
              size="big"
              fluid
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="padding-1"></div>
            <TextArea
              placeholder="Write your post..."
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" basic onClick={handleClose}>
          Cancel
        </Button>
        <Button
          color="blue"
          onClick={handleCreatePost}
          loading={loading}
          disabled={!title || !content}
        >
          Post
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default CreatePostModal;
