import React, { useState, useEffect } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function BlogApp() {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem("posts");
    return saved ? JSON.parse(saved) : [];
  });

  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPostData({ ...postData, image: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, content, image } = postData;
    if (!title || !content || !image) return;

    if (editId) {
      setPosts(
        posts.map((p) =>
          p.id === editId ? { ...p, title, content, image } : p
        )
      );
      setEditId(null);
    } else {
      const newPost = {
        id: Date.now(),
        title,
        content,
        image,
        date: new Date().toLocaleDateString(),
      };
      setPosts([newPost, ...posts]);
    }
    setPostData({ title: "", content: "", image: "" });
  };

  const handleDelete = (id) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  const handleEdit = (p) => {
    setPostData({ title: p.title, content: p.content, image: p.image });
    setEditId(p.id);
  };

  return (
    <div className="blog-section">
      <Container fluid className="py-4">
        <h2 className="text-center fw-bold mb-4 text-primary"> Simple Blog App</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="shadow-sm p-3 form-card">
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter post title"
                      value={postData.title}
                      onChange={(e) =>
                        setPostData({ ...postData, title: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Write something..."
                      value={postData.content}
                      onChange={(e) =>
                        setPostData({ ...postData, content: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                    />
                  </Form.Group>

                  {postData.image && (
                    <div className="text-center mb-3">
                      <img
                        src={postData.image}
                        alt="preview"
                        className="preview-img"
                      />
                    </div>
                  )}

                  <Button variant="primary" type="submit" className="w-100">
                    {editId ? "Update Post" : "Add Post"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <Row xs={1} md={2} className="g-3">
              {posts.length > 0 ? (
                posts.map((p) => (
                  <Col key={p.id}>
                    <Card className="shadow-sm blog-card">
                      <Card.Img
                        variant="top"
                        src={p.image}
                        alt={p.title}
                        className="post-image"
                      />
                      <Card.Body>
                        <Card.Title>{p.title}</Card.Title>
                        <Card.Text>{p.content}</Card.Text>
                        <small className="text-muted">{p.date}</small>
                        <div className="mt-3 d-flex justify-content-between">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(p)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(p.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <p className="text-center text-muted mt-3">
                  No posts yet. Add your first blog!
                </p>
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BlogApp;
