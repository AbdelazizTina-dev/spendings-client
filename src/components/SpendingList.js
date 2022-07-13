import React, { useState, useEffect } from "react";
import { FiDollarSign } from "react-icons/fi";
import { DateTime } from "luxon";
import Loader from "./Loader";
import { compareAsc, compareDesc, parseISO } from "date-fns";
import {
  ErrorMessage,
  Spending,
  IconWrapper,
  TextWrapper,
  Amount,
  AmountWrapper,
} from "../styles/ComponentStyles";

export default function SpendingList({
  spendings,
  setSpendings,
  sortType,
  currencyFilter,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const filteredSpendings =
    currencyFilter === "None"
      ? spendings
      : spendings.filter((spending) => spending.currency === currencyFilter);

  function sortAmount(spending_1, spending_2, mode) {
    //arbitary rate
    const conversionRate = 300;

    const comparePrices = (p1, p2) => {
      if (p1 === p2) return 0;
      if (mode === "asc") return p1 - p2 > 0 ? 1 : -1;
      return p1 - p2 < 0 ? 1 : -1;
    };

    if (spending_1.currency === "USD" && spending_2.currency === "HUF") {
      return comparePrices(
        spending_1.amount * conversionRate,
        spending_2.amount
      );
    }

    if (spending_1.currency === "HUF" && spending_2.currency === "USD") {
      return comparePrices(
        spending_1.amount,
        spending_2.amount * conversionRate
      );
    }

    return comparePrices(spending_1.amount, spending_2.amount);
  }

  function sortSpendings(spendings) {
    switch (sortType) {
      case "-date":
        return spendings.sort((e1, e2) =>
          compareDesc(parseISO(e1.spent_at), parseISO(e2.spent_at))
        );
      case "date":
        return spendings.sort((e1, e2) =>
          compareAsc(parseISO(e1.spent_at), parseISO(e2.spent_at))
        );
      case "-amount_in_huf":
        return spendings.sort((e1, e2) => sortAmount(e1, e2, "desc"));
      case "amount_in_huf":
        return spendings.sort((e1, e2) => sortAmount(e1, e2, "asc"));
      default:
        return spendings;
    }
  }

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/spendings`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        const body = await res.json();
        return {
          status: res.status,
          body,
        };
      })
      .then((response) => {
        if (response.status === 200) {
          setSpendings(response.body.results);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setSpendings]);

  if (loading) return <Loader />;

  return (
    <>
      {error && (
        <ErrorMessage>
          The server is probably down. Please try again later.
        </ErrorMessage>
      )}
      {!spendings.length && !error && (
        <h1 style={{ textAlign: "center", marginTop: "4rem" }}>
          Yay!{" "}
          <span role="img" aria-label="jsx-a11y/accessible-emoji">
            🎉
          </span>{" "}
          No spendings!
        </h1>
      )}
      {spendings.length > 0 &&
        sortSpendings(filteredSpendings).map((spending) => (
          <Spending key={spending.id}>
            <IconWrapper>
              <FiDollarSign color="var(--color-blue)" />
            </IconWrapper>
            <TextWrapper>
              <h3>{spending.description}</h3>
              <p>
                {DateTime.fromISO(spending.spent_at).toFormat(
                  "t - MMMM dd, yyyy"
                )}
              </p>
            </TextWrapper>
            <AmountWrapper>
              <Amount currency={spending.currency}>
                {(spending.amount / 100).toFixed(2)}
              </Amount>
            </AmountWrapper>
          </Spending>
        ))}
    </>
  );
}
