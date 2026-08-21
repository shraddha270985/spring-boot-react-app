import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  TailwindCard,
  TailwindButton,
  TailwindBadge,
  TailwindSpinner,
  TailwindAlert,
} from "./TailwindComponents";

const UserPosts = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  const isAdmin = user?.role === "ADMIN";

  // Fetch users and posts
  useEffect(() => {
    if (token) {
      fetchUsersAndPosts();
    }
  }, [token]);

  const fetchUsersAndPosts = async () => {
    try {
      setLoading(true);
      const [usersRes, postsRes] = await Promise.all([
        fetch("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/posts", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!usersRes.ok || !postsRes.ok) throw new Error("Failed to fetch data");

      const usersData = await usersRes.json();
      const postsData = await postsRes.json();

      setUsers(usersData);
      setPosts(postsData);
      if (usersData.length > 0) {
        setSelectedUser(usersData[0]);
      }
    } catch (error) {
      toast.error("Failed to load posts and users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts by selected user
  const userPosts = useMemo(() => {
    if (!selectedUser) return [];
    return posts.filter((post) => post.userId === selectedUser.id);
  }, [posts, selectedUser]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      totalPosts: posts.length,
      totalUsers: users.length,
      adminCount: users.filter((u) => u.role === "ADMIN").length,
      employeeCount: users.filter((u) => u.role === "EMPLOYEE").length,
    };
  }, [posts, users]);

  if (!token) {
    return (
      <TailwindAlert variant="info">
        Please sign in to view posts and users.
      </TailwindAlert>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Posts & Users
          </h1>
          <p className="text-gray-600">
            {isAdmin
              ? "Admin View - Full Controls"
              : "Employee View - Read Only"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Posts"
            value={stats.totalPosts}
            icon="📝"
            color="blue"
          />
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon="👥"
            color="green"
          />
          <StatsCard
            title="Admins"
            value={stats.adminCount}
            icon="👨‍💼"
            color="purple"
          />
          <StatsCard
            title="Employees"
            value={stats.employeeCount}
            icon="👨‍💻"
            color="orange"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <TailwindSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Users List */}
            <div className="lg:col-span-1">
              <TailwindCard
                title="Users"
                className="max-h-[600px] overflow-y-auto"
              >
                <div className="space-y-2">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => setSelectedUser(u)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedUser?.id === u.id
                          ? "bg-blue-100 border-l-4 border-blue-600"
                          : "hover:bg-gray-100 border-l-4 border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {u.name}
                          </p>
                          <p className="text-sm text-gray-600">{u.email}</p>
                        </div>
                        <div className="text-xs">
                          <TailwindBadge status={u.status} />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {u.role}
                        </span>
                        <span className="text-xs text-gray-500">
                          {posts.filter((p) => p.userId === u.id).length} posts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TailwindCard>
            </div>

            {/* Posts Display */}
            <div className="lg:col-span-2">
              {!selectedUser ? (
                <TailwindAlert variant="info">
                  Select a user to view their posts
                </TailwindAlert>
              ) : (
                <TailwindCard
                  title={`Posts by ${selectedUser.name}`}
                  className="min-h-[400px]"
                >
                  {userPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">
                        No posts from this user yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userPosts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          isAdmin={isAdmin}
                          onDelete={() => {
                            setPosts(posts.filter((p) => p.id !== post.id));
                            toast.success("Post deleted");
                          }}
                        />
                      ))}
                    </div>
                  )}
                </TailwindCard>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-4`}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
};

// Post Card Component
const PostCard = ({ post, isAdmin, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{post.title}</h3>
          <p className="text-sm text-gray-500">Post ID: {post.id}</p>
        </div>
      </div>

      <p className="text-gray-700 mb-3">{post.content}</p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex gap-2">
          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
            {post.category || "General"}
          </span>
          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <span>❤️ {post.likes || 0}</span>
          <span>💬 {post.comments || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default UserPosts;
