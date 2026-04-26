import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

const { totalCartItems, clearCart } = useCart();
  const { user, logout } = useAuth();

  const closeMenu = () => setIsOpen(false);

const handleLogout = () => {
  logout();
  clearCart();
  closeMenu();
};

  return (
    <nav className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" onClick={closeMenu} className="text-2xl font-extrabold">
          Mimi<span className="text-green-600">Cafe</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="font-semibold text-gray-700 hover:text-black">
            Menu
          </Link>

          {user && (
            <Link
              to="/my-orders"
              className="font-semibold text-gray-700 hover:text-black"
            >
              My Orders
            </Link>
          )}

          {user?.role === "admin" && (
            <>
              <Link
                to="/admin"
                className="font-semibold text-gray-700 hover:text-black"
              >
                Admin
              </Link>

              <Link
                to="/admin/orders"
                className="font-semibold text-gray-700 hover:text-black"
              >
                Orders
              </Link>
            </>
          )}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/cart"
            className="rounded-full bg-black px-5 py-2 font-semibold text-white hover:bg-gray-800"
          >
            Cart ({totalCartItems})
          </Link>

          {user ? (
            <>
              <span className="text-sm font-medium text-gray-600">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-full bg-gray-100 px-5 py-2 font-semibold hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full bg-gray-100 px-5 py-2 font-semibold hover:bg-gray-200"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-full bg-gray-100 px-4 py-2 text-xl font-bold md:hidden"
        >
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link onClick={closeMenu} to="/" className="font-semibold">
              Menu
            </Link>

            <Link onClick={closeMenu} to="/cart" className="font-semibold">
              Cart ({totalCartItems})
            </Link>

            {user && (
              <Link
                onClick={closeMenu}
                to="/my-orders"
                className="font-semibold"
              >
                My Orders
              </Link>
            )}

            {user?.role === "admin" && (
              <>
                <Link onClick={closeMenu} to="/admin" className="font-semibold">
                  Admin
                </Link>

                <Link
                  onClick={closeMenu}
                  to="/admin/orders"
                  className="font-semibold"
                >
                  Orders
                </Link>
              </>
            )}

            <div className="border-t pt-4">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full rounded-full bg-black px-5 py-3 font-bold text-white"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    onClick={closeMenu}
                    to="/login"
                    className="rounded-full bg-gray-100 px-5 py-3 text-center font-bold"
                  >
                    Login
                  </Link>

                  <Link
                    onClick={closeMenu}
                    to="/register"
                    className="rounded-full bg-green-600 px-5 py-3 text-center font-bold text-white"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
