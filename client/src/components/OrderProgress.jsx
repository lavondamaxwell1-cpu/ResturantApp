function OrderProgress({ status }) {
  const steps = ["pending", "preparing", "ready", "completed"];

  const labels = {
    pending: "Order received",
    preparing: "Preparing",
    ready: "Ready",
    completed: "Completed",
  };

  const currentIndex = steps.indexOf(status);

  return (
    <div className="mt-5">
      <div className="flex justify-between text-xs font-bold text-gray-500">
        {steps.map((step) => (
          <span
            key={step}
            className={
              currentIndex >= steps.indexOf(step) ? "text-green-600" : ""
            }
          >
            {labels[step]}
          </span>
        ))}
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-green-600 transition-all duration-500"
          style={{
            width: `${((currentIndex + 1) / steps.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

export default OrderProgress;
