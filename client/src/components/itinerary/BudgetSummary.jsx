import { DollarSign, Home, Utensils, Bus, Ticket, MoreHorizontal } from "lucide-react";

const BudgetItem = ({ icon: Icon, label, amount, color }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
    <div className="flex items-center gap-2">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={14} className="text-white" />
      </div>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-900">
      ${(amount || 0).toLocaleString()}
    </span>
  </div>
);

const BudgetSummary = ({ budget }) => {
  if (!budget) return null;
  const items = [
    { icon: Home, label: "Accommodation", key: "accommodation", color: "bg-blue-500" },
    { icon: Utensils, label: "Food & Dining", key: "food", color: "bg-amber-500" },
    { icon: Bus, label: "Transport", key: "transport", color: "bg-purple-500" },
    { icon: Ticket, label: "Activities", key: "activities", color: "bg-green-500" },
    { icon: MoreHorizontal, label: "Other", key: "other", color: "bg-gray-500" },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <DollarSign className="text-green-500" size={20} />
          Estimated Budget
        </h3>
        <div className="text-right">
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-xl font-bold text-green-600">
            ${(budget.total || 0).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <BudgetItem key={item.key} {...item} amount={budget[item.key]} />
        ))}
      </div>
    </div>
  );
};

export default BudgetSummary;
