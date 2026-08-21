import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import UserList from "./UserList";
import { Provider } from "react-redux";
import { store } from "../store";

jest.mock("axios");

describe("UserList", () => {
  const users = [
    {
      id: 1,
      name: "Alice Smith",
      email: "alice@example.com",
      status: "ACTIVE",
    },
    {
      id: 2,
      name: "Bob Johnson",
      email: "bob@example.com",
      status: "INACTIVE",
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: users });
    axios.post.mockResolvedValue({
      data: {
        id: 3,
        name: "Cathy",
        email: "cathy@example.com",
        status: "ACTIVE",
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("loads and displays users", async () => {
    render(
      <Provider store={store}>
        <UserList />
      </Provider>,
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    expect(await screen.findByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    expect(screen.getByText("2 users")).toBeInTheDocument();
  });

  test("submits a new user", async () => {
    render(
      <Provider store={store}>
        <UserList />
      </Provider>,
    );

    await screen.findByText("Alice Smith");

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Cathy" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "cathy@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: "ACTIVE" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add user/i }));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/users"),
        {
          name: "Cathy",
          email: "cathy@example.com",
          status: "ACTIVE",
        },
      ),
    );
  });
});
