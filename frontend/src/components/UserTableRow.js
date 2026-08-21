import React, { memo } from "react";

const UserTableRow = memo(
  ({
    user,
    isEditing,
    editingUser,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    onInputChange,
    isAdmin,
    onAssignRole,
    onCreatePost,
  }) => {
    const getInitials = (value) => {
      if (!value) return "?";
      const parts = value.trim().split(" ");
      return parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : value.slice(0, 2).toUpperCase();
    };

    const stringToColor = (text) => {
      let hash = 0;
      for (let i = 0; i < text.length; i += 1) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = Math.abs(hash) % 360;
      return `hsl(${hue}, 72%, 48%)`;
    };

    return (
      <tr>
        <td>{user.id}</td>
        <td>
          {isEditing ? (
            <input
              type="text"
              value={editingUser?.name || ""}
              onChange={(e) => onInputChange("name", e.target.value)}
              className="form-control form-control-sm"
              style={{ width: "200px" }}
            />
          ) : (
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-2"
                style={{
                  background: stringToColor(user.email),
                  width: "32px",
                  height: "32px",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {getInitials(user.name)}
              </div>
              {user.name}
            </div>
          )}
        </td>
        <td>
          {isEditing ? (
            <input
              type="email"
              value={editingUser?.email || ""}
              onChange={(e) => onInputChange("email", e.target.value)}
              className="form-control form-control-sm"
            />
          ) : (
            user.email
          )}
        </td>
        <td>
          {isEditing ? (
            <select
              value={editingUser?.status || "ACTIVE"}
              onChange={(e) => onInputChange("status", e.target.value)}
              className="form-select form-select-sm"
            >
              <option>ACTIVE</option>
              <option>INACTIVE</option>
              <option>PENDING</option>
            </select>
          ) : (
            <span className={`badge bg-${getStatusColor(user.status)}`}>
              {user.status}
            </span>
          )}
        </td>
        <td>
          {isEditing ? (
            <div className="btn-group btn-group-sm">
              <button className="btn btn-success" onClick={onSave}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
            </div>
          ) : (
            <div className="btn-group btn-group-sm" role="group">
              {isAdmin && (
                <>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={onEdit}
                    title="Edit user"
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-info btn-sm"
                    onClick={onAssignRole}
                    title="Assign role"
                  >
                    👤 Role
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={onCreatePost}
                    title="Create post"
                  >
                    ✍️ Post
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={onDelete}
                    title="Delete user"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </td>
      </tr>
    );
  },
);

const getStatusColor = (status) => {
  const colorMap = {
    ACTIVE: "success",
    INACTIVE: "danger",
    PENDING: "warning",
  };
  return colorMap[status] || "secondary";
};

UserTableRow.displayName = "UserTableRow";

export default UserTableRow;
