import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalCartItems,
  } = useCart();

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="text-4xl font-extrabold">Your cart</h1>
        <p className="mt-3 text-gray-600">
          Add something tasty to get started.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
        >
          Browse Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link
        to="/"
        className="text-sm font-medium text-gray-600 hover:underline"
      >
        ← Back to Menu
      </Link>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Your cart</h1>
          <p className="mt-1 text-gray-500">{totalCartItems} item(s)</p>
        </div>

        <button
          onClick={clearCart}
          className="rounded-full bg-gray-100 px-5 py-2 font-semibold hover:bg-gray-200"
        >
          Clear cart
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 rounded-3xl border bg-white p-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-28 w-28 rounded-2xl object-cover"
              />

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold">{item.name}</h2>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>

                  <p className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-sm font-semibold text-gray-500 hover:text-red-500"
                  >
                    Remove
                  </button>

                  <div className="flex items-center rounded-full bg-gray-100">
                    <button
                      onClick={() => decreaseQuantity(item._id)}
                      className="px-4 py-2 font-bold hover:text-green-600"
                    >
                      -
                    </button>

                    <span className="px-2 font-semibold">{item.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item._id)}
                      className="px-4 py-2 font-bold hover:text-green-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <aside className="h-fit rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold">Order summary</h2>

          <div className="mt-5 space-y-3 border-b pb-5 text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery fee</span>
              <span>$0.00</span>
            </div>
          </div>

          <div className="mt-5 flex justify-between text-xl font-extrabold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <Link to="/checkout">
            <button className="mt-6 w-full rounded-full bg-green-600 px-6 py-4 font-bold text-white hover:bg-green-700">
              Go to checkout
            </button>
          </Link>
        </aside>
      </div>
    </main>
  );
}

export default Cart;
