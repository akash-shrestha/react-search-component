import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ThemeProvider } from "styled-components";

import { lightTheme } from "../styles/themes";
import Search from "./Search";

const data = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Orange" },
  { id: 3, name: "Banana" },
  { id: 4, name: "Peach" },
  { id: 5, name: "Mango" },
];

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

test("renders search input", () => {
  renderWithTheme(<Search data={data} />);
  const searchInput = screen.getByPlaceholderText(/search.../i);
  expect(searchInput).toBeInTheDocument();
});

test("search functionality works correctly", async () => {
  renderWithTheme(<Search data={data} />);
  const searchInput = screen.getByPlaceholderText(/search.../i);

  fireEvent.change(searchInput, { target: { value: "apple" } });
  await waitFor(() =>
    expect(screen.queryByText(/orange/i)).not.toBeInTheDocument()
  );
  expect(screen.getByText(/apple/i)).toBeInTheDocument();

  fireEvent.change(searchInput, { target: { value: "ap" } });
  await waitFor(() =>
    expect(screen.queryByText(/orange/i)).not.toBeInTheDocument()
  );
  expect(screen.getByText(/apple/i)).toBeInTheDocument();

  fireEvent.change(searchInput, { target: { value: "app banan" } });
  await waitFor(() => expect(screen.getByText(/banana/i)).toBeInTheDocument());
  expect(screen.getByText(/apple/i)).toBeInTheDocument();
  expect(screen.queryByText(/orange/i)).not.toBeInTheDocument();

  fireEvent.change(searchInput, { target: { value: "apple banana" } });
  await waitFor(() => expect(screen.getByText(/banana/i)).toBeInTheDocument());
  expect(screen.getByText(/apple/i)).toBeInTheDocument();
  expect(screen.queryByText(/orange/i)).not.toBeInTheDocument();
});

test("clear search button works correctly", () => {
  renderWithTheme(<Search data={data} />);
  const searchInput = screen.getByPlaceholderText(/search.../i);
  const clearButton = screen.getByText(/clear/i);

  fireEvent.change(searchInput, { target: { value: "apple" } });
  fireEvent.click(clearButton);
  expect(searchInput).toHaveValue("");
  expect(screen.getByText(/apple/i)).toBeInTheDocument();
  expect(screen.getByText(/orange/i)).toBeInTheDocument();
});

test("show selected button works correctly", () => {
  renderWithTheme(<Search data={data} />);
  const listItem = screen.getByText(/apple/i);
  const showSelectedButton = screen.getByText(/show selected/i);

  fireEvent.click(listItem);
  fireEvent.click(showSelectedButton);

  expect(screen.getByText(/apple/i)).toBeInTheDocument();
  expect(screen.queryByText(/orange/i)).not.toBeInTheDocument();

  fireEvent.click(showSelectedButton);
  expect(screen.getByText(/orange/i)).toBeInTheDocument();
});

test("select and unselect items", () => {
  renderWithTheme(<Search data={data} />);
  const listItem = screen.getByText(/apple/i).closest("li");

  if (!listItem) {
    throw new Error("List item not found");
  }

  fireEvent.click(listItem);
  let selectedItems = screen.getAllByText((content, element) => {
    return element?.tagName.toLowerCase() === "span" && content === "Selected";
  });
  expect(selectedItems.length).toBe(1);
  expect(within(listItem).getByText("Selected")).toBeInTheDocument();

  fireEvent.click(listItem);
  selectedItems = screen.queryAllByText((content, element) => {
    return element?.tagName.toLowerCase() === "span" && content === "Selected";
  });
  expect(selectedItems.length).toBe(0);
  expect(within(listItem).queryByText("Selected")).not.toBeInTheDocument();
});
