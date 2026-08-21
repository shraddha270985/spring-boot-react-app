import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Alert,
  Pagination,
  Spinner,
  Modal,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser as deleteUserAction,
  setEditingUser,
  updateEditingUser,
  clearEditingUser,
} from "../features/usersSlice";
import { userValidationSchema } from "../validationSchemas";
import UserTableRow from "./UserTableRow";

const ITEMS_PER_PAGE = 10;

const UserList = () => {
  const dispatch = useDispatch();
  const { users, loading, editingUser } = useSelector((state) => state.users);
  const { token, user } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states for role and post
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [selectedUserForPost, setSelectedUserForPost] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    category: "General",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    if (token) {
      dispatch(fetchUsers());
      fetchRoles();
    }
  }, [dispatch, token]);

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Handler to open role modal
  const handleOpenRoleModal = useCallback((u) => {
    setSelectedUserForRole(u);
    setSelectedRole("");
    setShowRoleModal(true);
  }, []);

  // Handler to close role modal
  const handleCloseRoleModal = useCallback(() => {
    setShowRoleModal(false);
    setSelectedUserForRole(null);
    setSelectedRole("");
  }, []);

  // Handler to assign role
  const handleAssignRole = useCallback(async () => {
    if (!selectedRole) {
      toast.warning("Please select a role");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `/api/users/${selectedUserForRole.id}/roles/${selectedRole}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to assign role");
      }

      const updatedUser = await response.json();
      dispatch(fetchUsers());
      toast.success(`Role assigned to ${updatedUser.name}`);
      handleCloseRoleModal();
    } catch (error) {
      toast.error("Error assigning role");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedRole, selectedUserForRole, token, dispatch]);

  // Handler to open post modal
  const handleOpenPostModal = useCallback((u) => {
    setSelectedUserForPost(u);
    setPostForm({ title: "", content: "", category: "General" });
    setShowPostModal(true);
  }, []);

  // Handler to close post modal
  const handleClosePostModal = useCallback(() => {
    setShowPostModal(false);
    setSelectedUserForPost(null);
    setPostForm({ title: "", content: "", category: "General" });
  }, []);

  // Handler to create post
  const handleCreatePost = useCallback(async () => {
    if (!postForm.title.trim()) {
      toast.warning("Please enter a post title");
      return;
    }
    if (!postForm.content.trim()) {
      toast.warning("Please enter post content");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUserForPost.id,
          title: postForm.title,
          content: postForm.content,
          category: postForm.category,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const newPost = await response.json();
      toast.success("Post created successfully!");
      handleClosePostModal();
    } catch (error) {
      toast.error("Error creating post");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [postForm, selectedUserForPost, token]);

  // Formik setup with validation
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      status: "ACTIVE",
    },
    validationSchema: userValidationSchema,
    onSubmit: handleFormSubmit,
  });

  async function handleFormSubmit(values) {
    try {
      if (editingUser?.name === values.name) {
        // Editing mode
        await dispatch(
          updateUser({
            id: editingUser.id,
            user: values,
          }),
        ).unwrap();
        toast.success("User updated successfully!");
      } else {
        // Add mode
        await dispatch(addUser(values)).unwrap();
        toast.success("User added successfully!");
      }
      formik.resetForm();
      dispatch(clearEditingUser());
      setCurrentPage(1);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "An error occurred";
      toast.error(message);
    }
  }

  const handleDeleteUser = useCallback(
    async (id) => {
      try {
        await dispatch(deleteUserAction(id)).unwrap();
        toast.success("User deleted successfully!");
      } catch (error) {
        const message =
          error.response?.data?.message || error.message || "An error occurred";
        toast.error(message);
      }
    },
    [dispatch],
  );

  const handleEditUser = useCallback(
    (u) => {
      formik.setValues({
        name: u.name,
        email: u.email,
        status: u.status,
      });
      dispatch(setEditingUser(u));
    },
    [dispatch, formik],
  );

  const handleSaveEdit = useCallback(async () => {
    try {
      await dispatch(
        updateUser({
          id: editingUser.id,
          user: editingUser,
        }),
      ).unwrap();
      dispatch(clearEditingUser());
      formik.resetForm();
      toast.success("User updated successfully!");
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "An error occurred";
      toast.error(message);
    }
  }, [dispatch, editingUser, formik]);

  const handleCancelEdit = useCallback(() => {
    dispatch(clearEditingUser());
    formik.resetForm();
  }, [dispatch, formik]);

  const handleInputChange = useCallback(
    (field, value) => {
      dispatch(updateEditingUser({ [field]: value }));
    },
    [dispatch],
  );

  // Pagination logic with useMemo
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return users.slice(startIndex, endIndex);
  }, [users, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(users.length / ITEMS_PER_PAGE);
  }, [users.length]);

  const paginationItems = useMemo(() => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>,
      );
    }
    return items;
  }, [totalPages, currentPage]);

  return (
    <Container className="py-4" fluid>
      <ToastContainer position="top-right" autoClose={3000} />

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white">
              <Card.Title className="mb-0">User Management</Card.Title>
              <p className="mb-0 small">
                {token
                  ? `Logged in as ${user?.name || user?.email || "Unknown"}`
                  : "Please sign in to manage users"}
              </p>
            </Card.Header>
            <Card.Body>
              {!token ? (
                <Alert variant="info">
                  Sign in with Google to browse and manage users.
                </Alert>
              ) : (
                <>
                  <Form onSubmit={formik.handleSubmit} className="mb-4">
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter name"
                            {...formik.getFieldProps("name")}
                            isInvalid={
                              formik.touched.name && !!formik.errors.name
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter email"
                            {...formik.getFieldProps("email")}
                            isInvalid={
                              formik.touched.email && !!formik.errors.email
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Status</Form.Label>
                          <Form.Select
                            {...formik.getFieldProps("status")}
                            isInvalid={
                              formik.touched.status && !!formik.errors.status
                            }
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                            <option value="PENDING">PENDING</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.status}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-flex gap-2">
                      <Button variant="primary" type="submit">
                        {editingUser ? "Update User" : "Add User"}
                      </Button>
                      {editingUser && (
                        <Button variant="secondary" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </Form>

                  {loading && (
                    <div className="text-center py-4">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  )}

                  {!loading && users.length > 0 ? (
                    <>
                      <div className="table-responsive">
                        <Table striped bordered hover>
                          <thead className="table-dark">
                            <tr>
                              <th>ID</th>
                              <th>User</th>
                              <th>Email</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedUsers.map((u) => (
                              <UserTableRow
                                key={u.id}
                                user={u}
                                isEditing={editingUser?.id === u.id}
                                editingUser={editingUser}
                                onEdit={() => handleEditUser(u)}
                                onSave={handleSaveEdit}
                                onCancel={handleCancelEdit}
                                onDelete={() => handleDeleteUser(u.id)}
                                onInputChange={handleInputChange}
                                isAdmin={user?.role === "ADMIN"}
                                onAssignRole={() => handleOpenRoleModal(u)}
                                onCreatePost={() => handleOpenPostModal(u)}
                              />
                            ))}
                          </tbody>
                        </Table>
                      </div>

                      {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                          <Pagination>
                            <Pagination.First
                              onClick={() => setCurrentPage(1)}
                              disabled={currentPage === 1}
                            />
                            <Pagination.Prev
                              onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                              }
                              disabled={currentPage === 1}
                            />
                            {paginationItems}
                            <Pagination.Next
                              onClick={() =>
                                setCurrentPage((p) =>
                                  Math.min(totalPages, p + 1),
                                )
                              }
                              disabled={currentPage === totalPages}
                            />
                            <Pagination.Last
                              onClick={() => setCurrentPage(totalPages)}
                              disabled={currentPage === totalPages}
                            />
                          </Pagination>
                        </div>
                      )}

                      <div className="mt-3 text-muted small">
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                        {Math.min(currentPage * ITEMS_PER_PAGE, users.length)}{" "}
                        of {users.length} users
                      </div>
                    </>
                  ) : (
                    !loading && <Alert variant="info">No users found.</Alert>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Role Assignment Modal */}
      <Modal show={showRoleModal} onHide={handleCloseRoleModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Role to {selectedUserForRole?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Role</Form.Label>
            <Form.Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">-- Choose a role --</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRoleModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssignRole}
            disabled={isSubmitting || !selectedRole}
          >
            {isSubmitting ? "Assigning..." : "Assign Role"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Post Creation Modal */}
      <Modal
        show={showPostModal}
        onHide={handleClosePostModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Post for {selectedUserForPost?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Post Title *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter post title"
              value={postForm.title}
              onChange={(e) =>
                setPostForm({ ...postForm, title: e.target.value })
              }
              maxLength="200"
            />
            <small className="text-muted">
              {postForm.title.length}/200 characters
            </small>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={postForm.category}
              onChange={(e) =>
                setPostForm({ ...postForm, category: e.target.value })
              }
            >
              <option value="General">General</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="News">News</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Post Content *</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Enter post content"
              value={postForm.content}
              onChange={(e) =>
                setPostForm({ ...postForm, content: e.target.value })
              }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePostModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreatePost}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserList;
