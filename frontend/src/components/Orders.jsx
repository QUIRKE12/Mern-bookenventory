import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(
        `${import.meta.env.VITE_API_URL}/orders?email=${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleMarkPaid = async (orderId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/mark-paid`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Payment marked! Waiting for approval.");
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? { ...o, paymentStatus: "pending_approval" }
              : o
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="mt-28 text-center">Loading...</div>;

  return (
    <div className="mt-28 px-4 lg:px-24 min-h-screen">
      <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">
        Amakomande Yawe
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          Nta makomande urafise.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Products</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Payment</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">
                    {order.products.map((p) => (
                      <div key={p._id}>
                        {p.productName} x{p.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="border px-4 py-2">
                    {order.totalAmount} BIF
                  </td>
                  <td className="border px-4 py-2">{order.status}</td>
                  <td className="border px-4 py-2">
                    {order.paymentStatus}
                  </td>
                  <td className="border px-4 py-2">
                    {order.paymentStatus === "unpaid" && (
                      <button
                        onClick={() => handleMarkPaid(order._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Ndatsimvye
                      </button>
                    )}
                    {order.paymentStatus === "pending_approval" && (
                      <span className="text-yellow-600 font-semibold">
                        Tegereza kwemezwa
                      </span>
                    )}
                    {order.paymentStatus === "paid" && (
                      <span className="text-green-600 font-semibold">
                        Yishyuwe ✅
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
