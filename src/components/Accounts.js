import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Accounts.css";
import "./ViewDonations.css";
import logo from "../assets/aksharam-logo.jpeg";


const Accounts = (role = "staff") => {

const navigate = useNavigate();
const location = useLocation();

const isAdmin = role === "admin";
// const isStaff = role === "staff";


const handleHome = () => {
  navigate(isAdmin ? "/admin/dashboard" : "/staff/dashboard");
};

const handleAccounts = () => {
  navigate("/accounts");
};

const handleDonations = () => {
  navigate(isAdmin ? "/admin/donations/manage": "/staff/donations/manage");
};

  const [rows, setRows] = useState([
    {
      id: 1,
      date: "",
      receiptNo: "",
      voucherNo: "",
      particular: "",
      income: "",
      expense: "",
      closingBalance: "",
      uploadedBy: "",
    },
  ]);

  const [openingBalance, setOpeningBalance] = useState("");
  const [bank, setBank] = useState("");
  const [cashHandling, setCashHandling] = useState("");

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        date: "",
        receiptNo: "",
        voucherNo: "",
        particular: "",
        income: "",
        expense: "",
        closingBalance: "",
        uploadedBy: "",
      },
    ]);
  };

  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleChange = (id, field, value) => {
    setRows(
      rows.map((row) =>
        row.id === id
          ? { ...row, [field]: value }
          : row
      )
    );
  };

  const totalIncome = rows.reduce(
    (total, row) => total + Number(row.income || 0),
    0
  );

  const totalExpense = rows.reduce(
    (total, row) => total + Number(row.expense || 0),
    0
  );

  const totalAmount =
    Number(openingBalance || 0) +
    totalIncome -
    totalExpense;

  return (
    
  <div className="donations-dashboard">

    {/* ================= NAVBAR ================= */}

    <header className="donations-navbar">

      {/* Logo */}

      <div className="donations-brand">
        <img src={logo} alt="Aksharam Trust" />
      </div>

      {/* Navigation Menu */}

      <nav className="donations-nav-menu">

        <button
          type="button"
          className="nav-home"
          onClick={handleHome}
        >
          <span>🏠</span>
          <span>Home</span>
        </button>

        <button
          type="button"
          className={`nav-module ${
            location.pathname === "/accounts" ? "active" : ""
          }`}
          onClick={handleAccounts}
        >
          <span>📊</span>
          <span>Accounts</span>
        </button>

        <button
          type="button"
          className={`nav-module ${
            location.pathname.startsWith("/donations")
              ? "active"
              : ""
          }`}
          onClick={handleDonations}
        >
          <span>💙</span>
          <span>Donations</span>
        </button>

      </nav>

    </header>

    {/* ================= ACCOUNTS PAGE ================= */}

    <main className="accounts-page-content">

      <div className="accounts-container">


      {/* Header */}
      <div className="accounts-header">
        <div>
          <h1>Accounts</h1>
          <p>Financial transaction management</p>
        </div>

        <div className="financial-year">
          <label>Financial Year</label>

          <div className="year-inputs">
            <input type="text" placeholder="2025" />
            <span>to</span>
            <input type="text" placeholder="2026" />
          </div>
        </div>
      </div>

      {/* Total Amount */}
      <div className="amount-card">
        <div>
          <span>Total Amount</span>
          <h2>₹ {totalAmount.toFixed(2)}</h2>
        </div>
      </div>

      {/* Month */}
      <div className="month-section">
        <h2>April - 2026</h2>
      </div>

      {/* Opening Balance */}
      <div className="balance-section">

        <div className="balance-box">
          <label>Opening Balance</label>

          <input
            type="number"
            placeholder="Enter opening balance"
            value={openingBalance}
            onChange={(e) =>
              setOpeningBalance(e.target.value)
            }
          />
        </div>

      </div>

      {/* Transactions */}
      <div className="transaction-section">

        <div className="section-header">
          <div>
            <h2>Account Transactions</h2>
            <p>Record all income and expenses</p>
          </div>

          <button
            className="add-button"
            onClick={addRow}
          >
            + Add Transaction
          </button>
        </div>

        <div className="table-container">

          <table className="accounts-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Receipt No</th>
                <th>Voucher No</th>
                <th>Particular</th>
                <th>Income</th>
                <th>Expense</th>
                <th>Closing Balance</th>
                <th>Uploaded By</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {rows.map((row, index) => (

                <tr key={row.id}>

                  <td className="row-number">
                    {index + 1}
                  </td>

                  <td>
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) =>
                        handleChange(
                          row.id,
                          "date",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      placeholder="Receipt"
                      value={row.receiptNo}
                      onChange={(e) =>
                        handleChange(
                          row.id,
                          "receiptNo",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      placeholder="Voucher"
                      value={row.voucherNo}
                      onChange={(e) =>
                        handleChange(
                          row.id,
                          "voucherNo",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      placeholder="Particular"
                      value={row.particular}
                      onChange={(e) =>
                        handleChange(
                          row.id,
                          "particular",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={row.income}
                      onChange={(e) =>
                        handleChange(
                          row.id,
                          "income",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={row.expense}
                      onChange={(e) =>
                        handleChange(
                          row.id,
                          "expense",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={row.closingBalance}
                      onChange={(e) =>
                        handleChange(
                          row.id,
                          "closingBalance",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      value={row.uploadedBy}
                      onChange={(e) =>
                        handleChange(
                          row.id,
                          "uploadedBy",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteRow(row.id)
                      }
                    >
                      ×
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

            <tfoot>

              <tr>
                <td
                  colSpan="5"
                  className="total-label"
                >
                  Total
                </td>

                <td className="income-total">
                  ₹ {totalIncome.toFixed(2)}
                </td>

                <td className="expense-total">
                  ₹ {totalExpense.toFixed(2)}
                </td>

                <td colSpan="3"></td>
              </tr>

            </tfoot>

          </table>

        </div>
      </div>

      {/* Bank and Cash Handling */}
      <div className="handling-section">

        <div className="handling-box">

          <label>Bank</label>

          <input
            type="text"
            placeholder="Enter bank details"
            value={bank}
            onChange={(e) =>
              setBank(e.target.value)
            }
          />

        </div>

        <div className="handling-box">

          <label>Cash Handling</label>

          <input
            type="text"
            placeholder="Enter cash handling details"
            value={cashHandling}
            onChange={(e) =>
              setCashHandling(e.target.value)
            }
          />

        </div>

      </div>

      {/* Footer */}
      <div className="accounts-footer">

        <button className="save-button">
          Save Accounts
        </button>

      </div>

         </div>

    </main>

  </div>

  );
};

export default Accounts;