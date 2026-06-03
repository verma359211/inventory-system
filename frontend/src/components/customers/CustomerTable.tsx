import type { Customer } from "../../types/customer";

interface CustomerTableProps {
  customers: Customer[];
  onDelete: (customer: Customer) => void;
}

export default function CustomerTable({ customers, onDelete }: CustomerTableProps) {
  if (customers.length === 0) {
    return <p className="empty">No customers found.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.full_name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone_number}</td>
              <td className="actions-cell">
                <button
                  type="button"
                  className="btn-link danger"
                  onClick={() => onDelete(customer)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
