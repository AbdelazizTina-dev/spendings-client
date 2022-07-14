import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

const DUMMY_SPENDINGS = {
  results: [
    {
      id: 1,
      description: "Tomato",
      amount: 1400,
      spent_at: "2022-02-23T14:47:20.381000Z",
      currency: "HUF",
    },
    {
      id: 3,
      description: "Coca-Cola",
      amount: 2200,
      spent_at: "2022-04-23T15:47:20.381000Z",
      currency: "USD",
    },
    {
      id: 4,
      description: "Mango",
      amount: 0,
      spent_at: "2022-07-13T10:53:54Z",
      currency: "USD",
    },
    {
      id: 5,
      description: "Mango",
      amount: 4,
      spent_at: "2022-07-13T10:53:54Z",
      currency: "USD",
    },
    {
      id: 6,
      description: "Mango",
      amount: 42,
      spent_at: "2022-07-13T10:54:54Z",
      currency: "USD",
    },
    {
      id: 7,
      description: "Mango",
      amount: 6768,
      spent_at: "2022-07-13T10:58:42Z",
      currency: "USD",
    },
    {
      id: 8,
      description: "Fish",
      amount: 5600,
      spent_at: "2022-07-13T10:59:28Z",
      currency: "HUF",
    },
    {
      id: 9,
      description: "Food",
      amount: 78,
      spent_at: "2022-07-13T11:00:11Z",
      currency: "USD",
    },
    {
      id: 10,
      description: "Tacos",
      amount: 4244,
      spent_at: "2022-07-13T11:01:21Z",
      currency: "HUF",
    },
    {
      id: 11,
      description: "Coce",
      amount: 2200,
      spent_at: "2021-04-23T15:47:20.381000Z",
      currency: "USD",
    },
    {
      id: 12,
      description: "Coce",
      amount: 2200,
      spent_at: "2022-07-23T15:47:20.381000Z",
      currency: "USD",
    },
    {
      id: 13,
      description: "Rice",
      amount: 2100,
      spent_at: "2022-07-13T12:56:27Z",
      currency: "USD",
    },
    {
      id: 14,
      description: "Food",
      amount: 5000,
      spent_at: "2022-07-13T13:22:28Z",
      currency: "USD",
    },
    {
      id: 15,
      description: "Chipotle",
      amount: 4400,
      spent_at: "2022-07-13T15:05:12Z",
      currency: "USD",
    },
    {
      id: 16,
      description: "Gyros",
      amount: 1400,
      spent_at: "2022-07-13T15:05:27Z",
      currency: "HUF",
    },
    {
      id: 17,
      description: "Kurtoskalacs",
      amount: 50000,
      spent_at: "2022-07-13T15:07:00Z",
      currency: "HUF",
    },
  ],
};

const server = setupServer(
  rest.get(`http://localhost:8000/spendings`, (req, res, ctx) => {
    return res(ctx.json(DUMMY_SPENDINGS));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("SpendingList Component", () => {
  test("renders the spendings list if it exists", async () => {
    render(<App />);

    const spendings = await screen.findAllByTestId("spending");

    expect(spendings).toHaveLength(16);
  });

  test("renders error message if server is down", async () => {
    server.use(
      rest.get(`http://localhost:8000/spendings`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<App />);

    const errorMessage = await screen.findByText(
      "The server is probably down. Please try again later."
    );

    expect(errorMessage).toBeInTheDocument();
  });

  test("renders empty spendings list with indicative text", async () => {
    server.use(
      rest.get(`http://localhost:8000/spendings`, (req, res, ctx) => {
        return res(ctx.json({ results: [] }));
      })
    );

    render(<App />);

    const emptySpendingsMessage = await screen.findByText("No spendings!", {
      exact: false,
    });

    expect(emptySpendingsMessage).toBeInTheDocument();
  });
});
