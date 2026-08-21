import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  TailwindCard,
  TailwindButton,
  TailwindAlert,
} from "./TailwindComponents";

const PostCreation = () => {
  const { token, user: currentUser } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    userId: currentUser?.id || "",
    title: "",
    content: "",
    category: "General",
  });

  // Check if current user is admin
  const isAdmin = currentUser?.role === "ADMIN";

  useEffect(() => {
    if (token && isAdmin) {
      fetchUsers();
    }
  }, [token, isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.userId) {
      toast.warning("Please select a user");
      return;
    }
    if (!formData.title.trim()) {
      toast.warning("Please enter a post title");
      return;
    }
    if (!formData.content.trim()) {
      toast.warning("Please enter post content");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: parseInt(formData.userId),
          title: formData.title,
          content: formData.content,
          category: formData.category,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const newPost = await response.json();

      // Reset form
      setFormData({
        userId: currentUser?.id || "",
        title: "",
        content: "",
        category: "General",
      });

      toast.success("Post created successfully!");
    } catch (error) {
      toast.error("Error creating post");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <TailwindAlert variant="info">
        Please sign in to create posts.
      </TailwindAlert>
    );
  }

  if (!isAdmin) {
    return (
      <TailwindAlert variant="warning">
        Only admins can create posts. Your role: {currentUser?.role}
      </TailwindAlert>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create New Post
          </h1>
          <p className="text-gray-600">Add a new post to the system</p>
        </div>

        {/* Form */}
        <TailwindCard title="Post Details">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Author *
              </label>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email}) - {user.role}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter post title"
                maxLength="200"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/200 characters
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="General">General</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="News">News</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Enter post content"
                rows="8"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.content.length} characters
              </p>
            </div>

            {/* Preview */}
            {formData.title && formData.content && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Preview</h3>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    {formData.title}
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Category:{" "}
                    <span className="font-medium">{formData.category}</span>
                  </p>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {formData.content}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating..." : "Create Post"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    userId: currentUser?.id || "",
                    title: "",
                    content: "",
                    category: "General",
                  })
                }
                className="px-6 py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          </form>
        </TailwindCard>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ About Posts</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Only admins can create posts</li>
            <li>• Posts can be assigned to any user in the system</li>
            <li>• All posts are visible in the Posts & Users section</li>
            <li>• Admins can edit and delete posts</li>
            <li>• Employees can only view posts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PostCreation;
