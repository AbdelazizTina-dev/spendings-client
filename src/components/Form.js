import React, { useState } from "react";
import { InputStyles } from "../styles/InputStyles";
import { SelectStyles } from "../styles/SelectStyles";
import { FormStyles } from "../styles/ComponentStyles";
import { formatISO } from "date-fns";

const initial_state = {
  description: "",
  amount: 0,
  currency: "USD",
};

export default function Form({ setSpendings }) {
  const [state, setState] = useState(initial_state);

  const [descriptionIsInvalid, setDescriptionIsInvalid] = useState(false);
  const [amountIsInvalid, setAmountIsInvalid] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "description") setDescriptionIsInvalid(false);
    if (name === "amount") setAmountIsInvalid(false);

    setState({
      ...state,
      [name]: value,
    });
  }

  function formSubmitHandler(e) {
    e.preventDefault();

    if (state.description.trim().length === 0) setDescriptionIsInvalid(true);

    if (state.amount <= 0) setAmountIsInvalid(true);

    if (!descriptionIsInvalid && !amountIsInvalid && state !== initial_state) {
      postSpending({
        ...state,
        spent_at: formatISO(new Date()),
      });

      setState(initial_state);
    }
  }

  function postSpending(spending) {
    fetch(`http://localhost:8000/spendings/`, {
      method: "POST",
      body: JSON.stringify(spending),
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
        if (response.status === 201) {
          setSpendings((prevList) => [...prevList, response.body]);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <>
      <FormStyles>
        <InputStyles
          type="text"
          isInvalid={descriptionIsInvalid}
          placeholder="description"
          name="description"
          value={state.description}
          onChange={handleChange}
        />
        <InputStyles
          type="number"
          isInvalid={amountIsInvalid}
          placeholder="amount"
          name="amount"
          value={state.amount}
          onChange={handleChange}
        />
        <SelectStyles
          name="currency"
          value={state.currency}
          onChange={handleChange}
        >
          <option value="HUF">HUF</option>
          <option value="USD">USD</option>
        </SelectStyles>
        <InputStyles onClick={formSubmitHandler} type="submit" value="Save" />
      </FormStyles>
    </>
  );
}
