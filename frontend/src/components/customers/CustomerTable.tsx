import type { Customer } from "../../types/customer";

interface CustomerTableProps {
  customers: Customer[];
  onDelete: (customer: Customer) => void;
}

export default function CustomerTable({ customers, onDelete }: CustomerTableProps) {
  return (
    <div className="card table-card">
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Full name</th>
              <th>Email</th>
              <th>Phone</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <strong>{customer.full_name}</strong>
                </td>
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
    </div>
  );
}
